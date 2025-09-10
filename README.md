# Industrial Anomaly Detection Datasets

This repository systematically organizes popular datasets for research and benchmarking, with a primary focus on Anomaly Detection in the industrial vision domain.

- "The main focus is on images from automotive manufacturing processes."

## Table of Contents

- [Scope](#scope)
- [Quick Contribution Guide](#quick-contribution-guide)
- [Tag/Notation Rules](#tagnotation-rules)
- [Domain-specific Catalog](#domain-specific-catalog)
  - [Press](#press)
  - [Body/Welding](#bodywelding)
  - [Painting](#painting)
  - [Assembly](#assembly)
- [Related Repos/Resources](#related-reposresources)
- [License](#license)

## Quick Contribution Guide

1. Make sure the dataset is publicly available (download link or application process).
2. Add a row to the appropriate section using the table template below.
3. Prefer official pages/author distribution sites for links whenever possible.
4. Indicate the license/usage terms if specified.

Table row template for adding new datasets (copy and fill in the values):

```markdown
| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Representative Model | Image AUC | Image AP | Pixel AUC | Pixel AP | Pixel PRO | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | -------------------- | --------- | -------- | --------- | -------- | --------- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -                    | -         | -        | -         | -        | -         | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |
```

Field Guide :

- Name: Official dataset name
- Domain: Manufacturing process/domain (Press, Body/Welding, Painting, Assembly, etc.)
- Modality: RGB, Grayscale, Video, Depth, 3D, Multi, etc.
- Defect Type: Surface/structural categories (e.g., scratch, LP, PO, CR)
- Task: AD(img), AD(pixel), Seg, Cls, Det (comma-separated if multiple)
- Annotation: Img-level, Pix-level, Box-level (available supervision granularity)
- Scale: Total/Normal/Defect image counts (use official numbers if available)
- Representative Model: Best baseline/representative model (e.g., PatchCore (CNN), ResNet50, EfficientAD-M)
- Image AUC / Image AP: Requires image-level GT labels; report per protocol (per-class vs overall)
- Pixel AUC / Pixel AP / Pixel PRO: Requires pixel-level GT masks; PRO = area under per-region overlap curve
- Params (M): Number of parameters in millions
- Input Size: Evaluation input resolution (e.g., 256×256)
- Batch Size: Evaluation batch size for the reported numbers
- VRAM (GB): Peak GPU memory during inference (specify context if training)
- Inference (FPS): Single-GPU throughput; specify input size and batch size
- Train time/epoch: Time per epoch; specify dataset scope and epochs
- Hardware: GPU model (e.g., A6000, 4090), CPU if relevant
- Precision Type: FP32, FP16, Mixed (FP16/32)
- Year: Publication/release year
- License: MIT, CC-BY, research use, restricted, etc.
- Link: Official distribution page preferred
- Paper/Page: Official paper or documentation link

## Tag/Notation Rules

- Modality: [RGB], [Gray], [Video], [Depth], [3D], [Multi]
- Task: [AD(img)] image-level anomaly detection, [AD(pixel)] pixel-level anomaly localization, [Seg], [Cls], [Det]
- Annotation: [Img-level], [Pix-level], [Box-level]
- Precision Type: [FP32], [FP16], [Mixed(FP16/32)]
- Units/Conventions:
  - Params in millions (M), VRAM in GB, FPS as single-GPU throughput
  - Input Size as WxH (e.g., 256×256), clearly state batch size
- Reporting protocol (must state in Notes or README):
  - Per-class vs overall averaging, image-level vs pixel-level metrics
  - Dataset split (official/paper split), input resolution, post-processing
- Link priority: Official site > Official GitHub/author page > Public mirror

## Domain-specific Catalog

### Press

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Representative Model | Image AUC | Image AP | Pixel AUC | Pixel AP | Pixel PRO | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | -------------------- | --------- | -------- | --------- | -------- | --------- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -                    | -         | -        | -         | -        | -         | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

### Body/Welding

| Name    | Domain       | Modality            | Defect Type | Task    | Annotation | Total  | Normal      | Defect      | Representative Model | Image AUC | Image AP | Pixel AUC | Pixel AP | Pixel PRO | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License         | Link                                          | Paper/Page                                                                                                                                                                                                                                            |
| ------- | ------------ | ------------------- | ----------- | ------- | ---------- | ------ | ----------- | ----------- | -------------------- | --------- | -------- | --------- | -------- | --------- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | --------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RIAWELC | Weld (X-ray) | Gray (Radiographic) | LP, PO, CR  | AD, Cls | Img-level  | 24,407 | 이미지 개수 | 이미지 개수 | -                    | -         | -        | -         | -        | -         | -          | -          | -          | -         | -               | -                | -        | -              | 2022 | Freely released | [GitHub](https://github.com/stefyste/RIAWELC) | [1] [ICMECE 2022](https://www.researchgate.net/publication/369294451_RIAWELC_A_Novel_Dataset_of_Radiographic_Images_for_Automatic_Weld_Defects_Classification) <br> [2] [Manufacturing Letters (Elsevier)](https://doi.org/10.1016/j.mfglet.2022.100) |

### Painting

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Representative Model | Image AUC | Image AP | Pixel AUC | Pixel AP | Pixel PRO | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | -------------------- | --------- | -------- | --------- | -------- | --------- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -                    | -         | -        | -         | -        | -         | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

### Assembly

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Representative Model | Image AUC | Image AP | Pixel AUC | Pixel AP | Pixel PRO | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | -------------------- | --------- | -------- | --------- | -------- | --------- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -                    | -         | -        | -         | -        | -         | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

## Related Repos/Resources

- Benchmarks/Leaderboards: Refer to each dataset's official page and paper

## License

Metadata in this repository welcomes open contributions. The copyright/license of each dataset follows its respective provider.
