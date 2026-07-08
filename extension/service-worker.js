chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'kiya-capture-selection', title: 'Save selection to KIYA', contexts: ['selection'] });
});
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== 'kiya-capture-selection') return;
  const { api, token } = await chrome.storage.sync.get(['api','token']);
  if (!api || !token || !info.selectionText) return;
  fetch(`${api.replace(/\/$/,'')}/api/planner/capture`, { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({ text: info.selectionText }) }).catch(()=>{});
});
