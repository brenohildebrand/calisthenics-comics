// "CAPTAIN REP" — original procedural comic mascot. Ink outline + 2-tone cel shading + halftone + speed lines.
const {POSES,MAP,VAR,FX}=require('./poses');
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const SKIN='#f6c79a',SKIN_D='#d99a6c',SKIN_B='#c98a5e',SHORTS='#1d1f3a',SHORTS_D='#0c0d1f',BOOT='#e5262f',BOOT_D='#a3141b',HAIR='#1a1a1a',MASK='#ffd21f';
const shade=(hex,f)=>{const n=parseInt(hex.slice(1),16);const c=[n>>16,n>>8&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v*f))));return '#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')};
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],add=(a,b)=>[a[0]+b[0],a[1]+b[1]],mul=(a,k)=>[a[0]*k,a[1]*k],len=a=>Math.hypot(a[0],a[1])||1,nrm=a=>mul(a,1/len(a)),perp=a=>[-a[1],a[0]];
const f=n=>n.toFixed(1);
// muscular limb segment a->b with widths w1, bulge wm (at t), w2. returns {full, shadeHalf, hl}
function seg(a,b,w1,wm,w2,t=.4){const d=sub(b,a),u=nrm(d),p=perp(u),m=add(a,mul(d,t));
 const L=[add(a,mul(p,w1)),add(m,mul(p,wm)),add(b,mul(p,w2))],R=[add(b,mul(p,-w2)),add(m,mul(p,-wm)),add(a,mul(p,-w1))];
 const curve=(P,Q)=>`M${f(P[0][0])} ${f(P[0][1])} Q${f(P[1][0])} ${f(P[1][1])} ${f(P[2][0])} ${f(P[2][1])}`;
 const full=`${curve(L)} L${f(R[0][0])} ${f(R[0][1])} Q${f(R[1][0])} ${f(R[1][1])} ${f(R[2][0])} ${f(R[2][1])} Z`;
 const mm=add(a,mul(d,t));const sh=`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])} L${f(R[0][0])} ${f(R[0][1])} Q${f(R[1][0])} ${f(R[1][1])} ${f(R[2][0])} ${f(R[2][1])} Z`;
 const h1=add(a,add(mul(d,.25),mul(p,w1*.55))),h2=add(a,add(mul(d,.65),mul(p,wm*.6)));
 return {full,sh,hl:`M${f(h1[0])} ${f(h1[1])} L${f(h2[0])} ${f(h2[1])}`,caps:[[a,w1],[b,w2]]}}
function part(s,fill,dark,ink=true){const caps=s.caps.map(([c,w])=>`<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(w)}"/>`).join('');
 return {ink:`<g fill="#111" stroke="#111" stroke-width="7" stroke-linejoin="round"><path d="${s.full}"/>${caps}</g>`,
  body:`<g fill="${fill}"><path d="${s.full}"/>${caps}</g><path d="${s.sh}" fill="${dark}"/><path d="${s.hl}" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>`}}
function mascot(p,suit){const suitD=shade(suit,.68);const [e1,a1,e2,a2]=p.a,[k1,f1,k2,f2]=p.l;
 const tdir=sub(p.h,p.n),tu=nrm(tdir),tp=perp(tu),tl=len(tdir);
 const sh1=add(p.n,mul(tp,15)),sh2=add(p.n,mul(tp,-15));
 const parts=[];
 // back limbs (darker)
 const knee2=seg(p.h,k2,10,11,7,.35),shin2=seg(k2,f2,7,8,5,.35),uarm2=seg(p.n,e2,7,8.5,5.5),farm2=seg(e2,a2,5.5,6.5,4.5);
 parts.push(part(knee2,SHORTS_D,'#000'),part(shin2,SKIN_B,shade(SKIN_B,.8)),part(uarm2,SKIN_B,shade(SKIN_B,.8)),part(farm2,SKIN_B,shade(SKIN_B,.8)));
 // torso: V-taper (wide shoulders, narrow waist)
 const W1=17,W2=10,chest=add(p.n,mul(tdir,.32));
 const T=[add(p.n,mul(tp,W1)),add(chest,mul(tp,W1+1)),add(p.h,mul(tp,W2)),add(p.h,mul(tp,-W2)),add(chest,mul(tp,-W1-1)),add(p.n,mul(tp,-W1))];
 const tpath=`M${f(T[0][0])} ${f(T[0][1])} Q${f(T[1][0])} ${f(T[1][1])} ${f(T[2][0])} ${f(T[2][1])} L${f(T[3][0])} ${f(T[3][1])} Q${f(T[4][0])} ${f(T[4][1])} ${f(T[5][0])} ${f(T[5][1])} Z`;
 const tsh=`M${f(p.n[0])} ${f(p.n[1])} L${f(p.h[0])} ${f(p.h[1])} L${f(T[3][0])} ${f(T[3][1])} Q${f(T[4][0])} ${f(T[4][1])} ${f(T[5][0])} ${f(T[5][1])} Z`;
 const pecs=add(p.n,mul(tdir,.28)),abs=[.5,.62,.74].map(t=>add(p.n,mul(tdir,t)));
 const star=add(p.n,mul(tdir,.2));
 const torso={ink:`<path d="${tpath}" fill="#111" stroke="#111" stroke-width="7" stroke-linejoin="round"/><circle cx="${f(p.n[0])}" cy="${f(p.n[1])}" r="${W1}" fill="#111" stroke="#111" stroke-width="7"/>`,
  body:`<circle cx="${f(p.n[0])}" cy="${f(p.n[1])}" r="${W1}" fill="${suit}"/><path d="${tpath}" fill="${suit}"/><path d="${tsh}" fill="${suitD}"/>
<path d="M${f(add(pecs,mul(tp,11))[0])} ${f(add(pecs,mul(tp,11))[1])} Q${f(add(pecs,mul(tu,4))[0])} ${f(add(pecs,mul(tu,4))[1])} ${f(add(pecs,mul(tp,-11))[0])} ${f(add(pecs,mul(tp,-11))[1])}" stroke="#111" stroke-width="2" fill="none"/>
${abs.map(c=>`<path d="M${f(add(c,mul(tp,5))[0])} ${f(add(c,mul(tp,5))[1])} L${f(add(c,mul(tp,-5))[0])} ${f(add(c,mul(tp,-5))[1])}" stroke="#111" stroke-width="1.6" opacity=".6"/>`).join('')}
<path d="M${f(abs[0][0])} ${f(abs[0][1])} L${f(abs[2][0])} ${f(abs[2][1])}" stroke="#111" stroke-width="1.6" opacity=".6"/>
<g transform="translate(${f(star[0])} ${f(star[1])}) rotate(${f(Math.atan2(tu[1],tu[0])*57.3-90)})"><polygon points="0,-6 1.8,-1.8 6,-1.8 2.6,1 3.8,5.5 0,2.8 -3.8,5.5 -2.6,1 -6,-1.8 -1.8,-1.8" fill="${MASK}" stroke="#111" stroke-width="1.4"/></g>
<path d="M${f(add(p.h,mul(tp,W2+1))[0])} ${f(add(p.h,mul(tp,W2+1))[1])} L${f(add(p.h,mul(tp,-W2-1))[0])} ${f(add(p.h,mul(tp,-W2-1))[1])}" stroke="#111" stroke-width="5"/>
<path d="M${f(add(p.h,mul(tp,W2+1))[0])} ${f(add(p.h,mul(tp,W2+1))[1])} L${f(add(p.h,mul(tp,-W2-1))[0])} ${f(add(p.h,mul(tp,-W2-1))[1])}" stroke="${MASK}" stroke-width="2.5"/>`};
 const thigh1=seg(p.h,k1,11,12.5,7.5,.35),shin1=seg(k1,f1,7.5,9,5,.3),uarm1=seg(p.n,e1,8,10,6),farm1=seg(e1,a1,6,7.5,4.8);
 const front=[part(thigh1,SHORTS,SHORTS_D),part(shin1,SKIN,SKIN_D),part(uarm1,SKIN,SKIN_D),part(farm1,SKIN,SKIN_D)];
 // boots & gloves
 const boot=(fp,kp)=>{const u=nrm(sub(fp,kp)),q=add(fp,mul(u,-6));return `<path d="M${f(q[0])} ${f(q[1])} L${f(fp[0])} ${f(fp[1])}" stroke="#111" stroke-width="15" stroke-linecap="round"/><path d="M${f(q[0])} ${f(q[1])} L${f(fp[0])} ${f(fp[1])}" stroke="${BOOT}" stroke-width="9" stroke-linecap="round"/>`};
 const glove=a=>`<circle cx="${f(a[0])}" cy="${f(a[1])}" r="6" fill="${BOOT}" stroke="#111" stroke-width="3.5"/><circle cx="${f(a[0]-1.5)}" cy="${f(a[1]-1.5)}" r="1.8" fill="#fff" opacity=".7"/>`;
 // head: square-jawed with spiky hair + mask
 const up=nrm(sub(p.hd,p.n)),hp=perp(up),H=p.hd;
 const spikes=[-1,-.5,0,.5,1].map((s,i)=>{const base=add(H,add(mul(up,7),mul(hp,s*11)));const tip=add(H,add(mul(up,22+(i%2)*4),mul(hp,s*14-6)));return `${f(base[0])},${f(base[1])} ${f(tip[0])},${f(tip[1])}`}).join(' ');
 const hb1=add(H,add(mul(up,8),mul(hp,13))),hb2=add(H,add(mul(up,8),mul(hp,-13)));
 const jaw=add(H,mul(up,-13));
 const mk1=add(H,add(mul(up,3),mul(hp,13))),mk2=add(H,add(mul(up,3),mul(hp,-13))),ey1=add(H,add(mul(up,3),mul(hp,5))),ey2=add(H,add(mul(up,3),mul(hp,-5)));
 const head=`<polygon points="${f(hb1[0])},${f(hb1[1])} ${spikes} ${f(hb2[0])},${f(hb2[1])}" fill="${HAIR}" stroke="#111" stroke-width="4" stroke-linejoin="round"/>
<path d="M${f(add(H,mul(hp,12))[0])} ${f(add(H,mul(hp,12))[1])} A12 12 0 0 1 ${f(add(H,mul(hp,-12))[0])} ${f(add(H,mul(hp,-12))[1])} L${f(add(jaw,mul(hp,-6))[0])} ${f(add(jaw,mul(hp,-6))[1])} L${f(add(jaw,mul(hp,6))[0])} ${f(add(jaw,mul(hp,6))[1])} Z" fill="${SKIN}" stroke="#111" stroke-width="5" stroke-linejoin="round"/>
<path d="M${f(H[0])} ${f(H[1])} L${f(add(jaw,mul(hp,-6))[0])} ${f(add(jaw,mul(hp,-6))[1])} L${f(add(H,mul(hp,-12))[0])} ${f(add(H,mul(hp,-12))[1])}Z" fill="${SKIN_D}" opacity=".6"/>
<path d="M${f(mk1[0])} ${f(mk1[1])} L${f(mk2[0])} ${f(mk2[1])}" stroke="#111" stroke-width="9" stroke-linecap="round"/><path d="M${f(mk1[0])} ${f(mk1[1])} L${f(mk2[0])} ${f(mk2[1])}" stroke="${MASK}" stroke-width="5.5" stroke-linecap="round"/>
<circle cx="${f(ey1[0])}" cy="${f(ey1[1])}" r="2" fill="#fff" stroke="#111" stroke-width="1"/><circle cx="${f(ey2[0])}" cy="${f(ey2[1])}" r="2" fill="#fff" stroke="#111" stroke-width="1"/>`;
 const all=[...parts,torso,...front];
 // draw back parts fully first, then front with ink silhouette merged
 return parts.map(x=>x.ink+x.body).join('')+boot(f2,k2)+glove(a2)+[torso,...front].map(x=>x.ink).join('')+[torso,...front].map(x=>x.body).join('')+boot(f1,k1)+glove(a1)+head;
}
function props(spec,c){let o='';for(const t of spec.split(' ').filter(Boolean)){const[k,v='']=t.split(':');const a=v.split(',').map(Number);
 const R=(x,y,w,h,fl)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fl}" stroke="#111" stroke-width="4"/>`;
 if(k=='floor')o+=`<rect x="-20" y="${a[0]}" width="240" height="${220-a[0]}" fill="#2b2b2b"/><line x1="-20" y1="${a[0]}" x2="220" y2="${a[0]}" stroke="#111" stroke-width="5"/>`;
 if(k=='wall')o+=R(a[0]-16,-4,16,198,'#d9c7a3')+[16,48,80,112,144].map(y=>`<line x1="${a[0]-16}" y1="${y}" x2="${a[0]}" y2="${y}" stroke="#111" stroke-width="2.5"/>`).join('');
 if(k=='bench')o+=R(a[0],a[1],a[2]-a[0],10,'#8b5a2b')+R(a[0]+5,a[1]+10,6,190-a[1],'#333')+R(a[2]-11,a[1]+10,6,190-a[1],'#333');
 if(k=='box'||k=='step')o+=R(a[0],a[1],a[2]-a[0],196-a[1],k=='box'?'#c0392b':'#7f8c8d')+`<path d="M${a[0]+4} ${a[1]+4} h${a[2]-a[0]-8}" stroke="#fff" stroke-width="2" opacity=".5"/>`;
 if(k=='pbars')o+=R(a[0]-16,155,36,6,'#f1c40f')+R(a[0]-12,160,4,8,'#333')+R(a[0]+12,160,4,8,'#333');
 if(k=='pbar')o+=R(38,a[0],124,8,'#b0bec5')+R(46,a[0]+8,6,190,'#333')+R(148,a[0]+8,6,190,'#333');
 if(k=='bar')o+=R(14,a[0]-4,172,8,'#b0bec5')+`<path d="M18 ${a[0]-2} h164" stroke="#fff" stroke-width="2" opacity=".7"/>`;
 if(k=='lowbar')o+=R(26,a[0],116,8,'#b0bec5')+R(30,a[0]+8,5,190,'#333');
 if(k=='rings')o+=`<line x1="96" y1="0" x2="98" y2="${a[0]-8}" stroke="#111" stroke-width="3"/><line x1="112" y1="0" x2="110" y2="${a[0]-8}" stroke="#111" stroke-width="3"/><circle cx="100" cy="${a[0]}" r="8" fill="none" stroke="#111" stroke-width="7"/><circle cx="100" cy="${a[0]}" r="8" fill="none" stroke="#e67e22" stroke-width="4"/><circle cx="108" cy="${a[0]}" r="8" fill="none" stroke="#111" stroke-width="7"/><circle cx="108" cy="${a[0]}" r="8" fill="none" stroke="#e67e22" stroke-width="4"/>`;
 if(k=='ringrow')o+=`<line x1="72" y1="0" x2="74" y2="48" stroke="#111" stroke-width="3"/><circle cx="78" cy="56" r="8" fill="none" stroke="#111" stroke-width="7"/><circle cx="78" cy="56" r="8" fill="none" stroke="#e67e22" stroke-width="4"/>`;
 if(k=='towels')o+=`<path d="M84 8 q-4 14 0 28 M116 8 q4 14 0 28" stroke="#111" stroke-width="12" fill="none"/><path d="M84 8 q-4 14 0 28 M116 8 q4 14 0 28" stroke="#3498db" stroke-width="7" fill="none"/>`;
 if(k=='wheel')o+=`<circle cx="26" cy="150" r="11" fill="#e74c3c" stroke="#111" stroke-width="4"/><circle cx="26" cy="150" r="3" fill="#111"/>`;
 if(k=='anchor')o+=R(166,155,26,9,'#8e44ad');
 if(k=='pole')o+=R(a[0]-6,-4,12,198,'#b0bec5');
}return o}
function art(slug,c,label,opts={}){
 const p=POSES[MAP[slug]],v=VAR[slug]||{},h=hash(slug),id='z'+(h%1e6)+(opts.idSuffix||'');
 const rot=h%40-20,fx=v.fx||p.fx||FX[h%FX.length];
 const cx=(p.n[0]+p.h[0])/2,cy=(p.n[1]+p.h[1])/2;
 const burst=Array.from({length:16},(_,i)=>{const a=(i/16)*2*Math.PI+rot/57,r=i%2?50:96;return `${f(cx+r*Math.cos(a))},${f(cy+r*Math.sin(a))}`}).join(' ');
 const speed=Array.from({length:22},(_,i)=>{const a=(i/22)*2*Math.PI+(h%7)/10,r1=70+(h>>i)%25,r2=170;return `<line x1="${f(cx+r1*Math.cos(a))}" y1="${f(cy+r1*Math.sin(a))}" x2="${f(cx+r2*Math.cos(a))}" y2="${f(cy+r2*Math.sin(a))}" stroke="#111" stroke-width="${i%3?1.2:2.4}" opacity=".35"/>`}).join('');
 const cand=[[42,8],[158,8],[42,40],[158,40]];const pts0=[p.hd,p.a[1],p.a[3],p.n];const sc=q=>Math.min(...pts0.map(z=>Math.hypot(z[0]-q[0],(z[1]-q[1])*1.6)));const best=cand.reduce((b,q)=>sc(q)>sc(b)?q:b);const fxX=best[0],fxY=best[1];
 const pts=Array.from({length:12},(_,i)=>{const a=i/12*2*Math.PI,r=i%2?22:36;return `${f(fxX+r*Math.cos(a)*1.3)},${f(fxY+r*Math.sin(a)*.7)}`}).join(' ');
 return `<svg viewBox="-8 -18 216 212" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comic illustration: Captain Rep performing the ${label}"${opts.attrs||''}><defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})"><circle cx="3.5" cy="3.5" r="2" fill="${c}"/></pattern><radialGradient id="${id}g" cx="${f(cx/2)}%" cy="${f(cy/1.9)}%" r="70%"><stop offset="0" stop-color="#fffbe6"/><stop offset="1" stop-color="${shade(c,1)}" stop-opacity=".35"/></radialGradient></defs>
<rect x="-20" y="-30" width="240" height="250" fill="#fff4cc"/><rect x="-20" y="-30" width="240" height="250" fill="url(#${id}g)"/>${speed}
<polygon points="${burst}" fill="url(#${id})" opacity=".55"/><polygon points="${burst}" fill="none" stroke="${c}" stroke-width="2.5"/>
${props(p.props,c)}<g>${mascot(p,c)}</g>
<g transform="rotate(${h%2?-9:9} ${fxX} ${fxY})"><polygon points="${pts}" fill="#fff" stroke="#111" stroke-width="3"/><text x="${fxX}" y="${fxY+6}" font-family="Bangers,Impact,sans-serif" font-size="${fx.length>6?13:18}" text-anchor="middle" fill="#e5262f" stroke="#111" stroke-width=".6">${fx}</text></g>
<rect x="-6" y="-16" width="212" height="208" fill="none" stroke="#111" stroke-width="5"/></svg>`;
}
module.exports={art,mascot,props,shade};
