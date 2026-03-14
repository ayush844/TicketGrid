import QRCode from "qrcode"


export const generateQRCode = async (data: string) => {
    return await QRCode.toDataURL(data);
}