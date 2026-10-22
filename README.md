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
aspect ratios and remain to the left of the corresponding result. An alternate
result for one scene is available through its result selector.

The website media were prepared using stream copying and MP4 faststart; no new
cuts, frame rate conversion, or generative edits were applied for this page.
Gallery durations are measured from the media files. Prompt stages describe
the source instructions; they do not assert exact timestamps in the outputs.

## Hosting

GitHub Pages: deploy from the `main` branch, repository root.
The `.nojekyll` file enables direct static serving.

The presentation is independently implemented, with layout inspiration from
[HOMIE](https://yiyangcai.github.io/homie-page.github.io/) and
[EditStream](https://real-time-video-research.github.io/editstream/).
Institutional marks remain the property of their respective institutions.
