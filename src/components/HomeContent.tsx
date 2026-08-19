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
import type en from '@/dictionaries/en.json';

type Dict = typeof en;

const QRPreview = dynamic(() => import('@/components/QRPreview'), { ssr: false });
const DownloadButton = dynamic(() => import('@/components/DownloadButton'), { ssr: false });

const LOGO_URL = '/auracast-logo.svg';

const FORM_PARSERS = {
  BN: parseAsString.withDefault(''),
  BI: parseAsString.withDefault(''),
  AD: parseAsString.withDefault(''),
  AT: parseAsStringLiteral(['0', '1'] as const).withDefault('0'),
  AS: parseAsString.withDefault(''),
  PI: parseAsString.withDefault(''),
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

export default function HomeContent({ dict }: { dict: Dict }) {
  const [formParams, setFormParams] = useQueryStates(FORM_PARSERS, { history: 'replace' });
  const [stylingParams, setStylingParams] = useQueryStates(STYLING_PARSERS, { history: 'replace' });
  const [{ img: imgType }, setImgParam] = useQueryStates(IMAGE_PARSERS, { history: 'replace' });

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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <section className="flex-1 min-w-0 space-y-8 order-2 lg:order-1">
          <div>
            <AuracastForm
              initialValues={initialFormValues}
              onUriChange={setUri}
              onBroadcastNameChange={setBroadcastName}
              onFormValuesChange={setFormParams}
              dict={dict.form}
            />
          </div>
          <div className="border-t border-body-text/15 pt-7">
            <CentreImagePicker
              value={imgType}
              hasCustomImage={customImageDataUri !== null}
              onChange={handleCentreImageChange}
              dict={dict.centreImage}
            />
          </div>
          <div className="border-t border-body-text/15 pt-7">
            <AdvancedStylingAccordion
              value={styling}
              onChange={handleStylingChange}
              dict={dict.styling}
            />
          </div>
        </section>

        <aside className="lg:w-[440px] shrink-0 lg:sticky lg:top-8 lg:self-start order-1 lg:order-2">
          <div className="bg-surface rounded-2xl shadow-lg p-6 flex flex-col gap-5">
            <QRPreview uri={uri} centreImageUri={centreImageUri} styling={styling} dict={dict.preview} />
            <DownloadButton
              uri={uri}
              broadcastName={broadcastName}
              centreImageUri={centreImageUri}
              styling={styling}
              dict={dict.download}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
