// Pure projection: never return raw URLs, titles, favicons or chat content.
export const CHAT_HOSTS = new Set(["chatgpt.com", "chat.openai.com"]);
export const CHAT_PROTOCOL = "https:";

export function isChatGPTUrl(url) {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === CHAT_PROTOCOL && CHAT_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export function projectTab(tab) {
  if (!tab || !Number.isInteger(tab.id) || !isChatGPTUrl(tab.url)) return null;
  return {
    id: tab.id,
    windowId: Number.isInteger(tab.windowId) ? tab.windowId : -1,
    active: tab.active === true,
    pinned: tab.pinned === true,
    audible: tab.audible === true,
    discarded: tab.discarded === true,
    status: tab.status === "loading" ? "loading" : "complete",
    splitViewId: Number.isInteger(tab.splitViewId) && tab.splitViewId >= 0
      ? tab.splitViewId : null
  };
}

export function canDiscard(tab) {
  return Boolean(tab && !tab.active && !tab.pinned && !tab.audible && !tab.discarded
    && tab.status === "complete");
}

export function summarize(tabs) {
  const rows = tabs.map(projectTab).filter(Boolean).sort((a, b) =>
    a.windowId - b.windowId || a.id - b.id);
  const windows = [...new Set(rows.map(row => row.windowId))].length;
  const splitGroups = new Set(rows.filter(row => row.splitViewId !== null)
    .map(row => `${row.windowId}:${row.splitViewId}`)).size;
  return {
    rows, windows, splitGroups, total: rows.length,
    active: rows.filter(row => row.active).length,
    discarded: rows.filter(row => row.discarded).length,
    discardable: rows.filter(canDiscard).length
  };
}
