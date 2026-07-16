import { describe, it, expect } from 'vitest';
import { encodeUri } from '../uri-encoder';
import type { FormValues } from '../schema';

const base: FormValues = {
  BN: 'Test',
  BI: '1A2B',
  AD: '',
  AT: '0',
  quality: 'none',
  encrypted: false,
};

function b64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

describe('encodeUri — structure', () => {
  it('always begins with BLUETOOTH:UUID:184F', () => {
    expect(encodeUri(base)).toMatch(/^BLUETOOTH:UUID:184F;/);
  });

  it('always terminates with ;;', () => {
    expect(encodeUri(base)).toMatch(/;;$/);
  });
});

describe('encodeUri — BN (Broadcast Name)', () => {
  it('base64-encodes the broadcast name', () => {
    const uri = encodeUri({ ...base, BN: 'AuraTest' });
    expect(uri).toContain(`BN:${b64('AuraTest')}`);
  });

  it('UTF-8 encodes non-ASCII characters', () => {
    const uri = encodeUri({ ...base, BN: 'Café' });
    expect(uri).toContain(`BN:${b64('Café')}`);
  });
});

describe('encodeUri — BI (Broadcast ID)', () => {
  it('uppercases the broadcast ID', () => {
    const uri = encodeUri({ ...base, BI: '1a2b3c' });
    expect(uri).toContain('BI:1A2B3C');
  });

  it('includes the BI segment', () => {
    const uri = encodeUri({ ...base, BI: 'FF00' });
    expect(uri).toContain('BI:FF00');
  });

  it('omits BI when BI is empty', () => {
    const uri = encodeUri({ ...base, BI: '' });
    expect(uri).not.toContain('BI:');
  });
});

describe('encodeUri — AD / AT (Device Address)', () => {
  it('omits AT and AD when address is empty', () => {
    const uri = encodeUri({ ...base, AD: '' });
    expect(uri).not.toContain('AT:');
    expect(uri).not.toContain('AD:');
  });

  it('includes AT and AD when address is provided', () => {
    const uri = encodeUri({ ...base, AT: '1', AD: 'AABBCCDDEEFF' });
    expect(uri).toContain('AT:1');
    expect(uri).toContain('AD:AABBCCDDEEFF');
  });

  it('strips colon separators from device address', () => {
    const uri = encodeUri({ ...base, AT: '0', AD: 'AA:BB:CC:DD:EE:FF' });
    expect(uri).toContain('AD:AABBCCDDEEFF');
    expect(uri).not.toContain('AA:BB');
  });

  it('uppercases the device address', () => {
    const uri = encodeUri({ ...base, AT: '0', AD: 'aabbccddeeff' });
    expect(uri).toContain('AD:AABBCCDDEEFF');
  });
});

describe('encodeUri — quality', () => {
  it('omits SQ and HQ when quality is none', () => {
    const uri = encodeUri({ ...base, quality: 'none' });
    expect(uri).not.toContain('SQ:');
    expect(uri).not.toContain('HQ:');
  });

  it('includes SQ:1 when quality is sq', () => {
    const uri = encodeUri({ ...base, quality: 'sq' });
    expect(uri).toContain('SQ:1');
    expect(uri).not.toContain('HQ:');
  });

  it('includes HQ:1 when quality is hq', () => {
    const uri = encodeUri({ ...base, quality: 'hq' });
    expect(uri).toContain('HQ:1');
    expect(uri).not.toContain('SQ:');
  });

  it('includes SQ:1 and HQ:1 when quality is both', () => {
    const uri = encodeUri({ ...base, quality: 'both' });
    expect(uri).toContain('SQ:1');
    expect(uri).toContain('HQ:1');
  });
});

describe('encodeUri — BC (Broadcast Code)', () => {
  it('omits BC when encrypted is false', () => {
    const uri = encodeUri({ ...base, encrypted: false, BC: 'secret' });
    expect(uri).not.toContain('BC:');
  });

  it('includes BC when encrypted is true', () => {
    const uri = encodeUri({ ...base, encrypted: true, BC: 'secret' });
    expect(uri).toContain('BC:');
  });

  it('null-pads BC to 16 bytes before base64-encoding', () => {
    const padded = new Uint8Array(16);
    const encoded = new TextEncoder().encode('secret');
    padded.set(encoded);
    let binary = '';
    for (const byte of padded) binary += String.fromCharCode(byte);
    const expected = btoa(binary);

    const uri = encodeUri({ ...base, encrypted: true, BC: 'secret' });
    expect(uri).toContain(`BC:${expected}`);
  });
});

describe('encodeUri — no empty segments', () => {
  it('produces no empty segment placeholders', () => {
    const uri = encodeUri(base);
    expect(uri).not.toMatch(/:[;]/);
  });
});
