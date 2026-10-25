import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT } from "../ReviewHocVien/fonts";

// ===== Reels Fanpage – video chữ dọc 9:16 theo thương hiệu IELTS Ngọc Tỉnh =====
// Mỗi Reel chỉ cần sửa phần DỮ LIỆU (REEL_TU_VUNG_*, REEL_NANG_BAND_*) bên dưới.

export const FPS_REEL = 30;
const NAVY = "#003D82";
const NAVY_DARK = "#002A5C";
const CAM = "#FF9800";
const TRANG = "#FFFFFF";
const XAM = "#BFD0EA";
const DO = "#E5484D";

const HOOK = 3.5; // giây
const CTA = 4.5;
const VOCAB_S = 4.6;
const NANG_S = 7.8;

export type TuVung = { en: string; vi: string; vd: string };
export type NangBand = { b5: string; b7: string; hl: string[] };

export type ReelTuVungProps = {
  nhan: string;
  hook: string[];
  hookPhu: string;
  items: TuVung[];
  nhac: string;
  cta?: [string, string]; // tuỳ chọn: lời kêu gọi cảnh cuối (lưu bài / theo dõi / comment)
};
export type ReelNangBandProps = {
  nhan: string;
  hook: string[];
  hookPhu: string;
  items: NangBand[];
  nhac: string;
  cta?: [string, string];
  nhanTruoc?: string; // nhãn thẻ trên, mặc định "BAND 5" (ví dụ "BAND 4.5", "BAND 5.5", "BAND 6.5")
  nhanSau?: string; // nhãn thẻ dưới, mặc định "BAND 7+" (ví dụ "BAND 6", "BAND 7", "BAND 8")
};

export const tongKhungTuVung = (p: ReelTuVungProps) =>
  Math.round((HOOK + p.items.length * VOCAB_S + CTA) * FPS_REEL);
export const tongKhungNangBand = (p: ReelNangBandProps) =>
  Math.round((HOOK + p.items.length * NANG_S + CTA) * FPS_REEL);

// ---------- Nền và khung chung ----------
const Nen: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const dich = (f * 0.6) % 90;
  const tienDo = f / durationInFrames;
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(170deg, ${NAVY} 0%, ${NAVY_DARK} 100%)` }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `${dich}px ${dich}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: 350,
          right: -260,
          top: 1180 + Math.sin(f / 40) * 30,
          background: "radial-gradient(circle, rgba(255,152,0,0.22), rgba(255,152,0,0) 70%)",
        }}
      />
      <div style={{ position: "absolute", left: 0, top: 0, height: 14, width: `${tienDo * 100}%`, background: CAM }} />
    </AbsoluteFill>
  );
};

const DauTrang: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 90,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 18,
    }}
  >
    <div
      style={{
        width: 76,
        height: 76,
        borderRadius: 38,
        background: TRANG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img src={staticFile("images/5_icon_T.png")} style={{ width: 66, height: 66 }} />
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: TRANG }}>
      IELTS <span style={{ color: CAM }}>Ngọc Tỉnh</span>
    </div>
  </div>
);

const ChanTrang: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 230,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 30,
      color: XAM,
      letterSpacing: 1,
    }}
  >
    Sincere • Simple • Smart
  </div>
);

const Nhan: React.FC<{ text: string; mau?: string }> = ({ text, mau = CAM }) => (
  <div
    style={{
      display: "inline-block",
      background: mau,
      color: TRANG,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 34,
      padding: "12px 30px",
      borderRadius: 40,
      letterSpacing: 1,
    }}
  >
    {text}
  </div>
);

const vao = (f: number, fps: number, tre = 0) =>
  spring({ frame: f - tre, fps, config: { damping: 14, mass: 0.7 } });

// Tô cam các cụm cần nhấn mạnh trong câu
const ToSang: React.FC<{ text: string; hl: string[]; mau?: string }> = ({ text, hl, mau = CAM }) => {
  if (!hl.length) return <>{text}</>;
  const re = new RegExp(`(${hl.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((p, i) =>
        hl.some((h) => h.toLowerCase() === p.toLowerCase()) ? (
          <span key={i} style={{ color: mau, fontWeight: 800 }}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
};

// ---------- Cảnh mở đầu ----------
const CanhHook: React.FC<{ nhan: string; hook: string[]; phu: string }> = ({ nhan, hook, phu }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ padding: "0 80px", justifyContent: "center" }}>
      <div style={{ transform: `scale(${vao(f, fps)})`, transformOrigin: "left center" }}>
        <Nhan text={nhan} />
      </div>
      <div style={{ height: 40 }} />
      {hook.map((dong, i) => {
        const s = vao(f, fps, 6 + i * 6);
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 92,
              lineHeight: 1.12,
              color: i === hook.length - 1 ? CAM : TRANG,
              opacity: s,
              transform: `translateY(${(1 - s) * 60}px)`,
            }}
          >
            {dong}
          </div>
        );
      })}
      <div
        style={{
          marginTop: 40,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 42,
          lineHeight: 1.4,
          color: XAM,
          opacity: interpolate(f, [24, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {phu}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Cảnh từ vựng ----------
const CanhTuVung: React.FC<{ item: TuVung; so: number; tong: number }> = ({ item, so, tong }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = vao(f, fps);
  const b = vao(f, fps, 10);
  const c = vao(f, fps, 22);
  return (
    <AbsoluteFill style={{ padding: "0 80px", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: XAM, opacity: a }}>
        {String(so).padStart(2, "0")} / {String(tong).padStart(2, "0")}
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 96,
          lineHeight: 1.08,
          color: CAM,
          transform: `translateX(${(1 - a) * -80}px)`,
          opacity: a,
        }}
      >
        {item.en}
      </div>
      <div
        style={{
          marginTop: 26,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 50,
          color: TRANG,
          opacity: b,
          transform: `translateY(${(1 - b) * 30}px)`,
        }}
      >
        = {item.vi}
      </div>
      <div
        style={{
          marginTop: 60,
          background: TRANG,
          borderRadius: 36,
          padding: "40px 44px",
          opacity: c,
          transform: `translateY(${(1 - c) * 60}px)`,
          borderLeft: `16px solid ${CAM}`,
        }}
      >
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: CAM, marginBottom: 14 }}>
          VÍ DỤ
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 44, lineHeight: 1.45, color: NAVY }}>
          <ToSang text={item.vd} hl={[item.en.replace(/^to /, "")]} mau={NAVY} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Cảnh nâng band ----------
const TheCau: React.FC<{
  nhan: string;
  mauNhan: string;
  text: string;
  hl: string[];
  nen: string;
  chu: string;
  s: number;
  gach?: boolean;
}> = ({ nhan, mauNhan, text, hl, nen, chu, s, gach }) => (
  <div
    style={{
      background: nen,
      borderRadius: 36,
      padding: "36px 42px 42px",
      opacity: s,
      transform: `translateY(${(1 - s) * 70}px) scale(${0.94 + 0.06 * s})`,
    }}
  >
    <Nhan text={nhan} mau={mauNhan} />
    <div
      style={{
        marginTop: 24,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 50,
        lineHeight: 1.4,
        color: chu,
        textDecoration: gach ? `line-through ${DO} 5px` : "none",
      }}
    >
      <ToSang text={text} hl={hl} />
    </div>
  </div>
);

const CanhNangBand: React.FC<{ item: NangBand; so: number; tong: number; nhanTruoc?: string; nhanSau?: string }> = ({
  item,
  so,
  tong,
  nhanTruoc = "BAND 5",
  nhanSau = "BAND 7+",
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lucHienB7 = Math.round(2.6 * fps);
  const a = vao(f, fps);
  const b = vao(f, fps, lucHienB7);
  const gach = f > lucHienB7 - 10;
  return (
    <AbsoluteFill style={{ padding: "0 70px", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: XAM, marginBottom: 30, opacity: a }}>
        CÂU {so} / {tong}
      </div>
      <TheCau
        nhan={nhanTruoc}
        mauNhan={DO}
        text={item.b5}
        hl={[]}
        nen="rgba(255,255,255,0.10)"
        chu={TRANG}
        s={a}
        gach={gach}
      />
      <div
        style={{
          textAlign: "center",
          fontSize: 70,
          color: CAM,
          fontWeight: 900,
          fontFamily: FONT,
          margin: "14px 0",
          opacity: b,
        }}
      >
        ↓
      </div>
      <TheCau nhan={nhanSau} mauNhan={CAM} text={item.b7} hl={item.hl} nen={TRANG} chu={NAVY} s={b} />
    </AbsoluteFill>
  );
};

// ---------- Cảnh kêu gọi ----------
const CanhCTA: React.FC<{ dong1: string; dong2: string }> = ({ dong1, dong2 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = vao(f, fps);
  const b = vao(f, fps, 12);
  return (
    <AbsoluteFill style={{ padding: "0 80px", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          background: TRANG,
          borderRadius: 48,
          padding: "60px 70px",
          transform: `scale(${a})`,
        }}
      >
        <Img src={staticFile("images/3_logo_doc_day_du.png")} style={{ width: 400 }} />
      </div>
      <div
        style={{
          marginTop: 60,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 60,
          lineHeight: 1.25,
          color: TRANG,
          opacity: b,
          transform: `translateY(${(1 - b) * 40}px)`,
        }}
      >
        {dong1}
      </div>
      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 42,
          lineHeight: 1.4,
          color: CAM,
          opacity: b,
        }}
      >
        {dong2}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Âm thanh ----------
const NhacNen: React.FC<{ file: string }> = ({ file }) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <Audio
      src={staticFile(`audio/${file}`)}
      volume={(f) =>
        interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 0.32, 0.32, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};
const Pop: React.FC = () => <Audio src={staticFile("audio/sfx/claude-pop.mp3")} volume={0.7} />;
const Whoosh: React.FC = () => (
  <Audio src={staticFile("audio/sfx/dragon-studio-whoosh-effect-382717.mp3")} volume={0.5} />
);

// ---------- Composition: Reel từ vựng ----------
export const ReelTuVung: React.FC<ReelTuVungProps> = (p) => {
  const hook = Math.round(HOOK * FPS_REEL);
  const moi = Math.round(VOCAB_S * FPS_REEL);
  const batDauCTA = hook + p.items.length * moi;
  return (
    <AbsoluteFill>
      <Nen />
      <DauTrang />
      <ChanTrang />
      <NhacNen file={p.nhac} />
      <Sequence durationInFrames={hook}>
        <CanhHook nhan={p.nhan} hook={p.hook} phu={p.hookPhu} />
        <Pop />
      </Sequence>
      {p.items.map((it, i) => (
        <Sequence key={i} from={hook + i * moi} durationInFrames={moi}>
          <CanhTuVung item={it} so={i + 1} tong={p.items.length} />
          <Whoosh />
        </Sequence>
      ))}
      <Sequence from={batDauCTA}>
        <CanhCTA
          dong1={p.cta?.[0] ?? "Lưu lại để ôn trước ngày thi!"}
          dong2={p.cta?.[1] ?? "Theo dõi page để nhận từ vựng & bài mẫu mỗi tuần"}
        />
        <Pop />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- Composition: Reel nâng band ----------
export const ReelNangBand: React.FC<ReelNangBandProps> = (p) => {
  const hook = Math.round(HOOK * FPS_REEL);
  const moi = Math.round(NANG_S * FPS_REEL);
  const batDauCTA = hook + p.items.length * moi;
  return (
    <AbsoluteFill>
      <Nen />
      <DauTrang />
      <ChanTrang />
      <NhacNen file={p.nhac} />
      <Sequence durationInFrames={hook}>
        <CanhHook nhan={p.nhan} hook={p.hook} phu={p.hookPhu} />
        <Pop />
      </Sequence>
      {p.items.map((it, i) => (
        <Sequence key={i} from={hook + i * moi} durationInFrames={moi}>
          <CanhNangBand item={it} so={i + 1} tong={p.items.length} nhanTruoc={p.nhanTruoc} nhanSau={p.nhanSau} />
          <Whoosh />
          <Sequence from={Math.round(2.6 * FPS_REEL)}>
            <Pop />
          </Sequence>
        </Sequence>
      ))}
      <Sequence from={batDauCTA}>
        <CanhCTA
          dong1={p.cta?.[0] ?? "Lưu lại & thử viết lại câu của bạn!"}
          dong2={p.cta?.[1] ?? "Theo dõi page để nhận bài mẫu Writing mỗi tuần"}
        />
        <Pop />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- Composition: Reel "Chọn đáp án đúng" (quiz, đếm ngược 3 giây) ----------
const QUIZ_HIEN = 1.5; // giây đọc câu hỏi trước khi đếm ngược
const QUIZ_DEM = 3; // đếm ngược
const QUIZ_GIAI = 2.8; // hiện đáp án + giải thích
const QUIZ_S = QUIZ_HIEN + QUIZ_DEM + QUIZ_GIAI;

export type CauQuiz = { cau: string; dapAn: string[]; dung: number; giaiThich: string };
export type ReelQuizProps = {
  nhan: string;
  hook: string[];
  hookPhu: string;
  items: CauQuiz[];
  nhac: string;
  cta?: [string, string];
};
export const tongKhungQuiz = (p: ReelQuizProps) =>
  Math.round((HOOK + p.items.length * QUIZ_S + CTA) * FPS_REEL);

const CanhQuiz: React.FC<{ item: CauQuiz; so: number; tong: number }> = ({ item, so, tong }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const batDauDem = Math.round(QUIZ_HIEN * fps);
  const lucGiai = Math.round((QUIZ_HIEN + QUIZ_DEM) * fps);
  const a = vao(f, fps);
  const daGiai = f >= lucGiai;
  const g = vao(f, fps, lucGiai);
  const conLai = Math.max(1, QUIZ_DEM - Math.floor((f - batDauDem) / fps));
  const dangDem = f >= batDauDem && !daGiai;
  const tienDoDem = interpolate(f, [batDauDem, lucGiai], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chu = ["A", "B", "C", "D"];
  return (
    <AbsoluteFill style={{ padding: "0 70px", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: XAM, marginBottom: 30, opacity: a }}>
        CÂU {so} / {tong}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 62,
          lineHeight: 1.3,
          color: TRANG,
          opacity: a,
          transform: `translateY(${(1 - a) * 40}px)`,
        }}
      >
        {item.cau.split("___").map((p, i, arr) => (
          <React.Fragment key={i}>
            {p}
            {i < arr.length - 1 ? (
              <span style={{ color: CAM }}>{daGiai ? item.dapAn[item.dung] : "_____"}</span>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 26 }}>
        {item.dapAn.map((d, i) => {
          const s = vao(f, fps, 8 + i * 5);
          const laDung = i === item.dung;
          const nen = daGiai ? (laDung ? CAM : "rgba(255,255,255,0.08)") : TRANG;
          const mauChu = daGiai ? (laDung ? TRANG : "rgba(255,255,255,0.45)") : NAVY;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                background: nen,
                borderRadius: 30,
                padding: "26px 36px",
                opacity: s,
                transform: `translateX(${(1 - s) * -60}px) scale(${daGiai && laDung ? 1 + 0.04 * g : 1})`,
              }}
            >
              <div
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 37,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: daGiai ? (laDung ? TRANG : "rgba(255,255,255,0.15)") : NAVY,
                  color: daGiai ? (laDung ? CAM : "rgba(255,255,255,0.5)") : TRANG,
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 40,
                }}
              >
                {daGiai && laDung ? "✓" : chu[i]}
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 52, color: mauChu }}>{d}</div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 190, marginTop: 44, position: "relative" }}>
        {dangDem ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                background: `conic-gradient(${CAM} ${tienDoDem * 360}deg, rgba(255,255,255,0.15) 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  background: NAVY_DARK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 70,
                  color: TRANG,
                }}
              >
                {conLai}
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: XAM }}>Chọn nhanh nào!</div>
          </div>
        ) : null}
        {daGiai ? (
          <div
            style={{
              background: TRANG,
              borderRadius: 30,
              borderLeft: `16px solid ${CAM}`,
              padding: "28px 36px",
              opacity: g,
              transform: `translateY(${(1 - g) * 40}px)`,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.4,
              color: NAVY,
            }}
          >
            💡 {item.giaiThich}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const ReelQuiz: React.FC<ReelQuizProps> = (p) => {
  const hook = Math.round(HOOK * FPS_REEL);
  const moi = Math.round(QUIZ_S * FPS_REEL);
  const batDauCTA = hook + p.items.length * moi;
  return (
    <AbsoluteFill>
      <Nen />
      <DauTrang />
      <ChanTrang />
      <NhacNen file={p.nhac} />
      <Sequence durationInFrames={hook}>
        <CanhHook nhan={p.nhan} hook={p.hook} phu={p.hookPhu} />
        <Pop />
      </Sequence>
      {p.items.map((it, i) => (
        <Sequence key={i} from={hook + i * moi} durationInFrames={moi}>
          <CanhQuiz item={it} so={i + 1} tong={p.items.length} />
          <Whoosh />
          <Sequence from={Math.round((QUIZ_HIEN + QUIZ_DEM) * FPS_REEL)}>
            <Pop />
          </Sequence>
        </Sequence>
      ))}
      <Sequence from={batDauCTA}>
        <CanhCTA
          dong1={p.cta?.[0] ?? "Bạn đúng mấy câu? Comment ngay!"}
          dong2={p.cta?.[1] ?? "Theo dõi page để chơi quiz IELTS mỗi tuần"}
        />
        <Pop />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- Composition: Reel "Sai hay đúng?" (câu sai → câu đúng + giải thích) ----------
const SD_DOAN = 2.2; // giây để người xem tự đoán
const SD_S = 6.2; // tổng thời lượng mỗi câu
export type CauSaiDung = { sai: string; dung: string; hl: string[]; giaiThich: string };
export type ReelSaiDungProps = {
  nhan: string;
  hook: string[];
  hookPhu: string;
  items: CauSaiDung[];
  nhac: string;
  cta?: [string, string];
};
export const tongKhungSaiDung = (p: ReelSaiDungProps) =>
  Math.round((HOOK + p.items.length * SD_S + CTA) * FPS_REEL);

const CanhSaiDung: React.FC<{ item: CauSaiDung; so: number; tong: number }> = ({ item, so, tong }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lucGiai = Math.round(SD_DOAN * fps);
  const a = vao(f, fps);
  const daGiai = f >= lucGiai - 6;
  const b = vao(f, fps, lucGiai);
  const c = vao(f, fps, lucGiai + 12);
  return (
    <AbsoluteFill style={{ padding: "0 70px", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: XAM, marginBottom: 30, opacity: a }}>
        CÂU {so} / {tong}
      </div>
      <TheCau
        nhan={daGiai ? "✗ SAI" : "SAI HAY ĐÚNG?"}
        mauNhan={daGiai ? DO : CAM}
        text={item.sai}
        hl={[]}
        nen="rgba(255,255,255,0.10)"
        chu={TRANG}
        s={a}
        gach={daGiai}
      />
      <div
        style={{
          textAlign: "center",
          fontSize: 70,
          color: CAM,
          fontWeight: 900,
          fontFamily: FONT,
          margin: "14px 0",
          opacity: b,
        }}
      >
        ↓
      </div>
      <TheCau nhan="✓ ĐÚNG" mauNhan={CAM} text={item.dung} hl={item.hl} nen={TRANG} chu={NAVY} s={b} />
      <div
        style={{
          marginTop: 30,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.4,
          color: XAM,
          opacity: c,
          transform: `translateY(${(1 - c) * 30}px)`,
        }}
      >
        💡 {item.giaiThich}
      </div>
    </AbsoluteFill>
  );
};

export const ReelSaiDung: React.FC<ReelSaiDungProps> = (p) => {
  const hook = Math.round(HOOK * FPS_REEL);
  const moi = Math.round(SD_S * FPS_REEL);
  const batDauCTA = hook + p.items.length * moi;
  return (
    <AbsoluteFill>
      <Nen />
      <DauTrang />
      <ChanTrang />
      <NhacNen file={p.nhac} />
      <Sequence durationInFrames={hook}>
        <CanhHook nhan={p.nhan} hook={p.hook} phu={p.hookPhu} />
        <Pop />
      </Sequence>
      {p.items.map((it, i) => (
        <Sequence key={i} from={hook + i * moi} durationInFrames={moi}>
          <CanhSaiDung item={it} so={i + 1} tong={p.items.length} />
          <Whoosh />
          <Sequence from={Math.round(SD_DOAN * FPS_REEL)}>
            <Pop />
          </Sequence>
        </Sequence>
      ))}
      <Sequence from={batDauCTA}>
        <CanhCTA
          dong1={p.cta?.[0] ?? "Bạn từng nói sai câu nào?"}
          dong2={p.cta?.[1] ?? "Comment số câu & theo dõi page để nhận mẹo Speaking mỗi tuần"}
        />
        <Pop />
      </Sequence>
    </AbsoluteFill>
  );
};

// ===================== DỮ LIỆU =====================
export const REEL_TU_VUNG_ENVIRONMENT: ReelTuVungProps = {
  nhan: "TỪ VỰNG IELTS · ENVIRONMENT",
  hook: ["Viết về môi trường", "mà chỉ biết", "\"pollution\"?"],
  hookPhu: "5 cụm từ ăn điểm cho Writing & Speaking",
  nhac: "fassounds-lofi-study-calm-peaceful-chill-hop-112191.mp3",
  items: [
    {
      en: "carbon emissions",
      vi: "khí thải carbon",
      vd: "Governments should tax carbon emissions from heavy industry.",
    },
    {
      en: "renewable energy sources",
      vi: "nguồn năng lượng tái tạo",
      vd: "Investing in renewable energy sources can cut long-term costs.",
    },
    {
      en: "a throwaway culture",
      vi: "lối sống \"dùng xong vứt\"",
      vd: "Plastic waste is a direct result of a throwaway culture.",
    },
    {
      en: "to deplete natural resources",
      vi: "làm cạn kiệt tài nguyên thiên nhiên",
      vd: "Rapid industrial growth continues to deplete natural resources.",
    },
    {
      en: "to raise public awareness",
      vi: "nâng cao nhận thức cộng đồng",
      vd: "School campaigns can raise public awareness of recycling.",
    },
  ],
};

export const REEL_NANG_BAND_WRITING: ReelNangBandProps = {
  nhan: "WRITING TASK 2",
  hook: ["Câu này chỉ", "Band 5.", "Sửa sao lên 7+?"],
  hookPhu: "3 câu viết lại – xem thật kỹ phần tô cam",
  nhac: "fassounds-lofi-study-calm-peaceful-chill-hop-112191.mp3",
  items: [
    {
      b5: "Many people use cars, so the air is very dirty.",
      b7: "The heavy reliance on private cars has led to a serious decline in air quality.",
      hl: ["heavy reliance on", "a serious decline in air quality"],
    },
    {
      b5: "Children use phones too much and it is bad.",
      b7: "Excessive screen time can have a detrimental effect on children's concentration.",
      hl: ["Excessive screen time", "a detrimental effect on"],
    },
    {
      b5: "The government should do something about this problem.",
      b7: "Governments should introduce stricter regulations to tackle this issue.",
      hl: ["introduce stricter regulations", "tackle this issue"],
    },
  ],
};

// ----- Tuần 19–25/10/2026 -----
export const REEL_NANG_BAND_EDUCATION: ReelNangBandProps = {
  nhan: "WRITING TASK 2 · EDUCATION",
  hook: ["Viết về giáo dục", "mà chỉ biết", "\"important\"?"],
  hookPhu: "3 câu viết lại – chú ý phần tô cam",
  nhac: "fassounds-lofi-study-calm-peaceful-chill-hop-112191.mp3",
  items: [
    {
      b5: "Teachers are very important for children.",
      b7: "Teachers play a pivotal role in shaping children's attitudes to learning.",
      hl: ["play a pivotal role in", "shaping"],
    },
    {
      b5: "Students can learn many things on the internet now.",
      b7: "Online platforms have made education far more accessible to students.",
      hl: ["Online platforms", "far more accessible"],
    },
    {
      b5: "Many students study only to pass exams.",
      b7: "Many students focus on rote learning rather than genuine understanding.",
      hl: ["rote learning", "rather than genuine understanding"],
    },
  ],
};

export const REEL_TU_VUNG_HEALTH: ReelTuVungProps = {
  nhan: "TỪ VỰNG IELTS · HEALTH",
  hook: ["Nói về sức khỏe", "mà chỉ biết", "\"healthy\"?"],
  hookPhu: "5 cụm từ ăn điểm cho Writing & Speaking",
  nhac: "fassounds-lofi-study-calm-peaceful-chill-hop-112191.mp3",
  items: [
    {
      en: "a sedentary lifestyle",
      vi: "lối sống ít vận động",
      vd: "A sedentary lifestyle increases the risk of heart disease.",
    },
    {
      en: "to boost the immune system",
      vi: "tăng cường hệ miễn dịch",
      vd: "Regular exercise can boost the immune system.",
    },
    {
      en: "preventive healthcare",
      vi: "chăm sóc sức khỏe dự phòng",
      vd: "Preventive healthcare can reduce pressure on hospitals.",
    },
    {
      en: "to cut down on sugary drinks",
      vi: "uống ít đồ uống có đường hơn",
      vd: "Teenagers should cut down on sugary drinks.",
    },
    {
      en: "mental well-being",
      vi: "sức khỏe tinh thần",
      vd: "Spending time in nature can improve mental well-being.",
    },
  ],
};

export const REEL_NANG_BAND_SPEAKING_LIKE: ReelNangBandProps = {
  nhan: "SPEAKING PART 1",
  hook: ["Speaking Part 1", "chỉ biết nói", "\"I like...\"?"],
  hookPhu: "3 câu tự nhiên hơn – chú ý phần tô cam",
  nhac: "nhac-goc/dao-pho.mp3",
  cta: ["Lưu lại & tập nói theo ngay!", "Theo dõi page để nhận mẹo Speaking mỗi tuần"],
  items: [
    {
      b5: "Yes, I like reading. Reading is good.",
      b7: "Yes, I'm really into reading. It helps me unwind after a long day.",
      hl: ["I'm really into", "unwind"],
    },
    {
      b5: "I like music very much because it makes me happy.",
      b7: "I'm a huge fan of music. It instantly puts me in a good mood.",
      hl: ["a huge fan of", "puts me in a good mood"],
    },
    {
      b5: "I don't like sports. I think sports is boring.",
      b7: "To be honest, I'm not much of a sports person. I find most games quite dull.",
      hl: ["not much of a sports person", "quite dull"],
    },
  ],
};

export const REEL_QUIZ_COLLOCATION_1: ReelQuizProps = {
  nhan: "QUIZ CHỦ NHẬT",
  hook: ["3 câu \"dễ\"", "mà rất nhiều", "bạn chọn sai!"],
  hookPhu: "Bạn có 3 giây cho mỗi câu – thử ngay nhé",
  nhac: "nhac-goc/quiz-time.mp3",
  cta: ["Bạn đúng mấy câu?", "Comment số câu đúng & theo dõi page để chơi quiz mỗi tuần"],
  items: [
    {
      cau: "I ___ a lot of mistakes in my first IELTS test.",
      dapAn: ["did", "made", "took"],
      dung: 1,
      giaiThich: "make a mistake – không nói \"do a mistake\"",
    },
    {
      cau: "Can you ___ me how to get to the station?",
      dapAn: ["say", "speak", "tell"],
      dung: 2,
      giaiThich: "tell + người + điều gì; \"say\" không đi thẳng với người",
    },
    {
      cau: "I'm really looking forward to ___ you.",
      dapAn: ["see", "seeing", "saw"],
      dung: 1,
      giaiThich: "look forward to + V-ing (\"to\" là giới từ)",
    },
  ],
};

// ----- Tuần 26/10–01/11/2026 -----
export const REEL_NANG_BAND_TECHNOLOGY: ReelNangBandProps = {
  nhan: "WRITING TASK 2 · TECHNOLOGY",
  hook: ["Viết về công nghệ", "mà chỉ biết", "\"makes life easier\"?"],
  hookPhu: "3 câu viết lại – chú ý phần tô cam",
  nhac: "nhac-goc/groove.mp3",
  items: [
    {
      b5: "Technology makes our life easier.",
      b7: "Technological advances have greatly simplified everyday tasks.",
      hl: ["Technological advances", "greatly simplified"],
    },
    {
      b5: "People use social media too much, so they don't talk face to face.",
      b7: "Overuse of social media may reduce meaningful face-to-face interaction.",
      hl: ["Overuse of social media", "meaningful face-to-face interaction"],
    },
    {
      b5: "Robots will take many people's jobs in the future.",
      b7: "Automation is likely to displace many workers in the coming decades.",
      hl: ["Automation", "displace many workers"],
    },
  ],
};

export const REEL_TU_VUNG_TRAVEL: ReelTuVungProps = {
  nhan: "TỪ VỰNG IELTS · TRAVEL",
  hook: ["Nói về du lịch", "mà chỉ biết", "\"travel is fun\"?"],
  hookPhu: "5 cụm từ ăn điểm cho Writing & Speaking",
  nhac: "nhac-goc/nang-som.mp3",
  items: [
    {
      en: "to broaden your horizons",
      vi: "mở mang tầm mắt, hiểu biết",
      vd: "Travelling alone can really broaden your horizons.",
    },
    {
      en: "a once-in-a-lifetime experience",
      vi: "trải nghiệm có một không hai",
      vd: "Seeing the Northern Lights was a once-in-a-lifetime experience.",
    },
    {
      en: "mass tourism",
      vi: "du lịch đại trà",
      vd: "Mass tourism can damage fragile ecosystems.",
    },
    {
      en: "a tourist trap",
      vi: "nơi \"chặt chém\" du khách",
      vd: "That famous street has become a tourist trap.",
    },
    {
      en: "to sample the local cuisine",
      vi: "thưởng thức món ăn địa phương",
      vd: "I always sample the local cuisine when I travel.",
    },
  ],
};

export const REEL_SAI_DUNG_SPEAKING_1: ReelSaiDungProps = {
  nhan: "SPEAKING · SAI HAY ĐÚNG?",
  hook: ["4 câu Speaking", "nghe rất quen", "nhưng đều SAI!"],
  hookPhu: "Tự đoán trước khi xem đáp án nhé",
  nhac: "nhac-goc/dao-pho.mp3",
  items: [
    {
      sai: "I very like playing badminton.",
      dung: "I really like playing badminton.",
      hl: ["really like"],
      giaiThich: "\"very\" không đứng trước động từ – dùng really",
    },
    {
      sai: "I am agree with that idea.",
      dung: "I agree with that idea.",
      hl: ["I agree"],
      giaiThich: "\"agree\" là động từ – không cần \"am\"",
    },
    {
      sai: "Listening to music makes me feel relax.",
      dung: "Listening to music makes me feel relaxed.",
      hl: ["relaxed"],
      giaiThich: "feel + tính từ → relaxed (không phải relax)",
    },
    {
      sai: "I have been to Da Lat last year.",
      dung: "I went to Da Lat last year.",
      hl: ["went"],
      giaiThich: "Có \"last year\" → dùng quá khứ đơn",
    },
  ],
};

export const REEL_TU_VUNG_IDIOMS_1: ReelTuVungProps = {
  nhan: "IDIOMS CHO SPEAKING",
  hook: ["Speaking nghe", "như đọc sách?", "Thử 5 idioms này!"],
  hookPhu: "Chỉ dùng cho Speaking – KHÔNG dùng trong Writing Task 2",
  nhac: "ikoliks-upbeat-energetic-background-music-426530.mp3",
  cta: ["Lưu lại & thử dùng 1 idiom hôm nay!", "Comment câu của bạn & theo dõi page nhé"],
  items: [
    {
      en: "a night owl",
      vi: "cú đêm – người hay thức khuya",
      vd: "I'm a night owl, so I study best at night.",
    },
    {
      en: "under the weather",
      vi: "hơi mệt, không được khỏe",
      vd: "I was feeling a bit under the weather yesterday.",
    },
    {
      en: "to hit the books",
      vi: "vùi đầu vào học",
      vd: "I need to hit the books before my exam.",
    },
    {
      en: "once in a blue moon",
      vi: "rất hiếm khi",
      vd: "I only eat fast food once in a blue moon.",
    },
    {
      en: "to call it a day",
      vi: "nghỉ, dừng việc cho hôm nay",
      vd: "I was exhausted, so I decided to call it a day.",
    },
  ],
};
