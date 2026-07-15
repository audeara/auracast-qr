'use client';

import { useEffect, useRef } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { StylingOptions, DEFAULT_STYLING } from '@/lib/styling';

function buildOptions(data: string, imageUri: string | null, styling: StylingOptions): Options {
  const { fgColor, bgColor, dotType, cornerSquareType, gradient, errorCorrection } = styling;

  const dotsGradient = gradient.enabled
    ? {
        type: gradient.type,
        colorStops: [
          { offset: 0, color: gradient.startColor },
          { offset: 1, color: gradient.endColor },
        ],
      }
    : undefined;

  return {
    width: 280,
    height: 280,
    type: 'svg',
    data,
    image: imageUri ?? '',
    qrOptions: { errorCorrectionLevel: errorCorrection },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.35,
      margin: 4,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: fgColor,
      type: dotType,
      gradient: dotsGradient,
    },
    cornersSquareOptions: {
      color: gradient.enabled ? gradient.startColor : fgColor,
      type: cornerSquareType,
    },
    cornersDotOptions: {
      color: gradient.enabled ? gradient.startColor : fgColor,
    },
    backgroundOptions: { color: bgColor },
  };
}

interface QRPreviewProps {
  uri: string | null;
  centreImageUri: string | null;
  styling?: StylingOptions;
}

export default function QRPreview({ uri, centreImageUri, styling = DEFAULT_STYLING }: QRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!uri || !containerRef.current) return;

    const containerIsEmpty = containerRef.current.childElementCount === 0;
    const opts = buildOptions(uri, centreImageUri, styling);

    if (!qrRef.current || containerIsEmpty) {
      qrRef.current = new QRCodeStyling(opts);
      qrRef.current.append(containerRef.current);
    } else {
      qrRef.current.update(opts);
    }
  }, [uri, centreImageUri, styling]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-sm font-semibold text-body-text/60 uppercase tracking-wide">
        QR Preview
      </h2>

      <div className="w-[280px] h-[280px] flex items-center justify-center rounded-lg overflow-hidden bg-white shadow-sm border border-primary-tint">
        {uri ? (
          <div ref={containerRef} />
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 text-center">
      <PlaceholderGrid />
      <p className="text-sm text-body-text/50 leading-snug">
        Enter a Broadcast Name (min 4 chars) to see your QR code
      </p>
    </div>
  );
}

function PlaceholderGrid() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      {/* top-left finder */}
      <rect x="4" y="4" width="24" height="24" rx="2" fill="#E5EFEF" />
      <rect x="9" y="9" width="14" height="14" rx="1" fill="#188383" opacity="0.3" />
      {/* top-right finder */}
      <rect x="52" y="4" width="24" height="24" rx="2" fill="#E5EFEF" />
      <rect x="57" y="9" width="14" height="14" rx="1" fill="#188383" opacity="0.3" />
      {/* bottom-left finder */}
      <rect x="4" y="52" width="24" height="24" rx="2" fill="#E5EFEF" />
      <rect x="9" y="57" width="14" height="14" rx="1" fill="#188383" opacity="0.3" />
      {/* data dots */}
      {[36, 42, 48, 54, 60, 66].map((x) =>
        [4, 10, 16, 22, 28].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="0.5" fill="#188383" opacity="0.15" />
        ))
      )}
      {[36, 42, 48, 54, 60, 66].map((x) =>
        [36, 42, 48, 54, 60, 66].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="0.5" fill="#188383" opacity="0.15" />
        ))
      )}
    </svg>
  );
}
