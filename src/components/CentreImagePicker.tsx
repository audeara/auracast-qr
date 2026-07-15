'use client';

import { useRef } from 'react';

export type CentreImageType = 'logo' | 'none' | 'custom';

interface CentreImagePickerProps {
  value: CentreImageType;
  hasCustomImage: boolean;
  onChange: (type: CentreImageType, dataUri?: string) => void;
}

const OPTIONS: { value: CentreImageType; label: string }[] = [
  { value: 'logo', label: 'Auracast Logo' },
  { value: 'none', label: 'None' },
  { value: 'custom', label: 'Custom' },
];

export default function CentreImagePicker({ value, hasCustomImage, onChange }: CentreImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-body-text">Centre Image</label>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleTypeClick(opt.value)}
            className={[
              'flex-1 text-center text-sm font-medium py-2 rounded-lg border cursor-pointer transition-colors',
              value === opt.value
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-body-text border-primary-tint hover:border-primary/40',
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
            className="w-full text-sm py-2 px-3 rounded-lg border-2 border-dashed border-primary-tint text-body-text/60 hover:border-primary/40 hover:text-body-text/80 transition-colors"
          >
            {hasCustomImage ? 'Replace image…' : 'Upload image…'}
          </button>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-snug">
            Custom images are not included in the shareable URL — collaborators will need to re-upload.
          </p>
        </>
      )}
    </div>
  );
}
