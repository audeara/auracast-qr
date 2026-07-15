import { describe, it, expect } from 'vitest';
import { formSchema } from '../schema';

const base = {
  BN: 'Test Name',
  BI: '1A2B3C',
  AD: '',
  AT: '0' as const,
  quality: 'none' as const,
  encrypted: false,
};

describe('formSchema — BN (Broadcast Name)', () => {
  it('accepts 4-character minimum', () => {
    expect(formSchema.safeParse({ ...base, BN: 'abcd' }).success).toBe(true);
  });

  it('accepts 32-character maximum', () => {
    expect(formSchema.safeParse({ ...base, BN: 'a'.repeat(32) }).success).toBe(true);
  });

  it('rejects fewer than 4 characters', () => {
    expect(formSchema.safeParse({ ...base, BN: 'abc' }).success).toBe(false);
  });

  it('rejects more than 32 characters', () => {
    expect(formSchema.safeParse({ ...base, BN: 'a'.repeat(33) }).success).toBe(false);
  });
});

describe('formSchema — BI (Broadcast ID)', () => {
  it('accepts 1 uppercase hex character', () => {
    expect(formSchema.safeParse({ ...base, BI: 'A' }).success).toBe(true);
  });

  it('accepts 6 hex characters', () => {
    expect(formSchema.safeParse({ ...base, BI: '1A2B3C' }).success).toBe(true);
  });

  it('accepts lowercase hex', () => {
    expect(formSchema.safeParse({ ...base, BI: '1a2b3c' }).success).toBe(true);
  });

  it('rejects empty string', () => {
    expect(formSchema.safeParse({ ...base, BI: '' }).success).toBe(false);
  });

  it('rejects more than 6 hex characters', () => {
    expect(formSchema.safeParse({ ...base, BI: '1A2B3C4' }).success).toBe(false);
  });

  it('rejects non-hex characters', () => {
    expect(formSchema.safeParse({ ...base, BI: 'GGGGGG' }).success).toBe(false);
  });
});

describe('formSchema — AD (Device Address)', () => {
  it('accepts empty string', () => {
    expect(formSchema.safeParse({ ...base, AD: '' }).success).toBe(true);
  });

  it('accepts 12 hex characters without colons', () => {
    expect(formSchema.safeParse({ ...base, AD: 'AABBCCDDEEFF' }).success).toBe(true);
  });

  it('accepts colon-separated MAC address', () => {
    expect(formSchema.safeParse({ ...base, AD: 'AA:BB:CC:DD:EE:FF' }).success).toBe(true);
  });

  it('rejects 11 hex characters', () => {
    expect(formSchema.safeParse({ ...base, AD: 'AABBCCDDEE0' }).success).toBe(false);
  });

  it('rejects non-hex characters', () => {
    expect(formSchema.safeParse({ ...base, AD: 'AABBCCDDEEGG' }).success).toBe(false);
  });
});

describe('formSchema — AT (Address Type)', () => {
  it('accepts "0" (Public)', () => {
    expect(formSchema.safeParse({ ...base, AT: '0' }).success).toBe(true);
  });

  it('accepts "1" (Random)', () => {
    expect(formSchema.safeParse({ ...base, AT: '1' }).success).toBe(true);
  });

  it('rejects other values', () => {
    expect(formSchema.safeParse({ ...base, AT: '2' }).success).toBe(false);
  });
});

describe('formSchema — quality', () => {
  it.each(['none', 'sq', 'hq', 'both'] as const)('accepts "%s"', (quality) => {
    expect(formSchema.safeParse({ ...base, quality }).success).toBe(true);
  });

  it('rejects invalid quality value', () => {
    expect(formSchema.safeParse({ ...base, quality: 'ultra' }).success).toBe(false);
  });
});

describe('formSchema — encrypted / BC (Broadcast Code)', () => {
  it('accepts encrypted=false with no BC', () => {
    expect(formSchema.safeParse({ ...base, encrypted: false }).success).toBe(true);
  });

  it('accepts encrypted=true with BC provided', () => {
    expect(formSchema.safeParse({ ...base, encrypted: true, BC: 'secret' }).success).toBe(true);
  });

  it('rejects encrypted=true with no BC', () => {
    expect(formSchema.safeParse({ ...base, encrypted: true }).success).toBe(false);
  });

  it('rejects BC longer than 16 characters', () => {
    expect(formSchema.safeParse({ ...base, encrypted: true, BC: 'a'.repeat(17) }).success).toBe(false);
  });

  it('accepts BC up to 16 characters', () => {
    expect(formSchema.safeParse({ ...base, encrypted: true, BC: 'a'.repeat(16) }).success).toBe(true);
  });
});
