'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  useQueryStates,
  parseAsString,
  parseAsBoolean,
  parseAsInteger,
  parseAsStringLiteral,
} from 'nuqs';
import AuracastForm from '@/components/AuracastForm';
import CentreImagePicker, { CentreImageType } from '@/components/CentreImagePicker';
import AdvancedStylingAccordion from '@/components/AdvancedStylingAccordion';
import { StylingOptions, DEFAULT_STYLING } from '@/lib/styling';
import type { DotType, CornerSquareType, ErrorCorrectionLevel } from 'qr-code-styling';

const QRPreview = dynamic(() => import('@/components/QRPreview'), { ssr: false });
const DownloadButton = dynamic(() => import('@/components/DownloadButton'), { ssr: false });

const LOGO_URL = '/auracast-logo.svg';

const FORM_PARSERS = {
  BN: parseAsString.withDefault(''),
  BI: parseAsString.withDefault(''),
  AD: parseAsString.withDefault(''),
  AT: parseAsStringLiteral(['0', '1'] as const).withDefault('0'),
  quality: parseAsStringLiteral(['none', 'sq', 'hq', 'both'] as const).withDefault('none'),
  encrypted: parseAsBoolean.withDefault(false),
  BC: parseAsString.withDefault(''),
};

const STYLING_PARSERS = {
  fg: parseAsString.withDefault(DEFAULT_STYLING.fgColor),
  bg: parseAsString.withDefault(DEFAULT_STYLING.bgColor),
  dot: parseAsString.withDefault(DEFAULT_STYLING.dotType),
  eye: parseAsString.withDefault(DEFAULT_STYLING.cornerSquareType),
  grd: parseAsBoolean.withDefault(DEFAULT_STYLING.gradient.enabled),
  grt: parseAsStringLiteral(['linear', 'radial'] as const).withDefault(DEFAULT_STYLING.gradient.type),
  gc1: parseAsString.withDefault(DEFAULT_STYLING.gradient.startColor),
  gc2: parseAsString.withDefault(DEFAULT_STYLING.gradient.endColor),
  ec: parseAsStringLiteral(['L', 'M', 'Q', 'H'] as const).withDefault(DEFAULT_STYLING.errorCorrection),
  sz: parseAsInteger.withDefault(DEFAULT_STYLING.exportSize),
};

const IMAGE_PARSERS = {
  img: parseAsStringLiteral(['logo', 'none', 'custom'] as const).withDefault('logo'),
};

export default function Home() {
  const [formParams, setFormParams] = useQueryStates(FORM_PARSERS, { history: 'replace' });
  const [stylingParams, setStylingParams] = useQueryStates(STYLING_PARSERS, { history: 'replace' });
  const [{ img: imgType }, setImgParam] = useQueryStates(IMAGE_PARSERS, { history: 'replace' });

  // Freeze initial URL form values — AuracastForm uses them once for initialization
  const initialFormValues = useRef(formParams).current;

  const [uri, setUri] = useState<string | null>(null);
  const [broadcastName, setBroadcastName] = useState('');
  const [customImageDataUri, setCustomImageDataUri] = useState<string | null>(null);

  const styling: StylingOptions = {
    fgColor: stylingParams.fg,
    bgColor: stylingParams.bg,
    dotType: stylingParams.dot as DotType,
    cornerSquareType: stylingParams.eye as CornerSquareType,
    gradient: {
      enabled: stylingParams.grd,
      type: stylingParams.grt,
      startColor: stylingParams.gc1,
      endColor: stylingParams.gc2,
    },
    errorCorrection: stylingParams.ec as ErrorCorrectionLevel,
    exportSize: stylingParams.sz as 1024 | 2048 | 4096,
  };

  function handleStylingChange(next: StylingOptions) {
    setStylingParams({
      fg: next.fgColor,
      bg: next.bgColor,
      dot: next.dotType,
      eye: next.cornerSquareType,
      grd: next.gradient.enabled,
      grt: next.gradient.type,
      gc1: next.gradient.startColor,
      gc2: next.gradient.endColor,
      ec: next.errorCorrection,
      sz: next.exportSize,
    });
  }

  function handleCentreImageChange(type: CentreImageType, dataUri?: string) {
    setImgParam({ img: type });
    if (type === 'custom' && dataUri) {
      setCustomImageDataUri(dataUri);
    } else if (type !== 'custom') {
      setCustomImageDataUri(null);
    }
  }

  const centreImageUri =
    imgType === 'logo'
      ? LOGO_URL
      : imgType === 'custom'
        ? customImageDataUri
        : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <section className="flex-1 min-w-0">
          <div className="bg-surface rounded-xl shadow-sm p-6">
            <h1 className="text-base font-semibold text-body-text mb-5">
              Configure your Auracast broadcast
            </h1>
            <AuracastForm
              initialValues={initialFormValues}
              onUriChange={setUri}
              onBroadcastNameChange={setBroadcastName}
              onFormValuesChange={setFormParams}
            />
            <div className="mt-5 pt-5 border-t border-primary-tint/50">
              <CentreImagePicker
                value={imgType}
                hasCustomImage={customImageDataUri !== null}
                onChange={handleCentreImageChange}
              />
            </div>
            <div className="mt-5 pt-5 border-t border-primary-tint/50">
              <AdvancedStylingAccordion value={styling} onChange={handleStylingChange} />
            </div>
          </div>
        </section>

        <aside className="lg:w-80 shrink-0 lg:sticky lg:top-8 lg:self-start">
          <div className="bg-surface rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <QRPreview uri={uri} centreImageUri={centreImageUri} styling={styling} />
            <DownloadButton
              uri={uri}
              broadcastName={broadcastName}
              centreImageUri={centreImageUri}
              styling={styling}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
