const $ = (id) => document.getElementById(id);
chrome.storage.sync.get(['api','token'], (v) => { $('api').value=v.api||''; $('token').value=v.token||''; });
$('save').onclick = async () => {
  const api=$('api').value.replace(/\/$/,''); const token=$('token').value; const text=$('text').value.trim();
  chrome.storage.sync.set({api, token});
  if(!api||!token||!text){$('msg').textContent='API, token and text are required.';return;}
  try{const r=await fetch(`${api}/api/planner/capture`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({text})}); const d=await r.json(); $('msg').textContent=d.success?'Saved.':(d.error||'Failed'); if(d.success)$('text').value='';}catch(e){$('msg').textContent=e.message;}
};
