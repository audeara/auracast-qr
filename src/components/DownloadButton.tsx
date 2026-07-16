'use client';

import { useState } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import JSZip from 'jszip';
import { StylingOptions } from '@/lib/styling';
import type en from '@/dictionaries/en.json';

type DownloadDict = typeof en.download;

interface DownloadButtonProps {
  uri: string | null;
  broadcastName: string;
  centreImageUri: string | null;
  styling: StylingOptions;
  dict: DownloadDict;
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

export default function DownloadButton({ uri, broadcastName, centreImageUri, styling, dict }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  async function buildPngBlob(): Promise<Blob> {
    const embeddedImage = await resolveToDataUri(centreImageUri);
    const opts = buildExportOptions(uri!, embeddedImage, styling, styling.exportSize);
    const qrPng = new QRCodeStyling({ ...opts, type: 'canvas' });
    const raw = await qrPng.getRawData('png');
    if (!raw || !(raw instanceof Blob)) throw new Error('Failed to generate PNG');
    return raw;
  }

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

  async function handleCopy() {
    if (!uri) return;
    setCopying(true);
    try {
      const blob = await buildPngBlob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setCopying(false);
    }
  }

  const disabled = !uri;

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || loading}
        className={[
          'flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-4 text-base font-semibold transition-colors',
          disabled || loading
            ? 'bg-primary/20 text-primary/40 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-active active:scale-[0.98]',
        ].join(' ')}
      >
        {loading ? (
          <>
            <Spinner />
            {dict.generating}
          </>
        ) : (
          <>
            <DownloadIcon />
            {dict.download}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled || copying}
        className={[
          'flex items-center justify-center gap-1.5 rounded-xl px-4 py-4 text-sm font-semibold transition-colors whitespace-nowrap',
          disabled || copying
            ? 'bg-primary/10 text-primary/40 cursor-not-allowed'
            : copied
            ? 'bg-green-100 text-green-700'
            : 'bg-primary-tint text-primary hover:bg-primary/10 active:scale-[0.98]',
        ].join(' ')}
      >
        {copying ? (
          <Spinner />
        ) : copied ? (
          <CheckIcon />
        ) : (
          <CopyIcon />
        )}
        {copied ? dict.copied : dict.copy}
      </button>
    </div>
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

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
