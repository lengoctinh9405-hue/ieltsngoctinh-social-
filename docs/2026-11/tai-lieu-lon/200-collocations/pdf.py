from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome"); pg=b.new_page()
    pg.goto("file://"+os.path.abspath("collocations.html")); pg.wait_for_timeout(500)
    # overflow check
    print(pg.evaluate("""[...document.querySelectorAll('.page')].map((s,i)=>{const f=s.querySelector('.foot');const kids=[...s.children].filter(c=>!c.classList.contains('foot')&&!c.classList.contains('band')&&!c.classList.contains('band2'));const last=Math.max(...kids.map(k=>k.getBoundingClientRect().bottom));return f? (i+1)+':'+Math.round(f.getBoundingClientRect().top-last):'c'})"""))
    pg.pdf(path="out.pdf",format="A4",print_background=True,prefer_css_page_size=True); b.close()
