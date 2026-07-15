'use client';

import { useState } from 'react';
import { StylingOptions, GradientConfig } from '@/lib/styling';
import { DotType, CornerSquareType } from 'qr-code-styling';

interface Props {
  value: StylingOptions;
  onChange: (next: StylingOptions) => void;
}

export default function AdvancedStylingAccordion({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  function set<K extends keyof StylingOptions>(key: K, val: StylingOptions[K]) {
    onChange({ ...value, [key]: val });
  }

  function setGradient<K extends keyof GradientConfig>(key: K, val: GradientConfig[K]) {
    onChange({ ...value, gradient: { ...value.gradient, [key]: val } });
  }

  return (
    <div className="border border-primary-tint rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-body-text hover:bg-primary/5 transition-colors"
        aria-expanded={open}
      >
        <span>Advanced Styling</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-primary-tint/50">
          <div className="pt-4 space-y-4">
            {/* Dot colour / gradient */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="gradient-enabled"
                  checked={value.gradient.enabled}
                  onChange={(e) => setGradient('enabled', e.target.checked)}
                  className="w-4 h-4 rounded border-primary-tint accent-primary cursor-pointer"
                />
                <label htmlFor="gradient-enabled" className="text-sm font-medium text-body-text cursor-pointer">
                  Gradient fill
                </label>
              </div>

              {value.gradient.enabled ? (
                <div className="space-y-3 pl-6">
                  <div className="flex gap-2">
                    {(['linear', 'radial'] as const).map((t) => (
                      <label
                        key={t}
                        className={[
                          'flex-1 text-center text-sm font-medium py-1.5 rounded-lg border cursor-pointer transition-colors select-none',
                          value.gradient.type === t
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-body-text border-primary-tint hover:border-primary/40',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="gradient-type"
                          value={t}
                          checked={value.gradient.type === t}
                          onChange={() => setGradient('type', t)}
                          className="sr-only"
                        />
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <ColorField
                      label="Start colour"
                      value={value.gradient.startColor}
                      onChange={(c) => setGradient('startColor', c)}
                    />
                    <ColorField
                      label="End colour"
                      value={value.gradient.endColor}
                      onChange={(c) => setGradient('endColor', c)}
                    />
                  </div>
                </div>
              ) : (
                <ColorField
                  label="Foreground colour"
                  value={value.fgColor}
                  onChange={(c) => set('fgColor', c)}
                />
              )}
            </div>

            <ColorField
              label="Background colour"
              value={value.bgColor}
              onChange={(c) => set('bgColor', c)}
            />

            <SelectField
              label="Dot shape"
              value={value.dotType}
              onChange={(v) => set('dotType', v as DotType)}
              options={DOT_TYPES}
            />

            <SelectField
              label="Corner / eye style"
              value={value.cornerSquareType}
              onChange={(v) => set('cornerSquareType', v as CornerSquareType)}
              options={CORNER_TYPES}
            />

            <SelectField
              label="Error correction"
              value={value.errorCorrection}
              onChange={(v) => set('errorCorrection', v as StylingOptions['errorCorrection'])}
              options={ERROR_CORRECTION_OPTIONS}
            />

            <SelectField
              label="Export size"
              value={String(value.exportSize)}
              onChange={(v) => set('exportSize', Number(v) as StylingOptions['exportSize'])}
              options={EXPORT_SIZE_OPTIONS}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const DOT_TYPES: { value: string; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

const CORNER_TYPES: { value: string; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'rounded', label: 'Rounded' },
];

const ERROR_CORRECTION_OPTIONS: { value: string; label: string }[] = [
  { value: 'L', label: 'L — Low (7%)' },
  { value: 'M', label: 'M — Medium (15%)' },
  { value: 'Q', label: 'Q — Quartile (25%)' },
  { value: 'H', label: 'H — High (30%)' },
];

const EXPORT_SIZE_OPTIONS: { value: string; label: string }[] = [
  { value: '1024', label: '1024 px' },
  { value: '2048', label: '2048 px' },
  { value: '4096', label: '4096 px' },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={['transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-body-text w-36 shrink-0">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-primary-tint cursor-pointer p-0.5 bg-white"
        />
        <span className="text-xs text-body-text/60 font-mono">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-body-text">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm bg-white text-body-text border-primary-tint hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
