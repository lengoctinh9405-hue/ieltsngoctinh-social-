import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Nạp font Be Vietnam Pro từ public/fonts (đủ dấu tiếng Việt).
export const FONT = "'Be Vietnam Pro', sans-serif";

const WEIGHTS: [string, number][] = [
  ["Regular", 400],
  ["Medium", 500],
  ["SemiBold", 600],
  ["Bold", 700],
  ["ExtraBold", 800],
  ["Black", 900],
];

if (typeof window !== "undefined" && "FontFace" in window) {
  const handle = delayRender("Đang tải font Be Vietnam Pro");
  Promise.all(
    WEIGHTS.map(([ten, weight]) => {
      const face = new FontFace(
        "Be Vietnam Pro",
        `url('${staticFile(`fonts/BeVietnamPro-${ten}.ttf`)}') format('truetype')`,
        { weight: String(weight) },
      );
      return face.load().then((f) => {
        document.fonts.add(f);
      });
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
}
