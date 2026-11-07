/**
 * Functional test of the work-log host half against a fake Cordis context.
 * Verifies the event fold, per-project durations, persistence, the JSON routes,
 * model-generated summaries, and the `work_log` tool without touching the live
 * profile or the network.
 */
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const home = await mkdtemp(join(tmpdir(), 'work-log-test-'))
process.env.DSH_HOME = home

const { apply } = await import('../index.js')

const listeners = new Map()
const tools = []
const routes = new Map()
const summaries = new Map()
const llmCalls = []

const fakeStream = (text) => (async function* () {
  yield { type: 'text-delta', index: 0, text }
  yield { type: 'finish', reason: { kind: 'stop' } }
})()

const ctx = {
  on(event, listener) {
    listeners.set(event, listener)
    return () => listeners.delete(event)
  },
  effect(callback) {
    callback()
    return () => {}
  },
  get(name) {
    if (name === 'workspaceChanges') return { summary: (_sessionId, seq) => summaries.get(seq) }
    if (name === 'sessions') return { list: () => [] }
    if (name === 'webServer') {
      return {
        register: (definition) => {
          routes.set(definition.path, definition)
          return () => {}
        },
      }
    }
    if (name === 'llm') {
      return {
        stream: (options) => {
          llmCalls.push(options)
          return fakeStream('- 重构登录流程，拆成三段\n- 补了 6 个回归用例\n')
        },
      }
    }
    if (name === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'fake', model: 'fake-model' }) }
    if (name === 'deepseekAccount') {
      return {
        getBalance: async () => ({
          status: 'ready',
          value: [
            { currency: 'USD', balance: '1.00' },
            { currency: 'CNY', balance: '15.9892985' },
          ],
          bonusWallets: [],
        }),
      }
    }
    return undefined
  },
  tools: { register: (definition) => { tools.push(definition); return () => {} } },
  logger: { warn: (...args) => console.warn('[warn]', ...args), info: () => {} },
}

apply(ctx)
assert.equal(tools.length, 1, 'work_log tool registered')
assert.ok(routes.has('/work-log/data.json'), 'data route registered')
assert.ok(routes.has('/work-log/summarize.json'), 'summarize route registered')
assert.ok(routes.has('/work-log/month.json'), 'calendar route registered')

const session = {
  id: 'session-test-0001',
  header: { cwd: '/work/project' },
  ownEvents: () => [],
}
const emit = (type, data, seq = 1, time = Date.now()) => {
  listeners.get('session/event')?.(session, { type, seq, time, data })
}

const at = (hour, minute) => new Date(2026, 10, 7, hour, minute, 0).getTime()

// Turn 1: 09:00 -> 09:10 (10 minutes)
emit('turn/start', { turn: 1 }, 1, at(9, 0))
emit('user/message', { id: 'm1', role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: '重构登录流程并补测试' }] }, 2, at(9, 0) + 1000)
emit('user/message', { id: 'm2', role: 'user', source: { kind: 'runtime-context' }, content: [{ type: 'text', text: 'Current runtime context...' }] }, 3, at(9, 0) + 2000)
summaries.set(9, {
  turn: 1,
  cwd: '/work/project',
  files: [
    { path: 'src/auth/login.ts', display: 'src/auth/login.ts', added: 20, deleted: 4 },
    { path: 'src/auth/login.test.ts', display: 'src/auth/login.test.ts', added: 60, deleted: 0 },
    { path: 'package.json', display: 'package.json', added: 1, deleted: 1 },
    { path: '../outside/x.ts', display: '../outside/x.ts', added: 2, deleted: 0 },
  ],
  total: 4,
  added: 83,
  deleted: 5,
})
emit('workspace/changes', { turn: 1 }, 9, at(9, 9))
emit('assistant/message', { turn: 1, step: 1, message: { role: 'assistant', content: [{ type: 'text', text: '登录流程已拆成三个阶段，并补了 6 个用例。' }] }, stream: [] }, 10, at(9, 9))
emit('turn/end', { turn: 1, reason: { kind: 'completed' } }, 11, at(9, 10))

// Turn 2: 09:30 -> 09:45 (15 minutes)
emit('turn/start', { turn: 2 }, 12, at(9, 30))
emit('user/message', { id: 'm3', role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: '再补一版迁移脚本' }] }, 13, at(9, 30) + 1000)
emit('turn/end', { turn: 2, reason: { kind: 'completed' } }, 14, at(9, 45))

await new Promise((resolve) => setTimeout(resolve, 700))

const file = join(home, 'work-log', '2026-11-07.json')
const stored = JSON.parse(await readFile(file, 'utf8'))
assert.equal(Object.keys(stored.items).length, 2, 'two items stored')
const first = Object.values(stored.items).find((item) => item.turn === 1)
assert.equal(first.prompt, '重构登录流程并补测试', 'runtime context is not the prompt')
assert.equal(first.messages, 1, 'only real user messages counted')
assert.deepEqual(first.folders, { 'src/auth': 2, '（根目录）': 1, '（工作目录外）': 1 })
assert.equal(first.added, 83)

const call = (path, request) => new Promise((resolve, reject) => {
  const route = routes.get(path)
  if (route === undefined) {
    reject(new Error(`no route ${path}`))
    return
  }
  route.handler(request, {
    writeHead(status) {
      this.status = status
    },
    end(payload) {
      resolve({ status: this.status ?? 200, body: payload === undefined ? undefined : JSON.parse(payload) })
    },
  })
})

const get = (path, query = '') => call(path, {
  url: `${path}${query}`,
  method: 'GET',
  socket: { remoteAddress: '127.0.0.1' },
  headers: { host: '127.0.0.1:53192' },
})

const post = (path, body) => call(path, {
  url: path,
  method: 'POST',
  socket: { remoteAddress: '127.0.0.1' },
  headers: { host: '127.0.0.1:53192' },
  async *[Symbol.asyncIterator]() {
    yield Buffer.from(JSON.stringify(body), 'utf8')
  },
})

const data = (await get('/work-log/data.json', '?date=2026-11-07')).body
assert.equal(data.date, '2026-11-07')
assert.equal(data.day.totals.projects, 1)
assert.equal(data.day.totals.turns, 2)
// 10 + 15 minutes of active turns, with the 20-minute gap excluded.
assert.equal(data.day.totalMs, 25 * 60000)
const project = data.day.projects[0]
assert.equal(project.name, 'project')
assert.equal(project.ms, 25 * 60000)
assert.equal(project.turns, 2)
assert.equal(project.summary, null, 'no summary before generation')
assert.equal(project.folders.length, 3)
assert.ok(!('prompt' in project) && !('reply' in project), 'the page payload carries no conversation')

const calendar = (await get('/work-log/month.json', '?month=2026-11')).body
assert.equal(calendar.month, '2026-11')
assert.equal(calendar.days['2026-11-07'].turns, 2)
assert.equal(calendar.days['2026-11-07'].ms, 25 * 60000)
assert.equal(calendar.days['2026-11-06'], undefined, 'a day without records is absent')

const summarized = await post('/work-log/summarize.json', { date: '2026-11-07', project: '/work/project' })
assert.equal(summarized.status, 200)
assert.equal(summarized.body.ok, true)
assert.deepEqual(summarized.body.summary.bullets, ['重构登录流程，拆成三段', '补了 6 个回归用例'])
assert.equal(llmCalls.length, 1)
assert.match(llmCalls[0].messages[0].content[0].text, /重构登录流程并补测试/)
assert.ok(!/Current runtime context/.test(llmCalls[0].messages[0].content[0].text), 'prompt excludes injected context')

const cached = await post('/work-log/summarize.json', { date: '2026-11-07', project: '/work/project' })
assert.equal(cached.status, 200)
assert.equal(llmCalls.length, 1, 'an unchanged project reuses its cached summary')

const refreshed = await post('/work-log/summarize.json', { date: '2026-11-07', project: '/work/project', force: true })
assert.equal(refreshed.status, 200)
assert.equal(llmCalls.length, 2, 'force regenerates')

const after = (await get('/work-log/data.json', '?date=2026-11-07')).body
assert.deepEqual(after.day.projects[0].summary.bullets, ['重构登录流程，拆成三段', '补了 6 个回归用例'])
assert.equal(after.day.projects[0].summary.stale, false)

const read = await tools[0].execute({ action: 'read', date: '2026-11-07' })
assert.equal(read.projects, 1)
assert.equal(read.totalMs, 25 * 60000)
assert.match(read.text, /25 分钟/)
assert.match(read.text, /重构登录流程，拆成三段/)

await tools[0].execute({ action: 'summarize', date: '2026-11-07', project: '/work/project', text: '- 把登录流程拆成三段并补上回归用例' })
const agentWritten = (await get('/work-log/data.json', '?date=2026-11-07')).body
assert.deepEqual(agentWritten.day.projects[0].summary.bullets, ['把登录流程拆成三段并补上回归用例'])
assert.equal(agentWritten.day.projects[0].summary.source, 'agent')

// manual refresh asks the model again and replaces whatever was stored
await tools[0].execute({ action: 'refresh', date: '2026-11-07', project: '/work/project' })
const refreshedByTool = JSON.parse(await readFile(file, 'utf8'))
assert.deepEqual(refreshedByTool.summaries['/work/project'].bullets, ['重构登录流程，拆成三段', '补了 6 个回归用例'])
assert.equal(refreshedByTool.summaries['/work/project'].source, 'model')

const recorded = await tools[0].execute({ action: 'record', text: '顺手清理了旧分支', folders: ['scripts'] })
assert.equal(recorded.projects, 1)
const withNote = JSON.parse(await readFile(file, 'utf8'))
assert.equal(withNote.notes.length, 1)

const bad = await post('/work-log/summarize.json', { date: '2026-11-07', project: '/nope' })
assert.equal(bad.status, 502)
assert.equal(bad.body.ok, false)

// a message whose turn/start never arrived must not become a phantom turn-0 item
const orphan = { id: 'session-orphan', header: { cwd: '/work/project' }, ownEvents: () => [] }
listeners.get('session/event')?.(orphan, {
  type: 'user/message',
  seq: 30,
  time: Date.now(),
  data: { id: 'm9', role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: '没有 turn/start 的消息' }] },
})
await new Promise((resolve) => setTimeout(resolve, 300))
const noPhantom = JSON.parse(await readFile(file, 'utf8'))
assert.ok(!Object.keys(noPhantom.items).some((key) => key.endsWith('#0')), 'no phantom turn-0 item')

// the routes reject anything that is not a loopback, same-origin request
const remote = await call('/work-log/data.json', {
  url: '/work-log/data.json',
  method: 'GET',
  socket: { remoteAddress: '10.0.0.8' },
  headers: { host: '127.0.0.1:53192' },
})
assert.equal(remote.status, 403, 'a non-loopback peer is rejected')

const crossOrigin = await call('/work-log/data.json', {
  url: '/work-log/data.json',
  method: 'GET',
  socket: { remoteAddress: '127.0.0.1' },
  headers: { host: '127.0.0.1:53192', origin: 'https://evil.example' },
})
assert.equal(crossOrigin.status, 403, 'a foreign Origin is rejected')

const sameOrigin = await call('/work-log/data.json', {
  url: '/work-log/data.json',
  method: 'GET',
  socket: { remoteAddress: '127.0.0.1' },
  headers: { host: '127.0.0.1:53192', origin: 'http://127.0.0.1:53192' },
})
assert.equal(sameOrigin.status, 200, 'the app\'s own origin is allowed')

const oversized = await post('/work-log/summarize.json', { project: 'x'.repeat(20000) })
assert.equal(oversized.status, 413, 'a huge body is refused')

// the wallet is the CNY one, not the first wallet the platform happened to list
assert.equal(data.day.account.currency, 'CNY')
assert.equal(data.day.account.balance, 15.9892985)

// an unfinished turn runs to now, so the HUD clock keeps ticking
const nowish = Date.now()
emit('turn/start', { turn: 3 }, 20, nowish - 60000)
emit('user/message', { id: 'm4', role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: '还在改样式' }] }, 21, nowish - 30000)
const live = (await get('/work-log/data.json', '?date=2026-11-07')).body
assert.equal(live.day.running, true)
assert.ok(live.day.totalMs >= 25 * 60000, 'the open turn only adds time')

await rm(home, { recursive: true, force: true })
console.log('work-log host test: ok')
