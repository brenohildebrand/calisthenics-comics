// After generation: put images at vo-raw/<slug>.(png|jpg|webp) (1280x720). Run: node research/ingest-vo.js
// -> art/<slug>.webp (960x540), art/<slug>-sm.webp (480x270 for cards) + art/<slug>.jpg fallback, vo-contact-sheet.jpg. Reports missing slugs.
const sharp=require('sharp'),fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');
const P=require('./vo-ferro-prompts.json');const raw=path.join(R,'vo-raw');const tiles=[],missing=[];
const W=960,H=540;
(async()=>{for(const p of P){const f=['png','jpg','jpeg','webp'].map(e=>path.join(raw,`${p.slug}.${e}`)).find(fs.existsSync);if(!f){missing.push(p.slug);continue}
 let q=82,buf;do{buf=await sharp(f).resize(W,H,{fit:'cover'}).webp({quality:q}).toBuffer();q-=6}while(buf.length>110e3&&q>40);
 fs.writeFileSync(path.join(R,'art',p.slug+'.webp'),buf);await sharp(f).resize(480,270,{fit:'cover'}).webp({quality:70}).toFile(path.join(R,'art',p.slug+'-sm.webp'));await sharp(f).resize(W,H,{fit:'cover'}).jpeg({quality:70,mozjpeg:true}).toFile(path.join(R,'art',p.slug+'.jpg'));
 tiles.push(await sharp(f).resize(256,144).png().toBuffer())}
 if(tiles.length)await sharp({create:{width:2560,height:Math.ceil(tiles.length/10)*144,channels:3,background:'#fff'}}).composite(tiles.map((b,i)=>({input:b,left:(i%10)*256,top:Math.floor(i/10)*144}))).jpeg({quality:80}).toFile(path.join(R,'vo-contact-sheet.jpg'));
 console.log('ingested',tiles.length,'missing',missing.length,missing.join(','))})();
