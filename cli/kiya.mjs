#!/usr/bin/env node
const API = (process.env.KIYA_API_URL || 'http://localhost:3000').replace(/\/$/,'');
const TOKEN = process.env.KIYA_TOKEN || '';
const cmd = process.argv[2];
const args = process.argv.slice(3).join(' ');
async function req(path, init={}){ const r=await fetch(API+path,{...init,headers:{'Content-Type':'application/json',Authorization:`Bearer ${TOKEN}`,...init.headers}}); const d=await r.json().catch(()=>null); if(!r.ok||!d?.success){console.error(d?.error||`HTTP ${r.status}`); process.exit(1);} return d.data; }
if(!cmd||['help','--help','-h'].includes(cmd)){console.log(`KIYA CLI\n\nEnv: KIYA_API_URL, KIYA_TOKEN\nCommands:\n  capture <text>\n  tasks\n  goals\n  status\n  chat <message>`); process.exit(0);} 
if(!TOKEN){console.error('KIYA_TOKEN is required'); process.exit(1);} 
if(cmd==='capture'){ const d=await req('/api/planner/capture',{method:'POST',body:JSON.stringify({text:args})}); console.log(d.message||'Saved'); }
else if(cmd==='tasks'){ const d=await req('/api/planner/tasks'); console.table(d.map(t=>({title:t.title,status:t.status,priority:t.priority,due:t.due||''}))); }
else if(cmd==='goals'){ const d=await req('/api/planner/goals'); console.table(d.map(g=>({title:g.title,progress:g.progress||0,level:g.level||''}))); }
else if(cmd==='status'){ const [tasks,goals,habits]=await Promise.all([req('/api/planner/tasks'),req('/api/planner/goals'),req('/api/planner/habits')]); console.log({tasks:tasks.length,done:tasks.filter(t=>t.status==='done'||t.status==='completed').length,goals:goals.length,habits:habits.habits?.length||0}); }
else if(cmd==='chat'){ const d=await req('/api/planner/ai/chat',{method:'POST',body:JSON.stringify({message:args})}); console.log(d.assistantMessage.content); }
else { console.error('Unknown command'); process.exit(1); }
