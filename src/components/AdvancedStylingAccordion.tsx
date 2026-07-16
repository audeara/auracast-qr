'use client';

import { useState } from 'react';
import { StylingOptions, GradientConfig } from '@/lib/styling';
import { DotType, CornerSquareType } from 'qr-code-styling';
import type en from '@/dictionaries/en.json';

type StylingDict = typeof en.styling;

interface Props {
  value: StylingOptions;
  onChange: (next: StylingOptions) => void;
  dict: StylingDict;
}

export default function AdvancedStylingAccordion({ value, onChange, dict }: Props) {
  const [open, setOpen] = useState(false);

  function set<K extends keyof StylingOptions>(key: K, val: StylingOptions[K]) {
    onChange({ ...value, [key]: val });
  }

  function setGradient<K extends keyof GradientConfig>(key: K, val: GradientConfig[K]) {
    onChange({ ...value, gradient: { ...value.gradient, [key]: val } });
  }

  return (
    <div className="border border-body-text/15 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-base font-semibold text-body-text hover:bg-primary/5 transition-colors"
        aria-expanded={open}
      >
        <span>{dict.title}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="px-5 pb-6 space-y-6 border-t border-body-text/15">
          <div className="pt-6 space-y-6">

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-body-text">{dict.dotStyle}</label>
              <StylePicker
                value={value.dotType}
                onChange={(v) => set('dotType', v as DotType)}
                options={DOT_TYPE_OPTIONS}
                cols={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-body-text">{dict.cornerStyle}</label>
              <StylePicker
                value={value.cornerSquareType}
                onChange={(v) => set('cornerSquareType', v as CornerSquareType)}
                options={CORNER_TYPE_OPTIONS}
                cols={4}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-body-text">{dict.colours}</label>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="gradient-enabled"
                  checked={value.gradient.enabled}
                  onChange={(e) => setGradient('enabled', e.target.checked)}
                  className="w-4 h-4 rounded border-body-text/15 accent-primary cursor-pointer"
                />
                <label htmlFor="gradient-enabled" className="text-sm font-medium text-body-text cursor-pointer">
                  {dict.gradientFill}
                </label>
              </div>

              {value.gradient.enabled ? (
                <div className="space-y-3 pl-6">
                  <div className="flex gap-2">
                    {(['linear', 'radial'] as const).map((t) => (
                      <label
                        key={t}
                        className={[
                          'flex-1 text-center text-sm font-medium py-2.5 rounded-xl border-2 cursor-pointer transition-colors select-none',
                          value.gradient.type === t
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface text-body-text border-primary hover:bg-primary/5',
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
                  <div className="flex gap-6">
                    <ColorField
                      label={dict.start}
                      value={value.gradient.startColor}
                      onChange={(c) => setGradient('startColor', c)}
                    />
                    <ColorField
                      label={dict.end}
                      value={value.gradient.endColor}
                      onChange={(c) => setGradient('endColor', c)}
                    />
                  </div>
                </div>
              ) : (
                <ColorField
                  label={dict.foreground}
                  value={value.fgColor}
                  onChange={(c) => set('fgColor', c)}
                />
              )}

              <ColorField
                label={dict.background}
                value={value.bgColor}
                onChange={(c) => set('bgColor', c)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label={dict.errorCorrection}
                value={value.errorCorrection}
                onChange={(v) => set('errorCorrection', v as StylingOptions['errorCorrection'])}
                options={ERROR_CORRECTION_OPTIONS}
              />
              <SelectField
                label={dict.exportSize}
                value={String(value.exportSize)}
                onChange={(v) => set('exportSize', Number(v) as StylingOptions['exportSize'])}
                options={EXPORT_SIZE_OPTIONS}
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ── Style Picker (visual tiles) ────────────────────────────────────────────

interface StylePickerProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; preview: React.ReactNode }[];
  cols: number;
}

function StylePicker({ value, onChange, options, cols }: StylePickerProps) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all cursor-pointer',
            value === opt.value
              ? 'border-primary bg-surface'
              : 'border-body-text/15 bg-surface hover:border-body-text/30',
          ].join(' ')}
        >
          <div className={['w-10 h-10', value === opt.value ? 'text-primary' : 'text-body-text/40'].join(' ')}>
            {opt.preview}
          </div>
          <span className={['text-xs leading-tight text-center', value === opt.value ? 'font-semibold text-primary' : 'font-medium text-body-text/50'].join(' ')}>
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── SVG previews ───────────────────────────────────────────────────────────

function SquareDotPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <rect x="2" y="2" width="10" height="10" /><rect x="15" y="2" width="10" height="10" /><rect x="28" y="2" width="10" height="10" />
      <rect x="2" y="15" width="10" height="10" /><rect x="15" y="15" width="10" height="10" /><rect x="28" y="15" width="10" height="10" />
      <rect x="2" y="28" width="10" height="10" /><rect x="15" y="28" width="10" height="10" /><rect x="28" y="28" width="10" height="10" />
    </svg>
  );
}

function RoundedDotPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <rect x="2" y="2" width="10" height="10" rx="3" /><rect x="15" y="2" width="10" height="10" rx="3" /><rect x="28" y="2" width="10" height="10" rx="3" />
      <rect x="2" y="15" width="10" height="10" rx="3" /><rect x="15" y="15" width="10" height="10" rx="3" /><rect x="28" y="15" width="10" height="10" rx="3" />
      <rect x="2" y="28" width="10" height="10" rx="3" /><rect x="15" y="28" width="10" height="10" rx="3" /><rect x="28" y="28" width="10" height="10" rx="3" />
    </svg>
  );
}

function DotsPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <circle cx="7" cy="7" r="5" /><circle cx="20" cy="7" r="5" /><circle cx="33" cy="7" r="5" />
      <circle cx="7" cy="20" r="5" /><circle cx="20" cy="20" r="5" /><circle cx="33" cy="20" r="5" />
      <circle cx="7" cy="33" r="5" /><circle cx="20" cy="33" r="5" /><circle cx="33" cy="33" r="5" />
    </svg>
  );
}

function ClassyPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <polygon points="7,2 12,7 7,12 2,7" /><polygon points="20,2 25,7 20,12 15,7" /><polygon points="33,2 38,7 33,12 28,7" />
      <polygon points="7,15 12,20 7,25 2,20" /><polygon points="20,15 25,20 20,25 15,20" /><polygon points="33,15 38,20 33,25 28,20" />
      <polygon points="7,28 12,33 7,38 2,33" /><polygon points="20,28 25,33 20,38 15,33" /><polygon points="33,28 38,33 33,38 28,33" />
    </svg>
  );
}

function ClassyRoundedPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <rect x="2.5" y="2.5" width="9" height="9" rx="2" transform="rotate(45 7 7)" />
      <rect x="15.5" y="2.5" width="9" height="9" rx="2" transform="rotate(45 20 7)" />
      <rect x="28.5" y="2.5" width="9" height="9" rx="2" transform="rotate(45 33 7)" />
      <rect x="2.5" y="15.5" width="9" height="9" rx="2" transform="rotate(45 7 20)" />
      <rect x="15.5" y="15.5" width="9" height="9" rx="2" transform="rotate(45 20 20)" />
      <rect x="28.5" y="15.5" width="9" height="9" rx="2" transform="rotate(45 33 20)" />
      <rect x="2.5" y="28.5" width="9" height="9" rx="2" transform="rotate(45 7 33)" />
      <rect x="15.5" y="28.5" width="9" height="9" rx="2" transform="rotate(45 20 33)" />
      <rect x="28.5" y="28.5" width="9" height="9" rx="2" transform="rotate(45 33 33)" />
    </svg>
  );
}

function ExtraRoundedPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <rect x="2" y="2" width="10" height="10" rx="5" /><rect x="15" y="2" width="10" height="10" rx="5" /><rect x="28" y="2" width="10" height="10" rx="5" />
      <rect x="2" y="15" width="10" height="10" rx="5" /><rect x="15" y="15" width="10" height="10" rx="5" /><rect x="28" y="15" width="10" height="10" rx="5" />
      <rect x="2" y="28" width="10" height="10" rx="5" /><rect x="15" y="28" width="10" height="10" rx="5" /><rect x="28" y="28" width="10" height="10" rx="5" />
    </svg>
  );
}

function SquareCornerPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <rect x="5" y="5" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="5" />
      <rect x="14" y="14" width="12" height="12" />
    </svg>
  );
}

function DotCornerPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <rect x="5" y="5" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="20" cy="20" r="6" />
    </svg>
  );
}

function ExtraRoundedCornerPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <rect x="5" y="5" width="30" height="30" rx="9" fill="none" stroke="currentColor" strokeWidth="5" />
      <rect x="14" y="14" width="12" height="12" rx="4" />
    </svg>
  );
}

function RoundedCornerPreview() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%" aria-hidden="true">
      <rect x="5" y="5" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
      <rect x="14" y="14" width="12" height="12" />
    </svg>
  );
}

// ── Option lists ───────────────────────────────────────────────────────────

const DOT_TYPE_OPTIONS = [
  { value: 'square', label: 'Square', preview: <SquareDotPreview /> },
  { value: 'rounded', label: 'Rounded', preview: <RoundedDotPreview /> },
  { value: 'dots', label: 'Dots', preview: <DotsPreview /> },
  { value: 'classy', label: 'Classy', preview: <ClassyPreview /> },
  { value: 'classy-rounded', label: 'Classy Rounded', preview: <ClassyRoundedPreview /> },
  { value: 'extra-rounded', label: 'Extra Rounded', preview: <ExtraRoundedPreview /> },
];

const CORNER_TYPE_OPTIONS = [
  { value: 'square', label: 'Square', preview: <SquareCornerPreview /> },
  { value: 'dot', label: 'Dot', preview: <DotCornerPreview /> },
  { value: 'extra-rounded', label: 'Extra Rounded', preview: <ExtraRoundedCornerPreview /> },
  { value: 'rounded', label: 'Rounded', preview: <RoundedCornerPreview /> },
];

const ERROR_CORRECTION_OPTIONS = [
  { value: 'L', label: 'L — Low (7%)' },
  { value: 'M', label: 'M — Medium (15%)' },
  { value: 'Q', label: 'Q — Quartile (25%)' },
  { value: 'H', label: 'H — High (30%)' },
];

const EXPORT_SIZE_OPTIONS = [
  { value: '1024', label: '1024 px' },
  { value: '2048', label: '2048 px' },
  { value: '4096', label: '4096 px' },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"
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
  const inputId = `color-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={inputId} className="text-sm font-medium text-body-text w-24 shrink-0 cursor-pointer">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="cursor-pointer">
          <div
            className="w-9 h-9 rounded-full border-2 border-body-text/25 shadow-sm cursor-pointer hover:border-primary transition-colors"
            style={{ backgroundColor: value }}
          />
          <input id={inputId} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="sr-only" />
        </label>
        <code className="text-xs text-body-text/50 font-mono">{value.toUpperCase()}</code>
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
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-body-text">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-body-text/25 px-3 py-2.5 text-sm bg-surface text-body-text hover:border-body-text/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
