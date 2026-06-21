# Industrial Anomaly Detection Datasets

자동차 부품 제조 특화 이미지 결함탐지 AI모델 학습을 위한 **데이터셋 분류체계**  
*Data Taxonomy for Automotive-Parts Manufacturing Defect-Detection AI*

> **🔗 Live site:** https://dais-lab.github.io/Industrial-Anomaly-Detection-Datasets/

산업 비전 결함/이상탐지(Anomaly Detection) 데이터셋을 체계적으로 정리·검색하는 인터랙티브 카탈로그.  
University of Ulsan · Data analytics and intelligent Systems · **DaiS Lab**.

## 기능

- 컬럼별 패싯 필터(산업 분야·태스크·결함 범주·모달리티·소재·어노테이션·공정·출처·차원·라이선스), 멀티선택 + 카운트
- 텍스트 검색 / 정렬 / 표·카드 뷰 / 상세 모달 / 통계 분포 / 필터 결과 CSV 내보내기
- **데이터셋 추가 폼** + GitHub PR 제출 (아래 *Contributing*)

## 구조

```
.
├─ web/                 # 사이트 (GitHub Pages 배포 대상) — index.html / styles.css / app.js / data.js
├─ data-source/         # 데이터 정본 CSV (Notion DB 내보내기)
├─ submissions/         # 폼 'PR 제출'이 모이는 곳 (<이름>.json)
├─ dataset-cards/       # 데이터셋별 상세·모델 벤치마크 카드 (예: MVTec AD)
├─ convert.py           # CSV + submissions/*.json → web/data.js 생성
├─ build_standalone.py  # 단일 파일(standalone.html) 빌드
├─ standalone.html      # 의존성 없는 단일 HTML (파일 하나로 공유 가능)
├─ docs/                # legacy-catalog-README.md (이전 마크다운 카탈로그 보존)
└─ .github/             # CODEOWNERS · PR 템플릿 · Pages 배포 워크플로
```

## 🤝 Contributing (데이터셋 추가)

1. 사이트 우상단 **"+ 데이터셋 추가"** → 폼 작성 → **"GitHub에 PR로 제출"**
   - `submissions/<이름>.json` 새 파일을 만드는 PR이 생성됩니다(협력자가 아니면 자동 fork→PR).
2. **연구실 멤버(Code Owner) 검토 → 머지**
3. 머지되면 Pages 워크플로가 `convert.py`(submissions 병합)를 돌려 **사이트가 자동 갱신**됩니다.

> 즉 *누구나 제출 가능, 반영은 멤버 승인 후*. (`main` 은 브랜치 보호로 PR·승인 필수)

## 📄 License / Data

각 데이터셋의 라이선스는 카탈로그의 *License* 항목 참조. 데이터셋 원본 권리는 각 제공처에 있습니다.
