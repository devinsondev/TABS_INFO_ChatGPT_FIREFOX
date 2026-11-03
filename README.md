# ChatGPT Tab Safe Monitor — Firefox

Small privacy-first Firefox WebExtension. Shows **browser-provided metadata** for open ChatGPT tabs, and offers an explicit per-tab Firefox `tabs.discard()` action. This is not a ChatGPT integration and is not affiliated with OpenAI.

## What it actually does

- Counts ChatGPT tabs, active tabs, discarded tabs and windows; lists status per tab.
- Groups detected Firefox split-view tabs when the browser exposes `splitViewId`; falls back to normal tabs otherwise.
- Displays window number, whether a tab is active, pinned, audible, loading or discarded.
- Allows **only manual** discarding of inactive, unpinned, silent and fully loaded ChatGPT tabs. Re-checks state immediately before the action.
- Uses the Ink & Orange / Sand & Orange design from [code_rules](https://github.com/devinsondev/code_rules/blob/main/browser-extensions/design/SKILL.md).

## Explicit limitations

- **Does not** count messages, responses, prompts, characters, DOM nodes, requests, CPU, RAM or total chat size. Standard Firefox Tabs APIs do not expose those metrics, and Safe Mode will not read the ChatGPT page.
- A tab is not necessarily one conversation. ChatGPT routing or the site's own UI may differ from Firefox's browser-level split view.
- Browser resources are only observed indirectly by lifecycle state. No made-up RAM or performance numbers.
- Discarding a background tab may lose unsaved inputs or page-internal transient state; user must choose the action. It does not close the tab.
- No background scripts, periodic polling, automated tab manipulation or automatic data collection. Popup only reads a snapshot when opened or refreshed.
- No promise that OpenAI approves the extension. See [AUTHOR_ASSESSMENT.md](AUTHOR_ASSESSMENT.md) and the [AI-assisted support exchange](SUPPORT_TRANSCRIPT.md), which expressly provides no official compliance determination.

## Installation (temporary, for personal testing)

1. Download/clone this repository.
2. In Firefox Desktop open `about:debugging#/runtime/this-firefox`.
3. Choose **Load Temporary Add-on…** and select `manifest.json`.
4. Open ChatGPT tabs and click the toolbar extension button.

Temporary extensions are removed when Firefox restarts. Do not publish to AMO or claim signed distribution before release checks and review.

## Verification

Run `node --test tests/*.test.mjs` (Node.js 20+). Lint the **distribution directory** with a trusted installation of `web-ext lint --source-dir .`. Then smoke-test in actual Firefox (140+ declared minimum), including permission/restart/discard behavior and newer split-view versions.

Status: **NOT READY TO RELEASE** until actual Firefox runtime tests, `web-ext lint`, privacy disclosure review and signing checks pass.

## Permissions and privacy

The only requested permission is `tabs`, needed to inspect tab URLs to match exact ChatGPT hosts and observe tab lifecycle fields. URLs are evaluated locally in memory, never displayed, persisted or transmitted. No `host_permissions`, content scripts, cookies, storage, network requests or telemetry. The popup has an optional explicit link to the source repository; opening it is a user navigation, not a background request.

Data collection: none. The code does not transmit tab metadata, page data or analytics. To inspect every detail, review `manifest.json`, `src/core/tab-model.mjs` and `src/ui/popup.mjs`.

## License

MIT. The project is community-developed, unofficial and has no connection with OpenAI.
