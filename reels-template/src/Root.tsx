import { Composition } from "remotion";
import {
  FPS_REEL, ReelTuVung, ReelNangBand, REEL_TU_VUNG_ENVIRONMENT, REEL_NANG_BAND_WRITING,
  tongKhungTuVung, tongKhungNangBand,
} from "./ReelsFanpage/ReelsFanpage";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel-TuVung-Environment" component={ReelTuVung} durationInFrames={tongKhungTuVung(REEL_TU_VUNG_ENVIRONMENT)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_TU_VUNG_ENVIRONMENT} />
    <Composition id="Reel-NangBand-Writing" component={ReelNangBand} durationInFrames={tongKhungNangBand(REEL_NANG_BAND_WRITING)} fps={FPS_REEL} width={1080} height={1920} defaultProps={REEL_NANG_BAND_WRITING} />
  </>
);
