# ReferStream project page

Interactive Subject Injection for Streaming Video Generation.

Static project website: https://xushuolin.github.io/ReferStream/

## Local preview

Run `python3 -m http.server 8000` in this folder, then open http://localhost:8000.
No framework, installation, or build is required.

## Contents

- `index.html`, `style.css`, `app.js`: presentation and interactions.
- `data.js`: demo metadata, original prompts, and resized reference/poster images.
- `a-*.mp4`, `b-*.mp4`: recorded MultiShot and InShot results.
- `referstream-paper.pdf`: accompanying manuscript.
- `method.webp`, `benchmark.webp`, `nus.webp`, `ncca.png`: paper figures and institution marks.

Videos use lazy loading and native controls. Reference thumbnails retain their
aspect ratios and remain to the left of the corresponding result. The gallery
shows 24 distinct examples: four highlights in a 2 × 2 grid, followed by
15 InShot examples in a 3 × 5 grid and five MultiShot examples. The highlighted
cases do not repeat in the gallery. Smaller screens use fewer columns.
All examples are displayed without pagination; filters and search remain available.

Full gallery videos were prepared using stream copying and MP4 faststart, with no new
cuts, frame rate conversion, or generative edits. The banner alone uses 6-second
excerpts (4.25–10.25 s) of existing outputs, resized into desktop/mobile collages.
These showcase excerpts illustrate visible arrivals; their cut points are not
annotations of exact model injection times. The original results remain below.
Gallery durations are measured from the media files. Prompt stages describe
the source instructions; they do not assert exact timestamps in the outputs.

## Hosting

GitHub Pages: deploy from the `main` branch, repository root.
The `.nojekyll` file enables direct static serving.

The presentation is independently implemented, with layout inspiration from
[HOMIE](https://yiyangcai.github.io/homie-page.github.io/) and
[EditStream](https://real-time-video-research.github.io/editstream/).
Institutional marks remain the property of their respective institutions.

## Banner background

`hero/` contains a 3 × 3 desktop montage and a 2 × 4 mobile montage, each
6 seconds long with no audio. Static WebP posters cover loading, disabled
autoplay, reduced motion, and data saver preferences. Background playback
pauses outside the banner and when the tab is hidden; the visitor can pause it.
Regenerate with `tools/generate_hero.py --ffmpeg /path/to/ffmpeg` from the
parent project. `hero_clip_manifest.json` records the source clips.
