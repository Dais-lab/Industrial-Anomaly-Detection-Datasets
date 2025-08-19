# Industrial Anomaly Detection Datasets

This repository systematically organizes popular datasets for research and benchmarking, with a primary focus on Anomaly Detection in the industrial vision domain.

- "The main focus is on images from automotive manufacturing processes."

## Table of Contents

- [Scope](#scope)
- [Quick Contribution Guide](#quick-contribution-guide)
- [Tag/Notation Rules](#tagnotation-rules)
- [Core Benchmarks](#core-benchmarks)
  - [2D RGB](#2d-rgb)
  - [3D/Multimodal](#3dmultimodal)
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
| Name         | Domain | Modality | Task | Annotation | Total | Normal | Defect | Year | License | Link | Paper/Page |
| ------------ | ------ | -------- | ---- | ---------- | ----- | ------ | ------ | ---- | ------- | ---- | ---------- |
| (Please add) |        |          |      |            |       |        |        |      |         |      |            |
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

## Core Benchmarks

### 2D RGB

| Name               | Domain        | Modality | Task    | Annotation | Total | Normal | Defect | Year | License  | Link       | Paper/Page |
| ------------------ | ------------- | -------- | ------- | ---------- | ----- | ------ | ------ | ---- | -------- | ---------- | ---------- |
| (Example) MVTec AD | General/Multi | RGB      | AD, Seg | Img/Pix    | 5k+   | -      | -      | 2019 | Research | [Official] | [Paper]    |
| (Please add)       |               |          |         |            |       |        |        |      |          |            |            |

### 3D/Multimodal

| Name                  | Domain        | Modality  | Task    | Annotation | Total | Normal | Defect | Year | License  | Link       | Paper/Page |
| --------------------- | ------------- | --------- | ------- | ---------- | ----- | ------ | ------ | ---- | -------- | ---------- | ---------- |
| (Example) MVTec 3D-AD | General/Multi | 3D, Depth | AD, Seg | Img/Pix    | -     | -      | -      | 2021 | Research | [Official] | [Paper]    |
| (Please add)          |               |           |         |            |       |        |        |      |          |            |            |

## Domain-specific Catalog

### Surface/Metal

| Name                         | Modality | Task    | Annotation | Total | Normal | Defect | Year | License | Link       | Paper/Page |
| ---------------------------- | -------- | ------- | ---------- | ----- | ------ | ------ | ---- | ------- | ---------- | ---------- |
| (Example) NEU Surface Defect | RGB      | AD, Cls | Img        | -     | -      | -      | 2013 | -       | [Official] | [Paper]    |
| (Please add)                 |          |         |            |       |        |        |      |         |            |            |

## Related Repos/Resources

- Benchmarks/Leaderboards: Refer to each dataset's official page and paper

## License

Metadata in this repository welcomes open contributions. The copyright/license of each dataset follows its respective provider.
