// Generates og/<slug>.png (1200x630). Run locally: node og.js (outputs are committed).
const sharp=require('sharp'),fs=require('fs');const {art}=require('./art2');
process.env.SKIP=1;const {M,CAT}=require('./build.js');
fs.mkdirSync('og',{recursive:true});
const esc=s=>s.replace(/&/g,'&amp;');
const frame=(inner,title,sub,c)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><pattern id="d" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="3.5" fill="#111" opacity=".12"/></pattern></defs><rect width="1200" height="630" fill="#ffe14d"/><rect width="1200" height="630" fill="url(#d)"/>
<rect x="40" y="40" width="560" height="550" fill="#fff" stroke="#111" stroke-width="10"/><g transform="translate(50,50)">${inner}</g>
<text x="640" y="110" font-family="Bangers" font-size="44" fill="#111">CALISTHENICS <tspan fill="#ff3b3b">COMICS</tspan></text>
${title.map((t,i)=>`<text x="640" y="${230+i*92}" font-family="Bangers" font-size="96" fill="${c}" stroke="#111" stroke-width="4">${esc(t)}</text>`).join('')}
<rect x="640" y="${270+title.length*92-40}" width="520" height="70" fill="#fff" stroke="#111" stroke-width="6"/><text x="660" y="${270+title.length*92+8}" font-family="Bangers" font-size="44" fill="#111">${esc(sub)}</text></svg>`;
const wrap=s=>{const w=s.toUpperCase().split(' '),L=[''];for(const x of w){if((L.at(-1)+' '+x).trim().length>11&&L.at(-1))L.push(x);else L[L.length-1]=(L.at(-1)+' '+x).trim()}return L.slice(0,3)};
(async()=>{for(const m of M){const a=art(m.slug,CAT[m.cat][1],m.name).replace('<svg ','<svg width="540" height="530" preserveAspectRatio="xMidYMid slice" ');
 await sharp(Buffer.from(frame(a,wrap(m.name),`LEVEL ${m.diff}/10 · ${m.tier.toUpperCase()}`,CAT[m.cat][1]))).png({compressionLevel:9,palette:true}).toFile(`og/${m.slug}.png`)}
 const h=fs.readFileSync('art/hero.svg','utf8').replace('<svg ','<svg width="540" height="530" preserveAspectRatio="xMidYMid slice" ');
 await sharp(Buffer.from(frame(h,['EVERY MOVE.','RANKED 1–10'],`${M.length} CALISTHENICS MOVES`,'#ff3b3b'))).png({compressionLevel:9,palette:true}).toFile('og/home.png');
 console.log('og done')})();
