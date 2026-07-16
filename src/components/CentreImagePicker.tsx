'use client';

import { useRef } from 'react';
import type en from '@/dictionaries/en.json';

type CentreImageDict = typeof en.centreImage;

export type CentreImageType = 'logo' | 'none' | 'custom';

interface CentreImagePickerProps {
  value: CentreImageType;
  hasCustomImage: boolean;
  onChange: (type: CentreImageType, dataUri?: string) => void;
  dict: CentreImageDict;
}

export default function CentreImagePicker({ value, hasCustomImage, onChange, dict }: CentreImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const OPTIONS: { value: CentreImageType; label: string }[] = [
    { value: 'logo', label: dict.auracastLogo },
    { value: 'none', label: dict.none },
    { value: 'custom', label: dict.custom },
  ];

  function handleTypeClick(type: CentreImageType) {
    onChange(type);
    if (type === 'custom') {
      fileInputRef.current?.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUri = ev.target?.result as string;
      onChange('custom', dataUri);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-body-text">{dict.label}</label>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleTypeClick(opt.value)}
            className={[
              'flex-1 text-center text-base font-medium py-3 rounded-xl border-2 cursor-pointer transition-colors',
              value === opt.value
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-body-text border-primary hover:bg-primary/5',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {value === 'custom' && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="sr-only"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-base py-3 px-4 rounded-xl border-2 border-dashed border-body-text/25 text-body-text/60 hover:border-body-text/40 hover:text-body-text/80 transition-colors"
          >
            {hasCustomImage ? dict.replace : dict.upload}
          </button>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 leading-snug">
            {dict.warning}
          </p>
        </>
      )}
    </div>
  );
}
