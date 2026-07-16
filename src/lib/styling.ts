import { DotType, CornerSquareType, ErrorCorrectionLevel } from 'qr-code-styling';

export type GradientConfig = {
  enabled: boolean;
  type: 'linear' | 'radial';
  startColor: string;
  endColor: string;
};

export type StylingOptions = {
  fgColor: string;
  bgColor: string;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  gradient: GradientConfig;
  errorCorrection: ErrorCorrectionLevel;
  exportSize: 1024 | 2048 | 4096;
};

export const DEFAULT_STYLING: StylingOptions = {
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  dotType: 'square',
  cornerSquareType: 'square',
  gradient: {
    enabled: false,
    type: 'linear',
    startColor: '#188383',
    endColor: '#005E63',
  },
  errorCorrection: 'H',
  exportSize: 2048,
};
