const {POSES,MAP,VAR,FX}=require('./poses');
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const pl=(p,o,i,wo,wi)=>{const s=p.map(q=>q.join(',')).join(' ');return `<polyline points="${s}" stroke="#111" stroke-width="${wo}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${s}" stroke="${i}" stroke-width="${wi}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`};
function props(spec){let o='';for(const t of spec.split(' ').filter(Boolean)){const[k,v='']=t.split(':');const a=v.split(',').map(Number);
 const R=(x,y,w,h,f='#111')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="#111" stroke-width="4"/>`;
 if(k=='floor')o+=`<rect x="0" y="${a[0]}" width="200" height="${190-a[0]}" fill="#111"/>`;
 if(k=='wall')o+=R(a[0]-14,0,14,190,'#d9c7a3')+[20,60,100,140].map(y=>`<line x1="${a[0]-14}" y1="${y}" x2="${a[0]}" y2="${y}" stroke="#111" stroke-width="3"/>`).join('');
 if(k=='bench')o+=R(a[0],a[1],a[2]-a[0],10,'#8b5a2b')+R(a[0]+6,a[1]+10,6,190-a[1],'#111')+R(a[2]-12,a[1]+10,6,190-a[1],'#111');
 if(k=='box'||k=='step')o+=R(a[0],a[1],a[2]-a[0],190-a[1],k=='box'?'#c0392b':'#7f8c8d');
 if(k=='pbars')o+=R(a[0]-14,156,32,6,'#f1c40f')+R(a[0]-10,160,4,8)+R(a[0]+10,160,4,8);
 if(k=='pbar')o+=R(40,a[0],120,8,'#95a5a6')+R(48,a[0]+8,6,190,'#111')+R(146,a[0]+8,6,190,'#111');
 if(k=='bar')o+=R(20,a[0]-4,160,8,'#95a5a6');
 if(k=='lowbar')o+=R(30,a[0],110,8,'#95a5a6')+R(34,a[0]+8,5,190,'#111');
 if(k=='rings')o+=`<line x1="96" y1="0" x2="98" y2="${a[0]-8}" stroke="#111" stroke-width="3"/><line x1="112" y1="0" x2="110" y2="${a[0]-8}" stroke="#111" stroke-width="3"/><circle cx="100" cy="${a[0]}" r="8" fill="none" stroke="#e67e22" stroke-width="5"/><circle cx="108" cy="${a[0]}" r="8" fill="none" stroke="#e67e22" stroke-width="5"/>`;
 if(k=='ringrow')o+=`<line x1="72" y1="0" x2="74" y2="48" stroke="#111" stroke-width="3"/><circle cx="78" cy="56" r="8" fill="none" stroke="#e67e22" stroke-width="5"/>`;
 if(k=='towels')o+=`<path d="M84 8 q-4 14 0 28 M116 8 q4 14 0 28" stroke="#3498db" stroke-width="9" fill="none"/>`;
 if(k=='wheel')o+=`<circle cx="26" cy="150" r="10" fill="#e74c3c" stroke="#111" stroke-width="4"/>`;
 if(k=='anchor')o+=R(166,156,24,8,'#8e44ad');
 if(k=='pole')o+=R(a[0]-5,0,10,190,'#95a5a6');
}return o}
function art(slug,c,label,opts={}){
 const p=POSES[MAP[slug]],v=VAR[slug]||{},h=hash(slug);
 const id='h'+(h%1e6)+(opts.idSuffix||'');
 const rot=h%40-20, fx=v.fx||p.fx||FX[h%FX.length];
 const burst=Array.from({length:14},(_,i)=>{const a=(i/14)*2*Math.PI+rot/57,r=i%2?52:92;return `${100+r*Math.cos(a)},${95+r*Math.sin(a)}`}).join(' ');
 const [e1,a1,e2,a2]=p.a,[k1,f1,k2,f2]=p.l;
 const fxRight=p.hd[0]<100, fxX=fxRight?152:48, fxY=h%2?22:30;
 return `<svg viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comic illustration: ${label}"${opts.attrs||''}><defs><pattern id="${id}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})"><circle cx="4.5" cy="4.5" r="2.3" fill="${c}" opacity=".5"/></pattern></defs>
<rect width="200" height="190" fill="#fff8e1"/><polygon points="${burst}" fill="url(#${id})" stroke="${c}" stroke-width="2" opacity=".9"/>
${[0,1,2].map(i=>`<line x1="${(h>>i*3)%200}" y1="${10+i*8}" x2="${(h>>i*3)%200+20}" y2="${4+i*8}" stroke="#111" stroke-width="2" opacity=".25"/>`).join('')}
${props(p.props)}
${pl([p.h,k2,f2],'','#ddd',11,5)}${pl([p.n,e2,a2],'','#ddd',11,5)}
${pl([p.n,p.h],'',c,18,11)}
${pl([p.h,k1,f1],'',c,11,5)}${pl([p.n,e1,a1],'',c,11,5)}
<circle cx="${a1[0]}" cy="${a1[1]}" r="5" fill="#ffd9b0" stroke="#111" stroke-width="3"/><circle cx="${a2[0]}" cy="${a2[1]}" r="4" fill="#ffd9b0" stroke="#111" stroke-width="3"/>
<circle cx="${p.hd[0]}" cy="${p.hd[1]}" r="13" fill="#ffd9b0" stroke="#111" stroke-width="5"/><path d="M${p.hd[0]-11} ${p.hd[1]-3} h22" stroke="${c}" stroke-width="6"/>
<g transform="rotate(${h%2?-8:8} ${fxX} ${fxY})"><rect x="${fxX-30}" y="${fxY-13}" width="60" height="24" rx="4" fill="#fff" stroke="#111" stroke-width="3"/><text x="${fxX}" y="${fxY+6}" font-family="Bangers,Impact,sans-serif" font-size="${fx.length>6?14:18}" text-anchor="middle" fill="#e5262f">${fx}</text></g></svg>`;
}
module.exports={art};
