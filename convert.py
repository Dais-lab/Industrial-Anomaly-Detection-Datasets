#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Notion CSV -> web/data.js 변환기

노션에서 내보낸 'Datasets DB' CSV를 웹앱이 바로 쓸 수 있는 JSON으로 정제한다.
 - 멀티값 셀(콤마 구분)을 배열로 분리
 - 숫자 셀의 천단위 콤마 제거 후 정수 파싱
 - 알려진 오타 정규화 (Mulit-Classification -> Multi-Classification)
 - 불리언성 컬럼(isImage 등)을 true/false 로 변환
 - description(노션 페이지 본문) 필드 자리를 비워둠 → 추후 채울 수 있음

산출물은 file:// 로 바로 열어도 동작하도록 data.js (window.DATASETS) 로 저장.
"""
import csv, json, glob, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
# 데이터 정본 CSV 위치 후보 (위에서부터 먼저 찾는 것을 사용)
SRC_CANDIDATES = [
    os.path.join(ROOT, "data-source", "*.csv"),                       # 레포 표준 위치
    os.path.join(ROOT, "개인 페이지 & 공유된 페이지", "Datasets DB *.csv"),  # 로컬 노션 내보내기
]
OUT = os.path.join(ROOT, "web", "data.js")

# 콤마로 여러 값이 들어오는(멀티 셀렉트) 컬럼
MULTI = {
    "AI based Defect Type", "Annotation Format", "Annotation Level",
    "Image Modality", "Material Domain", "Process Domain", "Task",
    "Defect Category", "Industry Domain", "Model DB",
}
# 정수로 파싱할 컬럼 (천단위 콤마 제거)
NUMERIC = {
    "AI based defect types count", "Abnormal", "Normal", "Class",
    "Total", "Year",
}
# 불리언으로 변환할 컬럼: (참값 토큰)
BOOLEAN = {
    "isImage": "isImage",
    "isDownloadable": "Downloadable",
    "isAutomotive": "isAutomotive",
}
# 값 정규화(오타 등)
NORMALIZE = {
    "Mulit-Classification": "Multi-Classification",
}

def norm(v):
    v = v.strip()
    return NORMALIZE.get(v, v)

def parse_num(v):
    v = v.replace(",", "").strip()
    if not v:
        return None
    m = re.search(r"-?\d+", v)
    return int(m.group()) if m else None

def coerce(col, val):
    """submission JSON 값을 data.js 스키마에 맞게 정규화 (배열/숫자/불리언/문자 모두 허용)"""
    if col in MULTI:
        if isinstance(val, list):
            items = val
        elif val in (None, ""):
            items = []
        else:
            items = [p.strip() for p in str(val).split(",") if p.strip()]
        return [norm(str(x)) for x in items if str(x).strip()]
    if col in NUMERIC:
        if isinstance(val, bool) or val in (None, ""):
            return None
        if isinstance(val, int):
            return val
        return parse_num(str(val))
    if col in BOOLEAN:
        if isinstance(val, bool):
            return val
        if val in (None, ""):
            return None
        return str(val).strip() == BOOLEAN[col]
    return norm(str(val)) if val not in (None, "") else ""

def merge_submissions(cols, existing):
    """submissions/*.json 을 읽어 정규화된 레코드 리스트를 반환. 중복(Name)·파싱오류는 건너뜀."""
    sub_dir = os.path.join(ROOT, "submissions")
    if not os.path.isdir(sub_dir):
        return []
    added = []
    for p in sorted(glob.glob(os.path.join(sub_dir, "*.json"))):
        try:
            with open(p, encoding="utf-8") as f:
                rec = json.load(f)
        except Exception as e:
            print(f"  건너뜀(파싱 실패): {os.path.basename(p)} — {e}")
            continue
        name = (rec.get("Name") or "").strip()
        if not name or name in existing:
            print(f"  건너뜀(이름 없음/중복): {os.path.basename(p)}")
            continue
        norm_rec = {c: coerce(c, rec.get(c)) for c in cols}
        desc = rec.get("description")
        norm_rec["description"] = desc.strip() if isinstance(desc, str) else ""
        added.append(norm_rec)
        existing.add(name)
    if added:
        print(f"  + submissions {len(added)}건 병합")
    return added

def main():
    matches = []
    for pat in SRC_CANDIDATES:
        matches = sorted(glob.glob(pat))
        if matches:
            break
    if not matches:
        sys.exit("CSV를 찾을 수 없습니다. 후보 경로: " + " | ".join(SRC_CANDIDATES))
    src = matches[0]
    with open(src, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    cols = list(rows[0].keys())
    out = []
    for row in rows:
        rec = {}
        for k, raw in row.items():
            raw = (raw or "").strip()
            if k in BOOLEAN:
                token = BOOLEAN[k]
                rec[k] = (raw == token) if raw else None
            elif k in NUMERIC:
                rec[k] = parse_num(raw)
            elif k in MULTI:
                rec[k] = [norm(p) for p in raw.split(",") if p.strip()] if raw else []
            else:
                rec[k] = norm(raw) if raw else ""
        rec["description"] = ""  # 노션 페이지 본문 자리 (추후 채움)
        out.append(rec)

    # submissions/*.json (웹 폼의 'GitHub PR 제출'로 들어온 데이터) 병합
    out += merge_submissions(cols, {r["Name"] for r in out})

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    payload = json.dumps(out, ensure_ascii=False, indent=1)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("// 자동 생성 파일 — convert.py 로 재생성. 직접 수정 금지.\n")
        f.write(f"window.DATASETS = {payload};\n")
        f.write(f"window.DATASETS_META = {{ count: {len(out)}, source: {json.dumps(os.path.basename(src))} }};\n")

    print(f"OK: {len(out)}개 데이터셋 -> {OUT}")

if __name__ == "__main__":
    main()
