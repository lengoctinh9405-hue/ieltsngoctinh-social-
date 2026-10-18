import { Composition } from "remotion";
import {
  FPS_REEL, ReelTuVung, ReelNangBand, REEL_TU_VUNG_ENVIRONMENT, REEL_NANG_BAND_WRITING,
  tongKhungTuVung, tongKhungNangBand,
  ReelQuiz, tongKhungQuiz,
  REEL_NANG_BAND_EDUCATION, REEL_TU_VUNG_HEALTH, REEL_NANG_BAND_SPEAKING_LIKE, REEL_QUIZ_COLLOCATION_1,
} from "./ReelsFanpage/ReelsFanpage";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel-TuVung-Environment" component={ReelTuVung} durationInFrames={tongKhungTuVung(REEL_TU_VUNG_ENVIRONMENT)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_TU_VUNG_ENVIRONMENT} />
    <Composition id="Reel-NangBand-Writing" component={ReelNangBand} durationInFrames={tongKhungNangBand(REEL_NANG_BAND_WRITING)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_NANG_BAND_WRITING} />
    <Composition id="Reel-NangBand-Education" component={ReelNangBand} durationInFrames={tongKhungNangBand(REEL_NANG_BAND_EDUCATION)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_NANG_BAND_EDUCATION} />
    <Composition id="Reel-TuVung-Health" component={ReelTuVung} durationInFrames={tongKhungTuVung(REEL_TU_VUNG_HEALTH)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_TU_VUNG_HEALTH} />
    <Composition id="Reel-NangBand-Speaking-Like" component={ReelNangBand} durationInFrames={tongKhungNangBand(REEL_NANG_BAND_SPEAKING_LIKE)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_NANG_BAND_SPEAKING_LIKE} />
    <Composition id="Reel-Quiz-Collocation-1" component={ReelQuiz} durationInFrames={tongKhungQuiz(REEL_QUIZ_COLLOCATION_1)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_QUIZ_COLLOCATION_1} />
  </>
);
