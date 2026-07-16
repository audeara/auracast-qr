'use client';

import { useEffect, useRef, useState } from 'react';
import Code from '@/components/Code';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { StylingOptions, DEFAULT_STYLING } from '@/lib/styling';
import type en from '@/dictionaries/en.json';

type PreviewDict = typeof en.preview;

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
    width: 300,
    height: 300,
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
  dict: PreviewDict;
}

export default function QRPreview({ uri, centreImageUri, styling = DEFAULT_STYLING, dict }: QRPreviewProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!uri) return;
    navigator.clipboard.writeText(uri).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
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
        {dict.title}
      </h2>

      <div className="w-[340px] h-[340px] flex items-center justify-center rounded-lg overflow-hidden bg-surface shadow-sm border border-primary-tint p-6">
        {uri ? (
          <div ref={containerRef} />
        ) : (
          <Placeholder placeholder={dict.placeholder} />
        )}
      </div>

      {uri && (
        <div className="w-full space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-body-text/50 uppercase tracking-wide">{dict.generatedUri}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-body-text/50 hover:text-primary transition-colors duration-150"
              aria-label="Copy URI"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <Code className="px-3 py-2.5 rounded-lg">
            <code className="text-primary text-xs font-mono whitespace-nowrap">{uri}</code>
          </Code>
        </div>
      )}
    </div>
  );
}

function Placeholder({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 text-center">
      <PlaceholderGrid />
      <p className="text-sm text-body-text/50 leading-snug">{placeholder}</p>
    </div>
  );
}

function PlaceholderGrid() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="24" height="24" rx="2" fill="#dceeff" />
      <rect x="9" y="9" width="14" height="14" rx="1" fill="#0082fc" opacity="0.3" />
      <rect x="52" y="4" width="24" height="24" rx="2" fill="#dceeff" />
      <rect x="57" y="9" width="14" height="14" rx="1" fill="#0082fc" opacity="0.3" />
      <rect x="4" y="52" width="24" height="24" rx="2" fill="#dceeff" />
      <rect x="9" y="57" width="14" height="14" rx="1" fill="#0082fc" opacity="0.3" />
      {[36, 42, 48, 54, 60, 66].map((x) =>
        [4, 10, 16, 22, 28].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="0.5" fill="#0082fc" opacity="0.15" />
        ))
      )}
      {[36, 42, 48, 54, 60, 66].map((x) =>
        [36, 42, 48, 54, 60, 66].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="0.5" fill="#0082fc" opacity="0.15" />
        ))
      )}
    </svg>
  );
}
