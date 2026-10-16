const fs=require('fs'),path=require('path');
const BASE='/calisthenics-comics';const SITE='https://brenohildebrand.github.io'+BASE;
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const tier=d=>d<=2?'Rookie':d<=4?'Brawler':d<=6?'Hero':d<=8?'Champion':d==9?'Titan':'Legend';
const CAT={push:['Push','#ff3b3b'],pull:['Pull','#2f6bff'],legs:['Legs','#18b85a'],core:['Core','#ffb800'],skills:['Skills','#a43bff']};
const rows=require('./data.js');
const M=rows.map(([name,cat,muscles,diff,w,how,e,h])=>({name,slug:slug(name),cat,muscles,diff,tier:tier(diff),weighted:!!w,weightHow:w,how,easier:e?slug(e):'',harder:h?slug(h):''}));
const by=Object.fromEntries(M.map(m=>[m.slug,m]));
for(const m of M)for(const k of['easier','harder'])if(m[k]&&!by[m[k]])throw 'bad link '+m.name+' '+m[k];

// ---------- ART ----------
const S='stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"';
const head=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="14" fill="${c}" stroke="#111" stroke-width="6"/>`;
const pl=pts=>`<polyline ${S} points="${pts}"/>`;
const POSES={
 push:c=>`<rect x="10" y="150" width="180" height="10" fill="#111"/>${head(150,98,c)}${pl('135,108 60,128 30,140')}${pl('120,112 125,148')}${pl('140,108 145,148')}<path d="M40 70 l10 10 M30 95 h14" ${S}/>`,
 pull:c=>`<rect x="30" y="18" width="140" height="10" rx="4" fill="#111"/>${pl('70,28 85,62 100,72')}${pl('130,28 115,62 100,72')}${head(100,64,c)}${pl('100,80 100,130')}${pl('100,130 85,170')}${pl('100,130 118,168')}<path d="M40 120 v20 M160 120 v20" ${S}/>`,
 legs:c=>`<rect x="10" y="168" width="180" height="10" fill="#111"/>${head(95,52,c)}${pl('95,66 95,112')}${pl('95,80 145,82')}${pl('95,112 120,138 100,168')}${pl('95,112 60,118 30,112')}<path d="M150 60 l15 -10 M155 95 l18 5" ${S}/>`,
 core:c=>`<rect x="10" y="150" width="180" height="10" fill="#111"/>${head(55,102,c)}${pl('68,110 120,110 175,70')}${pl('70,110 60,148')}${pl('84,110 86,148')}<path d="M120 50 q20 -15 40 0" ${S}/>`,
 skills:c=>`<rect x="10" y="170" width="180" height="10" fill="#111"/>${pl('85,170 90,120')}${pl('115,170 110,120')}${head(100,108,c)}${pl('100,96 100,55')}${pl('100,55 80,18')}${pl('100,55 125,20')}<path d="M40 40 l12 12 M160 40 l-12 12 M30 100 h16 M170 100 h-16" ${S}/>`
};
const art=(cat,extra='')=>{const c=CAT[cat][1];return `<svg viewBox="0 0 200 190" role="img" aria-label="${CAT[cat][0]} comic pose" ${extra}><defs><pattern id="ht-${cat}" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2.4" fill="${c}" opacity=".45"/></pattern></defs><rect width="200" height="190" fill="#fff8e1"/><polygon points="100,10 118,60 175,40 135,85 190,120 128,118 140,180 100,135 60,180 72,118 10,120 65,85 25,40 82,60" fill="url(#ht-${cat})"/>${POSES[cat](c)}</svg>`};
const hero=`<svg viewBox="0 0 800 380" role="img" aria-label="Comic hero panel: a calisthenics athlete blasting through a muscle-up" class="hero-art"><defs><pattern id="hd" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3.5" fill="#ff3b3b" opacity=".35"/></pattern><radialGradient id="rg"><stop offset="0" stop-color="#ffe14d"/><stop offset="1" stop-color="#ff8a00"/></radialGradient></defs>
<rect width="800" height="380" fill="url(#rg)"/><rect width="800" height="380" fill="url(#hd)"/>
${Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return `<line x1="400" y1="190" x2="${400+700*Math.cos(a)}" y2="${190+700*Math.sin(a)}" stroke="#fff" stroke-width="${i%2?6:14}" opacity=".35"/>`}).join('')}
<polygon points="590,40 625,95 690,70 655,125 735,150 650,165 680,235 615,190 580,255 565,180 495,200 540,140 480,95 555,105" fill="#fff" stroke="#111" stroke-width="8"/>
<text x="610" y="160" font-family="Bangers,Impact,sans-serif" font-size="64" text-anchor="middle" fill="#ff3b3b" stroke="#111" stroke-width="3" transform="rotate(-10 610 150)">POW!</text>
<rect x="150" y="90" width="420" height="16" rx="6" fill="#111"/>
<g stroke="#111" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none">
<polyline points="300,98 285,140 330,150"/><polyline points="420,98 435,140 390,150"/>
<polyline points="360,92 360,200"/><polyline points="360,200 330,270 345,330"/><polyline points="360,200 395,265 390,330"/></g>
<circle cx="360" cy="62" r="30" fill="#2f6bff" stroke="#111" stroke-width="10"/>
<path d="M330 55 h60" stroke="#ff3b3b" stroke-width="10"/>
<g stroke="#111" stroke-width="6" stroke-linecap="round"><line x1="230" y1="160" x2="200" y2="175"/><line x1="230" y1="200" x2="195" y2="205"/><line x1="490" y1="160" x2="520" y2="175"/><line x1="490" y1="200" x2="525" y2="205"/></g>
<path d="M40 40 h230 a14 14 0 0 1 14 14 v50 a14 14 0 0 1 -14 14 h-150 l-30 30 v-30 h-50 a14 14 0 0 1 -14 -14 v-50 a14 14 0 0 1 14 -14z" fill="#fff" stroke="#111" stroke-width="6"/>
<text x="155" y="92" font-family="Bangers,Impact,sans-serif" font-size="36" text-anchor="middle" fill="#111">LEVEL UP!</text></svg>`;

// ---------- PAGE SHELL ----------
const fonts=`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">`;
const page=({title,desc,url,body,ld})=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${SITE}${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="${SITE}${url}"><meta name="twitter:card" content="summary"><meta name="theme-color" content="#ffe14d"><link rel="icon" href="/favicon.svg">${fonts}<link rel="stylesheet" href="/style.css">${ld?`<script type="application/ld+json">${JSON.stringify(ld)}</script>`:''}</head><body><a class="skip" href="#main">Skip to content</a><header class="top"><a href="/" class="logo">CALISTHENICS <span>COMICS</span></a><nav><a href="/#library">Library</a><a href="/#tiers">Tiers</a></nav></header><main id="main">${body}</main><footer class="foot"><p>Original comic art. Train smart: progress gradually and stop if you feel pain.</p><p>© ${new Date().getFullYear()} Calisthenics Comics</p></footer></body></html>`;
const ad=(label,size)=>`<aside class="ad" aria-label="Sponsor placeholder"><span>SPONSOR SLOT · ${label}</span><small>${size} · your brand here</small></aside>`;
const bar=d=>`<div class="power" role="img" aria-label="Difficulty ${d} of 10">${Array.from({length:10},(_,i)=>`<i class="${i<d?'on':''}"></i>`).join('')}</div>`;
const badge=m=>`<span class="lvl t-${m.tier.toLowerCase()}">LV ${m.diff} · ${m.tier}</span>`;
const card=m=>`<a class="card" href="/m/${m.slug}/" data-slug="${m.slug}" style="--c:${CAT[m.cat][1]}"><div class="art">${art(m.cat)}</div><div class="bubble"><h3>${esc(m.name)}</h3><p class="mus">${esc(m.muscles)}</p>${bar(m.diff)}<div class="tags">${badge(m)}<span class="tag">${CAT[m.cat][0]}</span>${m.weighted?'<span class="tag w">⚖ Weighted</span>':''}</div></div></a>`;

const out='dist';fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out+'/m',{recursive:true});
const tiersHTML=[['Rookie','1–2'],['Brawler','3–4'],['Hero','5–6'],['Champion','7–8'],['Titan','9'],['Legend','10']].map(([t,r])=>`<li class="lvl t-${t.toLowerCase()}">${t}<small>LV ${r}</small></li>`).join('');
const home=`<section class="hero"><div class="hero-copy"><h1>Every Calisthenics Move.<br><span>Comic-Book Powered.</span></h1><p>${M.length} bodyweight movements ranked from Level 1 to 10. Find your next power-up, check what can be loaded, and follow the progression path from Rookie to Legend.</p><a class="btn" href="#library">Start the quest ↓</a></div>${hero}</section>
${ad('Leaderboard','728×90')}
<section id="tiers" class="tiers"><h2>XP Tiers</h2><ol>${tiersHTML}</ol></section>
<section id="library"><h2>Movement Library</h2>
<div class="controls"><label class="search"><span class="sr">Search movements</span><input id="q" type="search" placeholder="Search moves, muscles…  press /" autocomplete="off"><kbd>/</kbd></label>
<div class="chips" role="group" aria-label="Category">${['all',...Object.keys(CAT)].map(c=>`<button class="chip${c=='all'?' on':''}" data-cat="${c}" aria-pressed="${c=='all'}">${c=='all'?'All':CAT[c][0]}</button>`).join('')}</div>
<div class="row"><label>Level <select id="dmin" aria-label="Minimum level">${[...Array(10)].map((_,i)=>`<option${i==0?' selected':''}>${i+1}</option>`).join('')}</select> to <select id="dmax" aria-label="Maximum level">${[...Array(10)].map((_,i)=>`<option${i==9?' selected':''}>${i+1}</option>`).join('')}</select></label>
<label><select id="wt" aria-label="Weighted filter"><option value="">Weighted: any</option><option value="y">Can be weighted</option><option value="n">Bodyweight only</option></select></label>
<label><select id="sort" aria-label="Sort"><option value="diff">Sort: level</option><option value="name">Sort: A–Z</option></select></label></div>
<p id="count" aria-live="polite"></p></div>
<div id="grid" class="grid">${M.slice().sort((a,b)=>a.diff-b.diff).map(card).join('')}</div></section>
${ad('Footer banner','970×250')}
<script>window.MOVES=${JSON.stringify(M.map(({name,slug,cat,muscles,diff,tier,weighted,how})=>({name,slug,cat,muscles,diff,tier,weighted,how})))}</script><script type="module" src="/app.js"></script>`;
fs.writeFileSync(out+'/index.html',page({title:'Calisthenics Comics — Every bodyweight movement, ranked 1–10',desc:`Comic-style encyclopedia of ${M.length} calisthenics movements with difficulty levels, weighted options and progressions.`,url:'/',body:home,ld:{'@context':'https://schema.org','@type':'WebSite',name:'Calisthenics Comics',url:SITE}}));

for(const m of M){
 const link=(s,l)=>s?`<a class="prog" href="/m/${s}/"><small>${l}</small>${esc(by[s].name)} <em>LV ${by[s].diff}</em></a>`:`<span class="prog none"><small>${l}</small>${l=='Harder'?'You reached the top! 🏆':'Starting point'}</span>`;
 const related=M.filter(x=>x.cat==m.cat&&x.slug!=m.slug).sort((a,b)=>Math.abs(a.diff-m.diff)-Math.abs(b.diff-m.diff)).slice(0,4);
 const body=`<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/#library">${CAT[m.cat][0]}</a> › ${esc(m.name)}</nav>
<article class="detail" style="--c:${CAT[m.cat][1]}"><div class="panel">${art(m.cat)}</div><div class="info"><h1>${esc(m.name)}</h1>${badge(m)}${bar(m.diff)}
<div class="bubble big"><h2>How to</h2><p>${esc(m.how)}</p></div>
<dl><dt>Category</dt><dd>${CAT[m.cat][0]}</dd><dt>Muscles</dt><dd>${esc(m.muscles)}</dd><dt>Weighted?</dt><dd>${m.weighted?'Yes — '+esc(m.weightHow):'No — bodyweight only'}</dd></dl>
<div class="progs">${link(m.easier,'Easier')}${link(m.harder,'Harder')}</div></div></article>
${ad('In-article','300×250')}
<section><h2>Related ${CAT[m.cat][0]} moves</h2><div class="grid">${related.map(card).join('')}</div></section>`;
 fs.mkdirSync(`${out}/m/${m.slug}`,{recursive:true});
 fs.writeFileSync(`${out}/m/${m.slug}/index.html`,page({title:`${m.name} — Level ${m.diff} ${m.tier} | Calisthenics Comics`,desc:`${m.name}: ${m.how} Difficulty ${m.diff}/10. Muscles: ${m.muscles}.`,url:`/m/${m.slug}/`,body,ld:{'@context':'https://schema.org','@type':'HowTo',name:m.name,description:m.how,step:[{'@type':'HowToStep',text:m.how}]}}));
}
fs.writeFileSync(out+'/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...M.map(m=>`/m/${m.slug}/`)].map(u=>`<url><loc>${SITE}${u}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(out+'/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(out+'/favicon.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#ffe14d" stroke="#111" stroke-width="5"/><text x="32" y="46" font-family="Impact" font-size="38" text-anchor="middle" fill="#ff3b3b" stroke="#111" stroke-width="2">C!</text></svg>`);
fs.writeFileSync(out+'/404.html',page({title:'Not found | Calisthenics Comics',desc:'Page not found',url:'/404',body:'<section class="hero-copy"><h1>KA-BOOM! 404</h1><p>That move fell off the bar. <a href="/">Back to the library</a>.</p></section>'}));
fs.copyFileSync('style.css',out+'/style.css');fs.copyFileSync('app.js',out+'/app.js');
fs.copyFileSync('node_modules/fuse.js/dist/fuse.min.mjs',out+'/fuse.mjs');
console.log('built',M.length);
// prefix root-relative URLs with BASE for GitHub Pages subpath
for(const f of require('child_process').execSync(`find ${out} -name '*.html'`).toString().trim().split('\n')){
 fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace(/(href|src)="\/(?!\/)/g,`$1="${BASE}/`));}
fs.writeFileSync(out+'/app.js',fs.readFileSync(out+'/app.js','utf8').replace("'/fuse.mjs'",`'${BASE}/fuse.mjs'`));
fs.writeFileSync(out+'/.nojekyll','');
