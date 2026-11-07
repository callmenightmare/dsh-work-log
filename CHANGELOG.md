# Changelog

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
