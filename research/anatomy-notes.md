# Anatomy, inking & calisthenics biomechanics notes for Captain Rep (v3 art)
Compiled 2026-10-16 from web research (WebSearch). Each bullet → how it's applied in `art3.js`.

## 1. Proportions
- Loomis: normal ≈ 7.5 heads, ideal 8, **heroic "superhuman" = 9 heads**; height controlled by head size. Loomis ideal torso: 1 head chin→nipples, 1 → navel, 1 → crotch; shoulders ≈ 2⅓ heads wide, hips ≈ 1.5 heads.
  - https://en.wikisource.org/wiki/Page:Andrew_Loomis,_Figure_Drawing_for_All_It%27s_Worth.pdf/21
  - https://www.alexhays.com/loomis/Loomis%20Figure%20Draw.pdf
  - https://www.proko.com/course-lesson/human-proportions-idealistic-figures
  - **Applied:** head height = ⅓ of neck→crotch torso length (≈ 8.5–9 heads overall); shoulders ≈ 2.3 head-widths; pelvis ≈ 1.5.

## 2. Construction: masses & wedging (Bridgman)
- Head, chest (rib cage, a cone flattened in front) and pelvis are the three stable masses; waist/abdomen is the mobile link. Masses "wedge" into each other rather than stacking; pelvis is a squarer, forward-tilted mass marked by the iliac crest.
  - https://ia800501.us.archive.org/32/items/constructiveanat00brid/constructiveanat00brid.pdf
  - https://doi.org/10.5962/bhl.title.43855
  - https://methods.art/painters/bridgman
  - http://www.artgraphica.net/free-art-lessons/constructive-anatomy-george-bridgman/constructive-anatomy-george-bridgman-art-book.html
  - http://www.artgraphica.net/free-art-lessons/constructive-anatomy-george-bridgman/george-bridgman-anatomy-trunk.html
  - **Applied:** separate rib-cage egg (upper ~55% of torso), narrower pelvis block, overlapping abdominal connector.

## 3. Gesture / line of action (Hampton)
- Start from a curved line of action; C- and S-curves, offset apexes, avoid parallels; spine as cervical/thoracic/lumbar curves; wrapping lines show tilt.
  - https://www.proko.com/course-lesson/dynamic-poses
  - https://www.proko.com/course-lesson/what-you-need-to-know-about-gesture
  - https://www.proko.com/lesson/gesture-and-anatomy-full-demo/
  - https://line-of-action.com/article/gesture-basics-1-line-of-action
  - https://www.oreilly.com/library/view/gesture-drawing/9798888142424/xhtml/part1.xhtml
  - **Applied (partially):** torso drawn as curved masses; poses still come from a joint table (limitation — see report).

## 4. Muscles in push / pull / overhead poses
- Deltoid = cap over the humerus head, tapering to its insertion; pecs tuck under the deltoid; lats wrap from back into the armpit and deepen when arms are overhead; arm = overlapping biceps/triceps masses, forearm widest near elbow.
  - https://www.thedrawingcodex.com/shoulder-anatomy-construction.html
  - https://www.proko.com/course-lesson/how-to-draw-deltoids-anatomy-for-artists
  - https://gvaat.com/blog/how-to-draw-the-shoulders-from-front-back-and-arms-raised/
  - http://www.artgraphica.net/free-art-lessons/constructive-anatomy-george-bridgman/shoulder-anatomy-and-art.html
  - https://artprof.org/learn/fundamentals/anatomy/anatomy-for-artists-front-torso-muscles/
  - **Applied:** deltoid cap, pec plate, lat wedge, trap slope, biceps+triceps, forearm bulge near elbow, quad/hamstring, calf on back of shin.

## 5. Foreshortening & overlap
- Simplify to cylinders/boxes; near forms overlap far forms and are larger; cross-contours sell volume.
  - https://www.lovelifedrawing.com/4-easy-steps-to-finally-conquer-foreshortening/
  - https://artprof.org/learn/tutorials-topic/figure/artistic-anatomy-lecture-foreshortening/
  - https://artprof.org/learn/tutorials-media/drawing/drawing-foreshortened-legs/
  - **Applied:** near limbs drawn ~8% thicker and on top; far limbs smaller and darker. No true perspective foreshortening (side views only).

## 6. Balance / centre of gravity
- Gravity line from the COG must fall inside the base of support; COG ≈ navel but shifts with pose.
  - https://www.proko.com/course-lesson/how-to-draw-balanced-poses
  - https://www.lovelifedrawing.com/how-to-achieve-balance-in-your-figure-drawings-3-easy-steps/
  - http://www.algarcia.org/AnimationPhysics/BalanceTutorial.pdf
  - https://www.animatorisland.com/principles-of-animation-physics-part-4/
- Segment masses (Dempster 1955): head+neck ≈ 8%, trunk ≈ 50%, upper arm ≈ 2.8%, forearm+hand ≈ 2.2%, thigh ≈ 10%, shank+foot ≈ 6%; segment COM ≈ 43% from proximal joint.
  - https://doi.org/10.1111/j.1749-6632.1955.tb32112.x
  - https://github.com/wspr/body-segment-param
  - **Applied:** `balance()` computes the COG from these weights for every hand-supported and hanging pose and rotates the arms about the shoulder until the COG is over/under the hands, then re-seats the hands on the floor/bar.

## 7. Calisthenics biomechanics (joint angles)
- **Planche:** COG must sit over the hands; shoulders lean well past the hands; hands roughly under the navel; elbows locked; ~40–50° shoulder flexion typical.
  - https://themovementathlete.com/planche-muscles/
  - https://www.mdpi.com/2306-5354/10/7/761
  - https://stevenlow.org/wp-content/uploads/2016/12/OG2PreviewCh1.pdf
  - https://www.workedoutfitness.com/resources/moment-calculator
  - https://www.youtube.com/watch?v=vDRunCZZk8c
- **Front lever:** straight arms, body one horizontal line face-up, hips level with shoulders; shoulder extension by lats/teres major at ~40–50°; bar sits above the COG (so arms are angled, not vertical).
  - https://leverage.fit/skills/front-lever/
  - https://www.simple-calisthenics.com/exercises/frontLeverProgressions
  - https://calisthenics.com/exercise/front-lever/
  - https://bodytree.app/exercises/front-lever
  - https://calisteniapp.com/articles/front-lever-calisthenics
- **Muscle-up:** hips drive toward the bar, chest leans over, hands rotate around the bar, finish in straight-arm support with COG over the bar.
  - https://www.theprogrm.com/blog/bar-muscle-up-guide
  - https://www.bergmovement.com/calisthenics-blog/3-steps-slow-muscle-up
  - https://www.crossfit.com/essentials/the-muscle-up-journal-classic
- **Handstand:** wrists, shoulders, hips, knees, ankles stacked; hollow, ribs down; shoulders elevated/open.
  - https://camillamia.com/complete-handstand-guide-2-finding-the-shape/
  - https://www.orthopt.org/uploads/A_Primer_on_the_Handstand.pdf
  - https://kyleweiger.com/open-shoulders-in-a-handstand/
- **Pistol squat:** big ankle dorsiflexion, knee travels forward, heel down, arms reach forward as counterweight; COG over the standing foot.
  - https://barbend.com/pistol-squat/
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC10987311/
- **L-sit:** locked elbows, depressed shoulders, legs straight at ~90° hip flexion, hips slightly behind hands.
  - https://theworkoutmag.com/training/l-sit-form-guide-progressions
  - https://www.crossfit.com/essentials/the-l-sit
- **Human flag:** top arm pulls, bottom arm pushes, both straight; body in one horizontal line.
  - https://calisthenics.com/exercise/human-flag/
  - https://calisteniapp.com/articles/human-flag-calisthenics

## 8. Comic inking & cel shading
- Three line-weight tiers: heaviest silhouette/bottom/shadow edges, medium for major separations, thinnest for interior details; spot solid blacks where shadows fall and to separate planes.
  - http://johnkstuff.blogspot.com/2008/11/inking-advanced-pt-1-logical-line.html
  - https://vintageinkwell.com/wp-content/uploads/2021/05/The-Art-of-Comic-Book-Inking.pdf
  - https://lebeauunderwood.weebly.com/le-beaus-blog-4-those-in-the-know/inking-tutorial-part-iii-spotting-blacks
  - https://tips.clip-studio.com/en-us/articles/3783
- Two-tone cel: one light direction, hard terminator, cool shadows against warm light.
  - https://bueskenart.com/cel-shading/
  - https://tips.clip-studio.com/en-us/articles/1312
  - https://www.micahbuzan.com/cel-shading-tutorial/
  - **Applied:** light from upper-left; every mass shaded on the side facing away; shadows mixed toward cool violet; 3 line tiers (silhouette 6px, separations 2.4px, details 1.3px); spotted blacks in armpits, under pecs, shorts.
