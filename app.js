import Fuse from '/fuse.mjs';
const M=window.MOVES,grid=document.getElementById('grid'),q=document.getElementById('q');
const cards=Object.fromEntries([...grid.children].map(c=>[c.dataset.slug,c]));
const fuse=new Fuse(M,{keys:[{name:'name',weight:3},'muscles','cat','tier','how'],threshold:.38,ignoreLocation:true});
let cat='all';
function run(){const t=q.value.trim(),mn=+dmin.value,mx=+dmax.value,w=wt.value;
 let list=t?fuse.search(t).map(r=>r.item):M.slice().sort((a,b)=>sort.value=='name'?a.name.localeCompare(b.name):a.diff-b.diff||a.name.localeCompare(b.name));
 list=list.filter(m=>(cat=='all'||m.cat==cat)&&m.diff>=mn&&m.diff<=mx&&(!w||(w=='y')==m.weighted));
 const shown=new Set(list.map(m=>m.slug));
 Object.values(cards).forEach(c=>c.hidden=!shown.has(c.dataset.slug));
 list.forEach(m=>grid.appendChild(cards[m.slug]));
 count.textContent=list.length?`${list.length} move${list.length>1?'s':''} found`:'No moves found — try another word!';}
q.addEventListener('input',run);[dmin,dmax,wt,sort].forEach(e=>e.addEventListener('change',run));
document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{cat=b.dataset.cat;document.querySelectorAll('.chip').forEach(x=>{x.classList.toggle('on',x==b);x.setAttribute('aria-pressed',x==b)});run();});
addEventListener('keydown',e=>{if(e.key=='/'&&document.activeElement!=q&&!/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();q.focus();q.select();}if(e.key=='Escape'&&document.activeElement==q){q.value='';run();}});
run();
