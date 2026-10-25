# Mẫu Reels Fanpage – IELTS Ngọc Tỉnh (Remotion 4.0.529)

Video dọc 1080×1920, khoảng 30 giây, theo nhận diện navy #003D82 + cam.
- `ReelTuVung`: hook → 5 cụm từ (nghĩa + ví dụ) → CTA.
- `ReelNangBand`: hook → 3 câu Band 5 → Band 7+ (tô cam cụm nâng điểm) → CTA. Dùng được cho Writing lẫn Speaking (đặt `cta` riêng).
- `ReelQuiz`: hook → 3 câu "Chọn đáp án đúng" (A/B/C, đếm ngược 3 giây, hiện đáp án + giải thích) → CTA. Hợp nhạc upbeat cho Reel Chủ nhật.
- `ReelSaiDung`: hook → 4 câu "Sai hay đúng?" (2,2 giây cho người xem đoán, rồi gạch câu sai, hiện câu đúng tô cam + giải thích 💡) → CTA. Hợp Reel Speaking lỗi hay gặp.
`ReelNangBand` nhận thêm `nhanTruoc` / `nhanSau` tuỳ chọn để đổi nhãn thẻ (mặc định "BAND 5" → "BAND 7+"), dùng khi làm Reel theo level: Mind Solid "BAND 4.5" → "BAND 6", Mind Boost "BAND 5.5" → "BAND 7", Mind Master "BAND 6.5" → "BAND 8".
Mọi loại đều nhận `cta?: [dòng1, dòng2]` tuỳ chọn (chỉ dùng lời kêu gọi lưu bài / theo dõi page / comment).
Dữ liệu từng Reel nằm cuối `src/ReelsFanpage/ReelsFanpage.tsx`; mỗi Reel là một Composition trong `src/Root.tsx`.

Render (trong container cloud):
    npm ci || npm install
    HS=$(find /opt/pw-browsers \( -name headless_shell -o -name chrome-headless-shell \) -type f | head -1)   # bản mới tên là chrome-headless-shell
    npx remotion render src/index.ts <CompositionId> out/x.mp4 --browser-executable=$HS --concurrency=2

Nhạc nền (trường `nhac`, đường dẫn tính từ `public/audio/`). ĐỔI BÀI MỖI REEL, không dùng cùng một bài 2 Reel liền nhau:
- `nhac-goc/nang-som.mp3`: marimba pop tươi sáng, 118 bpm (hợp Reel từ vựng)
- `nhac-goc/dao-pho.mp3`: guitar mộc + tambourine vui, 112 bpm (hợp Speaking, đời sống)
- `nhac-goc/groove.mp3`: funk nhẹ, bass slap + kèn, 104 bpm (hợp Reel nâng band Writing)
- `nhac-goc/quiz-time.mp3`: 8-bit vui nhộn, 128 bpm (hợp quiz Chủ nhật)
- `ikoliks-upbeat-energetic-background-music-426530.mp3`: Pixabay, upbeat (quiz / Chủ nhật)
- `fassounds-lofi-...112191.mp3`: lofi chậm, CHỈ dùng khi thật cần không khí yên tĩnh.
Nhạc trong `nhac-goc/` do Claude tự sáng tác bằng code (`music-gen/gen.py`, render FluidSynth + soundfont FluidR3_GM giấy phép MIT), là nhạc gốc nên không cần credit.
Muốn thêm bài mới: thêm một SONG trong `music-gen/gen.py` (apt-get install fluidsynth fluid-soundfont-gm; pip install mido), render rồi chuẩn hoá về -12 LUFS như các bài đang có.
Hiệu ứng (sfx/): Pixabay 382717 (whoosh) + pop tự tạo. BẮT BUỘC: anh Tỉnh thích Reel có sound effect hơn chỉ có nhạc – mọi Reel giữ nhạc vui tươi + SFX khớp từng nhịp (whoosh chuyển cảnh, pop khi hiện đáp án/thẻ quan trọng). Loại Reel mới cũng phải gắn SFX như vậy; được thêm SFX mới (tick, ding, buzz…) tự tạo hoặc từ Pixabay.
