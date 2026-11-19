import json, sys, os, base64
from playwright.sync_api import sync_playwright
TL='/tmp/claude-0/tl'; OUT=sys.argv[1]
D=json.load(open('/tmp/claude-0/tlgen/data.json'))
CSS=open('/tmp/claude-0/sq/base.css').read()
LOGO='<span class="l"><svg width="50" height="50" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#fff"/><rect x="7" y="8" width="26" height="7" rx="3.5" fill="#FB8F2C"/><rect x="16.5" y="15" width="7" height="18" rx="3.5" fill="#FB8F2C"/></svg>IELTS Ngọc Tỉnh</span><span class="r">Sincere • Simple • Smart</span>'
def img(p): return 'file://'+p
def wrap(body,extra=''): return f'<html><head><meta charset="utf-8"><style>{CSS}{extra}</style></head><body>{body}<div class="f">{LOGO}</div></body></html>'
def hook(d):
    g=''.join(f'<div><b>{n}</b>{t}</div>' for n,t in d['stats'])
    return wrap(f'''<div class="c"></div><div class="w"><div class="k">{d["kicker"]}</div><h1>{d["h1"]}</h1><p>{d["p"]}</p><div class="g">{g}</div></div>''',
    '.w{position:absolute;left:80px;right:80px;top:48%;transform:translateY(-50%)}h1{font-weight:900;font-size:80px;line-height:1.07;margin-top:22px}h1 span{color:#FB8F2C}p{font-size:32px;line-height:1.42;color:#DCE6F4;margin-top:26px;font-weight:600}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:40px}.g div{background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.16);border-radius:20px;padding:16px 18px;font-size:22px;line-height:1.25;color:#E6EDF7}.g b{display:block;font-size:46px;color:#FB8F2C;font-weight:900;white-space:nowrap}')
def page(d,pg):
    li=''.join(f'<li>{x}</li>' for x in pg['li'])
    return wrap(f'''<div class="lc"><div class="k">{pg["k"]}</div><h2>{pg["h"]}</h2><ul>{li}</ul></div><img class="im" src="{img(f"{TL}/{d['id']}-p-{pg['p']}.png")}">''',
    '.lc{position:absolute;left:80px;top:0;bottom:150px;width:330px;display:flex;flex-direction:column;justify-content:center}.lc h2{font-size:44px;font-weight:900;line-height:1.12;margin-top:16px}.lc h2 span{color:#FB8F2C}.lc ul{list-style:none;padding:0;margin-top:30px}.lc li{font-size:25px;line-height:1.35;color:#DCE6F4;font-weight:600;margin-bottom:18px;padding-left:34px;position:relative}.lc li:before{content:"";position:absolute;left:0;top:12px;width:16px;height:16px;border-radius:50%;background:#FB8F2C}.im{position:absolute;right:56px;top:70px;height:810px;border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,.35)}')
def cta(d):
    n=d['pages']; th=''.join(f'<img src="{img(f"{TL}/{d["id"]}-p-{i}.png")}">' for i in range(1,n+1))
    return wrap(f'''<div class="t"><div class="k">TRỌN BỘ {n} TRANG PDF · MIỄN PHÍ</div><h2>Comment <span>“{d["kw"]}”</span><br>để nhận file qua inbox</h2></div><div class="th">{th}</div>''',
    '.t{position:absolute;left:80px;right:80px;top:70px}.t h2{font-size:58px;font-weight:900;line-height:1.12;margin-top:14px}.t h2 span{color:#FB8F2C}.th{position:absolute;left:80px;right:80px;top:300px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.th img{width:100%;border-radius:6px;box-shadow:0 10px 26px rgba(0,0,0,.35)}')
os.makedirs(OUT,exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1080,'height':1080})
    for d in D:
        htmls=[hook(d),page(d,d['pg'][0]),page(d,d['pg'][1]),cta(d)]
        for i,h in enumerate(htmls,1):
            f=f'/tmp/claude-0/tlgen/{d["id"]}-{i}.html'; open(f,'w').write(h)
            pg.goto('file://'+f); pg.wait_for_timeout(300)
            pg.screenshot(path=f'{OUT}/{d["slug"]}-{i}.png')
    b.close()
