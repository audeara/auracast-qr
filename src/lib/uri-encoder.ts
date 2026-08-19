import type { FormValues } from './schema';

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function bcToBase64(bc: string): string {
  const padded = new Uint8Array(16);
  const encoded = new TextEncoder().encode(bc);
  padded.set(encoded.subarray(0, 16));
  let binary = '';
  for (const byte of padded) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function encodeUri(values: FormValues): string {
  const segments: string[] = ['BLUETOOTH:UUID:184F'];

  // Field order follows the Bluetooth SIG Broadcast Audio URI spec:
  // BN → SQ/HQ → AT → AD → AS → BI → PI → BC. Order matters — some
  // assistants (e.g. Oticon) reject the code if the quality flag does
  // not appear directly after BN.
  segments.push(`BN:${utf8ToBase64(values.BN)}`);

  if (values.quality === 'sq' || values.quality === 'both') {
    segments.push('SQ:1');
  }
  if (values.quality === 'hq' || values.quality === 'both') {
    segments.push('HQ:1');
  }

  const ad = values.AD ? values.AD.replace(/:/g, '').toUpperCase() : '';
  if (ad) {
    segments.push(`AT:${values.AT}`);
    segments.push(`AD:${ad}`);
  }

  if (values.AS) {
    segments.push(`AS:${values.AS}`);
  }

  if (values.BI) {
    segments.push(`BI:${values.BI.toUpperCase()}`);
  }

  if (values.PI) {
    segments.push(`PI:${values.PI.toUpperCase()}`);
  }

  if (values.encrypted && values.BC) {
    segments.push(`BC:${bcToBase64(values.BC)}`);
  }

  return segments.join(';') + ';;';
}
