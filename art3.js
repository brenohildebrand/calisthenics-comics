// Captain Rep v3 — anatomical construction (Bridgman masses), heroic ~8.5-9 head proportions (Loomis),
// Dempster-weighted COG balancing, 3-tier ink, cel shading from upper-left, spotted blacks. See research/anatomy-notes.md
const {POSES,MAP,VAR,FX}=require('./poses');
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],add=(a,b)=>[a[0]+b[0],a[1]+b[1]],mul=(a,k)=>[a[0]*k,a[1]*k],len=a=>Math.hypot(a[0],a[1])||1e-6,nrm=a=>mul(a,1/len(a)),perp=a=>[-a[1],a[0]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],lerp=(a,b,t)=>add(a,mul(sub(b,a),t));
const f=n=>(+n).toFixed(1),P=p=>`${f(p[0])} ${f(p[1])}`;
const hex=h=>{const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]},toHex=c=>'#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>toHex(hex(a).map((v,i)=>v+(hex(b)[i]-v)*t));
const shadow=c=>mix(mix(c,'#000000',.32),'#3b1f7a',.28), light=c=>mix(c,'#ffffff',.28);
const LIGHT=nrm([-.6,-.8]);
const SKIN='#f4c08f',SHORTS='#23264a',BOOT='#e5262f',MASK='#ffd21f',HAIR='#141414';
// ---------- pose utilities ----------
const clone=p=>JSON.parse(JSON.stringify(p));
const W={head:.081,trunk:.497,ua:.028,fa:.022,th:.1,sh:.061};
function cog(p){const [e1,a1,e2,a2]=p.a,[k1,f1,k2,f2]=p.l;let s=[0,0];const A=(pt,w)=>{s=add(s,mul(pt,w))};
 A(p.hd,W.head);A(lerp(p.n,p.h,.5),W.trunk);[[e1,a1],[e2,a2]].forEach(([e,a])=>{A(lerp(p.n,e,.43),W.ua);A(lerp(e,a,.43),W.fa)});[[k1,f1],[k2,f2]].forEach(([k,ft])=>{A(lerp(p.h,k,.43),W.th);A(lerp(k,ft,.43),W.sh)});return s}
const rot=(pt,c,ang)=>{const d=sub(pt,c),cs=Math.cos(ang),sn=Math.sin(ang);return add(c,[d[0]*cs-d[1]*sn,d[0]*sn+d[1]*cs])};
const SUPPORT_HANDS=new Set(['planche_tuck','planche_straddle','planche_full','planche_push','deg90','crow','elbow_lever','hs_free','hs_wall','hs_onearm','lsit','vsit','manna','dip_top','dip_bottom','ring_dip','muscle_up','ring_mu','impossible']);
const HANG=new Set(['hang','pull_top','pull_wide','pull_lsit','fl_tuck','fl_straddle','fl_full','back_lever','knee_raise','hang_leg','toes_bar','wipers','towel','skin_cat','pull_onearm']);
// Loomis segment lengths in head units (upper arm 1.5, forearm 1.3, thigh 2, shin 2.1) — keeps the pose's joint angles (FK)
function normalize(p0){const p=clone(p0),HU=len(sub(p.h,p.n))/3;const seg=(o,j,L)=>add(o,mul(nrm(sub(j,o)),L*HU));
 for(const i of[0,2]){const e=seg(p.n,p.a[i],1.5),a=seg(e,add(e,sub(p.a[i+1],p.a[i])),1.3);p.a[i]=e;p.a[i+1]=a}
 for(const i of[0,2]){const k=seg(p.h,p.l[i],2),ft=seg(k,add(k,sub(p.l[i+1],p.l[i])),2.1);p.l[i]=k;p.l[i+1]=ft}
 return p}
function fit(p){const all=[p.hd,p.n,p.h,...p.a,...p.l],HU=len(sub(p.h,p.n))/3;const xs=all.map(q=>q[0]),ys=all.map(q=>q[1]);
 const w=Math.max(...xs)-Math.min(...xs)+HU*1.6,h=Math.max(...ys)-Math.min(...ys)+HU*2;const k=Math.min(1,196/w,200/h);if(k>=1)return p;
 const c=cog(p);for(const q of all){q[0]=c[0]+(q[0]-c[0])*k;q[1]=c[1]+(q[1]-c[1])*k}return p}
function seat(key,p,orig){const all=[p.hd,p.n,p.h,...p.a,...p.l];const sh=(dx,dy)=>{for(const q of all){q[0]+=dx;q[1]+=dy}};
 const spec=POSES[key].props;const floor=+(spec.match(/floor:(\d+)/)||[])[1];const fixedX=/wall|bench|box|step|pole|lowbar|anchor|ringrow/.test(spec);
 if(SUPPORT_HANDS.has(key)||HANG.has(key)){/* already seated by balance */}
 else if(POSES[key].fx){const oy=orig.l[1][1],ny=p.l[1][1];sh(0,Math.min(0,oy-ny))}
 else if(fixedX&&floor){const i=orig.l[1][1]>=orig.l[3][1]?1:3;sh(0,orig.l[i][1]-p.l[i][1])}
 else if(floor&&!/bar:|pbar|rings/.test(spec)){ // lowest foot/hand/knee rests on floor
  const lows=[p.l[1],p.l[3],p.a[1],p.a[3]].map(q=>q[1]);const m=Math.max(...lows);sh(0,(floor-2)-m)}
 else{const oy=Math.max(orig.a[1][1],orig.a[3][1]),ny=Math.max(p.a[1][1],p.a[3][1]);sh(0,oy-ny)}
 if(!fixedX){const xs=all.map(q=>q[0]),mn=Math.min(...xs),mx=Math.max(...xs);if(mn<4)sh(4-mn,0);else if(mx>196)sh(196-mx,0)}
 const ys=all.map(q=>q[1]),top=Math.min(...ys);if(top<-2&&!(SUPPORT_HANDS.has(key)||HANG.has(key)))sh(0,-2-top);
 return p}
// rotate both arm chains about the shoulder until COG x == support hand x; then re-seat hands at original y.
function balance(key,p0){const p=clone(p0);if(!SUPPORT_HANDS.has(key)&&!HANG.has(key))return {p,dx:null};
 const one=key=='hs_onearm'||key=='pull_onearm';const y0=one?p.a[1][1]:(p.a[1][1]+p.a[3][1])/2;
 for(let it=0;it<25;it++){const c=cog(p),hx=one?p.a[1][0]:(p.a[1][0]+p.a[3][0])/2,err=c[0]-hx;if(Math.abs(err)<.3)break;
  const r=len(sub(one?p.a[1]:lerp(p.a[1],p.a[3],.5),p.n));let ang=Math.asin(Math.max(-1,Math.min(1,err/r)))*.6;
  const side=(one?p.a[1][1]:y0)>p.n[1]?-1:1; ang*=side;
  const arms=one?[0,1]:[0,1,2,3];for(const i of arms)p.a[i]=rot(p.a[i],p.n,ang);
  const hy=one?p.a[1][1]:(p.a[1][1]+p.a[3][1])/2,dy=y0-hy;const sh=pt=>[pt[0],pt[1]+dy];
  p.hd=sh(p.hd);p.n=sh(p.n);p.h=sh(p.h);p.a=p.a.map(sh);p.l=p.l.map(sh);}
 const c=cog(p),hx=one?p.a[1][0]:(p.a[1][0]+p.a[3][0])/2;return {p,dx:c[0]-hx}}
// ---------- drawing primitives ----------
function capsule(a,b,w1,wm,w2,t=.42,bias=0){const d=sub(b,a),u=nrm(d),q=perp(u),m=add(a,mul(d,t));
 const L=[add(a,mul(q,w1)),add(m,mul(q,wm*(1+bias))),add(b,mul(q,w2))],R=[add(b,mul(q,-w2)),add(m,mul(q,-wm*(1-bias))),add(a,mul(q,-w1))];
 const path=`M${P(L[0])} Q${P(L[1])} ${P(L[2])} A${f(w2)} ${f(w2)} 0 0 1 ${P(R[0])} Q${P(R[1])} ${P(R[2])} A${f(w1)} ${f(w1)} 0 0 1 ${P(L[0])}Z`;
 const sideShadow=dot(q,LIGHT)>0?-1:1; // shade the side facing away from light
 const S=sideShadow>0?L:R.slice().reverse();
 const sh=`M${P(a)} L${P(S[0])} Q${P(S[1])} ${P(S[2])} L${P(b)} Z`;
 return {path,sh,u,q,m,sideShadow}}
const ell=(c,rx,ry,angDeg,fill,extra='')=>`<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${f(angDeg)} ${f(c[0])} ${f(c[1])})" fill="${fill}"${extra}/>`;
const ang=u=>Math.atan2(u[1],u[0])*57.2958;
const INK=(d,w=6)=>`<path d="${d}" fill="none" stroke="#111" stroke-width="${w}" stroke-linejoin="round"/>`;
function limb(a,b,w1,wm,w2,col,opt={}){const c=capsule(a,b,w1,wm,w2,opt.t??.42,opt.bias||0);const dk=opt.far?shadow(shadow(col)):shadow(col);
 let mus='';
 if(opt.muscle=='upperarm'){ // biceps (front) + triceps (back) overlapping ellipses
  mus+=ell(add(c.m,mul(c.q,wm*.35*opt.front)),len(sub(b,a))*.3,wm*.55,ang(c.u),opt.far?dk:col)+`<path d="M${P(add(lerp(a,b,.3),mul(c.q,wm*.15*opt.front)))} Q${P(add(c.m,mul(c.q,-wm*.1*opt.front)))} ${P(add(lerp(a,b,.75),mul(c.q,wm*.05*opt.front)))}" stroke="#111" stroke-width="1.3" fill="none" opacity=".8"/>`;}
 if(opt.muscle=='thigh'){mus+=`<path d="M${P(add(lerp(a,b,.2),mul(c.q,wm*.25*opt.front)))} Q${P(add(c.m,mul(c.q,-wm*.15*opt.front)))} ${P(add(lerp(a,b,.85),mul(c.q,wm*.3*opt.front)))}" stroke="#111" stroke-width="1.3" fill="none" opacity=".75"/>`;}
 if(opt.muscle=='calf'){const cc=add(lerp(a,b,.3),mul(c.q,-wm*.45*opt.front));mus+=ell(cc,len(sub(b,a))*.26,wm*.6,ang(c.u),opt.far?dk:col)+ell(add(cc,mul(c.q,-wm*.15*opt.front*c.sideShadow)),len(sub(b,a))*.2,wm*.35,ang(c.u),dk,' opacity=".55"');}
 if(opt.muscle=='forearm'){mus+=`<path d="M${P(add(lerp(a,b,.12),mul(c.q,wm*.5)))} Q${P(add(lerp(a,b,.4),mul(c.q,wm*.1)))} ${P(add(lerp(a,b,.8),mul(c.q,-w2*.4)))}" stroke="#111" stroke-width="1.2" fill="none" opacity=".7"/>`;}
 return {ink:INK(c.path,opt.far?5:6),body:`<path d="${c.path}" fill="${opt.far?dk:col}"/>${opt.far?'':`<path d="${c.sh}" fill="${dk}"/>`}${mus}${opt.far?'':`<path d="M${P(add(lerp(a,b,.18),mul(c.q,-wm*.62*c.sideShadow)))} L${P(add(lerp(a,b,.55),mul(c.q,-wm*.7*c.sideShadow)))}" stroke="${light(col)}" stroke-width="2" stroke-linecap="round" opacity=".9"/>`}`,c}}
// ---------- mascot ----------
function mascot(p,suit){
 const [e1,a1,e2,a2]=p.a,[k1,f1,k2,f2]=p.l;
 const td=sub(p.h,p.n),T=len(td),tu=nrm(td),tq=perp(tu);
 // facing: knees flex toward the front
 let fr=Math.sign(dot(sub(k1,lerp(p.h,f1,.5)),tq))||Math.sign(dot(sub(p.hd,p.n),tq))||1;
 const front=tq.map(v=>v*fr);
 const HU=T/3; // head unit (Loomis: 3 heads neck->crotch)
 const shoulderW=HU*.78, waistW=HU*.5, hipW=HU*.6;
 const sD=shadow(suit), out=[];
 // far limbs (darker, thinner — overlap/depth)
 const farArmU=limb(p.n,e2,HU*.27,HU*.34,HU*.22,SKIN,{far:1,muscle:'upperarm',front:1}),farArmF=limb(e2,a2,HU*.22,HU*.27,HU*.15,SKIN,{far:1,t:.3});
 const farTh=limb(p.h,k2,HU*.42,HU*.48,HU*.27,SHORTS,{far:1,t:.35}),farSh=limb(k2,f2,HU*.27,HU*.33,HU*.16,SKIN,{far:1,muscle:'calf',front:fr,t:.3});
 for(const x of[farTh,farSh,farArmU,farArmF])out.push(x.ink+x.body);
 out.push(foot(f2,k2,front,HU,true),hand(a2,e2,HU,true));
 // ---- torso masses ----
 const rib=lerp(p.n,p.h,.3), pel=lerp(p.n,p.h,.86), waist=lerp(p.n,p.h,.62);
 const ribRx=T*.36, ribRy=shoulderW*.92, a0=ang(tu);
 const tPath=(()=>{const s1=add(p.n,mul(tq,shoulderW)),s2=add(p.n,mul(tq,-shoulderW)),w1=add(waist,mul(tq,waistW)),w2=add(waist,mul(tq,-waistW)),h1=add(p.h,mul(tq,hipW)),h2=add(p.h,mul(tq,-hipW));
  const c1=add(rib,mul(tq,shoulderW*1.08)),c2=add(rib,mul(tq,-shoulderW*1.08));
  return `M${P(s1)} Q${P(c1)} ${P(w1)} L${P(h1)} Q${P(add(p.h,mul(tu,HU*.25)))} ${P(h2)} L${P(w2)} Q${P(c2)} ${P(s2)} Q${P(add(p.n,mul(tu,-HU*.3)))} ${P(s1)}Z`})();
 const shadeSide=dot(tq,LIGHT)>0?-1:1;
 const tShade=`M${P(add(p.n,mul(tq,shoulderW*shadeSide)))} Q${P(add(rib,mul(tq,shoulderW*1.08*shadeSide)))} ${P(add(waist,mul(tq,waistW*shadeSide)))} L${P(add(p.h,mul(tq,hipW*shadeSide)))} L${P(add(p.h,mul(tq,hipW*.25*shadeSide)))} Q${P(add(rib,mul(tq,shoulderW*.45*shadeSide)))} ${P(add(p.n,mul(tq,shoulderW*.3*shadeSide)))}Z`;
 // lat wedge on back side (from armpit into waist), pec plate on front, traps above
 const back=mul(front,-1);
 const lat=`M${P(add(lerp(p.n,p.h,.12),mul(back,shoulderW*.95)))} Q${P(add(rib,mul(back,shoulderW*1.2)))} ${P(add(waist,mul(back,waistW*.95)))} L${P(add(waist,mul(back,waistW*.4)))} Q${P(add(rib,mul(back,shoulderW*.6)))} ${P(add(lerp(p.n,p.h,.12),mul(back,shoulderW*.5)))}Z`;
 const pecC=add(lerp(p.n,p.h,.2),mul(front,shoulderW*.45));
 const pecLine=`M${P(add(lerp(p.n,p.h,.08),mul(front,shoulderW*.95)))} Q${P(add(lerp(p.n,p.h,.34),mul(front,shoulderW*.9)))} ${P(add(lerp(p.n,p.h,.32),mul(front,shoulderW*.05)))}`;
 const absX=[.46,.58,.7].map(t=>add(lerp(p.n,p.h,t),mul(front,waistW*.55)));
 const crest=`M${P(add(lerp(p.n,p.h,.8),mul(front,hipW*1.0)))} Q${P(add(lerp(p.n,p.h,.86),mul(front,hipW*.2)))} ${P(add(lerp(p.n,p.h,.94),mul(front,hipW*-.3)))}`;
 // shorts over pelvis
 const shortsTop=lerp(p.n,p.h,.8);
 const shorts=`M${P(add(shortsTop,mul(tq,hipW*1.05)))} L${P(add(p.h,mul(tq,hipW*1.1)))} Q${P(add(p.h,mul(tu,HU*.3)))} ${P(add(p.h,mul(tq,-hipW*1.1)))} L${P(add(shortsTop,mul(tq,-hipW*1.05)))}Z`;
 const star=add(lerp(p.n,p.h,.22),mul(front,shoulderW*.2));
 const torsoInk=INK(tPath,6.5);
 const torsoBody=`<path d="${tPath}" fill="${suit}"/><path d="${lat}" fill="${sD}"/><path d="${tShade}" fill="${sD}"/>
${ell(pecC,T*.13,shoulderW*.5,a0,light(suit),' opacity=".55"')}<path d="${pecLine}" stroke="#111" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<path d="M${P(add(lerp(p.n,p.h,.33),mul(front,shoulderW*.1)))} Q${P(add(lerp(p.n,p.h,.36),mul(front,shoulderW*.6)))} ${P(add(lerp(p.n,p.h,.31),mul(front,shoulderW*.92)))}" stroke="#111" stroke-width="3.2" fill="none" opacity=".85"/>
${absX.map(c=>`<path d="M${P(add(c,mul(tu,-HU*.08)))} Q${P(add(c,mul(front,waistW*.25)))} ${P(add(c,mul(tu,HU*.08)))}" stroke="#111" stroke-width="1.3" fill="none" opacity=".7"/>`).join('')}
<path d="M${P(add(lerp(p.n,p.h,.42),mul(front,waistW*.3)))} L${P(add(lerp(p.n,p.h,.76),mul(front,waistW*.3)))}" stroke="#111" stroke-width="1.3" opacity=".6"/>
<path d="${crest}" stroke="#111" stroke-width="1.6" fill="none" opacity=".7"/>
<path d="${shorts}" fill="${SHORTS}"/><path d="M${P(add(shortsTop,mul(tq,hipW*1.05)))} L${P(add(shortsTop,mul(tq,-hipW*1.05)))}" stroke="${MASK}" stroke-width="3"/>
<g transform="translate(${P(star)}) rotate(${f(a0-90)}) scale(${f(HU/14)})"><polygon points="0,-6 1.8,-1.8 6,-1.8 2.6,1 3.8,5.5 0,2.8 -3.8,5.5 -2.6,1 -6,-1.8 -1.8,-1.8" fill="${MASK}" stroke="#111" stroke-width="1.3"/></g>`;
 // neck + traps (wedge into head)
 const up=nrm(sub(p.hd,p.n)),hr=HU*.5,headC=add(p.n,mul(up,HU*.78)),neckTop=add(p.n,mul(up,HU*.35));
 const trap=`M${P(add(p.n,mul(tq,shoulderW*.85)))} Q${P(add(neckTop,mul(tq,HU*.3)))} ${P(add(neckTop,mul(perp(up),HU*.18)))} L${P(add(neckTop,mul(perp(up),-HU*.18)))} Q${P(add(neckTop,mul(tq,-HU*.3)))} ${P(add(p.n,mul(tq,-shoulderW*.85)))}Z`;
 // near limbs (with deltoid cap over shoulder)
 const th=limb(p.h,k1,HU*.45,HU*.55,HU*.3,SHORTS,{muscle:'thigh',front:fr,t:.35,bias:.1});
 const shn=limb(k1,f1,HU*.3,HU*.36,HU*.17,SKIN,{muscle:'calf',front:fr,t:.3});
 const ua=limb(p.n,e1,HU*.3,HU*.38,HU*.24,SKIN,{muscle:'upperarm',front:1});
 const fa=limb(e1,a1,HU*.25,HU*.3,HU*.16,SKIN,{muscle:'forearm',t:.28});
 const du=nrm(sub(e1,p.n)),delt=add(p.n,mul(du,HU*.32));
 const deltInk=ell(delt,HU*.5,HU*.4,ang(du),'#111',' stroke="#111" stroke-width="6"');
 const deltBody=ell(delt,HU*.5,HU*.4,ang(du),suit)+ell(add(delt,mul(perp(du),HU*.13*(dot(perp(du),LIGHT)>0?-1:1))),HU*.42,HU*.2,ang(du),sD)+`<path d="M${P(add(delt,mul(du,HU*.4)))} q${f(perp(du)[0]*3)} ${f(perp(du)[1]*3)} 0 0" stroke="#111"/>`;
 // armpit spotted black
 const pit=add(p.n,add(mul(du,HU*.15),mul(back,HU*.1)));
 out.push(`<path d="${trap}" fill="${sD}" stroke="#111" stroke-width="5" stroke-linejoin="round"/>`);
 out.push(th.ink+shn.ink+torsoInk+th.body+shn.body+torsoBody);
 out.push(foot(f1,k1,front,HU,false));
 out.push(head(headC,up,hr,fr,suit));
 out.push(ua.ink+fa.ink+deltInk+ua.body+fa.body+deltBody+ell(pit,HU*.12,HU*.07,ang(du),'#111',' opacity=".8"'));
 out.push(hand(a1,e1,HU,false));
 return out.join('');
}
function hand(a,e,HU,far){const u=nrm(sub(a,e)),q=perp(u),c=add(a,mul(u,HU*.12)),col=far?'#a3141b':BOOT;
 const mitt=`M${P(add(a,mul(q,HU*.2)))} Q${P(add(c,add(mul(u,HU*.38),mul(q,HU*.22))))} ${P(add(c,mul(u,HU*.36)))} Q${P(add(c,add(mul(u,HU*.38),mul(q,-HU*.22))))} ${P(add(a,mul(q,-HU*.2)))}Z`;
 const thumb=add(a,add(mul(u,HU*.12),mul(q,HU*.24)));
 return `<path d="${mitt}" fill="${col}" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/>${ell(thumb,HU*.13,HU*.08,ang(u)+40,col,' stroke="#111" stroke-width="2.5"')}<path d="M${P(add(a,mul(q,HU*.22)))} L${P(add(a,mul(q,-HU*.22)))}" stroke="#111" stroke-width="5"/><path d="M${P(add(a,mul(q,HU*.2)))} L${P(add(a,mul(q,-HU*.2)))}" stroke="${MASK}" stroke-width="2.4"/>`}
function foot(ft,k,front,HU,far){const u=nrm(sub(ft,k)),toe=add(ft,mul(front,HU*.42)),heel=add(ft,mul(front,-HU*.12)),col=far?'#a3141b':BOOT;
 const top=add(ft,mul(u,-HU*.38));
 const d=`M${P(add(top,mul(front,-HU*.2)))} L${P(add(heel,mul(u,HU*.05)))} L${P(add(toe,mul(u,HU*.06)))} Q${P(add(toe,mul(u,-HU*.2)))} ${P(add(lerp(ft,top,.4),mul(front,HU*.22)))} L${P(add(top,mul(front,HU*.18)))}Z`;
 return `<path d="${d}" fill="${col}" stroke="#111" stroke-width="${far?3.5:4.2}" stroke-linejoin="round"/><path d="M${P(add(heel,mul(u,HU*.05)))} L${P(add(toe,mul(u,HU*.06)))}" stroke="#111" stroke-width="3"/><path d="M${P(add(top,mul(front,-HU*.2)))} L${P(add(top,mul(front,HU*.18)))}" stroke="${MASK}" stroke-width="2.4"/>`}
function head(c,up,r,fr,suit){const q=perp(up),fw=mul(q,fr);
 const jaw=add(c,add(mul(up,-r*1.05),mul(fw,r*.35))),chin=add(c,add(mul(up,-r*1.15),mul(fw,r*.05))),back=add(c,mul(fw,-r));
 const crown=add(c,mul(up,r));
 const skull=`M${P(add(c,mul(fw,r*.95)))} A${f(r)} ${f(r)} 0 1 0 ${P(back)} Q${P(add(c,add(mul(up,-r*.8),mul(fw,-r*.7))))} ${P(chin)} L${P(jaw)} Q${P(add(c,add(mul(up,-r*.4),mul(fw,r*1.05))))} ${P(add(c,mul(fw,r*.95)))}Z`;
 const spikes=[-.9,-.45,0,.45].map((s,i)=>{const b=add(c,add(mul(up,r*.55),mul(fw,s*r)));const t=add(c,add(mul(up,r*(1.5+(i%2)*.25)),mul(fw,s*r*1.1-r*.75)));return `${P(b).replace(' ',',')} ${P(t).replace(' ',',')}`}).join(' ');
 const hb1=add(c,add(mul(up,r*.25),mul(fw,r*.95))),hb2=add(c,add(mul(up,r*.1),mul(fw,-r*1.02)));
 const eye=add(c,add(mul(up,r*.12),mul(fw,r*.5))),mk1=add(c,add(mul(up,r*.15),mul(fw,r*1.02))),mk2=add(c,add(mul(up,r*.15),mul(fw,-r*.3)));
 const ear=add(c,add(mul(fw,-r*.15),mul(up,-r*.05)));
 const lightSide=dot(fw,LIGHT)>0;
 return `<path d="${skull}" fill="${SKIN}" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
<path d="M${P(back)} Q${P(add(c,add(mul(up,-r*.8),mul(fw,-r*.7))))} ${P(chin)} L${P(add(c,mul(up,-r*.3)))}Z" fill="${shadow(SKIN)}" opacity=".85"/>
<polygon points="${P(hb1).replace(' ',',')} ${spikes} ${P(hb2).replace(' ',',')} ${P(add(c,add(mul(up,r*.6),mul(fw,-r*.1)))).replace(' ',',')}" fill="${HAIR}" stroke="#111" stroke-width="3" stroke-linejoin="round"/>
<path d="M${P(mk1)} L${P(mk2)}" stroke="#111" stroke-width="${f(r*.62)}" stroke-linecap="round"/><path d="M${P(mk1)} L${P(mk2)}" stroke="${MASK}" stroke-width="${f(r*.38)}" stroke-linecap="round"/>
${ell(eye,r*.2,r*.12,ang(fw),'#fff',' stroke="#111" stroke-width="1.2"')}
${ell(ear,r*.18,r*.24,ang(up),SKIN,' stroke="#111" stroke-width="1.5"')}
<path d="M${P(add(c,add(mul(up,-r*.62),mul(fw,r*.55))))} l${f(fw[0]*r*.25)} ${f(fw[1]*r*.25)}" stroke="#111" stroke-width="1.6" stroke-linecap="round"/>`}
// ---------- props (follow balanced hands) ----------
function props(spec,p){let o='';const hands=[p.a[1],p.a[3]];const hx=(hands[0][0]+hands[1][0])/2;
 for(const t of spec.split(' ').filter(Boolean)){const[k,v='']=t.split(':');const a=v.split(',').map(Number);
 const R=(x,y,w,h,fl)=>`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fl}" stroke="#111" stroke-width="4"/>`;
 if(k=='floor')o+=`<rect x="-20" y="${a[0]}" width="240" height="${220-a[0]}" fill="#2b2b2b"/><path d="M-20 ${a[0]+8} H220" stroke="#444" stroke-width="2"/><line x1="-20" y1="${a[0]}" x2="220" y2="${a[0]}" stroke="#111" stroke-width="5"/>`;
 if(k=='wall')o+=R(a[0]-16,-30,16,240,'#d9c7a3')+[-10,22,54,86,118,150].map(y=>`<line x1="${a[0]-16}" y1="${y}" x2="${a[0]}" y2="${y}" stroke="#111" stroke-width="2.5"/>`).join('');
 if(k=='bench')o+=R(a[0],a[1],a[2]-a[0],10,'#8b5a2b')+R(a[0]+5,a[1]+10,6,200-a[1],'#333')+R(a[2]-11,a[1]+10,6,200-a[1],'#333');
 if(k=='box'||k=='step')o+=R(a[0],a[1],a[2]-a[0],206-a[1],k=='box'?'#c0392b':'#7f8c8d');
 if(k=='pbars')o+=R(hx-18,155,36,6,'#f1c40f')+R(hx-14,160,4,8,'#333')+R(hx+10,160,4,8,'#333');
 if(k=='pbar')o+=R(-20,a[0],240,8,'#b0bec5')+R(Math.min(hx-50,30),a[0]+8,6,200,'#333')+R(Math.max(hx+44,160),a[0]+8,6,200,'#333');
 if(k=='bar')o+=R(-20,a[0]-4,240,8,'#b0bec5')+`<path d="M-20 ${a[0]-2} H220" stroke="#fff" stroke-width="2" opacity=".7"/>`;
 if(k=='lowbar')o+=R(-20,a[0],150,8,'#b0bec5')+R(30,a[0]+8,5,200,'#333');
 if(k=='rings')for(const h of hands)o+=`<line x1="${f(h[0])}" y1="-30" x2="${f(h[0])}" y2="${f(h[1]-8)}" stroke="#111" stroke-width="3"/><circle cx="${f(h[0])}" cy="${f(h[1])}" r="8" fill="none" stroke="#111" stroke-width="7"/><circle cx="${f(h[0])}" cy="${f(h[1])}" r="8" fill="none" stroke="#e67e22" stroke-width="4"/>`;
 if(k=='ringrow')for(const h of hands)o+=`<line x1="${f(h[0]-4)}" y1="-30" x2="${f(h[0])}" y2="${f(h[1]-8)}" stroke="#111" stroke-width="3"/><circle cx="${f(h[0])}" cy="${f(h[1])}" r="8" fill="none" stroke="#111" stroke-width="7"/><circle cx="${f(h[0])}" cy="${f(h[1])}" r="8" fill="none" stroke="#e67e22" stroke-width="4"/>`;
 if(k=='towels')for(const h of hands)o+=`<path d="M${f(h[0])} 8 q-3 ${f((h[1]-8)/2)} 0 ${f(h[1]-8)}" stroke="#111" stroke-width="12" fill="none"/><path d="M${f(h[0])} 8 q-3 ${f((h[1]-8)/2)} 0 ${f(h[1]-8)}" stroke="#3498db" stroke-width="7" fill="none"/>`;
 if(k=='wheel')o+=`<circle cx="${f(hands[0][0])}" cy="150" r="11" fill="#e74c3c" stroke="#111" stroke-width="4"/><circle cx="${f(hands[0][0])}" cy="150" r="3" fill="#111"/>`;
 if(k=='anchor')o+=R(166,155,26,9,'#8e44ad');
 if(k=='pole')o+=R(a[0]-6,-30,12,240,'#b0bec5');
}return o}
function art(slug,c,label,opts={}){
 const key=MAP[slug],{p}=balance(key,fit(normalize(POSES[key])));seat(key,p,POSES[key]),v=VAR[slug]||{},h=hash(slug),id='v'+(h%1e6)+(opts.idSuffix||'');
 const rt=h%40-20,fx=v.fx||POSES[key].fx||FX[h%FX.length];
 const cg=cog(p),cx=cg[0],cy=cg[1];
 const burst=Array.from({length:16},(_,i)=>{const a=(i/16)*2*Math.PI+rt/57,r=i%2?50:98;return `${f(cx+r*Math.cos(a))},${f(cy+r*Math.sin(a))}`}).join(' ');
 const speed=Array.from({length:26},(_,i)=>{const a=(i/26)*2*Math.PI+(h%7)/10,r1=74+(h>>(i%20))%25;return `<line x1="${f(cx+r1*Math.cos(a))}" y1="${f(cy+r1*Math.sin(a))}" x2="${f(cx+180*Math.cos(a))}" y2="${f(cy+180*Math.sin(a))}" stroke="#111" stroke-width="${i%3?1:2.2}" opacity=".3"/>`}).join('');
 const cand=[[40,0],[160,0],[40,30],[160,30]],pts0=[p.hd,p.a[1],p.a[3],p.n,p.l[1],p.l[3]];const sc=q=>Math.min(...pts0.map(z=>Math.hypot(z[0]-q[0],(z[1]-q[1])*1.6)));const best=cand.reduce((b,q)=>sc(q)>sc(b)?q:b);
 const [fxX,fxY]=best,bp=Array.from({length:12},(_,i)=>{const a=i/12*2*Math.PI,r=i%2?22:35;return `${f(fxX+r*Math.cos(a)*1.3)},${f(fxY+r*Math.sin(a)*.7)}`}).join(' ');
 return `<svg viewBox="-8 -18 216 212" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comic illustration: Captain Rep performing the ${label}"${opts.attrs||''}><defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(${rt})"><circle cx="3.5" cy="3.5" r="2" fill="${c}"/></pattern><radialGradient id="${id}g" cx="${f((cx+8)/2.16)}%" cy="${f((cy+18)/2.12)}%" r="70%"><stop offset="0" stop-color="#fffbe6"/><stop offset="1" stop-color="${c}" stop-opacity=".35"/></radialGradient></defs>
<rect x="-20" y="-30" width="240" height="250" fill="#fff4cc"/><rect x="-20" y="-30" width="240" height="250" fill="url(#${id}g)"/>${speed}
<polygon points="${burst}" fill="url(#${id})" opacity=".5"/><polygon points="${burst}" fill="none" stroke="${c}" stroke-width="2.5"/>
${props(POSES[key].props,p)}<g>${mascot(p,c)}</g>
<g transform="rotate(${h%2?-9:9} ${fxX} ${fxY})"><polygon points="${bp}" fill="#fff" stroke="#111" stroke-width="3"/><text x="${fxX}" y="${fxY+6}" font-family="Bangers,Impact,sans-serif" font-size="${fx.length>6?13:18}" text-anchor="middle" fill="#e5262f" stroke="#111" stroke-width=".6">${fx}</text></g>
<rect x="-6" y="-16" width="212" height="208" fill="none" stroke="#111" stroke-width="5"/></svg>`;
}
const shade=(hx,k)=>mix(hx,'#000000',1-k);
const prepared=key=>{const {p}=balance(key,fit(normalize(POSES[key])));return seat(key,p,POSES[key])};
module.exports={prepared,normalize,art,mascot,props,shade,balance,cog};
