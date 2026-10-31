const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "myDailyLife_v1";
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
let selectedDate = todayISO();
let activeFilter = "all";
const defaultRoutines = [
  {group:"Sebelum mandi",title:"Gunakan body scrub (sesuai jadwal kulit)",id:"pre1"},
  {group:"Sebelum mandi",title:"Siapkan perlengkapan mandi",id:"pre2"},
  {group:"Setelah mandi",title:"Gunakan body lotion",id:"post1"},
  {group:"Setelah mandi",title:"Gunakan deodorant",id:"post2"},
  {group:"Setelah mandi",title:"Hair care / vitamin rambut",id:"post3"},
  {group:"Skincare pagi",title:"Cleanser",id:"am1"},
  {group:"Skincare pagi",title:"Moisturizer",id:"am2"},
  {group:"Skincare pagi",title:"Sunscreen",id:"am3"},
  {group:"Skincare malam",title:"Cleanser",id:"pm1"},
  {group:"Skincare malam",title:"Moisturizer",id:"pm2"},
  {group:"Makeup",title:"Primer",id:"make1"},
  {group:"Makeup",title:"Cushion / foundation",id:"make2"},
  {group:"Makeup",title:"Bedak, blush on, dan lip product",id:"make3"}
];
let data = loadData();
function loadData(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {days:{},customRoutines:[]};}catch(e){return {days:{},customRoutines:[]};} }
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
function dayData(){if(!data.days[selectedDate])data.days[selectedDate]={tasks:[],checks:{},note:""};return data.days[selectedDate];}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function prettyDate(iso){return new Date(iso+"T12:00:00").toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});}
function setDate(iso){selectedDate=iso;$("selectedDate").value=iso;render();}
function render(){const day=dayData();$("prettyDate").textContent=prettyDate(todayISO());$("selectedDate").value=selectedDate;
 const routines=[...defaultRoutines,...data.customRoutines];const checked=Object.values(day.checks).filter(Boolean).length;const done=day.tasks.filter(t=>t.done).length+checked;const total=day.tasks.length+routines.length;const pct=total?Math.round(done/total*100):0;
 $("progressText").textContent=pct+"% done";$("progressBar").style.width=pct+"%";$("taskCount").textContent=day.tasks.length;$("routineCount").textContent=checked;$("doneCount").textContent=done;
 renderTasks($("overviewTasks"),day.tasks.slice(0,4),false);renderTasks($("taskList"),day.tasks,true);renderRoutines(routines,day);renderOverviewRoutine(routines,day);$("dailyNote").value=day.note||"";}
function renderTasks(target,tasks,showDelete){if(!tasks.length){target.innerHTML='<div class="empty">Belum ada tugas. Tambahkan kegiatan kecilmu yuk ♡</div>';return;}
 const visible=showDelete?tasks.filter(t=>activeFilter==="all"||(activeFilter==="done"?t.done:!t.done)):tasks;
 target.innerHTML=visible.length?visible.map(t=>`<div class="item ${t.done?"done":""}"><input type="checkbox" data-task="${t.id}" ${t.done?"checked":""} aria-label="Tandai selesai"><div class="item-main"><div class="item-title">${escapeHTML(t.title)}</div><div class="item-meta">${t.time?escapeHTML(t.time)+" · ":""}${escapeHTML(t.category||"Pribadi")}</div></div>${showDelete?`<button class="delete-button" data-delete-task="${t.id}" aria-label="Hapus tugas">×</button>`:""}</div>`).join(""):'<div class="empty">Tidak ada tugas pada filter ini ♡</div>';}
function renderRoutines(routines,day){const groups=[...new Set(routines.map(r=>r.group))];$("routineGroups").innerHTML=groups.map(group=>`<div class="routine-group"><h3>${escapeHTML(group)}</h3><div class="item-list">${routines.filter(r=>r.group===group).map(r=>`<div class="item ${day.checks[r.id]?"done":""}"><input type="checkbox" data-routine="${r.id}" ${day.checks[r.id]?"checked":""} aria-label="Tandai routine selesai"><div class="item-main"><div class="item-title">${escapeHTML(r.title)}</div></div>${r.id.startsWith("custom-")?`<button class="delete-button" data-delete-routine="${r.id}" aria-label="Hapus step">×</button>`:""}</div>`).join("")}</div></div>`).join("");}
function renderOverviewRoutine(routines,day){const list=routines.slice(0,4);$("overviewRoutine").innerHTML=list.map(r=>`<div class="item ${day.checks[r.id]?"done":""}"><input type="checkbox" data-routine="${r.id}" ${day.checks[r.id]?"checked":""}><div class="item-main"><div class="item-title">${escapeHTML(r.title)}</div><div class="item-meta">${escapeHTML(r.group)}</div></div></div>`).join("");}
document.addEventListener("click",e=>{
 const tab=e.target.closest("[data-tab]");if(tab){document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===tab));document.querySelectorAll(".panel").forEach(x=>x.classList.toggle("active",x.id==="panel-"+tab.dataset.tab));}
 const go=e.target.closest("[data-go]");if(go){document.querySelector(`[data-tab="${go.dataset.go}"]`).click();}
 const task=e.target.closest("[data-task]");if(task){const t=dayData().tasks.find(x=>x.id===task.dataset.task);if(t){t.done=task.checked;save();render();}}
 const del=e.target.closest("[data-delete-task]");if(del){dayData().tasks=dayData().tasks.filter(t=>t.id!==del.dataset.deleteTask);save();render();}
 const routine=e.target.closest("[data-routine]");if(routine){dayData().checks[routine.dataset.routine]=routine.checked;save();render();}
 const delr=e.target.closest("[data-delete-routine]");if(delr){data.customRoutines=data.customRoutines.filter(r=>r.id!==delr.dataset.deleteRoutine);save();render();}
 const filter=e.target.closest("[data-filter]");if(filter){activeFilter=filter.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===filter));render();}
});
$("taskForm").addEventListener("submit",e=>{e.preventDefault();const title=$("taskTitle").value.trim();if(!title)return;dayData().tasks.push({id:crypto.randomUUID(),title,time:$("taskTime").value,category:$("taskCategory").value,done:false});save();$("taskForm").reset();render();});
$("routineForm").addEventListener("submit",e=>{e.preventDefault();const title=$("routineTitle").value.trim();if(!title)return;data.customRoutines.push({id:"custom-"+crypto.randomUUID(),title,group:$("routineGroup").value});save();$("routineForm").reset();render();});
$("dailyNote").addEventListener("input",()=>{dayData().note=$("dailyNote").value;save();$("noteStatus").textContent="Tersimpan otomatis ♡";});
$("selectedDate").addEventListener("change",e=>setDate(e.target.value||todayISO()));
$("prevDay").addEventListener("click",()=>{const d=new Date(selectedDate+"T12:00:00");d.setDate(d.getDate()-1);setDate(d.toISOString().slice(0,10));});
$("nextDay").addEventListener("click",()=>{const d=new Date(selectedDate+"T12:00:00");d.setDate(d.getDate()+1);setDate(d.toISOString().slice(0,10));});
$("todayButton").addEventListener("click",()=>setDate(todayISO()));
$("resetRoutine").addEventListener("click",()=>{if(confirm("Reset semua checklist self care untuk tanggal ini?")){dayData().checks={};save();render();}});
render();
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));}
