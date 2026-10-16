// Renders Captain Rep art: art/<slug>.webp + .svg, hero + category banners. Run locally: node gen-art.js (outputs committed).
const sharp=require('sharp'),fs=require('fs');const {art,mascot,props,shade}=require('./art2');const {POSES}=require('./poses');
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const COL={push:'#ff3b3b',pull:'#2f6bff',legs:'#18b85a',core:'#ffb800',skills:'#a43bff'};
const M=require('./data.js').map(r=>({name:r[0],slug:slug(r[0]),cat:r[1]}));
fs.mkdirSync('art',{recursive:true});
const banner=(poseKey,c,w,h,title,scale,tx,ty,suit=c)=>{const rays=Array.from({length:36},(_,i)=>{const a=i*Math.PI/18;return `<polygon points="${w/2},${h/2} ${w/2+1400*Math.cos(a)},${h/2+1400*Math.sin(a)} ${w/2+1400*Math.cos(a+.08)},${h/2+1400*Math.sin(a+.08)}" fill="#fff" opacity="${i%2?.25:.45}"/>`}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><defs><pattern id="hd" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3.6" fill="${shade(c,.85)}" opacity=".45"/></pattern><radialGradient id="rg"><stop offset="0" stop-color="#ffe14d"/><stop offset="1" stop-color="${c}"/></radialGradient></defs>
<rect width="${w}" height="${h}" fill="url(#rg)"/>${rays}<rect width="${w}" height="${h}" fill="url(#hd)"/>
<g transform="translate(${tx} ${ty}) scale(${scale})">${props(POSES[poseKey].props.replace(/floor:\d+/,''),c)}${mascot(POSES[poseKey],suit)}</g>
<rect x="5" y="5" width="${w-10}" height="${h-10}" fill="none" stroke="#111" stroke-width="10"/></svg>`};
const hero=()=>{let s=banner('muscle_up','#ff3b3b',800,380,'Comic hero panel: Captain Rep blasting through a muscle-up',1.65,235,30,'#2f6bff');
 s=s.replace('</svg>',`<g transform="rotate(-10 640 120)"><polygon points="640,30 660,80 715,60 690,105 760,120 690,140 715,185 660,160 640,210 620,160 565,185 590,140 520,120 590,105 565,60 620,80" fill="#fff" stroke="#111" stroke-width="7"/><text x="640" y="140" font-family="Bangers" font-size="60" text-anchor="middle" fill="#e5262f" stroke="#111" stroke-width="2.5">POW!</text></g>
<path d="M30 30 h240 a12 12 0 0 1 12 12 v54 a12 12 0 0 1 -12 12 h-160 l-34 30 v-30 h-46 a12 12 0 0 1 -12 -12 v-54 a12 12 0 0 1 12 -12z" fill="#fff" stroke="#111" stroke-width="6"/><text x="150" y="70" font-family="Bangers" font-size="30" text-anchor="middle" fill="#111">CAPTAIN REP SAYS:</text><text x="150" y="100" font-family="Bangers" font-size="30" text-anchor="middle" fill="#e5262f">LEVEL UP!</text>
<path d="M610 300 h150 v52 h-150z" fill="#ffe14d" stroke="#111" stroke-width="5"/><text x="685" y="336" font-family="Bangers" font-size="26" text-anchor="middle" fill="#111">92 MOVES!</text></svg>`);return s};
const CATPOSE={push:'push_onearm',pull:'pull_archer',legs:'pistol',core:'vsit',skills:'planche_straddle'};
(async()=>{
 for(const m of M){const svg=art(m.slug,COL[m.cat],m.name);fs.writeFileSync(`art/${m.slug}.svg`,svg);
  await sharp(Buffer.from(svg),{density:220}).resize(560).webp({quality:78}).toFile(`art/${m.slug}.webp`)}
 const hs=hero();fs.writeFileSync('art/hero.svg',hs);await sharp(Buffer.from(hs),{density:160}).resize(1600).webp({quality:80}).toFile('art/hero.webp');
 for(const [c,k] of Object.entries(CATPOSE)){const s=banner(k,COL[c],600,300,`Captain Rep ${c} pose`,1.35,165,10);fs.writeFileSync(`art/cat-${c}.svg`,s);await sharp(Buffer.from(s),{density:160}).resize(1200).webp({quality:80}).toFile(`art/cat-${c}.webp`)}
 console.log('art done')})();
