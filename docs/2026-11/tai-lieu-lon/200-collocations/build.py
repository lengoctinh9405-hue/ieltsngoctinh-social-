import re, html, data
T = data.T
PROMPTS = [
"Some people think schools should focus on academic subjects, while others believe practical skills are more important. Discuss both views and give your opinion.",
"Young people today spend too much time on their phones. What problems does this cause, and what can be done about it?",
"Some people say individuals can do little to protect the environment and only governments can make a real difference. To what extent do you agree or disagree?",
"Obesity is increasing in many countries. What are the causes of this problem, and what measures can be taken to solve it?",
"More and more young people change jobs frequently. Is this a positive or negative development?",
"Some people believe prison is the best way to reduce crime, while others think education and job training are more effective. Discuss both views and give your opinion.",
"Advertising aimed at children should be banned. To what extent do you agree or disagree?",
"Globalisation is causing many countries to lose their cultural identity. To what extent do you agree or disagree?",
"Traffic congestion is a serious problem in many big cities. What are the causes, and what solutions can you suggest?",
"Governments should spend more on social welfare than on large infrastructure projects. To what extent do you agree or disagree?",
]
LOGO = lambda s,bg="#003D82": f'<svg width="{s}" height="{s}" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="{bg}"/><rect x="7" y="8" width="26" height="7" rx="3.5" fill="#FB8F2C"/><rect x="16.5" y="15" width="7" height="18" rx="3.5" fill="#FB8F2C"/></svg>'
def hl(s, cls="b"):
    s = html.escape(s, quote=False)
    return re.sub(r"\[(.+?)\]", rf'<b class="{cls}">\1</b>', s)
CSS = open("style.css").read()
pages = []
pn = [0]
def page(tag, body, foot="200 Collocations Writing Task 2"):
    pn[0] += 1
    pages.append(f'''<section class="page"><div class="top"><div class="brand">{LOGO(22)}IELTS Ngọc Tỉnh</div><div class="tag">{tag}</div></div>{body}
<div class="foot"><span><b>IELTS Ngọc Tỉnh</b> · {foot}</span><span>{pn[0]}</span></div></section>''')

# cover
pn[0] = 1
pages.append(f'''<section class="page cover"><div class="band"></div><div class="band2"></div><div class="inner">
<div class="brand" style="color:#fff">{LOGO(34,"#fff")}<span style="font-size:13pt">IELTS Ngọc Tỉnh</span></div>
<div class="series">IELTS Writing Task 2 · Bộ tài liệu tra cứu</div>
<h1><span class="o">200</span><br>COLLOCATIONS<br><span class="sm">theo <span class="o">10 chủ đề</span> hay gặp nhất</span></h1>
<div class="sub">Mỗi cụm từ có nghĩa tiếng Việt và câu ví dụ đúng văn phong Writing. Mỗi chủ đề kèm lỗi collocation người Việt hay mắc, một đoạn văn mẫu và bài tự luyện.</div>
<div class="pill">Dành cho Band 5.0 → 7.0+</div>
<div class="toc"><div><b>200</b>cụm từ có ví dụ</div><div><b>40</b>lỗi collocation hay gặp</div><div><b>10</b>đoạn văn mẫu Task 2</div><div><b>40</b>câu tự luyện + đáp án</div></div>
<div class="bottom"><span>ielts-ngoctinh.com</span><span>Sincere • Simple • Smart</span></div></div></section>''')

# how to use + contents
rows = "".join(f'<div class="ci"><span class="cn">{t["code"]}</span><span class="ct"><b>{t["en"]}</b><i>{t["vi"]}</i></span><span class="cp">trang {3+2*k}–{4+2*k}</span></div>' for k,t in enumerate(T))
page("CÁCH DÙNG", f'''<div class="kicker">Đọc trước khi bắt đầu</div><h2>Học collocation đúng cách</h2>
<p class="lead">Collocation là những từ <b>“hay đi với nhau”</b> trong tiếng Anh. Giám khảo IELTS đánh giá rất cao việc dùng collocation <b>chính xác và tự nhiên</b>. Một collocation đúng có giá trị hơn ba từ “khủng” dùng sai.</p>
<div class="steps">
<div class="step"><div class="num"><span>1</span><i></i></div><div class="body"><h3>Học theo cụm, không học từng từ</h3><p>Chép cả cụm và câu ví dụ, ví dụ <b>tackle climate change</b>, đừng chỉ chép <b>tackle</b>. Cụm có <span class="star">★</span> là cụm nâng cao, phù hợp khi bạn nhắm band 7+.</p></div></div>
<div class="step"><div class="num"><span>2</span><i></i></div><div class="body"><h3>Xem kỹ phần “Đừng viết”</h3><p>Mỗi chủ đề có 4 lỗi collocation người Việt hay mắc do dịch từng chữ. Sửa được các lỗi này là cách nhanh nhất để bài viết bớt “mùi tiếng Việt”.</p></div></div>
<div class="step"><div class="num"><span>3</span><i></i></div><div class="body"><h3>Đọc đoạn văn mẫu, rồi tự luyện</h3><p>Đoạn văn mẫu cho thấy các cụm từ được dùng trong lập luận thật. Làm 4 câu tự luyện cuối mỗi chủ đề, đáp án ở trang cuối.</p></div></div>
</div>
<h3 style="margin:2mm 0 3mm">Mục lục 10 chủ đề</h3><div class="contents">{rows}</div>''')

for k,t in enumerate(T):
    trs = "".join(f'<tr><td class="n">{i+1:02d}</td><td class="c">{html.escape(c)}{" <span class=star>★</span>" if s else ""}</td><td class="v">{html.escape(v)}</td><td class="e">{hl(e)}</td></tr>' for i,(c,s,v,e) in enumerate(t["items"]))
    page(f'CHỦ ĐỀ {t["code"]} · 20 CỤM', f'''<div class="kicker">Chủ đề {t["code"]} / 10</div><h2 class="th">{t["en"]} <span>· {t["vi"]}</span></h2>
<table class="ct"><thead><tr><th>#</th><th>Collocation</th><th>Nghĩa</th><th>Ví dụ Writing</th></tr></thead><tbody>{trs}</tbody></table>''', f'Chủ đề {t["code"]} · {t["en"]}')
    errs = "".join(f'<div class="err"><div class="x"><span>✗</span>{html.escape(a)}</div><div class="ok"><span>✓</span>{html.escape(b)}</div><div class="why">{html.escape(w)}</div></div>' for a,b,w in t["errs"])
    prac = "".join(f'<div class="q"><span class="n">{i+1}</span><span class="s">{html.escape(q).replace("______","<u>&nbsp;</u>")}</span></div>' for i,(q,a) in enumerate(t["prac"]))
    page(f'CHỦ ĐỀ {t["code"]} · LUYỆN', f'''<div class="kicker">Chủ đề {t["code"]} · {t["en"]}</div><h2>Đừng viết – Hãy viết</h2>
<div class="errs">{errs}</div>
<h3 class="sec">Đoạn văn mẫu <small>(các cụm tô cam lấy từ bảng 20 cụm)</small></h3>
<div class="para">{hl(t["para"],"o")}</div>
<h3 class="sec">Tự luyện <small>· điền một từ vào chỗ trống, đáp án ở trang cuối</small></h3>
<div class="qs">{prac}</div>
<h3 class="sec" style="margin-top:4.5mm">Đề thử sức <small>· viết 1 đoạn thân bài, dùng ít nhất 4 cụm từ của chủ đề này</small></h3>
<div class="prompt">{html.escape(PROMPTS[k])}</div><div class="lines">{'<i></i>'*4}</div>''', f'Chủ đề {t["code"]} · {t["en"]}')

ans = "".join(f'<div class="ab"><div class="ah">{t["code"]} · {t["en"]}</div>' + "".join(f'<div class="ar"><b>{i+1}</b>{html.escape(a)}</div>' for i,(q,a) in enumerate(t["prac"])) + '</div>' for t in T)
page("ĐÁP ÁN", f'''<div class="kicker">Tự chấm điểm</div><h2>Đáp án 40 câu tự luyện</h2>
<div class="ans">{ans}</div>
<div class="note" style="margin-top:5mm"><div class="ic">!</div><div><b>Cách ôn hiệu quả:</b> mỗi ngày chọn 1 chủ đề, viết lại đoạn văn mẫu bằng lời của bạn và dùng ít nhất <b>5 cụm từ</b> trong bảng. Sau 10 ngày bạn đã đi hết 200 cụm.</div></div>
<div class="cta">{LOGO(46,"#fff")}<div><div class="big">Tài liệu miễn phí từ <span>IELTS Ngọc Tỉnh</span></div><p>Dạy kiến thức, không dạy mẹo · Theo dõi để nhận các bộ tài liệu tiếp theo · ielts-ngoctinh.com</p></div></div>''')

open("collocations.html","w").write(f'<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>200 Collocations Writing Task 2 | IELTS Ngọc Tỉnh</title><style>{CSS}</style></head><body>{"".join(pages)}</body></html>')
print(len(pages),"pages")
