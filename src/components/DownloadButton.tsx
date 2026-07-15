'use client';

import { useState } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import JSZip from 'jszip';
import { StylingOptions } from '@/lib/styling';

interface DownloadButtonProps {
  uri: string | null;
  broadcastName: string;
  centreImageUri: string | null;
  styling: StylingOptions;
}

async function resolveToDataUri(uri: string | null): Promise<string | undefined> {
  if (!uri) return undefined;
  if (uri.startsWith('data:')) return uri;
  const res = await fetch(uri);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function buildExportOptions(data: string, imageUri: string | undefined, styling: StylingOptions, size: number): Options {
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
    width: size,
    height: size,
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

function toFileStem(broadcastName: string): string {
  return `auracast-qr-${broadcastName.toLowerCase().replace(/\s+/g, '-')}`;
}

export default function DownloadButton({ uri, broadcastName, centreImageUri, styling }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!uri) return;
    setLoading(true);
    try {
      const embeddedImage = await resolveToDataUri(centreImageUri);
      const size = styling.exportSize;
      const opts = buildExportOptions(uri, embeddedImage, styling, size);

      const qrSvg = new QRCodeStyling({ ...opts, type: 'svg' });
      const qrPng = new QRCodeStyling({ ...opts, type: 'canvas' });

      const [svgBlob, pngBlob] = await Promise.all([
        qrSvg.getRawData('svg'),
        qrPng.getRawData('png'),
      ]);

      if (!svgBlob || !pngBlob) throw new Error('Failed to generate QR data');

      const stem = toFileStem(broadcastName);
      const zip = new JSZip();
      zip.file(`${stem}.svg`, svgBlob);
      zip.file(`${stem}.png`, pngBlob);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${stem}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  const disabled = !uri || loading;

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled}
      className={[
        'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
        disabled
          ? 'bg-primary/20 text-primary/40 cursor-not-allowed'
          : 'bg-primary text-white hover:bg-primary-active active:scale-[0.98]',
      ].join(' ')}
    >
      {loading ? (
        <>
          <Spinner />
          Generating…
        </>
      ) : (
        <>
          <DownloadIcon />
          Download ZIP
        </>
      )}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="animate-spin">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
