window.__ModuleLoader__.load({
  id: 'dsh-work-log',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** Dictionary namespace owned by this plugin. */
    const NS = 'work-log'
    /** The main-panel key and the sidebar entry id address the same panel. */
    const PANEL_ID = 'work-log'

    const zh = {
      'panel': '工作日志',
      'title': '工作日志',
      'nav.prev': '前一天',
      'nav.next': '后一天',
      'nav.today': '今天',
      'nav.refresh': '刷新',
      'cal.month': '{year} 年 {month} 月',
      'cal.prev': '上个月',
      'cal.next': '下个月',
      'cal.today': '今天',
      'cal.day': '{duration} · {projects} 个项目 · {turns} 轮',
      'cal.emptyDay': '这一天没有记录',
      'cal.loading': '正在读取日历…',
      'cal.weekdays': '一,二,三,四,五,六,日',
      'cal.expand': '展开月历',
      'cal.collapse': '收起月历',
      'cal.prevWeek': '上一周',
      'cal.nextWeek': '下一周',
      'day.projects': '{count} 个项目',
      'pill.today': '今日工作 {duration} · {projects} 个项目',
      'stat.work': '工作时长',
      'account.balance': '余额',
      'account.spend': '今日花费',
      'pill.open': '打开工作日志',
      'project.range': '{from} – {to}',
      'project.turns': '{count} 轮',
      'project.files': '{count} 个文件',
      'project.noFiles': '没有文件改动',
      'summary.none': '这个项目今天还没有摘要。',
      'summary.generate': '生成摘要',
      'summary.regenerate': '更新摘要',
      'summary.busy': '正在总结…',
      'summary.at': '摘要更新于 {time}',
      'summary.agent': '（由 Harness 撰写）',
      'summary.stale': '之后又有新的工作',
      'summary.error': '生成失败：{error}',
      'section.notes': '备注',
      'empty.title': '这一天还没有记录',
      'empty.body': '开始与 Harness 对话后，每个项目的工作会自动出现在这里。',
      'error.title': '无法读取工作日志',
      'error.retry': '重试',
      'loading': '正在读取…',
      'footer': '数据保存在 {path}，由 Harness 在每一轮结束时自动写入。',
    }

    const en = {
      'panel': 'Work log',
      'title': 'Work log',
      'nav.prev': 'Previous day',
      'nav.next': 'Next day',
      'nav.today': 'Today',
      'nav.refresh': 'Refresh',
      'cal.month': '{month}/{year}',
      'cal.prev': 'Previous month',
      'cal.next': 'Next month',
      'cal.today': 'Today',
      'cal.day': '{duration} · {projects} projects · {turns} turns',
      'cal.emptyDay': 'Nothing recorded',
      'cal.loading': 'Loading calendar…',
      'cal.weekdays': 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
      'cal.expand': 'Expand month',
      'cal.collapse': 'Collapse to one row',
      'cal.prevWeek': 'Previous week',
      'cal.nextWeek': 'Next week',
      'day.projects': '{count} projects',
      'pill.today': 'Today: {duration} · {projects} projects',
      'stat.work': 'Time worked',
      'account.balance': 'Balance',
      'account.spend': 'Spent today',
      'pill.open': 'Open the work log',
      'project.range': '{from} – {to}',
      'project.turns': '{count} turns',
      'project.files': '{count} files',
      'project.noFiles': 'No file changes',
      'summary.none': 'No summary for this project yet.',
      'summary.generate': 'Summarize',
      'summary.regenerate': 'Update summary',
      'summary.busy': 'Summarizing…',
      'summary.at': 'Summary updated at {time}',
      'summary.agent': '(written by Harness)',
      'summary.stale': 'Newer work is not covered',
      'summary.error': 'Failed: {error}',
      'section.notes': 'Notes',
      'empty.title': 'Nothing recorded for this day',
      'empty.body': 'Every project you work on with Harness shows up here automatically.',
      'error.title': 'Could not read the work log',
      'error.retry': 'Retry',
      'loading': 'Loading…',
      'footer': 'Stored in {path} and written by Harness at the end of every turn.',
    }

    const CSS = `
.dshwl-page{--wl-ink:#0A0712;--wl-text:#F3F0FF;--wl-muted:rgba(226,219,255,.6);--wl-glass:rgba(255,255,255,.045);--wl-glass-2:rgba(255,255,255,.07);--wl-edge:rgba(255,255,255,.1);--wl-edge-2:rgba(255,255,255,.2);--wl-accent:#8B5CF6;--wl-accent-2:#C084FC;--wl-ok:#7CE3B1;--wl-bad:#FF8A9B;color-scheme:dark;position:relative;isolation:isolate;height:100%;min-height:0;overflow-y:auto;overflow-x:hidden;color:var(--wl-text);font-size:13px;line-height:1.6;background:radial-gradient(1200px 620px at 16% -12%,#2B1157 0%,rgba(43,17,87,0) 62%),radial-gradient(900px 520px at 96% 4%,#1B0E3A 0%,rgba(27,14,58,0) 58%),linear-gradient(180deg,#0C0818 0%,#0A0712 100%)}
.dshwl-glow{position:absolute;left:-8%;top:-140px;width:620px;height:520px;border-radius:50%;background:radial-gradient(closest-side,rgba(139,92,246,.55),rgba(139,92,246,0) 72%);filter:blur(50px);pointer-events:none;z-index:-1}
.dshwl-inner{position:relative;max-width:1080px;margin:0 auto;padding:28px 32px 64px;box-sizing:border-box}
.dshwl-head{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.dshwl-title{font-size:15px;font-weight:600;margin:0;letter-spacing:.01em}
.dshwl-nav{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dshwl-btn{height:30px;padding:0 12px;border-radius:9px;border:1px solid var(--wl-edge);background:var(--wl-glass);color:var(--wl-text);font:inherit;font-size:12px;cursor:pointer;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.dshwl-btn:hover{background:var(--wl-glass-2);border-color:var(--wl-edge-2)}
.dshwl-btn[disabled]{opacity:.4;cursor:default}
.dshwl-date{height:30px;padding:0 10px;border-radius:9px;border:1px solid var(--wl-edge);background:var(--wl-glass);color:var(--wl-text);font:inherit;font-size:12px}
.dshwl-day{margin:18px 0 0;padding:24px 22px 22px;border-radius:14px;border:1px solid var(--wl-edge);background:var(--wl-glass);backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 24px 48px -36px rgba(0,0,0,.95)}
.dshwl-stats{display:grid;gap:32px;align-items:end}
.dshwl-stat{display:flex;flex-direction:column;gap:3px;min-width:0}
.dshwl-stat-label{font-size:11px;color:var(--wl-muted);letter-spacing:.01em}
.dshwl-stat-value{font-size:30px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.2;color:#FBF8FF;white-space:nowrap}
.dshwl-facts{display:flex;flex-wrap:wrap;gap:5px 14px;margin-top:14px;font-size:12px;color:var(--wl-muted);font-variant-numeric:tabular-nums}
.dshwl-bar{display:flex;gap:3px;height:6px;margin-top:20px}
.dshwl-bar-seg{flex:1 1 0;min-width:3px;border-radius:3px;background:linear-gradient(90deg,var(--wl-accent),var(--wl-accent-2));box-shadow:0 0 14px rgba(139,92,246,.45)}
.dshwl-link{border:0;background:transparent;padding:0;font:inherit;font-size:12px;color:var(--wl-accent-2);cursor:pointer}
.dshwl-link:hover{color:#DCC6FF}
.dshwl-link[disabled]{opacity:.45;cursor:default}
.dshwl-projects{display:grid;gap:14px;margin-top:18px}
.dshwl-project{padding:18px 17px 16px;min-height:210px;border-radius:14px;border:1px solid var(--wl-edge);background:var(--wl-glass);backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 24px 48px -36px rgba(0,0,0,.95)}
.dshwl-project-head{display:flex;align-items:baseline;gap:7px;min-width:0}
.dshwl-swatch{flex:none;width:7px;height:7px;border-radius:2px;background:linear-gradient(135deg,var(--wl-accent),var(--wl-accent-2));transform:translateY(-1px)}
.dshwl-project-name{flex:1 1 auto;min-width:0;font-size:13.5px;font-weight:600;margin:0;line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshwl-duration{flex:none;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
.dshwl-meta{display:flex;flex-wrap:wrap;gap:4px 10px;margin:7px 0 0;font-size:11px;color:var(--wl-muted);font-variant-numeric:tabular-nums}
.dshwl-add{color:var(--wl-ok)}
.dshwl-del{color:var(--wl-bad)}
.dshwl-bullets{margin:12px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
.dshwl-bullets li{position:relative;padding-left:12px;font-size:12.5px;line-height:1.7}
.dshwl-bullets li::before{content:"·";position:absolute;left:2px;top:0;color:var(--wl-accent-2);font-weight:700}
.dshwl-folders{display:flex;flex-wrap:nowrap;overflow:hidden;gap:10px;margin:14px 0 0;font-size:11px;white-space:nowrap;color:var(--wl-muted);font-variant-numeric:tabular-nums}
.dshwl-folders b{margin-left:3px;font-weight:500;color:var(--wl-text)}
.dshwl-pending{margin:10px 0 0;font-size:12px;color:var(--wl-muted);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dshwl-note-line{margin:10px 0 0;font-size:10.5px;color:var(--wl-muted);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dshwl-error-line{margin:10px 0 0;font-size:11px;color:var(--wl-bad);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dshwl-stale{margin-left:6px;font-size:10px;padding:1px 7px;border-radius:999px;background:rgba(139,92,246,.16);border:1px solid rgba(192,132,252,.35);color:#DCC6FF}
.dshwl-btn:focus-visible,.dshwl-link:focus-visible,.dshwl-cell:focus-visible,.dshwl-mini-cell:focus-visible{outline:2px solid var(--wl-accent-2);outline-offset:2px}
.dshwl-cal{margin:18px 0 0;padding:14px 16px 12px;border-radius:14px;border:1px solid var(--wl-edge);background:var(--wl-glass);backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 24px 48px -36px rgba(0,0,0,.95)}
.dshwl-cal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px}
.dshwl-cal-title{font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.dshwl-cal-actions{display:flex;align-items:center;gap:6px}
.dshwl-cal-week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin-bottom:4px}
.dshwl-cal-wd{font-size:10px;color:var(--wl-muted);text-align:center}
.dshwl-cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
.dshwl-cell{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:38px;padding:2px;border-radius:9px;border:1px solid transparent;background:transparent;color:var(--wl-muted);font:inherit;font-size:12px;cursor:pointer;font-variant-numeric:tabular-nums}
.dshwl-cell:hover{border-color:var(--wl-edge-2);color:var(--wl-text)}
.dshwl-cell-blank{cursor:default;background:transparent}
.dshwl-cell-blank:hover{border-color:transparent}
.dshwl-cell-data{background:rgba(255,255,255,.06);border-color:var(--wl-edge);color:var(--wl-text)}
.dshwl-cell-today{font-weight:700}
.dshwl-cell-selected{border-color:var(--wl-accent-2);box-shadow:0 0 0 1px rgba(192,132,252,.25),0 0 14px rgba(139,92,246,.35)}
.dshwl-cell-num{line-height:1}
.dshwl-cell-today .dshwl-cell-num{color:var(--wl-accent-2)}
.dshwl-cell-dot{width:4px;height:4px;border-radius:50%;background:var(--wl-accent-2);display:block;box-shadow:0 0 6px rgba(192,132,252,.8)}
.dshwl-cal-status{margin-top:8px;font-size:11px;color:var(--wl-muted)}
.dshwl-cal-compact{display:flex;align-items:center;gap:10px;margin:18px 0 0;padding:6px 10px;border-radius:12px;border:1px solid var(--wl-edge);background:var(--wl-glass);backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.dshwl-cal-compact .dshwl-cal-title{white-space:nowrap}
.dshwl-cal-compact .dshwl-cal-actions{flex:1 1 auto;min-width:0;gap:6px}
.dshwl-mini{display:flex;align-items:center;gap:4px;flex:1 1 auto;min-width:0}
.dshwl-mini-cell{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;height:26px;padding:0;border-radius:8px;border:1px solid transparent;background:transparent;color:var(--wl-muted);font:inherit;font-size:12px;cursor:pointer;font-variant-numeric:tabular-nums}
.dshwl-mini-cell:hover{border-color:var(--wl-edge-2);color:var(--wl-text)}
.dshwl-mini-cell-data{background:rgba(255,255,255,.06);color:var(--wl-text)}
.dshwl-mini-cell-today{font-weight:700;color:var(--wl-accent-2)}
.dshwl-mini-cell-selected{border-color:var(--wl-accent-2);color:var(--wl-text)}
.dshwl-mini-dot{width:3px;height:3px;border-radius:50%;background:var(--wl-accent-2);display:block;box-shadow:0 0 6px rgba(192,132,252,.8)}
.dshwl-notes{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.dshwl-note{display:flex;gap:10px;padding:10px 13px;border-radius:11px;background:var(--wl-glass);border:1px solid var(--wl-edge);font-size:12px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.dshwl-note strong{color:var(--wl-muted);font-weight:500;font-variant-numeric:tabular-nums}
.dshwl-empty{border:1px dashed var(--wl-edge-2);border-radius:14px;padding:40px 20px;text-align:center;color:var(--wl-muted);font-size:13px;background:rgba(255,255,255,.02)}
.dshwl-empty strong{display:block;color:var(--wl-text);font-size:14px;margin-bottom:6px;font-weight:500}
.dshwl-error{border:1px solid rgba(255,138,155,.5);border-radius:12px;padding:14px 16px;color:var(--wl-bad);font-size:12px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:rgba(255,138,155,.07)}
.dshwl-section{margin:26px 0 0}
.dshwl-section-title{display:block;font-size:12px;font-weight:600;color:var(--wl-muted);margin:0 0 10px}
.dshwl-footer{margin-top:32px;font-size:11px;color:var(--wl-muted);opacity:.75}
`    /** Monochrome ramp that maps a project's segment to its row marker. */
    const SHADES = [1, 0.62, 0.4, 0.26, 0.16]

    /** The ramp step for one project, in bar order. */
    function shadeOf(index) {
      return SHADES[index] ?? 0.12
    }

    /** Local calendar day of a Date, as the page's date input wants it. */
    function dayString(date) {
      const pad = (value) => String(value).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    }

    /** Shift a `YYYY-MM-DD` day by whole days, in local time. */
    function shiftDay(day, delta) {
      const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day)
      if (parts === null) return dayString(new Date())
      const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
      date.setDate(date.getDate() + delta)
      return dayString(date)
    }

    /** Interpolate `{name}` placeholders in a dictionary entry. */
    function format(text, values) {
      return String(text).replace(/\{(\w+)\}/g, (match, key) => (values[key] === undefined ? match : String(values[key])))
    }

    /** Last two segments of a path, for the narrow project card. */
    function shortPath(path) {
      const parts = String(path).split('/')
      return parts.length <= 2 ? String(path) : `…/${parts.slice(-2).join('/')}`
    }

    /** `2 小时 14 分` style duration. */
    function duration(ms) {
      if (!Number.isFinite(ms) || ms <= 0) return '0 分钟'
      const minutes = Math.round(ms / 60000)
      if (minutes < 1) return '不到 1 分钟'
      const hours = Math.floor(minutes / 60)
      const rest = minutes % 60
      if (hours === 0) return `${rest} 分钟`
      if (rest === 0) return `${hours} 小时`
      return `${hours} 小时 ${rest} 分`
    }

    /** `HH:mm` of an epoch millisecond value. */
    function clock(ms) {
      const date = new Date(ms)
      const pad = (value) => String(value).padStart(2, '0')
      return `${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    function Project(props) {
      const { project, t, busy, error, onSummarize, shade } = props
      const summary = project.summary
      const facts = [
        format(t('project.range'), { from: project.firstClock, to: project.lastClock }),
        format(t('project.turns'), { count: project.turns }),
        project.files > 0 ? format(t('project.files'), { count: project.files }) : t('project.noFiles'),
      ]

      let summaryBlock
      if (busy) {
        summaryBlock = h('p', { className: 'dshwl-pending' }, t('summary.busy'))
      } else if (summary === null) {
        summaryBlock = h('div', { className: 'dshwl-pending' },
          h('span', null, t('summary.none')),
          h('button', { className: 'dshwl-link', type: 'button', onClick: () => onSummarize(false) }, t('summary.generate')))
      } else {
        summaryBlock = h('ul', { className: 'dshwl-bullets' },
          summary.bullets.map((bullet, index) => h('li', { key: `${index}-${bullet}` }, bullet)))
      }

      return h('article', { className: 'dshwl-project' },
        h('div', { className: 'dshwl-project-head' },
          h('span', { className: 'dshwl-swatch', style: { opacity: shade }, 'aria-hidden': true }),
          h('h2', { className: 'dshwl-project-name', title: project.cwd }, project.name),
          h('span', { className: 'dshwl-duration' }, duration(project.ms))),
        h('p', { className: 'dshwl-meta' },
          facts.map((fact, index) => h('span', { key: `fact-${index}` }, fact)),
          project.added > 0 ? h('span', { className: 'dshwl-add' }, `+${project.added}`) : null,
          project.deleted > 0 ? h('span', { className: 'dshwl-del' }, `−${project.deleted}`) : null),
        summaryBlock,
        project.folders.length > 0
          ? h('p', { className: 'dshwl-folders' },
            project.folders.slice(0, 3).map((folder) => h('span', { key: folder.path, title: folder.path },
              shortPath(folder.path),
              h('b', null, folder.files))))
          : null,
        summary !== null
          ? h('p', { className: 'dshwl-note-line' },
            h('span', null, format(t('summary.at'), { time: clock(summary.at) })),
            summary.source === 'agent' ? h('span', null, t('summary.agent')) : null,
            summary.stale ? h('span', { className: 'dshwl-stale' }, t('summary.stale')) : null,
            h('button', {
              className: 'dshwl-link',
              type: 'button',
              disabled: busy,
              onClick: () => onSummarize(true),
            }, t('summary.regenerate')))
          : null,
        error !== '' ? h('p', { className: 'dshwl-error-line' },
          format(t('summary.error'), { error }),
          h('button', { className: 'dshwl-link', type: 'button', onClick: () => onSummarize(true) }, t('error.retry'))) : null)
    }

    /** `YYYY-MM` of a `YYYY-MM-DD` day. */
    function monthOf(day) {
      return String(day).slice(0, 7)
    }

    /** Shift a `YYYY-MM` month by whole months. */
    function shiftMonth(month, delta) {
      const parts = /^(\d{4})-(\d{2})$/.exec(month)
      if (parts === null) return monthOf(dayString(new Date()))
      const date = new Date(Number(parts[1]), Number(parts[2]) - 1 + delta, 1)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }

    /** One month's cells: leading blanks for a Monday-first week, then every day. */
    function monthCells(month) {
      const [year, mon] = month.split('-').map(Number)
      const total = new Date(year, mon, 0).getDate()
      const lead = (new Date(year, mon - 1, 1).getDay() + 6) % 7
      const cells = []
      for (let index = 0; index < lead; index += 1) cells.push(null)
      for (let day = 1; day <= total; day += 1) cells.push(`${month}-${String(day).padStart(2, '0')}`)
      return cells
    }

    /** The seven `YYYY-MM-DD` days of the week holding one day, Monday first. */
    function weekOf(day) {
      const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day))
      const base = parts === null
        ? new Date()
        : new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
      base.setDate(base.getDate() - ((base.getDay() + 6) % 7))
      const days = []
      for (let index = 0; index < 7; index += 1) {
        const date = new Date(base)
        date.setDate(base.getDate() + index)
        days.push(dayString(date))
      }
      return days
    }

    /** Browser-local preference for the calendar's expanded state. */
    const PREF_KEY = 'dsh.work-log.calendar'

    /** Whether the month grid starts expanded; defaults to the one-row strip. */
    function calendarPref() {
      try {
        return localStorage.getItem(PREF_KEY) === 'open'
      } catch {
        return false
      }
    }

    /** Persist the expanded/collapsed choice. */
    function storeCalendarPref(open) {
      try {
        localStorage.setItem(PREF_KEY, open ? 'open' : 'closed')
      } catch {
        /* storage may be unavailable; the choice still holds for this render tree */
      }
    }

    /**
     * Day switcher in two states: a full month grid, or one compact week row.
     * Both mark the days that have a record and carry the day's totals in the
     * tooltip; the strip keeps the same controls in one line height.
     * @param props - month, the month's day map, selection, state, and callbacks.
     */
    function Calendar(props) {
      const { t, month, data, status, selected, today, open, onSelect } = props
      const [year, mon] = month.split('-').map(Number)
      const label = format(t('cal.month'), { year, month: mon })
      const days = data === null || data === undefined ? {} : data.days ?? {}
      const dayTitle = (day) => {
        const entry = days[day]
        if (entry === undefined) return `${day} · ${t('cal.emptyDay')}`
        return `${day} · ${format(t('cal.day'), { duration: duration(entry.ms), projects: entry.projects, turns: entry.turns })}`
      }
      const toggle = h('button', {
        className: 'dshwl-btn',
        type: 'button',
        title: open ? t('cal.collapse') : t('cal.expand'),
        'aria-expanded': open,
        onClick: props.onToggle,
      }, open ? '▴' : '▾')

      if (!open) {
        return h('section', { className: 'dshwl-cal dshwl-cal-compact', 'data-testid': 'work-log-calendar', 'aria-label': label },
          h('span', { className: 'dshwl-cal-title' }, label),
          h('div', { className: 'dshwl-cal-actions' },
            h('button', { className: 'dshwl-btn', type: 'button', title: t('cal.prevWeek'), onClick: props.onPrevWeek }, '‹'),
            h('div', { className: 'dshwl-mini' },
              weekOf(selected === '' ? today : selected).map((day) => {
                const entry = days[day]
                const classes = ['dshwl-mini-cell']
                if (entry !== undefined) classes.push('dshwl-mini-cell-data')
                if (day === today) classes.push('dshwl-mini-cell-today')
                if (day === selected) classes.push('dshwl-mini-cell-selected')
                return h('button', {
                  key: day,
                  className: classes.join(' '),
                  type: 'button',
                  title: dayTitle(day),
                  'aria-pressed': day === selected,
                  onClick: () => onSelect(day),
                },
                h('span', null, String(Number(day.slice(8)))),
                entry === undefined ? null : h('span', { className: 'dshwl-mini-dot' }))
              })),
            h('button', { className: 'dshwl-btn', type: 'button', title: t('cal.nextWeek'), onClick: props.onNextWeek }, '›'),
            toggle))
      }

      return h('section', { className: 'dshwl-cal', 'data-testid': 'work-log-calendar', 'aria-label': label },
        h('div', { className: 'dshwl-cal-head' },
          h('span', { className: 'dshwl-cal-title' }, label),
          h('div', { className: 'dshwl-cal-actions' },
            h('button', { className: 'dshwl-btn', type: 'button', title: t('cal.prev'), onClick: props.onPrevMonth }, '‹'),
            h('button', { className: 'dshwl-btn', type: 'button', title: t('cal.next'), onClick: props.onNextMonth }, '›'),
            h('button', { className: 'dshwl-btn', type: 'button', onClick: props.onToday }, t('cal.today')),
            toggle)),
        h('div', { className: 'dshwl-cal-week' },
          t('cal.weekdays').split(',').map((weekday, index) => h('span', { key: `${index}-${weekday}`, className: 'dshwl-cal-wd' }, weekday))),
        h('div', { className: 'dshwl-cal-grid' },
          monthCells(month).map((day, index) => {
            if (day === null) return h('span', { key: `blank-${index}`, className: 'dshwl-cell dshwl-cell-blank' })
            const entry = days[day]
            const classes = ['dshwl-cell']
            if (entry !== undefined) classes.push('dshwl-cell-data')
            if (day === today) classes.push('dshwl-cell-today')
            if (day === selected) classes.push('dshwl-cell-selected')
            return h('button', {
              key: day,
              className: classes.join(' '),
              type: 'button',
              title: dayTitle(day),
              'aria-pressed': day === selected,
              onClick: () => onSelect(day),
            },
            h('span', { className: 'dshwl-cell-num' }, String(Number(day.slice(8)))),
            entry === undefined ? null : h('span', { className: 'dshwl-cell-dot' }))
          })),
        status === 'loading' ? h('div', { className: 'dshwl-cal-status' }, t('cal.loading')) : null)
    }

        /** `¥12.34` / `$12.34` for one wallet amount. */
    function money(amount, currency) {
      const value = Number(amount)
      return `${currency === 'USD' ? '$' : '¥'}${Number.isFinite(value) ? value.toFixed(2) : '—'}`
    }

    /** Clock-style duration for the HUD: `08:11`. */
    function clockDuration(ms) {
      const totalMinutes = Math.floor((Number(ms) || 0) / 60000)
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }

    /** Persisted top-right HUD offset; null keeps the default corner. */
    const PILL_POS_KEY = 'dsh.work-log.pill'

    function readPillPos() {
      try {
        const raw = localStorage.getItem(PILL_POS_KEY)
        if (raw === null) return null
        const parsed = JSON.parse(raw)
        if (typeof parsed?.left !== 'number' || typeof parsed?.top !== 'number') return null
        return { left: parsed.left, top: parsed.top }
      } catch {
        return null
      }
    }

    function storePillPos(position) {
      try {
        if (position === null) localStorage.removeItem(PILL_POS_KEY)
        else localStorage.setItem(PILL_POS_KEY, JSON.stringify(position))
      } catch {
        /* storage unavailable: the position still holds for this render tree */
      }
    }

    /** Keep the HUD inside the viewport, with an 8px breathing edge. */
    function clampPill(left, top, width, height) {
      return {
        left: Math.min(Math.max(8, left), Math.max(8, window.innerWidth - width - 8)),
        top: Math.min(Math.max(8, top), Math.max(8, window.innerHeight - height - 8)),
      }
    }

    const PILL_CSS = `
.dshwl-pill-layer{position:fixed;inset:0;pointer-events:none;z-index:2}
.dshwl-pill{position:absolute;top:62px;right:18px;pointer-events:auto;display:inline-flex;align-items:center;gap:7px;padding:4px 5px 4px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(16,10,30,.62);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);color:rgba(243,240,255,.94);font-size:12px;font-weight:600;font-variant-numeric:tabular-nums;letter-spacing:.02em;line-height:1.5;white-space:nowrap;user-select:none;box-shadow:0 10px 24px -14px rgba(0,0,0,.95),inset 0 1px 0 rgba(255,255,255,.1)}
.dshwl-pill{cursor:grab;touch-action:none}
.dshwl-pill:active{cursor:grabbing}
.dshwl-pill-placed{right:auto}
.dshwl-pill-idle{opacity:.45}
.dshwl-pill-dot{flex:none;width:5px;height:5px;border-radius:50%;background:#C084FC;box-shadow:0 0 6px rgba(192,132,252,.85)}
.dshwl-pill-idle .dshwl-pill-dot{background:rgba(243,240,255,.45);box-shadow:none}
.dshwl-pill-balance{color:rgba(243,240,255,.66);font-weight:500;letter-spacing:0}
.dshwl-pill-balance::before{content:"·";margin-right:6px;color:rgba(255,255,255,.3)}
.dshwl-pill-rule{flex:none;width:1px;height:13px;background:rgba(255,255,255,.16)}
.dshwl-pill-go{flex:none;display:inline-flex;align-items:center;justify-content:center;width:21px;height:21px;padding:0;border:0;border-radius:999px;background:rgba(255,255,255,.06);color:rgba(243,240,255,.72);font:inherit;font-size:13px;line-height:1;cursor:pointer}
.dshwl-pill-go:hover{background:rgba(255,255,255,.14);color:#fff}
`

    /**
     * Frame-level HUD: today's total work time in a small pill at the top-right.
     * Root-scoped, so it survives switching Sessions and panels.
     * @param props - slot props carrying the locale translator.
     */
    function WorkPill(props) {
      const t = typeof props.t === 'function' ? props.t : (key) => key
      const [state, setState] = React.useState({ ms: 0, projects: 0, running: false, at: Date.now(), account: null, ready: false })
      const [now, setNow] = React.useState(() => Date.now())

      React.useEffect(() => {
        let alive = true
        const load = () => {
          fetch('/work-log/data.json', { headers: { accept: 'application/json' } })
            .then((response) => (response.ok ? response.json() : null))
            .then((payload) => {
              if (!alive || payload === null || payload.day === undefined) return
              setState({
                ms: payload.day.totalMs,
                projects: payload.day.totals.projects,
                running: payload.day.running === true,
                account: payload.day.account ?? null,
                at: Date.now(),
                ready: true,
              })
            })
            .catch(() => undefined)
        }
        load()
        const id = setInterval(load, 30000)
        const tick = setInterval(() => setNow(Date.now()), 1000)
        const onVisible = () => {
          if (document.visibilityState === 'visible') load()
        }
        document.addEventListener('visibilitychange', onVisible)
        return () => {
          alive = false
          clearInterval(id)
          clearInterval(tick)
          document.removeEventListener('visibilitychange', onVisible)
        }
      }, [])

      const [position, setPosition] = React.useState(() => readPillPos())
      const pillRef = React.useRef(null)
      const dragRef = React.useRef(null)
      const lastRef = React.useRef(null)
      const positionRef = React.useRef(position)
      positionRef.current = position

      // Re-clamp after a window resize or rotation.
      React.useEffect(() => {
        const onResize = () => {
          const el = pillRef.current
          if (el === null || positionRef.current === null) return
          const next = clampPill(positionRef.current.left, positionRef.current.top, el.offsetWidth, el.offsetHeight)
          if (next.left === positionRef.current.left && next.top === positionRef.current.top) return
          lastRef.current = next
          setPosition(next)
          storePillPos(next)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
      }, [])

      const startDrag = (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return
        const el = pillRef.current
        if (el === null) return
        const rect = el.getBoundingClientRect()
        dragRef.current = { pointerId: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top }
        lastRef.current = { left: rect.left, top: rect.top }
        try {
          el.setPointerCapture(event.pointerId)
        } catch {
          /* capture is a nicety; dragging still works without it */
        }
        event.preventDefault()
      }

      const moveDrag = (event) => {
        const drag = dragRef.current
        const el = pillRef.current
        if (drag === null || el === null || drag.pointerId !== event.pointerId) return
        const next = clampPill(event.clientX - drag.dx, event.clientY - drag.dy, el.offsetWidth, el.offsetHeight)
        lastRef.current = next
        setPosition(next)
      }

      const endDrag = (event) => {
        if (dragRef.current === null) return
        dragRef.current = null
        try {
          pillRef.current?.releasePointerCapture(event.pointerId)
        } catch {
          /* already released */
        }
        if (lastRef.current !== null) storePillPos(lastRef.current)
      }

      // Double-click returns the HUD to its default corner.
      const resetPosition = () => {
        dragRef.current = null
        lastRef.current = null
        setPosition(null)
        storePillPos(null)
      }

      // Smooth between polls; never invent more than one poll window of time.
      const live = state.ms + (state.running && state.ready ? Math.min(35000, Math.max(0, now - state.at)) : 0)
      const short = clockDuration(live)
      const full = format(t('pill.today'), {
        duration: duration(live),
        projects: state.projects,
      })
      const classes = ['dshwl-pill']
      if (!state.ready) classes.push('dshwl-pill-idle')
      if (position !== null) classes.push('dshwl-pill-placed')
      return h('div', { className: 'dshwl-pill-layer' },
        h('style', null, PILL_CSS),
        h('div', {
          ref: pillRef,
          className: classes.join(' '),
          style: position === null ? undefined : { left: `${position.left}px`, top: `${position.top}px` },
          title: full,
          role: 'status',
          'aria-label': full,
          onPointerDown: startDrag,
          onPointerMove: moveDrag,
          onPointerUp: endDrag,
          onPointerCancel: endDrag,
          onDoubleClick: resetPosition,
        },
        h('span', { className: 'dshwl-pill-dot', 'aria-hidden': true }),
        h('span', null, short),
        state.account === null
          ? null
          : h('span', { className: 'dshwl-pill-balance' }, money(state.account.balance, state.account.currency)),
        h('span', { className: 'dshwl-pill-rule', 'aria-hidden': true }),
        h('button', {
          className: 'dshwl-pill-go',
          type: 'button',
          title: t('pill.open'),
          'aria-label': t('pill.open'),
          onPointerDown: (event) => event.stopPropagation(),
          onDoubleClick: (event) => event.stopPropagation(),
          onClick: (event) => {
            event.stopPropagation()
            if (typeof props.open === 'function') props.open()
          },
        }, '›')))
    }

    /**
     * The whole panel: one day of work grouped by project, with each project's
     * duration, touched folders, and a short "what got solved" summary.
     * @param props - slot props carrying the locale translator.
     */
    function Page(props) {
      const t = typeof props.t === 'function' ? props.t : (key) => key
      const [selected, setSelected] = React.useState('')
      const [state, setState] = React.useState({ status: 'loading', data: null, error: '' })
      const [nonce, setNonce] = React.useState(0)
      const [busy, setBusy] = React.useState({})
      const [failures, setFailures] = React.useState({})
      const autoAsked = React.useRef(null)
      const [month, setMonth] = React.useState(() => monthOf(dayString(new Date())))
      const [calendarOpen, setCalendarOpen] = React.useState(() => calendarPref())
      const [monthState, setMonthState] = React.useState({ status: 'idle', data: null })

      React.useEffect(() => {
        let alive = true
        setState((current) => ({ status: 'loading', data: current.data, error: '' }))
        const query = selected === '' ? '' : `?date=${encodeURIComponent(selected)}`
        fetch(`/work-log/data.json${query}`, { headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return response.json()
          })
          .then((data) => {
            if (!alive) return
            setState({ status: 'ready', data, error: '' })
          })
          .catch((error) => {
            if (!alive) return
            setState({ status: 'error', data: null, error: error instanceof Error ? error.message : String(error) })
          })
        return () => {
          alive = false
        }
      }, [selected, nonce])

      React.useEffect(() => {
        const id = setInterval(() => setNonce((value) => value + 1), 30000)
        return () => clearInterval(id)
      }, [])

      const data = state.data
      const day = data === null ? null : data.day
      const current = selected !== '' ? selected : day === null ? dayString(new Date()) : day.date
      const today = data === null ? dayString(new Date()) : data.today

      const toggleCalendar = React.useCallback(() => {
        setCalendarOpen((current) => {
          storeCalendarPref(!current)
          return !current
        })
      }, [])

      const summarize = React.useCallback(async (date, project, force) => {
        setBusy((current) => ({ ...current, [project]: true }))
        setFailures((current) => ({ ...current, [project]: '' }))
        try {
          const response = await fetch('/work-log/summarize.json', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ date, project, force }),
          })
          const body = await response.json().catch(() => ({}))
          if (!response.ok || body.ok !== true) throw new Error(body.error ?? `HTTP ${response.status}`)
          setNonce((value) => value + 1)
        } catch (error) {
          setFailures((current) => ({ ...current, [project]: error instanceof Error ? error.message : String(error) }))
        } finally {
          setBusy((current) => ({ ...current, [project]: false }))
        }
      }, [])

      // First visit of a day: fill in the projects that have no summary yet.
      React.useEffect(() => {
        if (data === null || day === null) return
        const marker = `${data.date}|${day.projects.length}`
        if (autoAsked.current === marker) return
        autoAsked.current = marker
        for (const project of day.projects) {
          if (project.summary === null && project.turns > 0) void summarize(day.date, project.key, false)
        }
      }, [data, day, summarize])

      // The calendar month grid follows the visible month.
      React.useEffect(() => {
        if (month === '') return
        let alive = true
        setMonthState((current) => ({ status: 'loading', data: current.data }))
        fetch(`/work-log/month.json?month=${encodeURIComponent(month)}`, { headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return response.json()
          })
          .then((payload) => {
            if (!alive) return
            setMonthState({ status: 'ready', data: payload })
          })
          .catch(() => {
            if (!alive) return
            setMonthState({ status: 'error', data: null })
          })
        return () => {
          alive = false
        }
      }, [month, nonce])

      // Following the day picker into another month keeps the grid in step.
      React.useEffect(() => {
        if (selected === '') return
        setMonth(monthOf(selected))
      }, [selected])

      let body
      if (state.status === 'error') {
        body = h('div', { className: 'dshwl-error' },
          h('span', null, `${t('error.title')}：${state.error}`),
          h('button', { className: 'dshwl-btn', type: 'button', onClick: () => setNonce((value) => value + 1) }, t('error.retry')))
      } else if (day === null) {
        body = h('div', { className: 'dshwl-empty' }, t('loading'))
      } else if (day.projects.length === 0) {
        body = h('div', { className: 'dshwl-empty' },
          h('strong', null, t('empty.title')),
          t('empty.body'))
      } else {
        body = h(React.Fragment, null,
          h('div', {
            className: 'dshwl-projects',
            style: { gridTemplateColumns: `repeat(${Math.min(day.projects.length, 5)}, minmax(0, 1fr))` },
          },
            day.projects.map((project, index) => h(Project, {
              key: project.key,
              project,
              t,
              shade: shadeOf(index),
              busy: busy[project.key] === true,
              error: failures[project.key] ?? '',
              onSummarize: (force) => summarize(day.date, project.key, force),
            }))),
          day.notes.length > 0
            ? h('section', { className: 'dshwl-section' },
              h('span', { className: 'dshwl-section-title' }, t('section.notes')),
              h('div', { className: 'dshwl-notes' },
                day.notes.map((note) => h('div', { className: 'dshwl-note', key: note.id },
                  h('strong', null, clock(note.time)),
                  h('span', null, note.text)))))
            : null)
      }

      return h('div', { className: 'dshwl-page', 'data-testid': 'work-log-page' },
        h('style', null, CSS),
        h('div', { className: 'dshwl-glow', 'aria-hidden': true }),
        h('div', { className: 'dshwl-inner' },
          h('header', { className: 'dshwl-head' },
            h('div', null,
              h('h1', { className: 'dshwl-title' }, t('title'))),
            h('div', { className: 'dshwl-nav' },
              h('button', {
                className: 'dshwl-btn',
                type: 'button',
                title: t('nav.prev'),
                onClick: () => setSelected(shiftDay(current, -1)),
              }, '‹'),
              h('input', {
                className: 'dshwl-date',
                type: 'date',
                value: current,
                max: today,
                'aria-label': t('title'),
                onChange: (event) => setSelected(event.target.value === '' ? today : event.target.value),
              }),
              h('button', {
                className: 'dshwl-btn',
                type: 'button',
                title: t('nav.next'),
                disabled: current >= today,
                onClick: () => setSelected(shiftDay(current, 1)),
              }, '›'),
              h('button', {
                className: 'dshwl-btn',
                type: 'button',
                disabled: current >= today,
                onClick: () => setSelected(today),
              }, t('nav.today')),
              h('button', {
                className: 'dshwl-btn',
                type: 'button',
                onClick: () => setNonce((value) => value + 1),
              }, t('nav.refresh')))),
          h(Calendar, {
            t,
            month,
            data: monthState.data,
            status: monthState.status,
            selected: current,
            today,
            onSelect: (next) => {
              setSelected(next)
              setMonth(monthOf(next))
            },
            onPrevMonth: () => setMonth(shiftMonth(month, -1)),
            onNextMonth: () => setMonth(shiftMonth(month, 1)),
            onToday: () => {
              setSelected(today)
              setMonth(monthOf(today))
            },
            open: calendarOpen,
            onToggle: toggleCalendar,
            onPrevWeek: () => setSelected(shiftDay(current, -7)),
            onNextWeek: () => setSelected(shiftDay(current, 7)),
          }),
          day === null
            ? null
            : h('div', { className: 'dshwl-day' },
              h('div', {
                className: 'dshwl-stats',
                style: {
                  gridTemplateColumns: `repeat(${(day.account === null || day.account === undefined ? 1 : 3)}, minmax(0, 1fr))`,
                },
              },
              h('div', { className: 'dshwl-stat' },
                h('span', { className: 'dshwl-stat-label' }, t('stat.work')),
                h('span', { className: 'dshwl-stat-value' }, duration(day.totalMs))),
              day.account === null || day.account === undefined
                ? null
                : h('div', { className: 'dshwl-stat' },
                  h('span', { className: 'dshwl-stat-label' }, t('account.balance')),
                  h('span', { className: 'dshwl-stat-value' }, money(day.account.balance, day.account.currency))),
              day.account === null || day.account === undefined
                ? null
                : h('div', { className: 'dshwl-stat' },
                  h('span', { className: 'dshwl-stat-label' }, t('account.spend')),
                  h('span', { className: 'dshwl-stat-value' }, money(day.account.spend, day.account.currency)))),
              h('div', { className: 'dshwl-facts' },
                h('span', null, format(t('day.projects'), { count: day.totals.projects })),
                h('span', null, format(t('project.turns'), { count: day.totals.turns })),
                h('span', null, format(t('project.files'), { count: day.totals.files })),
                day.totals.added > 0 ? h('span', { className: 'dshwl-add' }, `+${day.totals.added}`) : null,
                day.totals.deleted > 0 ? h('span', { className: 'dshwl-del' }, `−${day.totals.deleted}`) : null),
              h('div', { className: 'dshwl-bar', 'aria-hidden': true },
                day.projects.map((project, index) => h('span', {
                  key: project.key,
                  className: 'dshwl-bar-seg',
                  style: { flexGrow: Math.max(project.ms, 60000), opacity: shadeOf(index) },
                })))),
          body,
          h('p', { className: 'dshwl-footer' }, format(t('footer'), { path: '~/.dsh/work-log' }))))
    }

    /** Notebook glyph for the sidebar entry; inherits the row's color. */
    function PanelIcon(props) {
      const size = typeof props.size === 'number' ? props.size : 18
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': true,
        style: { display: 'block' },
      },
      h('path', {
        d: 'M6.25 3.75h9.5A2.5 2.5 0 0 1 18.25 6.25v14H8.25a2 2 0 0 1-2-2V3.75Z',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinejoin: 'round',
      }),
      h('path', {
        d: 'M6.25 16.25h12M9.5 7.75h5.5M9.5 11h5.5',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
      }))
    }

    return {
      inject: ['slots', 'locale', 'layout'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'work-log: dictionaries')
        const t = ctx.locale.bind(NS)
        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
          locale: NS,
        }, Page))
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 20,
          locale: NS,
          label: () => t('panel'),
        }, PanelIcon))
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'work-log-pill',
          order: 5,
          locale: NS,
          inject: () => ({
            open: () => ctx.layout.selectPanel(PANEL_ID),
          }),
        }, WorkPill))
      },
    }
  },
})
