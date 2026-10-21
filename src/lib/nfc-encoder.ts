import { NfcCardConfig } from './types';

export function generateTapRouterUrl(cardId: string, baseUrl: string = 'https://townraise.org'): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  return `${cleanBase}/tap/${encodeURIComponent(cardId)}`;
}

export function isWebNfcSupported(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window;
}

export async function writeNfcRewardCardWithWebNfc(
  card: NfcCardConfig,
  baseUrl: string = typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org'
): Promise<{ success: boolean; message: string; serialNumber?: string }> {
  if (!isWebNfcSupported()) {
    return {
      success: false,
      message: 'Web NFC is only supported on Android Chrome/Edge. On iPhone or Desktop, copy the NFC Tap URL below and write it with the free "NFC Tools" app!'
    };
  }

  try {
    const NDEFReaderClass = (window as any).NDEFReader;
    const ndef = new NDEFReaderClass();
    const tapUrl = generateTapRouterUrl(card.id, baseUrl);

    await ndef.write({
      records: [
        {
          recordType: 'url',
          data: tapUrl
        }
      ]
    });

    return {
      success: true,
      message: `Successfully programmed NFC Reward Card for ${card.businessName}! Target URL: ${tapUrl}`
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to write to physical NFC card. Hold the card steady against the back of your phone and try again.'
    };
  }
}

export async function scanPhysicalNfcCard(): Promise<{
  success: boolean;
  serialNumber?: string;
  records?: { recordType: string; data: string }[];
  message: string;
}> {
  if (!isWebNfcSupported()) {
    return {
      success: false,
      message: 'Web NFC hardware scanning requires Android Chrome/Edge.'
    };
  }

  return new Promise(async (resolve) => {
    try {
      const NDEFReaderClass = (window as any).NDEFReader;
      const ndef = new NDEFReaderClass();
      await ndef.scan();

      const timeout = setTimeout(() => {
        resolve({
          success: false,
          message: 'Scan timed out (15s). Hold your physical NFC card against the back of your phone and try again.'
        });
      }, 15000);

      ndef.onreading = (event: any) => {
        clearTimeout(timeout);
        const serialNumber = event.serialNumber || 'UID-DETECTED';
        const parsedRecords: { recordType: string; data: string }[] = [];
        if (event.message?.records) {
          for (const rec of event.message.records) {
            try {
              const decoder = new TextDecoder();
              parsedRecords.push({
                recordType: rec.recordType,
                data: decoder.decode(rec.data)
              });
            } catch {
              parsedRecords.push({
                recordType: rec.recordType,
                data: '[Binary NDEF Payload]'
              });
            }
          }
        }
        resolve({
          success: true,
          serialNumber,
          records: parsedRecords,
          message: `Card Scanned! UID: ${serialNumber}`
        });
      };

      ndef.onreadingerror = () => {
        clearTimeout(timeout);
        resolve({
          success: false,
          message: 'Error reading NFC tag. Please hold the card steady.'
        });
      };
    } catch (err: any) {
      resolve({
        success: false,
        message: err?.message || 'Unable to start Web NFC scanner.'
      });
    }
  });
}
