# Industrial Anomaly Detection Datasets

This repository systematically organizes popular datasets for research and benchmarking, with a primary focus on Anomaly Detection in the industrial vision domain.

- "The main focus is on images from automotive manufacturing processes."

## Table of Contents

- [Scope](#scope)
- [Quick Contribution Guide](#quick-contribution-guide)
- [Tag/Notation Rules](#tagnotation-rules)
- [Core Benchmarks](#core-benchmarks)
- [Domain-specific Catalog](#domain-specific-catalog)
  - [Surface/Metal](#surfacemetal)
- [Related Repos/Resources](#related-reposresources)
- [License](#license)

## Scope

- Focused on visual datasets in the context of industrial inspection/quality control
- Modalities: Includes image/RGB, grayscale, video, 3D (depth/point cloud), and multimodal
- Tasks: Anomaly Detection (AD), Segmentation, Classification, Detection, etc. (mainly AD)

## Quick Contribution Guide

1. Make sure the dataset is publicly available (download link or application process).
2. Add a row to the appropriate section using the table template below.
3. Prefer official pages/author distribution sites for links whenever possible.
4. Indicate the license/usage terms if specified.

Table row template for adding new datasets (copy and fill in the values):

```markdown
| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Model | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | ----- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -     | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |
```

Field Guide :

- Name: Official dataset name
- Domain: Surface/metal, PCB, textile, food, semiconductor, etc.
- Modality: RGB, Grayscale, Video, Depth, 3D, Multi, etc.
- Task: AD, Seg, Cls, Det, etc.
- Annotation: Image-level/pixel-level/box-level, etc.
- Scale: Provide counts for total/normal/defect if possible
- License: MIT, CC-BY, research use, etc. (If unclear, write "Restricted/Contact required", etc.)

## Tag/Notation Rules

- Modality abbreviations: [RGB], [Gray], [Video], [Depth], [3D], [Multi]
- Task abbreviations: [AD], [Seg], [Cls], [Det]
- Annotation: [Img-level], [Pix-level], [Box-level]
- Link priority: Official site > Official GitHub/author page > Public mirror

## Domain-specific Catalog

### Press

#### Supervised Learning

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Model | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | ----- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -     | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

#### Unsupervised Learning

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Model | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | ----- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -     | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

### Body/Welding

#### Supervised Learning

| Name    | Domain       | Modality            | Defect Type | Task    | Annotation | Total  | Normal      | Defect      | Model | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License         | Link                                          | Paper/Page                                                                                                                                                                                                                                            |
| ------- | ------------ | ------------------- | ----------- | ------- | ---------- | ------ | ----------- | ----------- | ----- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | --------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RIAWELC | Weld (X-ray) | Gray (Radiographic) | LP, PO, CR  | AD, Cls | Img-level  | 24,407 | 6000 | 18707 | -     | -          | -          | -          | -         | -               | -                | -        | -              | 2022 | Freely released | [GitHub](https://github.com/stefyste/RIAWELC) | [1] [ICMECE 2022](https://www.researchgate.net/publication/369294451_RIAWELC_A_Novel_Dataset_of_Radiographic_Images_for_Automatic_Weld_Defects_Classification) <br> [2] [Manufacturing Letters (Elsevier)](https://www.researchgate.net/publication/366209086_Welding_Defects_Classification_Through_a_Convolutional_Neural_Network) |


#### Unsupervised Learning

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Model | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | ----- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -     | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

### Painting

#### Supervised Learning

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Model | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | ----- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -     | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

#### Unsupervised Learning

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Model | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | ----- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -     | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

### Assembly

#### Supervised Learning

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Model | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | ----- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -     | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

#### Unsupervised Learning

| Name | Domain | Modality | Defect Type | Task | Annotation | Total | Normal | Defect | Model | Params (M) | Input Size | Batch Size | VRAM (GB) | Inference (FPS) | Train time/epoch | Hardware | Precision Type | Year | License | Link | Paper/Page |
| ---- | ------ | -------- | ----------- | ---- | ---------- | ----- | ------ | ------ | ----- | ---------- | ---------- | ---------- | --------- | --------------- | ---------------- | -------- | -------------- | ---- | ------- | ---- | ---------- |
| -    | -      | -        | -           | -    | -          | -     | -      | -      | -     | -          | -          | -          | -         | -               | -                | -        | -              | -    | -       | -    | -          |

## Related Repos/Resources

- Benchmarks/Leaderboards: Refer to each dataset's official page and paper

## License

Metadata in this repository welcomes open contributions. The copyright/license of each dataset follows its respective provider.
