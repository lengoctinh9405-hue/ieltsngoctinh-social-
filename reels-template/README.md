# Mẫu Reels Fanpage – IELTS Ngọc Tỉnh (Remotion 4.0.529)

Video dọc 1080×1920, khoảng 30 giây, theo nhận diện navy #003D82 + cam.
- `ReelTuVung`: hook → 5 cụm từ (nghĩa + ví dụ) → CTA.
- `ReelNangBand`: hook → 3 câu Band 5 → Band 7+ (tô cam cụm nâng điểm) → CTA. Dùng được cho Writing lẫn Speaking (đặt `cta` riêng).
- `ReelQuiz`: hook → 3 câu "Chọn đáp án đúng" (A/B/C, đếm ngược 3 giây, hiện đáp án + giải thích) → CTA. Hợp nhạc upbeat cho Reel Chủ nhật.
Mọi loại đều nhận `cta?: [dòng1, dòng2]` tuỳ chọn (chỉ dùng lời kêu gọi lưu bài / theo dõi page / comment).
Dữ liệu từng Reel nằm cuối `src/ReelsFanpage/ReelsFanpage.tsx`; mỗi Reel là một Composition trong `src/Root.tsx`.

Render (trong container cloud):
    npm ci || npm install
    HS=$(find /opt/pw-browsers -name headless_shell -type f | head -1)
    npx remotion render src/index.ts <CompositionId> out/x.mp4 --browser-executable=$HS --concurrency=2

Nhạc: Pixabay (không bắt buộc credit). Hiệu ứng: Pixabay 382717 + pop tự tạo.
