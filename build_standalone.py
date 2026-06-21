#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
web/ 의 index.html + styles.css + data.js + app.js 를 하나로 합쳐
'단일 HTML 파일'(standalone.html)을 생성한다. 파일 하나만 보내도 그대로 열림.

사용: python3 build_standalone.py   (먼저 convert.py 로 data.js 최신화 권장)
"""
import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(ROOT, "web")
OUT = os.path.join(ROOT, "standalone.html")

def read(name):
    with open(os.path.join(WEB, name), encoding="utf-8") as f:
        return f.read()

def safe_js(s):
    # 인라인 <script> 조기 종료/escaped 상태 진입 방지 (대소문자 무관, 닫는 꺾쇠 유무 무관)
    s = re.sub(r"<(/script)", r"<\\\1", s, flags=re.IGNORECASE)  # </script... -> <\/script...
    s = s.replace("<!--", "<\\!--")
    return s

html = read("index.html")
css = read("styles.css")
data_js = read("data.js")
app_js = read("app.js")

# <link rel="stylesheet" href="styles.css" /> -> <style>
html = re.sub(r'<link[^>]+href="styles\.css"[^>]*/?>',
              "<style>\n" + css + "\n</style>", html, count=1)

# <script src="data.js"></script> -> 인라인
html = html.replace('<script src="data.js"></script>',
                    "<script>\n" + safe_js(data_js) + "\n</script>", 1)

# <script src="app.js"></script> -> 인라인
html = html.replace('<script src="app.js"></script>',
                    "<script>\n" + safe_js(app_js) + "\n</script>", 1)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)

print(f"OK -> {OUT}  ({os.path.getsize(OUT)//1024} KB, 단일 파일)")
