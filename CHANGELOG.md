# Changelog

## 1.0.2 — 2026-11-07

### Fixed

- Concurrent flushes could share one temp file and interleave writes; flushes are now serialised and every temp name is unique.
- A hung provider call blocked the summarize route forever; it now aborts after 60 seconds.
- The HTTP routes now reject non-loopback peers, foreign `Origin` headers, and request bodies over 16 KB. They expose the wallet balance and can spend model quota.
- A failed balance read no longer opens the 5-minute throttle window, and only one read runs at a time.
- The wallet prefers CNY, then USD, and sums wallets of that currency instead of blindly taking the first.
- Client requests give up after 10 seconds instead of loading forever.

## 1.0.1 — 2026-11-07

### Changed

- The project grid now shows **three cards per row**; fewer projects widen to fill the row, more wrap onto the next row.
- Calendar marks show **one dot per hour up to three hours**, then a bar from four hours up that grows with the day.
- The collapsed calendar strip is taller, with larger day numbers and a thicker duration bar.
- The per-project "update summary" button and the "newer work" badge are gone; the summary line keeps only its timestamp.
- Summaries refresh **only on demand** — never when the panel opens. Ask the agent to refresh a day or a project; it calls the `work_log` tool with `action: "refresh"`.
- The panel's **Refresh** button re-reads the wallet balance immediately, instead of waiting for the 5-minute throttle.
- A recharge no longer resets "today's spend": the increase is tracked as a top-up, and spend stays `opening − current + top-ups`.

### Fixed

- A turn whose `turn/start` fell outside the replay window could create a phantom turn-0 record that inflated the day's duration by up to three hours.
- An unfinished turn counted up to "now"; it now stops at its last event, so stale turns never inflate the total.

## 1.0.0 — 2026-11-07

First release: the panel, the floating pill, per-project duration, model-written summaries, wallet balance and spend, and the `work_log` tool.
