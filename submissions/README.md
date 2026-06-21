# submissions/

웹앱의 **"데이터셋 추가" 폼 → "GitHub에 PR로 제출"** 로 들어오는 데이터셋 파일이 모이는 폴더입니다.
파일 하나 = 데이터셋 하나 (`<이름>.json`).

## 흐름
1. 기여자가 사이트에서 폼 작성 → "GitHub에 PR로 제출" → 이 폴더에 `*.json` 새 파일로 **PR** 생성
2. 관리자가 PR 검토 → 병합(merge)
3. 관리자가 재빌드:
   ```bash
   python3 convert.py          # submissions/*.json 을 읽어 web/data.js 에 병합
   python3 build_standalone.py # (선택) 단일 파일 갱신
   ```
4. 배포 갱신 → 사이트에 반영

## 규칙
- `Name` 은 필수. 기존 데이터셋과 **이름이 중복되면 병합 시 자동으로 건너뜁니다.**
- 멀티값(산업 분야·태스크 등)은 JSON 배열, 숫자는 정수, isImage 등은 true/false 로 저장됩니다(폼이 자동 처리).
- 병합 후 정본(`web/data.js`)에 반영되면, 원하면 이 폴더의 처리된 파일은 정리해도 됩니다(선택).
