const d=require('../data.js');const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const SFX=['POW!','BAM!','ZAP!','WHAM!','BOOM!','KRAK!','SMASH!','ZING!'];
const CHAR="Vó Ferro, the exact character from the reference sheet: a 72-year-old Brazilian grandmother with warm brown skin, a big round silver hair bun pierced by two knitting needles, gold hoop earrings, gold bangles on both wrists, an orange-red sleeveless dress with yellow flowers, dark grey leggings, coral sneakers, compact powerful build with strong arms";
const STYLE="Classic comic book panel, bold black ink outlines with thick-to-thin line weight, spotted solid blacks, flat two-tone cel shading, Ben-Day halftone dots, speed lines, simple Brazilian praça background (green park with a mosaic sidewalk and a palm tree, minimal detail). Square 1:1 composition, full body visible, side or 3/4 view so the joint angles read clearly. The ONLY lettering is one big comic sound-effect word";
const POSE={ // biomechanics from research/anatomy-notes.md
'full-planche':'full planche on the ground: body perfectly horizontal and straight from shoulders to toes, legs together, feet off the ground, elbows locked straight, hands on the ground under her hips/navel, shoulders leaned far forward past the hands, about 45 degrees between arms and torso',
'straddle-planche':'straddle planche: body horizontal, legs straight and wide apart in a V, feet off the ground, elbows locked, hands under the hips, shoulders far forward of the hands',
'tuck-planche':'tuck planche: knees pulled tight to chest, back rounded and horizontal, feet off the ground, elbows locked, shoulders leaned well forward of the hands',
'planche-push-up':'planche push-up bottom position: body horizontal and straight, feet off the ground, elbows bent about 90 degrees close to the body, shoulders far forward of the hands',
'planche-lean-push-up':'planche lean push-up: push-up position on toes, shoulders leaned far forward past the hands, fingers pointing slightly outward, body straight',
'pseudo-planche-push-up':'pseudo planche push-up: hands beside the hips, shoulders leaning forward past the hands, toes on the floor, body straight',
'full-front-lever':'full front lever: hanging from a pull-up bar with straight locked arms, body perfectly horizontal and face-up, hips level with shoulders, legs together and straight, the bar is above her belly so the arms angle down to the shoulders at about 45 degrees',
'straddle-front-lever':'straddle front lever: hanging from a bar, straight arms angled from the bar to the shoulders, face-up horizontal body, legs straight in a wide V',
'tuck-front-lever':'tuck front lever: hanging from a bar with straight arms, back horizontal and face-up, knees tucked to chest',
'back-lever':'back lever: hanging from a bar with straight arms behind her, body horizontal and face-down, legs straight and together',
'muscle-up':'bar muscle-up finish: in straight-arm support above the bar, hips touching the bar, chest leaned slightly forward over the bar, legs together below',
'ring-muscle-up':'ring muscle-up transition: on gymnastics rings, chest rising over her hands in a deep dip position, false grip on the rings',
'strict-muscle-up':'strict muscle-up transition: chest passing over the bar with elbows bent, no swing, legs straight together',
'freestanding-handstand':'freestanding handstand: completely vertical and stacked, wrists, shoulders, hips and ankles in one straight line, arms locked overhead, ribs in, legs together and pointed, hands flat on the ground, no wall',
'handstand-wall-hold':'handstand against a wall: hands on the floor a short distance from the wall, body straight vertical, heels touching the wall',
'one-arm-handstand':'one-arm handstand: balancing on one straight arm, legs in a straddle for balance, free arm out to the side',
'wall-handstand-push-up':'wall handstand push-up bottom: upside down against a wall, head almost touching the floor between the hands, elbows bent',
'freestanding-handstand-push-up':'freestanding handstand push-up bottom: upside down with no wall, head near the floor, elbows bent forward, legs straight up',
'90-degree-push-up':'90-degree push-up: body horizontal like a planche but with elbows bent 90 degrees, supporting the hips on her elbows',
'pistol-squat':'pistol squat bottom: squatting all the way down on one leg with the heel flat, knee well forward over the toes, the other leg held straight out in front parallel to the ground, both arms reaching forward for balance',
'dragon-pistol-squat':'dragon pistol squat: deep one-leg squat with the free leg threaded behind the standing leg',
'shrimp-squat':'shrimp squat: one-leg squat holding the back foot behind her with one hand, back knee lowering to touch the floor',
'l-sit':'L-sit on parallettes: arms locked straight, shoulders pushed down, legs straight together held horizontal at 90 degrees to the torso, hips slightly behind the hands',
'v-sit':'V-sit on parallettes: arms locked straight, legs straight and raised high above horizontal into a V',
'manna':'manna: seated support on parallettes with hips pushed far behind the hands, legs straight pointing up and back toward her face',
'human-flag':'human flag on a vertical pole: top hand pulling and bottom hand pushing, both arms straight, body held sideways and horizontal like a flag, legs together',
'dragon-flag':'dragon flag on a bench: gripping the bench behind her head, only upper back on the bench, body straight and rigid at an angle in the air',
'crow-pose':'crow pose: squatting with hands flat on the ground, knees resting on the backs of the upper arms, feet lifted off the ground, leaning forward',
'frog-stand':'frog stand: hands on the ground, knees resting on the outside of the bent elbows, feet off the ground',
'elbow-lever':'elbow lever: balancing horizontally on both hands with her elbows pressed into her hips',
'skin-the-cat':'skin the cat: hanging from a bar and rotating backward through her arms into an inverted tuck',
'pull-up':'pull-up top: hanging from a bar with an overhand grip, chin over the bar, elbows pulled down, legs straight',
'chin-up':'chin-up top: underhand grip, chin over the bar',
'one-arm-pull-up':'one-arm pull-up top: hanging from one hand, chin at bar height, other arm relaxed at her side',
'archer-pull-up':'archer pull-up: pulling toward one hand while the other arm stays straight along the bar',
'front-lever':'',
'push-up':'push-up bottom: body in a straight plank line, elbows at about 45 degrees, chest just above the ground',
'dead-hang':'dead hang: hanging from a bar with straight arms and relaxed legs',
'bridge':'full bridge: back arched, hands and feet flat on the ground, hips pushed high',
'nordic-curl':'Nordic curl: kneeling with ankles anchored, lowering her straight torso forward slowly',
};
const out=d.map(([name,cat,mus,diff,w,how],i)=>{const s=slug(name);const pose=POSE[s]||`${name}: ${how.replace(/\.$/,'')}`;const sfx=SFX[i%SFX.length];
 return {slug:s,name,prompt:`${STYLE} "${sfx}". ${CHAR}, performing a ${pose}. Biomechanically accurate, correct balance with her centre of gravity over the support. Keep her exactly on-model with the reference sheet. No captions, no labels, no other text.`,sfx}});
require('fs').writeFileSync(__dirname+'/vo-ferro-prompts.json',JSON.stringify(out,null,1));console.log(out.length,'prompts');console.log(out[0].prompt.length,'chars');
