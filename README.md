# ReferStream: Interactive Subject Injection for Streaming Video Generation

**Shuolin Xu, Guanyuan Li, Boyu Li, Kelu Yao, Xiaogang Xu, Hongchuan Yu, Shuicheng Yan, Xiaobin Hu**

[Project page and demos](https://xushuolin.github.io/ReferStream/) · [Paper (arXiv)](https://arxiv.org/abs/2610.37566)

ReferStream enables new visual subjects to be introduced into a video while it is being generated. It integrates newly provided reference images with the current scene while retaining established subjects, scene context, and previously generated frames. The method operates without additional training and combines **Joint Latent**, which constructs reference features in the current scene context, with **Cache Restoration**, which restores the original global cache after a transient reference injection.

We also introduce **ReferStream Bench** for evaluating interactive subject injection with scheduled reference arrivals, evolving prompts, and subject presence annotations across InShot and MultiShot settings. Visit the project page for the method overview and selected demonstrations.

## Repository

This repository currently hosts the project website and its demonstration assets. Inference code is not yet included.

- `index.html`, `style.css`, `app.js`, `data.js`: project page and demo metadata.
- `demo_videos/`: full demonstration videos used in the page.
- `hero/`: short background video montages and their posters.
- `method.webp`, `benchmark.webp`, `nus.webp`, `ncca.png`: figures and institution logos.
- `referstream-paper.pdf`: a bundled manuscript copy; see the arXiv link above for the current version.

To preview the page locally, run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000`. GitHub Pages serves the site from the root of the `main` branch.

## Citation

If you find this work useful, please cite:

```bibtex
@misc{xu2026referstream,
  title         = {ReferStream: Interactive Subject Injection for Streaming Video Generation},
  author        = {Shuolin Xu and Guanyuan Li and Boyu Li and Kelu Yao and
                   Xiaogang Xu and Hongchuan Yu and Shuicheng Yan and Xiaobin Hu},
  year          = {2026},
  eprint        = {2610.37566},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CV},
  url           = {https://arxiv.org/abs/2610.37566}
}
```
