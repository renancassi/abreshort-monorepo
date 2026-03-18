import * as QRCode from 'qrcode';

export async function generateQrCode(url: string) {
    const qrCodeBase64 = await QRCode.toDataURL(url);
    return qrCodeBase64;
}