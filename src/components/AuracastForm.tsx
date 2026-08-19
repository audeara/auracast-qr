'use client';

import { useEffect, useCallback, useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formSchema, FormValues } from '@/lib/schema';
import { encodeUri } from '@/lib/uri-encoder';
import type en from '@/dictionaries/en.json';

type FormDict = typeof en.form;

type FormInput = z.input<typeof formSchema>;

export type FormUrlValues = {
  BN: string;
  BI: string;
  AD: string;
  AT: '0' | '1';
  AS: string;
  PI: string;
  quality: 'none' | 'sq' | 'hq' | 'both';
  encrypted: boolean;
  BC: string;
};

interface AuracastFormProps {
  initialValues?: Partial<FormUrlValues>;
  onUriChange: (uri: string | null) => void;
  onBroadcastNameChange?: (name: string) => void;
  onFormValuesChange?: (values: FormUrlValues) => void;
  dict: FormDict;
}

export default function AuracastForm({
  initialValues,
  onUriChange,
  onBroadcastNameChange,
  onFormValuesChange,
  dict,
}: AuracastFormProps) {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      BN: initialValues?.BN ?? '',
      BI: initialValues?.BI ?? '',
      AD: initialValues?.AD ?? '',
      AT: initialValues?.AT ?? '0',
      AS: initialValues?.AS ?? '',
      PI: initialValues?.PI ?? '',
      quality: initialValues?.quality ?? 'none',
      encrypted: initialValues?.encrypted ?? false,
      BC: initialValues?.BC ?? '',
    },
  });

  const values = useWatch({ control });
  const encrypted = useWatch({ control, name: 'encrypted' });

  const computeUri = useCallback((vals: Partial<FormInput>) => {
    const bn = vals.BN ?? '';
    if (bn.length < 4) return null;
    const result = formSchema.safeParse(vals);
    if (!result.success) return null;
    return encodeUri(result.data);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onUriChange(computeUri(values as Partial<FormInput>));
      onBroadcastNameChange?.(values.BN ?? '');
      onFormValuesChange?.({
        BN: values.BN ?? '',
        BI: values.BI ?? '',
        AD: values.AD ?? '',
        AT: (values.AT as '0' | '1') ?? '0',
        AS: values.AS ?? '',
        PI: values.PI ?? '',
        quality: (values.quality as 'none' | 'sq' | 'hq' | 'both') ?? 'none',
        encrypted: values.encrypted ?? false,
        BC: values.BC ?? '',
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [values, computeUri, onUriChange, onBroadcastNameChange, onFormValuesChange]);

  function formatMacAddress(raw: string): string {
    const hex = raw.replace(/[^0-9A-Fa-f]/g, '');
    const chunks = hex.match(/.{1,2}/g) ?? [];
    return chunks.slice(0, 6).join(':');
  }

  function handleAdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatMacAddress(e.target.value);
    const currentAd = getValues('AD');
    setValue('AD', formatted, { shouldValidate: !!currentAd });
  }

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const qualityOptions = [
    { value: 'none' as const, label: dict.audioQuality.none },
    { value: 'sq' as const, label: dict.audioQuality.standard },
    { value: 'hq' as const, label: dict.audioQuality.high },
    { value: 'both' as const, label: dict.audioQuality.both },
  ];

  return (
    <form className="space-y-6" noValidate>
      {/* ── Always-visible fields ── */}
      <Field label={dict.broadcastName.label} error={errors.BN?.message} required>
        <input
          {...register('BN')}
          type="text"
          placeholder={dict.broadcastName.placeholder}
          maxLength={32}
          className={inputClass(!!errors.BN)}
        />
      </Field>

      <Field
        label={dict.broadcastId.label}
        error={errors.BI?.message}
        hint={dict.broadcastId.hint}
        hintWarn
        tooltip={dict.broadcastId.tooltip}
      >
        <input
          {...register('BI')}
          type="text"
          placeholder={dict.broadcastId.placeholder}
          maxLength={6}
          className={inputClass(!!errors.BI)}
        />
      </Field>

      <Field
        label={dict.deviceAddress.label}
        error={errors.AD?.message}
        hint={dict.deviceAddress.hint}
        hintWarn
        tooltip={dict.deviceAddress.tooltip}
      >
        <input
          {...register('AD')}
          type="text"
          placeholder={dict.deviceAddress.placeholder}
          maxLength={17}
          onChange={handleAdChange}
          className={inputClass(!!errors.AD)}
        />
      </Field>

      <div className="flex items-center gap-3">
        <label htmlFor="encrypted" className="text-base font-medium text-body-text cursor-pointer">
          {dict.encrypted.label}
        </label>
        <Tooltip text={dict.encrypted.tooltip} />
        <label htmlFor="encrypted" className="relative inline-flex items-center cursor-pointer">
          <input
            {...register('encrypted')}
            type="checkbox"
            id="encrypted"
            className="sr-only peer"
          />
          <div className="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out bg-gray-300 peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform after:duration-200 after:ease-in-out peer-checked:after:translate-x-5" />
        </label>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${encrypted ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <Field
            label={dict.broadcastCode.label}
            error={errors.BC?.message}
            required
            hint={dict.broadcastCode.hint}
            tooltip={dict.broadcastCode.tooltip}
          >
            <input
              {...register('BC')}
              type="text"
              placeholder={dict.broadcastCode.placeholder}
              maxLength={16}
              className={inputClass(!!errors.BC)}
            />
          </Field>
        </div>
      </div>

      {/* ── Advanced accordion ── */}
      <div className="border border-body-text/15 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setAdvancedOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 text-base font-semibold text-body-text hover:bg-primary/5 transition-colors"
          aria-expanded={advancedOpen}
        >
          <span>{dict.advanced}</span>
          <svg
            width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            className={['transition-transform duration-200', advancedOpen ? 'rotate-180' : ''].join(' ')}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {advancedOpen && (
          <div className="px-5 pb-6 border-t border-body-text/15">
            <div className="pt-6 space-y-6">

              <Field
                label={dict.addressType.label}
                error={errors.AT?.message}
                tooltip={dict.addressType.tooltip}
              >
                <Controller
                  control={control}
                  name="AT"
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {(['0', '1'] as const).map((val) => (
                        <label
                          key={val}
                          className={[
                            'flex-1 text-center text-base font-medium py-3 rounded-xl border-2 cursor-pointer transition-colors select-none',
                            field.value === val
                              ? 'bg-primary text-white border-primary'
                              : 'bg-surface text-body-text border-primary hover:bg-primary/5',
                          ].join(' ')}
                        >
                          <input
                            type="radio"
                            value={val}
                            checked={field.value === val}
                            onChange={() => field.onChange(val)}
                            className="sr-only"
                          />
                          {val === '0' ? dict.addressType.public : dict.addressType.random}
                        </label>
                      ))}
                    </div>
                  )}
                />
              </Field>

              <Field
                label={dict.advertisingSid.label}
                error={errors.AS?.message}
                hint={dict.advertisingSid.hint}
                tooltip={dict.advertisingSid.tooltip}
              >
                <input
                  {...register('AS')}
                  type="text"
                  inputMode="numeric"
                  placeholder={dict.advertisingSid.placeholder}
                  maxLength={2}
                  className={inputClass(!!errors.AS)}
                />
              </Field>

              <Field
                label={dict.paInterval.label}
                error={errors.PI?.message}
                hint={dict.paInterval.hint}
                tooltip={dict.paInterval.tooltip}
              >
                <input
                  {...register('PI')}
                  type="text"
                  placeholder={dict.paInterval.placeholder}
                  maxLength={4}
                  className={inputClass(!!errors.PI)}
                />
              </Field>

              <Field
                label={dict.audioQuality.label}
                error={errors.quality?.message}
                tooltip={dict.audioQuality.tooltip}
              >
                <Controller
                  control={control}
                  name="quality"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      {qualityOptions.map((opt) => (
                        <label
                          key={opt.value}
                          className={[
                            'text-center text-base font-medium py-3 rounded-xl border-2 cursor-pointer transition-colors select-none',
                            field.value === opt.value
                              ? 'bg-primary text-white border-primary'
                              : 'bg-surface text-body-text border-primary hover:bg-primary/5',
                          ].join(' ')}
                        >
                          <input
                            type="radio"
                            value={opt.value}
                            checked={field.value === opt.value}
                            onChange={() => field.onChange(opt.value)}
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  )}
                />
              </Field>

            </div>
          </div>
        )}
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return [
    'w-full rounded-xl border-2 px-4 py-3 text-base bg-surface text-body-text placeholder:text-body-text/40',
    'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
    'transition-colors',
    hasError
      ? 'border-error focus:ring-error/30 focus:border-error'
      : 'border-body-text/25 hover:border-body-text/40',
  ].join(' ');
}

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  hintWarn?: boolean;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}

function Field({ label, error, hint, hintWarn, required, tooltip, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <span className="flex items-center gap-1">
        <label className="block text-sm font-semibold text-body-text">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
        {tooltip && <Tooltip text={tooltip} />}
      </span>
      {children}
      {hint && !error && (
        hintWarn ? (
          <p className="flex items-start gap-1 text-xs font-medium text-amber-600">
            <WarningIcon />
            <span>{hint}</span>
          </p>
        ) : (
          <p className="text-xs text-body-text/50">{hint}</p>
        )
      )}
      {error && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function WarningIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 mt-px"
    >
      <path
        d="M12 3.5L2.5 20h19L12 3.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.75" r="1.1" fill="currentColor" />
    </svg>
  );
}

function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        aria-label="More information"
        className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-body-text/10 text-body-text/50 text-[10px] font-bold leading-none cursor-help focus:outline-none focus:ring-2 focus:ring-primary/40 hover:bg-primary/20 hover:text-primary transition-colors"
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-full mt-2 w-72 bg-neutral-900 border border-white/10 text-white text-xs rounded-xl p-3 z-20 leading-relaxed shadow-xl"
        >
          {text}
          <span className="absolute -top-1.5 left-2 border-4 border-transparent border-b-neutral-900" />
        </span>
      )}
    </span>
  );
}
