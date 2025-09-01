# MVTec AD — Dataset Card

Brief: A widely used industrial anomaly detection benchmark of multiple object and texture categories, providing image-level and pixel-level annotations for normal and defective samples.

- Official: [MVTec AD Official](https://www.mvtec.com/company/research/datasets/mvtec-ad/)
- Paper: [Bergmann et al., 2019](https://arxiv.org/abs/1901.08954)

## Dataset Overview

| Domain        | Modality | Tasks   | Annotation         | Total | Normal | Defect | Year | License                   |
| ------------- | -------- | ------- | ------------------ | ----- | ------ | ------ | ---- | ------------------------- |
| General/Multi | RGB      | AD, Seg | Img-level, Pix-lvl | 5354  | 4096   | 1258   | 2019 | Research (non-commercial) |

Notes:

- Replace TBD with official counts per category or overall if you maintain a unified row.
- Use the same evaluation protocol across models (e.g., per-class AUROC averaged over categories).

## Baselines — Predictive Performance

All results should clearly indicate the evaluation protocol (image-level vs pixel-level, per-class averaging, input size, and data split).

### AD — Unsupervised

| Model         | Protocol (Split/Input) | Image AUROC | Pixel AUROC | Pixel AP | Notes                                     |
| ------------- | ---------------------- | ----------- | ----------- | -------- | ----------------------------------------- |
| PatchCore     | Paper protocol         | 99.6        | —           | —        | [Paper](https://arxiv.org/abs/2106.08265) |
| EfficientAD-M | Paper protocol         | 99.1        | —           | —        | [Paper](https://arxiv.org/abs/2303.14535) |
| CFLOW-AD      | Paper protocol         | 97.4        | 97.5        | —        | [Paper](https://arxiv.org/abs/2107.12571) |
| FastFlow      | Paper protocol         | 99.4        | —           | —        | [Paper](https://arxiv.org/abs/2111.07677) |

### AD — Supervised

| Model | Protocol (Split/Input) | Image AUROC | Pixel AUROC | Pixel AP | Notes                                                              |
| ----- | ---------------------- | ----------- | ----------- | -------- | ------------------------------------------------------------------ |
| DRAEM | Paper protocol         | —           | —           | —        | Supervised segmentation. [Paper](https://arxiv.org/abs/2105.11198) |

### AD — CNN-based Few-shot

| Model    | #Shots | Protocol (Split/Input) | Image AUROC | Pixel AUROC | Pixel AP | Notes                                                                  |
| -------- | ------ | ---------------------- | ----------- | ----------- | -------- | ---------------------------------------------------------------------- |
| CutPaste | 1–5    | Paper protocol         | —           | —           | —        | Augmentation-based few-shot. [Paper](https://arxiv.org/abs/2104.04015) |

## Computational Cost per Model

Report hardware and software context for fairness: GPU type, batch size, input size, mixed precision, framework/version.

| Model         | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware     | Precision Type  |
| ------------- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | ------------ | --------------- |
| EfficientAD-M | 23.5       | 256×256    | 32         | 8.2       | 222             | 45 min           | NVIDIA A6000 | Mixed (FP16/32) |

Guidelines:

- VRAM: report peak usage measured during inference and training if both are relevant.
- FPS: single-GPU, specify resolution and batch size (e.g., 256×256, bs=1).
- Train time: specify dataset subset or full set, number of categories trained jointly or per-class, and epochs.

## Reproducibility

- Reference Code: [link]
- Configs: [link]
- How to run: add a minimal command-line and environment spec once numbers are finalized.
