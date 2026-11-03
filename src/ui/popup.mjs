import { summarize, canDiscard, isChatGPTUrl } from "../core/tab-model.mjs";

const $ = id => document.getElementById(id);
const status = message => { $("status").textContent = message; };
const api = globalThis.browser;
let busy = false;

function updateCounters(summary) {
  for (const key of ["total", "active", "discarded", "windows"]) {
    $(key).textContent = String(summary[key]);
  }
  $("split-count").textContent = summary.splitGroups
    ? `Split View: ${summary.splitGroups}` : "";
}

function makeRow(tab, index) {
  const li = document.createElement("li");
  const head = document.createElement("div");
  head.className = "tab-main";
  const details = document.createElement("div");
  const title = document.createElement("div");
  title.className = "tab-title";
  title.textContent = `ChatGPT · вкладка #${index + 1}`;
  const subtitle = document.createElement("p");
  subtitle.className = "tab-subtitle";
  const flags = [
    `Окно ${tab.windowId}`,
    tab.active ? "Активная" : "Фоновая",
    tab.discarded ? "Выгружена" : tab.status === "loading" ? "Загружается" : "Загружена",
    tab.splitViewId === null ? "" : `Split #${tab.splitViewId}`,
    tab.pinned ? "Закреплена" : "",
    tab.audible ? "Воспроизводит звук" : ""
  ].filter(Boolean);
  subtitle.textContent = flags.join(" · ");
  details.append(title, subtitle);
  head.append(details);
  const actions = document.createElement("div");
  actions.className = "tab-actions";
  const discard = document.createElement("button");
  discard.type = "button";
  discard.textContent = tab.discarded ? "Уже выгружена" : "Выгрузить";
  discard.disabled = !canDiscard(tab);
  discard.title = canDiscard(tab) ? "Выгрузить из RAM; может пропасть несохранённый ввод" :
    "Недоступно для активной, закреплённой, звучащей, уже выгруженной или загружаемой вкладки";
  discard.addEventListener("click", () => discardTab(tab.id));
  actions.append(discard);
  li.append(head, actions);
  return li;
}

async function refresh() {
  if (busy) return;
  busy = true;
  $("refresh").disabled = true;
  status("Обновление…");
  try {
    const snapshot = summarize(await api.tabs.query({}));
    updateCounters(snapshot);
    $("tabs-list").replaceChildren(...snapshot.rows.map(makeRow));
    status(snapshot.total ? "" : "Открытых вкладок ChatGPT не найдено.");
  } catch {
    status("Не удалось получить вкладки. Проверьте разрешение tabs.");
  } finally {
    busy = false;
    $("refresh").disabled = false;
  }
}

async function discardTab(tabId) {
  if (busy) return;
  busy = true;
  $("refresh").disabled = true;
  status("Проверка вкладки…");
  try {
    // Re-query immediately before privileged action; never trust stale UI state.
    const fresh = await api.tabs.get(tabId);
    if (!isChatGPTUrl(fresh.url) || !canDiscard({
      active: fresh.active, pinned: fresh.pinned, audible: fresh.audible,
      discarded: fresh.discarded, status: fresh.status
    })) {
      status("Вкладка изменилась. Выгрузка отменена.");
      return;
    }
    await api.tabs.discard(tabId);
    status("Вкладка выгружена. При выборе Firefox загрузит её снова.");
  } catch {
    status("Firefox не разрешил выгрузку. Вкладка не изменена расширением.");
  } finally {
    busy = false;
    $("refresh").disabled = false;
    // Allow status text to remain until next explicit refresh.
    await refreshAfterAction();
  }
}

async function refreshAfterAction() {
  try {
    const snapshot = summarize(await api.tabs.query({}));
    updateCounters(snapshot);
    $("tabs-list").replaceChildren(...snapshot.rows.map(makeRow));
  } catch {
    status("Не удалось обновить список вкладок.");
  }
}

$("refresh").addEventListener("click", refresh);
refresh();
