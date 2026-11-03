import test from "node:test";
import assert from "node:assert/strict";
import { isChatGPTUrl, projectTab, canDiscard, summarize } from "../src/core/tab-model.mjs";

test("only exact HTTPS ChatGPT hosts, never lookalikes", () => {
  for (const url of ["https://chatgpt.com/c/123", "https://chat.openai.com/"]) {
    assert.equal(isChatGPTUrl(url), true);
  }
  for (const url of ["http://chatgpt.com", "https://chatgpt.com.evil.com/",
    "https://evil-chatgpt.com/", "https://openai.com/", "javascript:alert(1)", "", null]) {
    assert.equal(isChatGPTUrl(url), false);
  }
});

test("projection excludes titles, urls and any page information", () => {
  const projected = projectTab({ id: 5, windowId: 2, url: "https://chatgpt.com/c/secret",
    title: "Sensitive secret", favIconUrl: "https://example.com/icon", active: true,
    discarded: false, status: "complete", splitViewId: 42 });
  assert.deepEqual(projected, {
    id: 5, windowId: 2, active: true, pinned: false, audible: false,
    discarded: false, status: "complete", splitViewId: 42
  });
});

test("strict discard policy denies active, pinned, audible, discarded and loading tabs", () => {
  const base = { active: false, pinned: false, audible: false,
    discarded: false, status: "complete" };
  assert.equal(canDiscard(base), true);
  for (const change of [{active:true}, {pinned:true}, {audible:true},
    {discarded:true}, {status:"loading"}]) {
    assert.equal(canDiscard({...base,...change}), false);
  }
});

test("split groups are window-scoped and absent feature degrades gracefully", () => {
  const tab = (id, windowId, splitViewId) => ({
    id, windowId, url:"https://chatgpt.com", active:false, status:"complete", splitViewId
  });
  const summary = summarize([tab(1, 1, 8), tab(2, 1, 8), tab(3, 2, 8), tab(4, 2, undefined),
    {id:9, url:"https://example.com",windowId:2}]);
  assert.equal(summary.total,4);
  assert.equal(summary.windows,2);
  assert.equal(summary.splitGroups,2);
  assert.equal(summary.discardable,4);
});
