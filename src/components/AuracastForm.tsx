'use client';

import { useEffect, useCallback } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formSchema, FormValues } from '@/lib/schema';
import { encodeUri } from '@/lib/uri-encoder';

type FormInput = z.input<typeof formSchema>;

export type FormUrlValues = {
  BN: string;
  BI: string;
  AD: string;
  AT: '0' | '1';
  quality: 'none' | 'sq' | 'hq' | 'both';
  encrypted: boolean;
  BC: string;
};

interface AuracastFormProps {
  initialValues?: Partial<FormUrlValues>;
  onUriChange: (uri: string | null) => void;
  onBroadcastNameChange?: (name: string) => void;
  onFormValuesChange?: (values: FormUrlValues) => void;
}

export default function AuracastForm({
  initialValues,
  onUriChange,
  onBroadcastNameChange,
  onFormValuesChange,
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

  return (
    <form className="space-y-5" noValidate>
      <Field label="Broadcast Name" error={errors.BN?.message} required>
        <input
          {...register('BN')}
          type="text"
          placeholder="e.g. Main Hall Audio"
          maxLength={32}
          className={inputClass(!!errors.BN)}
        />
      </Field>

      <Field label="Broadcast ID" error={errors.BI?.message} required>
        <input
          {...register('BI')}
          type="text"
          placeholder="e.g. 1A2B"
          maxLength={6}
          className={inputClass(!!errors.BI)}
        />
      </Field>

      <Field label="Device Address" error={errors.AD?.message} hint="Optional — 12 hex characters">
        <input
          {...register('AD')}
          type="text"
          placeholder="AA:BB:CC:00:11:22"
          maxLength={17}
          onChange={handleAdChange}
          className={inputClass(!!errors.AD)}
        />
      </Field>

      <Field label="Address Type" error={errors.AT?.message}>
        <Controller
          control={control}
          name="AT"
          render={({ field }) => (
            <div className="flex gap-2">
              {(['0', '1'] as const).map((val) => (
                <label
                  key={val}
                  className={[
                    'flex-1 text-center text-sm font-medium py-2 rounded-lg border cursor-pointer transition-colors select-none',
                    field.value === val
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-body-text border-primary-tint hover:border-primary/40',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    value={val}
                    checked={field.value === val}
                    onChange={() => field.onChange(val)}
                    className="sr-only"
                  />
                  {val === '0' ? 'Public' : 'Random'}
                </label>
              ))}
            </div>
          )}
        />
      </Field>

      <Field label="Audio Quality" error={errors.quality?.message}>
        <select {...register('quality')} className={inputClass(!!errors.quality)}>
          <option value="none">Not specified</option>
          <option value="sq">Standard Quality</option>
          <option value="hq">High Quality</option>
          <option value="both">Both</option>
        </select>
      </Field>

      <div className="flex items-center gap-3">
        <input
          {...register('encrypted')}
          type="checkbox"
          id="encrypted"
          className="w-4 h-4 rounded border-primary-tint accent-primary cursor-pointer"
        />
        <label htmlFor="encrypted" className="text-sm font-medium text-body-text cursor-pointer">
          Encrypted broadcast
        </label>
      </div>

      {encrypted && (
        <Field label="Broadcast Code" error={errors.BC?.message} required hint="Max 16 characters">
          <input
            {...register('BC')}
            type="text"
            placeholder="Enter broadcast code"
            maxLength={16}
            className={inputClass(!!errors.BC)}
          />
        </Field>
      )}
    </form>
  );
}

function inputClass(hasError: boolean) {
  return [
    'w-full rounded-lg border px-3 py-2 text-sm bg-white text-body-text',
    'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
    'transition-colors',
    hasError
      ? 'border-error focus:ring-error/30 focus:border-error'
      : 'border-primary-tint hover:border-primary/40',
  ].join(' ');
}

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-body-text">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-body-text/50">{hint}</p>}
      {error && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
