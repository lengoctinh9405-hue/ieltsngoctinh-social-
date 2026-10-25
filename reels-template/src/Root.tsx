import { Composition } from "remotion";
import {
  FPS_REEL, ReelTuVung, ReelNangBand, REEL_TU_VUNG_ENVIRONMENT, REEL_NANG_BAND_WRITING,
  tongKhungTuVung, tongKhungNangBand,
  ReelQuiz, tongKhungQuiz,
  REEL_NANG_BAND_EDUCATION, REEL_TU_VUNG_HEALTH, REEL_NANG_BAND_SPEAKING_LIKE, REEL_QUIZ_COLLOCATION_1,
  ReelSaiDung, tongKhungSaiDung,
  REEL_NANG_BAND_TECHNOLOGY, REEL_TU_VUNG_TRAVEL, REEL_SAI_DUNG_SPEAKING_1, REEL_TU_VUNG_IDIOMS_1,
} from "./ReelsFanpage/ReelsFanpage";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel-TuVung-Environment" component={ReelTuVung} durationInFrames={tongKhungTuVung(REEL_TU_VUNG_ENVIRONMENT)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_TU_VUNG_ENVIRONMENT} />
    <Composition id="Reel-NangBand-Writing" component={ReelNangBand} durationInFrames={tongKhungNangBand(REEL_NANG_BAND_WRITING)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_NANG_BAND_WRITING} />
    <Composition id="Reel-NangBand-Education" component={ReelNangBand} durationInFrames={tongKhungNangBand(REEL_NANG_BAND_EDUCATION)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_NANG_BAND_EDUCATION} />
    <Composition id="Reel-TuVung-Health" component={ReelTuVung} durationInFrames={tongKhungTuVung(REEL_TU_VUNG_HEALTH)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_TU_VUNG_HEALTH} />
    <Composition id="Reel-NangBand-Speaking-Like" component={ReelNangBand} durationInFrames={tongKhungNangBand(REEL_NANG_BAND_SPEAKING_LIKE)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_NANG_BAND_SPEAKING_LIKE} />
    <Composition id="Reel-Quiz-Collocation-1" component={ReelQuiz} durationInFrames={tongKhungQuiz(REEL_QUIZ_COLLOCATION_1)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_QUIZ_COLLOCATION_1} />
    <Composition id="Reel-NangBand-Technology" component={ReelNangBand} durationInFrames={tongKhungNangBand(REEL_NANG_BAND_TECHNOLOGY)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_NANG_BAND_TECHNOLOGY} />
    <Composition id="Reel-TuVung-Travel" component={ReelTuVung} durationInFrames={tongKhungTuVung(REEL_TU_VUNG_TRAVEL)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_TU_VUNG_TRAVEL} />
    <Composition id="Reel-SaiDung-Speaking-1" component={ReelSaiDung} durationInFrames={tongKhungSaiDung(REEL_SAI_DUNG_SPEAKING_1)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_SAI_DUNG_SPEAKING_1} />
    <Composition id="Reel-TuVung-Idioms-1" component={ReelTuVung} durationInFrames={tongKhungTuVung(REEL_TU_VUNG_IDIOMS_1)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_TU_VUNG_IDIOMS_1} />
  </>
);
