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
};
export type ReelNangBandProps = {
  nhan: string;
  hook: string[];
  hookPhu: string;
  items: NangBand[];
  nhac: string;
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

const CanhNangBand: React.FC<{ item: NangBand; so: number; tong: number }> = ({ item, so, tong }) => {
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
        nhan="BAND 5"
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
      <TheCau nhan="BAND 7+" mauNhan={CAM} text={item.b7} hl={item.hl} nen={TRANG} chu={NAVY} s={b} />
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
        <CanhCTA dong1="Lưu lại để ôn trước ngày thi!" dong2="Theo dõi page để nhận từ vựng & bài mẫu mỗi tuần" />
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
          <CanhNangBand item={it} so={i + 1} tong={p.items.length} />
          <Whoosh />
          <Sequence from={Math.round(2.6 * FPS_REEL)}>
            <Pop />
          </Sequence>
        </Sequence>
      ))}
      <Sequence from={batDauCTA}>
        <CanhCTA dong1="Lưu lại & thử viết lại câu của bạn!" dong2="Theo dõi page để nhận bài mẫu Writing mỗi tuần" />
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
