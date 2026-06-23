/* ===========================================================
 * 산업 결함 데이터셋 DB — 클라이언트 사이드 필터/검색/정렬 앱
 * 의존성 없음(vanilla JS). data.js 의 window.DATASETS 를 사용.
 * =========================================================== */
"use strict";

const DATA = (window.DATASETS || []).map((d, i) => ({ ...d, _id: i }));

/* 사이드바 패싯 (배열형 멀티값 컬럼) — 라벨은 한국어 */
/* 사이드바 패싯 — 대표 테이블 컬럼 순서를 앞에 두고, 나머지 필터를 뒤에 */
const ALL_FACETS = [
  { key: "Industry Domain",      label: "산업 분야" },
  { key: "Process Domain",       label: "공정" },
  { key: "Defect Category",      label: "결함 범주" },
  { key: "AI based Defect Type", label: "결함 유형" },
  { key: "Image Modality",       label: "이미지 모달리티" },
  { key: "License",              label: "라이선스" },
  { key: "Task",                 label: "태스크" },
  { key: "Material Domain",      label: "소재" },
  { key: "Annotation Format",    label: "어노테이션 형식" },
  { key: "Annotation Level",     label: "어노테이션 레벨" },
  { key: "Data Source Type",     label: "데이터 생성 방식" },
  { key: "Dimension",            label: "차원" },
];

const BOOL_FILTERS = [
  { key: "isImage",        label: "이미지" },
  { key: "isDownloadable", label: "다운로드" },
  { key: "isAutomotive",   label: "자동차" },
];

const SORTS = [
  { key: "Total",                       label: "총 데이터 수", num: true },
  { key: "Year",                        label: "연도",         num: true },
  { key: "AI based defect types count", label: "결함 종류 수", num: true },
  { key: "Class",                       label: "클래스 수",    num: true },
  { key: "Name",                        label: "이름",         num: false },
  { key: "Last edited time",            label: "최종 수정",    num: false },
];

/* 표 컬럼 */
const COLUMNS = [
  { key: "Name",                 label: "이름",      type: "name",  w: "20%" },
  { key: "Industry Domain",      label: "산업 분야",  type: "chips", w: "10%" },
  { key: "Process Domain",       label: "공정",      type: "chips", w: "13%" },
  { key: "Defect Category",      label: "결함 범주",  type: "chips", w: "10%" },
  { key: "AI based Defect Type", label: "결함 유형",  type: "chips", w: "15%" },
  { key: "Image Modality",       label: "모달리티",   type: "chips", w: "7%" },
  { key: "Total",                label: "총 데이터 수", type: "num",  w: "8%" },
  { key: "Year",                 label: "연도",      type: "year",  w: "5%" },
  { key: "License",              label: "라이선스",   type: "text",  w: "12%" },
];

/* ---------------- 상태 ---------------- */
const state = {
  q: "",
  facets: {},                 // {key: Set(values)}
  bools: {},                  // {key: true|false}  (없으면 전체)
  sortKey: "Total",
  sortDir: -1,                // -1 내림차순, 1 오름차순
  view: "table",
  desktopView: "table",       // 데스크톱(넓은 화면)에서 사용자가 선택한 뷰 — 넓어질 때 복원
  showAll: {},                // {facetKey: bool} — 옵션 더보기
};
ALL_FACETS.forEach(f => (state.facets[f.key] = new Set()));

/* 검색 인덱스 문자열 */
DATA.forEach(d => {
  d._search = [
    d.Name,
    ...(d["AI based Defect Type"] || []),
    ...(d["Material Domain"] || []),
    ...(d["Industry Domain"] || []),
    ...(d["Task"] || []),
  ].join(" ").toLowerCase();
});

/* ---------------- 유틸 ---------------- */
const $ = sel => document.querySelector(sel);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const asArray = v => Array.isArray(v) ? v : (v === "" || v == null ? [] : [v]);
const fmtNum = n => (n == null ? "—" : n.toLocaleString("en-US"));

/* 한 레코드가 주어진 필터 집합을 통과하는지. exceptFacet 은 패싯 카운트 계산용. */
function passes(d, { exceptFacet = null } = {}) {
  if (state.q && !d._search.includes(state.q)) return false;
  for (const b of BOOL_FILTERS) {
    if (b.key in state.bools && d[b.key] !== state.bools[b.key]) return false;
  }
  for (const f of ALL_FACETS) {
    if (f.key === exceptFacet) continue;
    const sel = state.facets[f.key];
    if (sel.size === 0) continue;
    const vals = asArray(d[f.key]);
    if (!vals.some(v => sel.has(v))) return false;
  }
  return true;
}

function filtered() {
  const arr = DATA.filter(d => passes(d));
  const s = SORTS.find(s => s.key === state.sortKey);
  arr.sort((a, b) => {
    let av = a[state.sortKey], bv = b[state.sortKey];
    if (s && s.num) { av = av == null ? -Infinity : av; bv = bv == null ? -Infinity : bv; return (av - bv) * state.sortDir; }
    av = (av || "").toString(); bv = (bv || "").toString();
    return av.localeCompare(bv) * state.sortDir;
  });
  return arr;
}

/* ---------------- 렌더: 사이드바 ---------------- */
function buildBoolFilters() {
  const wrap = $("#bool-filters"); wrap.innerHTML = "";
  BOOL_FILTERS.forEach(b => {
    const g = el("div", "tristate");
    g.appendChild(el("span", null, b.label));
    [["전체", null], ["예", true], ["아니오", false]].forEach(([txt, val]) => {
      const btn = el("button", null, txt);
      const cur = (b.key in state.bools) ? state.bools[b.key] : null;
      if (cur === val) btn.classList.add("on");
      btn.onclick = () => {
        if (val === null) delete state.bools[b.key]; else state.bools[b.key] = val;
        render();
      };
      g.appendChild(btn);
    });
    wrap.appendChild(g);
  });
}

function facetCounts(facetKey) {
  const counts = new Map();
  for (const d of DATA) {
    if (!passes(d, { exceptFacet: facetKey })) continue;
    for (const v of asArray(d[facetKey])) counts.set(v, (counts.get(v) || 0) + 1);
  }
  return counts;
}

function buildFacets() {
  const root = $("#facets"); root.innerHTML = "";
  ALL_FACETS.forEach((f, idx) => {
    const counts = facetCounts(f.key);
    const sel = state.facets[f.key];
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    // 선택된 값이 카운트0이어도 보이도록 보강
    sel.forEach(v => { if (!counts.has(v)) entries.push([v, 0]); });

    const det = el("details", "facet");
    if (idx < 4 || sel.size) det.open = true;
    const sum = el("summary");
    sum.appendChild(el("span", null, f.label + (sel.size ? ` · ${sel.size}` : "")));
    sum.appendChild(el("span", "chev", "▸"));
    det.appendChild(sum);

    const opts = el("div", "opts");
    const limit = state.showAll[f.key] ? entries.length : 8;
    entries.slice(0, limit).forEach(([val, n]) => {
      const lab = el("label", "opt" + (n === 0 && !sel.has(val) ? " zero" : ""));
      const cb = el("input"); cb.type = "checkbox"; cb.checked = sel.has(val);
      cb.onchange = () => { cb.checked ? sel.add(val) : sel.delete(val); render(); };
      lab.appendChild(cb);
      lab.appendChild(el("span", null, val));
      lab.appendChild(el("span", "oc", String(n)));
      opts.appendChild(lab);
    });
    if (entries.length > 8) {
      const more = el("button", "more", state.showAll[f.key] ? "접기" : `+ ${entries.length - 8}개 더보기`);
      more.onclick = e => { e.preventDefault(); state.showAll[f.key] = !state.showAll[f.key]; render(); };
      opts.appendChild(more);
    }
    det.appendChild(opts);
    root.appendChild(det);
  });
}

/* ---------------- 렌더: 활성 필터 칩 ---------------- */
function buildActiveFilters() {
  const wrap = $("#active-filters"); wrap.replaceChildren();
  // 값(v)은 textContent 로만 삽입 — innerHTML 미사용(XSS 방지)
  const chip = (label, valText, onclear) => {
    const c = el("span", "afilter");
    c.appendChild(el("b", null, label + ":"));
    c.appendChild(document.createTextNode(" " + valText + " ✕"));
    c.onclick = onclear;
    wrap.appendChild(c);
  };
  ALL_FACETS.forEach(f => state.facets[f.key].forEach(v =>
    chip(f.label, v, () => { state.facets[f.key].delete(v); render(); })));
  BOOL_FILTERS.forEach(b => {
    if (!(b.key in state.bools)) return;
    chip(b.label, state.bools[b.key] ? "예" : "아니오", () => { delete state.bools[b.key]; render(); });
  });
}

/* ---------------- 렌더: 결과 ---------------- */
function chipList(vals, dim, max) {
  const box = el("div", "cell-chips");
  const arr = asArray(vals);
  const shown = (max && arr.length > max) ? arr.slice(0, max) : arr;
  shown.forEach(v => box.appendChild(el("span", "chip" + (dim ? " dim" : ""), v)));
  if (max && arr.length > max) box.appendChild(el("span", "chip more", "+" + (arr.length - max)));
  if (!box.children.length) box.appendChild(el("span", "chip dim", "—"));
  return box;
}

function renderTable(rows) {
  const wrap = el("div", "table-wrap");
  const table = el("table");
  const thead = el("thead"); const trh = el("tr");
  COLUMNS.forEach(c => {
    const th = el("th", null, c.label);
    if (c.w) th.style.width = c.w;
    if (c.type === "num" || c.type === "year") th.style.textAlign = "right";  // 숫자 헤더는 값과 같이 우측 정렬
    trh.appendChild(th);
  });
  thead.appendChild(trh); table.appendChild(thead);
  const tb = el("tbody");
  rows.forEach(d => {
    const tr = el("tr");
    tr.onclick = () => openModal(d);
    COLUMNS.forEach(c => {
      const td = el("td");
      if (c.type === "name") { td.className = "name"; td.appendChild(el("span", "ds-name", d.Name)); }
      else if (c.type === "num") { td.className = "num"; td.textContent = fmtNum(d[c.key]); }
      else if (c.type === "year") { td.className = "num"; td.textContent = d[c.key] == null ? "—" : String(d[c.key]); }
      else if (c.type === "chips") td.appendChild(chipList(d[c.key], false, 3));
      else td.textContent = d[c.key] || "—";
      tr.appendChild(td);
    });
    tb.appendChild(tr);
  });
  table.appendChild(tb); wrap.appendChild(table);
  return wrap;
}

function renderCards(rows) {
  const grid = el("div", "cards");
  rows.forEach(d => {
    const card = el("div", "card");
    card.onclick = () => openModal(d);
    card.appendChild(el("h3", null, d.Name));
    card.appendChild(el("div", "meta", [d["Data Source Type"], d.Dimension, d.Year].filter(Boolean).join(" · ")));
    const r1 = el("div", "row"); asArray(d["Industry Domain"]).forEach(v => r1.appendChild(el("span", "chip", v))); card.appendChild(r1);
    const r2 = el("div", "row"); asArray(d.Task).forEach(v => r2.appendChild(el("span", "chip dim", v))); card.appendChild(r2);
    const st = el("div", "stat");
    [["총", d.Total], ["정상", d.Normal], ["비정상", d.Abnormal]].forEach(([lab, n]) => {
      const s = el("span"); s.appendChild(document.createTextNode(lab + " ")); s.appendChild(el("b", null, fmtNum(n))); st.appendChild(s);
    });
    card.appendChild(st);
    grid.appendChild(card);
  });
  return grid;
}

/* ---------------- 렌더: 통계 ---------------- */
function renderStats(rows) {
  const host = $("#stats");
  if (host.classList.contains("hidden")) return;
  host.innerHTML = "";
  const dims = [
    { key: "Industry Domain", label: "산업 분야 분포" },
    { key: "Task",            label: "태스크 분포" },
    { key: "Defect Category", label: "결함 범주 분포" },
    { key: "Image Modality",  label: "모달리티 분포" },
  ];
  dims.forEach(dm => {
    const counts = new Map();
    rows.forEach(d => asArray(d[dm.key]).forEach(v => counts.set(v, (counts.get(v) || 0) + 1)));
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    const max = Math.max(1, ...entries.map(e => e[1]));
    const card = el("div", "stat-card");
    card.appendChild(el("h3", null, dm.label));
    entries.forEach(([val, n]) => {
      const row = el("div", "bar-row");
      row.appendChild(el("div", "lbl", val));
      const track = el("div", "bar-track"); const fill = el("div", "bar-fill");
      fill.style.width = (n / max * 100) + "%"; track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el("div", "val", String(n)));
      card.appendChild(row);
    });
    host.appendChild(card);
  });
}

/* ---------------- 모달 ---------------- */
/* 상단 핵심 지표 타일 */
const STAT_TILES = [
  { key: "Total",                       label: "총 데이터" },
  { key: "Abnormal",                    label: "비정상" },
  { key: "Normal",                      label: "정상" },
  { key: "Class",                       label: "클래스 수" },
  { key: "AI based defect types count", label: "결함 종류 수" },
];
/* 그룹별 상세 섹션 */
const DETAIL_GROUPS = [
  { title: "분류 체계", fields: ["Industry Domain", "Defect Category", "Task", "Material Domain", "Process Domain", "AI based Defect Type"] },
  { title: "데이터 형식", fields: ["Dimension", "Image Modality", "Annotation Format", "Annotation Level", "Data Source Type"] },
  { title: "메타데이터", fields: ["Year", "License", "isImage", "isDownloadable", "isAutomotive", "Automotive process", "Created time", "Last edited time"] },
];
const FIELD_LABELS = {
  "AI based Defect Type": "결함 유형", "AI based defect types count": "결함 종류 수",
  "Class": "클래스 수", "Total": "총 데이터", "Normal": "정상", "Abnormal": "비정상",
  "Data Source Type": "데이터 생성 방식", "Defect Category": "결함 범주", "Dimension": "차원",
  "Image Modality": "이미지 모달리티", "Industry Domain": "산업 분야", "Material Domain": "소재",
  "Process Domain": "공정", "Annotation Format": "어노테이션 형식", "Annotation Level": "어노테이션 레벨",
  "Task": "태스크", "Year": "연도", "License": "라이선스", "isImage": "이미지 여부",
  "isDownloadable": "다운로드 가능", "isAutomotive": "자동차 관련", "Automotive process": "자동차 공정",
  "Created time": "생성일", "Last edited time": "최종 수정",
};
function fmtVal(v) {
  if (Array.isArray(v)) return v.length ? v : "—";
  if (typeof v === "boolean") return v ? "예" : "아니오";
  if (typeof v === "number") return v.toLocaleString("en-US");
  return v || "—";
}
/* Link 필드에서 URL을 모두 추출 + 앞 라벨로 종류 판별 (한 셀에 데이터셋/논문 등 여러 링크 대응) */
/* 용어 통일: 논문 계열 → "논문 URL", 그 외(다운로드·원본·repo 등) → "데이터셋 URL" */
function linkLabel(ctx) {
  const t = (ctx || "").toLowerCase();
  if (/(paper|논문|arxiv|ieee|doi|stamp|article)/.test(t)) return "논문 URL";
  return "데이터셋 URL";
}
function parseLinks(raw) {
  raw = (raw || "").trim();
  if (!raw) return [];
  const re = /https?:\/\/[^\s,]+/g;
  const found = []; let m, last = 0;
  while ((m = re.exec(raw))) {
    found.push({ url: m[0].replace(/[).,;]+$/, ""), ctx: raw.slice(last, m.index) });
    last = re.lastIndex;
  }
  return found.map(o => ({ url: o.url, label: linkLabel(o.ctx) }));
}
function openModal(d) {
  const panel = $("#modal-panel");
  panel.innerHTML = "";
  const scroll = el("div", "modal-scroll");   // 내부 스크롤 영역(둥근 모서리 밖으로 스크롤바 안 나오게)

  // 헤더
  const head = el("div", "modal-head");
  const hl = el("div");
  hl.appendChild(el("h2", null, d.Name));
  hl.appendChild(el("div", "meta", [d["Data Source Type"], d.Dimension, d.Year].filter(Boolean).join("  ·  ")));
  head.appendChild(hl);
  const close = el("button", "modal-close", "✕"); close.onclick = closeModal;
  head.appendChild(close);
  scroll.appendChild(head);

  if (d.description) scroll.appendChild(el("div", "modal-desc", d.description));

  // 핵심 지표 타일
  const tiles = el("div", "stat-tiles");
  STAT_TILES.forEach(t => {
    const tile = el("div", "stat-tile");
    tile.appendChild(el("div", "st-val", fmtNum(d[t.key])));
    tile.appendChild(el("div", "st-lbl", t.label));
    tiles.appendChild(tile);
  });
  scroll.appendChild(tiles);

  // 그룹 섹션
  DETAIL_GROUPS.forEach(g => {
    const sec = el("section", "modal-section");
    sec.appendChild(el("h4", "ms-title", g.title));
    const dl = el("dl", "dl");
    g.fields.forEach(k => {
      const val = (k === "Year") ? (d[k] == null ? "—" : String(d[k])) : fmtVal(d[k]);  // 연도는 콤마 없이
      dl.appendChild(el("dt", null, FIELD_LABELS[k] || k));
      const dd = el("dd");
      if (Array.isArray(val)) val.forEach(v => dd.appendChild(el("span", "chip", v)));
      else dd.textContent = val;
      dl.appendChild(dd);
    });
    sec.appendChild(dl);
    scroll.appendChild(sec);
  });

  const links = parseLinks(d.Link);
  if (links.length) {
    const lw = el("div", "modal-links");
    links.forEach(l => {
      const a = el("a", "modal-link", l.label + " ↗");
      a.href = l.url; a.target = "_blank"; a.rel = "noopener";
      lw.appendChild(a);
    });
    scroll.appendChild(lw);
  }
  panel.appendChild(scroll);
  $("#modal").classList.remove("hidden");
}
function closeModal() { $("#modal").classList.add("hidden"); }

/* ================= 데이터셋 추가 폼 (관리자 입력 + GitHub PR 제출) ================= */
const GITHUB = {
  owner: "Dais-lab",
  repo: "Industrial-Anomaly-Detection-Datasets",
  branch: "main",
  dir: "submissions",    // PR로 제출되는 폴더 (convert.py 가 이 폴더를 읽어 병합)
};

/* 폼 필드 정의 */
const FORM_FIELDS = [
  { key: "Name", label: "이름", type: "text", required: true },
  { key: "Link", label: "원본 링크(URL)", type: "url" },
  { key: "Industry Domain", label: "산업 분야", type: "multi" },
  { key: "Defect Category", label: "결함 범주", type: "multi" },
  { key: "Task", label: "태스크", type: "multi" },
  { key: "Material Domain", label: "소재", type: "multi" },
  { key: "Process Domain", label: "공정", type: "multi" },
  { key: "AI based Defect Type", label: "결함 유형", type: "multi" },
  { key: "Image Modality", label: "이미지 모달리티", type: "multi" },
  { key: "Annotation Format", label: "어노테이션 형식", type: "multi" },
  { key: "Annotation Level", label: "어노테이션 레벨", type: "multi" },
  { key: "Data Source Type", label: "데이터 출처", type: "select" },
  { key: "Dimension", label: "차원", type: "select" },
  { key: "License", label: "라이선스", type: "select" },
  { key: "Total", label: "총 이미지 수", type: "number" },
  { key: "Normal", label: "정상", type: "number" },
  { key: "Abnormal", label: "비정상", type: "number" },
  { key: "Class", label: "클래스 수", type: "number" },
  { key: "AI based defect types count", label: "결함 종류 수", type: "number" },
  { key: "Year", label: "연도", type: "number" },
  { key: "isImage", label: "이미지 여부", type: "bool", def: true },
  { key: "isDownloadable", label: "다운로드 가능", type: "bool", def: true },
  { key: "isAutomotive", label: "자동차 관련", type: "bool", def: false },
  { key: "Automotive process", label: "자동차 공정", type: "text" },
  { key: "description", label: "설명(본문)", type: "textarea" },
];
const MULTI_KEYS = new Set(FORM_FIELDS.filter(f => f.type === "multi").map(f => f.key));

function allValues(key) {
  const s = new Set();
  DATA.forEach(d => asArray(d[key]).forEach(v => s.add(v)));
  return [...s].sort((a, b) => a.localeCompare(b));
}
function slugify(name) {
  return (name || "dataset").trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "") || "dataset";
}

function buildAddForm() {
  const panel = $("#add-panel");
  panel.innerHTML = "";
  const scroll = el("div", "modal-scroll");   // 내부 스크롤(폼이 길어도 끝까지 스크롤 가능)

  const head = el("div", "modal-head");
  const hl = el("div");
  hl.appendChild(el("h2", null, "데이터셋 추가"));
  hl.appendChild(el("div", "meta", "입력 후 미리보기로 확인하거나 GitHub에 PR로 제출하세요"));
  head.appendChild(hl);
  const close = el("button", "modal-close", "✕"); close.onclick = closeAddModal;
  head.appendChild(close);
  scroll.appendChild(head);

  scroll.appendChild(el("div", "add-note",
    "제출하면 GitHub에 새 파일(PR)로 올라가고, 관리자가 검토·병합한 뒤 재빌드하면 사이트에 반영됩니다. " +
    "여기서의 ‘미리보기 추가’는 이 브라우저 세션에서만 보입니다(저장 아님)."));

  const grid = el("div", "form-grid");
  FORM_FIELDS.forEach(f => {
    const field = el("div", "field" + (f.type === "textarea" ? " wide" : ""));
    const lab = el("label", null, f.label + (f.required ? " *" : ""));
    field.appendChild(lab);

    if (f.type === "number") {
      const inp = el("input"); inp.type = "number"; inp.dataset.field = f.key; field.appendChild(inp);
    } else if (f.type === "textarea") {
      const ta = el("textarea"); ta.dataset.field = f.key; ta.rows = 3; field.appendChild(ta);
    } else if (f.type === "bool") {
      const sel = el("select"); sel.dataset.field = f.key;
      [["예", "true"], ["아니오", "false"]].forEach(([t, v]) => { const o = el("option", null, t); o.value = v; if ((v === "true") === !!f.def) o.selected = true; sel.appendChild(o); });
      field.appendChild(sel);
    } else if (f.type === "select" || f.type === "multi") {
      const inp = el("input"); inp.type = "text"; inp.dataset.field = f.key;
      inp.setAttribute("autocomplete", "off");
      if (f.type === "multi") inp.placeholder = "쉼표로 구분 (여러 개 가능)";
      // 자동완성 datalist
      const dlId = "dl-" + f.key.replace(/[^a-z]/gi, "");
      const dl = el("datalist"); dl.id = dlId;
      allValues(f.key).forEach(v => { const o = el("option"); o.value = v; dl.appendChild(o); });
      inp.setAttribute("list", dlId);
      field.appendChild(inp); field.appendChild(dl);
      // 멀티: 기존 값 칩 클릭으로 추가
      if (f.type === "multi") {
        const sugg = el("div", "sugg");
        allValues(f.key).slice(0, 12).forEach(v => {
          const c = el("button", "sugg-chip", v); c.type = "button";
          c.onclick = () => {
            const cur = inp.value.split(",").map(s => s.trim()).filter(Boolean);
            if (!cur.includes(v)) cur.push(v);
            inp.value = cur.join(", ");
          };
          sugg.appendChild(c);
        });
        field.appendChild(sugg);
      }
    } else {
      const inp = el("input"); inp.type = f.type === "url" ? "url" : "text"; inp.dataset.field = f.key; field.appendChild(inp);
    }
    grid.appendChild(field);
  });
  scroll.appendChild(grid);

  const actions = el("div", "add-actions");
  const bPrev = el("button", "ghost", "미리보기에 추가"); bPrev.onclick = onPreviewAdd;
  const bRec = el("button", "ghost", "레코드 JSON 내려받기"); bRec.onclick = onDownloadRecord;
  const bData = el("button", "ghost", "전체 data.js 내려받기"); bData.onclick = onDownloadDataJs;
  const bPR = el("button", "modal-link", "GitHub에 PR로 제출 ↗"); bPR.onclick = onSubmitGitHub; bPR.style.marginTop = "0";
  actions.append(bPrev, bRec, bData, bPR);
  scroll.appendChild(actions);

  scroll.appendChild(el("div", "add-status"));
  panel.appendChild(scroll);
}

function collectAddForm() {
  const rec = {};
  let nameErr = false;
  FORM_FIELDS.forEach(f => {
    const node = $(`#add-panel [data-field="${f.key}"]`);
    let v = node ? node.value : "";
    if (f.type === "multi") rec[f.key] = v.split(",").map(s => s.trim()).filter(Boolean);
    else if (f.type === "number") { v = v.replace(/,/g, "").trim(); rec[f.key] = v === "" ? null : (parseInt(v, 10) || 0); }
    else if (f.type === "bool") rec[f.key] = v === "true";
    else rec[f.key] = (v || "").trim();
  });
  if (!rec.Name) nameErr = true;
  // data.js 스키마 정합성 보강
  rec["Model DB"] = []; rec["in-lab"] = ""; rec["Created time"] = ""; rec["Last edited time"] = "";
  return { rec, nameErr };
}
function cleanRecord(d) {
  const o = {}; Object.keys(d).forEach(k => { if (!k.startsWith("_")) o[k] = d[k]; });
  return o;
}
function setStatus(msg, ok) {
  const s = $("#add-panel .add-status"); if (!s) return;
  s.textContent = msg; s.className = "add-status " + (ok ? "ok" : "warn");
}
function download(filename, text, mime) {
  const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  URL.revokeObjectURL(a.href);
}

function onPreviewAdd() {
  const { rec, nameErr } = collectAddForm();
  if (nameErr) return setStatus("‘이름’은 필수입니다.", false);
  rec._id = DATA.length; rec._added = true;
  rec._search = [rec.Name, ...(rec["AI based Defect Type"] || []), ...(rec["Material Domain"] || []), ...(rec["Industry Domain"] || []), ...(rec["Task"] || [])].join(" ").toLowerCase();
  DATA.push(rec);
  render();
  setStatus(`‘${rec.Name}’ 미리보기 추가됨 (세션 전용). 닫고 이름으로 검색해 확인하세요.`, true);
}
function onDownloadRecord() {
  const { rec, nameErr } = collectAddForm();
  if (nameErr) return setStatus("‘이름’은 필수입니다.", false);
  download(slugify(rec.Name) + ".json", JSON.stringify(cleanRecord(rec), null, 2), "application/json");
  setStatus("레코드 JSON 내려받음 → submissions/ 폴더에 넣고 커밋하면 됩니다.", true);
}
function onDownloadDataJs() {
  const { rec, nameErr } = collectAddForm();
  if (nameErr) return setStatus("‘이름’은 필수입니다.", false);
  const list = DATA.map(cleanRecord);
  if (!DATA.some(d => d._added && d.Name === rec.Name)) list.push(cleanRecord(rec));
  const out = "// 자동 생성 파일 — convert.py 로 재생성. 직접 수정 금지.\n" +
    "window.DATASETS = " + JSON.stringify(list, null, 1) + ";\n" +
    "window.DATASETS_META = { count: " + list.length + ", source: \"manual-export\" };\n";
  download("data.js", out, "text/javascript;charset=utf-8");
  setStatus("전체 data.js 내려받음 → web/data.js 를 교체 후 커밋하면 즉시 반영됩니다.", true);
}
function onSubmitGitHub() {
  const { rec, nameErr } = collectAddForm();
  if (nameErr) return setStatus("‘이름’은 필수입니다.", false);
  if (GITHUB.owner === "YOUR-ORG" || GITHUB.repo === "YOUR-REPO") {
    return setStatus("먼저 app.js 상단 GITHUB 설정(owner/repo)을 연구실 저장소 정보로 수정하세요.", false);
  }
  const filename = `${GITHUB.dir}/${slugify(rec.Name)}.json`;
  const value = encodeURIComponent(JSON.stringify(cleanRecord(rec), null, 2));
  const url = `https://github.com/${GITHUB.owner}/${GITHUB.repo}/new/${GITHUB.branch}?filename=${encodeURIComponent(filename)}&value=${value}`;
  window.open(url, "_blank", "noopener");
  setStatus("GitHub 새 파일 작성 화면을 열었습니다. 하단에서 ‘Propose new file’ → PR 생성하세요.", true);
}
function openAddModal() { buildAddForm(); $("#add-modal").classList.remove("hidden"); }
function closeAddModal() { $("#add-modal").classList.add("hidden"); }

/* ---------------- 메인 렌더 ---------------- */
function render() {
  buildBoolFilters();
  buildFacets();
  buildActiveFilters();
  const rows = filtered();
  $("#count-badge").textContent = `${rows.length} / ${DATA.length}`;
  $("#result-info").textContent = `${rows.length}개 데이터셋`;

  const host = $("#results"); host.innerHTML = "";
  if (!rows.length) {
    host.appendChild(el("div", "empty", "조건에 맞는 데이터셋이 없습니다. 필터를 조정해 보세요."));
  } else {
    host.appendChild(state.view === "table" ? renderTable(rows) : renderCards(rows));
  }
  renderStats(rows);
}

/* ---------------- CSV 내보내기 ---------------- */
function exportCSV() {
  const rows = filtered();
  const cols = ["Name", ...ALL_FACETS.map(f => f.key), "Total", "Normal", "Abnormal", "Year", "Link"];
  const esc = s => { s = (s == null ? "" : Array.isArray(s) ? s.join("; ") : String(s)); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const lines = [cols.join(",")];
  rows.forEach(d => lines.push(cols.map(c => esc(d[c])).join(",")));
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `datasets_filtered_${rows.length}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ---------------- 이벤트 바인딩 ---------------- */
function init() {
  // 정렬 옵션
  const sortSel = $("#sort");
  SORTS.forEach(s => { const o = el("option", null, s.label); o.value = s.key; sortSel.appendChild(o); });
  sortSel.value = state.sortKey;
  sortSel.onchange = () => { state.sortKey = sortSel.value; render(); };
  $("#sort-dir").onclick = () => { state.sortDir *= -1; $("#sort-dir").textContent = state.sortDir < 0 ? "↓" : "↑"; render(); };

  // 검색 (디바운스)
  let t;
  $("#search").oninput = e => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim().toLowerCase(); render(); }, 120); };

  // 반응형 뷰: 좁은 화면(≤920px)=카드 강제, 넓어지면 데스크톱 선택(기본 표)으로 자동 복귀
  const narrowMQ = matchMedia("(max-width: 920px)");
  const syncToggle = () => document.querySelectorAll(".view-toggle button")
    .forEach(b => b.classList.toggle("active", b.dataset.view === state.view));
  function applyResponsiveView(doRender) {
    const want = narrowMQ.matches ? "card" : state.desktopView;
    if (state.view !== want) { state.view = want; syncToggle(); if (doRender) render(); }
  }
  // 뷰 토글 (좁은 화면에선 숨겨져 데스크톱에서만 클릭됨 → 그 선택을 기억)
  document.querySelectorAll(".view-toggle button").forEach(btn => {
    btn.onclick = () => {
      state.view = btn.dataset.view;
      if (!narrowMQ.matches) state.desktopView = state.view;
      syncToggle(); render();
    };
  });
  narrowMQ.addEventListener("change", () => applyResponsiveView(true));
  applyResponsiveView(false);  // 초기 상태 세팅(아래 최초 render가 반영)

  // 초기화
  $("#btn-reset").onclick = () => {
    state.q = ""; $("#search").value = "";
    ALL_FACETS.forEach(f => state.facets[f.key].clear());
    state.bools = {}; state.showAll = {};
    render();
  };

  // 통계 토글
  $("#btn-stats").onclick = () => { $("#stats").classList.toggle("hidden"); $("#btn-stats").textContent = $("#stats").classList.contains("hidden") ? "통계 ▾" : "통계 ▴"; render(); };

  // 내보내기
  $("#btn-export").onclick = exportCSV;

  // 테마
  const applyTheme = th => { document.documentElement.setAttribute("data-theme", th); try { localStorage.setItem("ddb-theme", th); } catch (e) {} };
  let theme = "light";
  try { theme = localStorage.getItem("ddb-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch (e) {}
  applyTheme(theme);
  $("#btn-theme").onclick = () => applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");

  // 데이터셋 추가 폼
  $("#btn-add").onclick = openAddModal;
  $("#add-modal").addEventListener("click", e => { if (e.target.dataset.closeAdd !== undefined) closeAddModal(); });

  // 모달 닫기
  $("#modal").addEventListener("click", e => { if (e.target.dataset.close !== undefined) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeAddModal(); } });

  // Liquid Glass 굴절: SVG displacement-as-backdrop 는 Chromium 만 지원 → 그때만 활성화
  const isChromium = !!(navigator.userAgentData && navigator.userAgentData.brands &&
    navigator.userAgentData.brands.some(b => /Chromium/i.test(b.brand)));
  const reduceTransparency = matchMedia("(prefers-reduced-transparency: reduce)").matches;
  if (isChromium && !reduceTransparency) document.documentElement.classList.add("refraction");

  // 포인터 추종 스페큘러 하이라이트 (카드)
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $("#results").addEventListener("pointermove", e => {
      const card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    });
  }

  render();
}

init();
