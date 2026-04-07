# Prompt Library — SDXL-Turbo Keyword Testing

Test these prompts. Keep the good ones, delete the bad ones.
Once we have results, I'll extract which keywords consistently produce the best output per style.

**Current preset suffixes (auto-appended):**
- Realistic: `, hyper realistic`
- Cartoon: `, cartoon illustration, vibrant colors`
- Painting: `, oil painting, textured brushstrokes`
- Sketch: `, detailed pencil sketch, hand-drawn`

**How to use:** Each prompt has test keywords baked in (noted in parentheses).
The preset suffix gets appended automatically — so these keywords stack on top.
Rate 1-5 or just delete if bad.

---

## Realistic
*Preset adds: `, hyper realistic`*

### Lighting keywords
- A woman smiling for the camera, with beautiful eyes *(CONFIRMED GOOD)* 4.6
- A young teacher writing on a whiteboard, soft natural lighting, sharp focus *(soft natural lighting / sharp focus)* 3 (duplicating arms or messing up fingers/hand)
- A young teacher writing on a whiteboard, studio lighting, high detail *(studio lighting / high detail)* 4.5 (only text was messed up)
- A young teacher writing on a whiteboard, golden hour lighting, cinematic *(golden hour / cinematic)* 5
- A young teacher writing on a whiteboard, dramatic side lighting *(dramatic side lighting)* 4.5
- A young teacher writing on a whiteboard, warm ambient light *(warm ambient)* 4.4 (fingers messed up)

### Camera/lens keywords
- A child reading a book in a library, shallow depth of field, 85mm lens *(shallow dof / 85mm)* 4.9 (book just a bit too big)
- A child reading a book in a library, close-up shot, macro detail *(close-up / macro)* 4.9 (a finger got messed up)
- A child reading a book in a library, wide angle, environmental portrait *(wide angle / environmental)* 4.6(book too big)
- A child reading a book in a library, documentary photography *(documentary)* 4.8
- A child reading a book in a library, portrait photography *(portrait photography)* 4.9

### Quality boosters
- Hands holding a globe, detailed textures, sharp focus *(detailed textures / sharp)*3 (hands are weird as shit, globe proportions weird)
- Hands holding a globe, 8k, ultra detailed *(8k / ultra detailed)* 4.1 (hands look a lil off, globe small)
- Hands holding a globe, professional photograph *(professional photograph)*4.2
- Hands holding a globe, RAW photo, film grain *(RAW photo / film grain)* 2
- Hands holding a globe, true-to-life colors *(true-to-life colors)* 2
- Hands holding a globe, DSLR quality *(DSLR quality)* 4 (fingers got messed up)

### Subject variety (clean — rely on preset suffix)
- A golden retriever in a sunny park, soft bokeh background -5
- Fresh fruits on a rustic wooden table, overhead shot -5
- A steaming cup of coffee on a rainy windowsill, moody atmosphere-4.9
- An elderly man with weathered hands reading a newspaper -4 (head is great, fingers and newspaper messed up(skin texture is amazing tho))
- A red bicycle leaning against an old brick wall, golden hour-3.7
- A butterfly on a wildflower, macro photography -4.2
- Rain on a cobblestone street at night, reflections in puddles-4.6
- A cat sleeping on a sunlit windowsill, warm tones-4.8(just missing one leg in a try i did, and sometimes the eyes look weird)
- Stacked old books with reading glasses on top, soft light -4.7
- A farmer holding fresh vegetables in a garden, candid
- A classroom with sunlight streaming through windows, morning light -3.8 (face and hands messed up)
- Children playing on a school playground, action shot -1.9
(almost everything is deformed, and not in a blurry movement shot manner)
---

## Cartoon
*Preset adds: `, cartoon illustration, vibrant colors`*

### Style keywords
- A friendly robot helping a student with homework, bold outlines *(bold outlines)* -3.2
- A friendly robot helping a student with homework, cel shading *(cel shading)*-3.7
- A friendly robot helping a student with homework, Pixar style *(Pixar style)* -3.
- A friendly robot helping a student with homework, anime style *(anime style)* -3.4
- A friendly robot helping a student with homework, flat vector art *(flat vector art)*
- A friendly robot helping a student with homework, Disney style *(Disney style)*
- A friendly robot helping a student with homework, Ghibli style *(Ghibli style)*
- A friendly robot helping a student with homework, chibi style *(chibi style)*

### Color/mood keywords
- A dragon reading to baby dragons in a cozy cave, bright saturated colors *(bright saturated)*
- A dragon reading to baby dragons in a cozy cave, pastel tones *(pastel tones)*
- A dragon reading to baby dragons in a cozy cave, neon colors, high contrast *(neon / high contrast)*
- A dragon reading to baby dragons in a cozy cave, warm color palette *(warm palette)*
- A dragon reading to baby dragons in a cozy cave, soft gradient colors *(soft gradient)*

### Detail keywords
- A cat wearing glasses at a tiny desk, cute and expressive *(cute / expressive)*
- A cat wearing glasses at a tiny desk, exaggerated features *(exaggerated features)*
- A cat wearing glasses at a tiny desk, simple and clean *(simple / clean)*
- A cat wearing glasses at a tiny desk, highly detailed *(highly detailed)*

### Subject variety (clean — rely on preset suffix)
- Children exploring a magical forest with glowing mushrooms
- A treehouse school in the clouds with a rainbow bridge
- A penguin scientist mixing potions in a laboratory
- An astronaut planting a flag on the moon with Earth behind
- A fox and owl sharing a picnic on a log, autumn forest
- A wizard casting a spell with sparkles and swirling energy
- A submarine exploring a coral reef with smiling fish
- A baker pulling bread from a brick oven, cheerful kitchen
- A girl flying a kite on a windy hilltop, bright sky
- A group of animals having a tea party in a garden
- A knight riding a friendly dragon over a castle
- A snowman coming to life in a winter wonderland

---

## Painting
*Preset adds: `, oil painting, textured brushstrokes`*

### Medium keywords
- A misty mountain lake at dawn with pine trees, impressionist *(impressionist)*
- A misty mountain lake at dawn with pine trees, watercolor *(watercolor)*
- A misty mountain lake at dawn with pine trees, acrylic *(acrylic)*
- A misty mountain lake at dawn with pine trees, gouache *(gouache)*
- A misty mountain lake at dawn with pine trees, digital painting *(digital painting)*
- A misty mountain lake at dawn with pine trees, fresco style *(fresco)*

### Texture/technique keywords
- A village marketplace with fruit stalls, visible brushstrokes *(visible brushstrokes)*
- A village marketplace with fruit stalls, palette knife texture *(palette knife)*
- A village marketplace with fruit stalls, soft blended strokes *(soft blended)*
- A village marketplace with fruit stalls, impasto technique *(impasto)*
- A village marketplace with fruit stalls, painterly *(painterly)*
- A village marketplace with fruit stalls, loose expressive strokes *(loose expressive)*

### Mood/atmosphere keywords
- A lighthouse on a cliff during sunset, dramatic atmosphere *(dramatic atmosphere)*
- A lighthouse on a cliff during sunset, warm golden light *(warm golden light)*
- A lighthouse on a cliff during sunset, moody and atmospheric *(moody / atmospheric)*
- A lighthouse on a cliff during sunset, ethereal glow *(ethereal glow)*
- A lighthouse on a cliff during sunset, rich deep colors *(rich deep colors)*

### Subject variety (clean — rely on preset suffix)
- A field of sunflowers under a cloudy sky
- An old stone bridge over a stream in autumn forest
- A cozy cottage with chimney smoke, snow-covered garden, winter evening
- A jazz musician playing saxophone on a dimly lit stage
- A fishing boat in a calm harbor at sunset
- Cherry blossom grove in full bloom, petals falling
- A Parisian cafe terrace at evening, warm atmosphere
- A tropical waterfall into a crystal pool, lush jungle
- A windmill in a Dutch tulip field, spring morning
- A medieval castle overlooking rolling farmland, epic landscape
- A still life with wine bottle, grapes, and cheese on a table
- A rainy city street with glowing shop windows, evening scene

---

## Sketch
*Preset adds: `, detailed pencil sketch, hand-drawn`*

### Medium keywords
- A wise owl perched on a branch, crosshatching *(crosshatching)*
- A wise owl perched on a branch, charcoal drawing *(charcoal)*
- A wise owl perched on a branch, ink sketch *(ink sketch)*
- A wise owl perched on a branch, graphite shading *(graphite shading)*
- A wise owl perched on a branch, pen and ink, stippling *(pen and ink / stippling)*
- A wise owl perched on a branch, conte crayon *(conte crayon)*
- A wise owl perched on a branch, fine linework *(fine linework)*

### Detail level keywords
- A Gothic cathedral with flying buttresses, architectural sketch *(architectural sketch)*
- A Gothic cathedral with flying buttresses, loose gestural lines *(loose / gestural)*
- A Gothic cathedral with flying buttresses, technical drawing, precise *(technical / precise)*
- A Gothic cathedral with flying buttresses, rough concept sketch *(rough concept)*
- A Gothic cathedral with flying buttresses, blueprint style *(blueprint style)*

### Texture keywords
- A horse galloping across a plain, dynamic motion lines *(dynamic motion lines)*
- A horse galloping across a plain, smooth gradients *(smooth gradients)*
- A horse galloping across a plain, rough textured strokes *(rough textured)*
- A horse galloping across a plain, clean precise lines *(clean precise)*
- A horse galloping across a plain, expressive marks *(expressive marks)*

### Subject variety (clean — rely on preset suffix)
- A still life with a vase of flowers and fruit on a table
- A vintage bicycle with a basket of flowers
- A human hand reaching toward a butterfly, anatomical detail
- A city skyline with a bridge in the foreground, urban sketch
- A botanical illustration of a rose with thorns
- A sleeping cat curled on a stack of books
- A sailing ship on rough ocean waves, dramatic perspective
- A portrait of a girl with curly hair, expressive eyes
- A cozy reading nook with armchair and bookshelf
- A wolf howling at the moon, dramatic shadows
- An old tree with twisted branches, detailed bark texture
- A school building with children in the yard, architectural sketch
