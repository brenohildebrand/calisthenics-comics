document.querySelectorAll('form.nlform').forEach(f=>f.addEventListener('submit',e=>{const m=f.parentElement.querySelector('.nlmsg');
 if(f.dataset.pending){e.preventDefault();m.textContent="Signups open very soon. Nothing was sent or stored.";return}
 m.textContent="Almost there! Check your inbox to confirm your subscription (a Buttondown tab opened too).";}));
// POW micro-interactions
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const pow=(x,y,t)=>{const s=document.createElement('span');s.className='pow';s.textContent=t;s.style.left=x+'px';s.style.top=y+'px';s.setAttribute('aria-hidden','true');document.body.appendChild(s);setTimeout(()=>s.remove(),700)};
document.querySelectorAll('a.prog').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||RM)return;e.preventDefault();const harder=a.querySelector('small').textContent=='Harder';pow(e.clientX||innerWidth/2,e.clientY||innerHeight/2,harder?'LEVEL UP!':'POW!');setTimeout(()=>location.href=a.href,380)}));
// power bar charge-up on detail page
const pb=document.querySelector('.detail .power');if(pb&&!RM){const on=[...pb.querySelectorAll('i.on')];pb.classList.add('charge');on.forEach((i,k)=>setTimeout(()=>{i.style.background='var(--c)';if(k==on.length-1){const r=pb.getBoundingClientRect();pow(r.left+r.width*on.length/10,r.top,on.length>=7?'BOSS LEVEL!':'POW!')}},250+k*90));}
