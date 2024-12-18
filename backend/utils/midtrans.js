import midtransClient from 'midtrans-client';

// Konfigurasi Midtrans
const snap = new midtransClient.Snap({
    isProduction: false, // Ubah menjadi `true` jika menggunakan mode produksi
    serverKey: 'SB-Mid-server-1Uh0f2R-HOozKNPgs30r4UPk',
    clientKey: 'SB-Mid-client-bLyCTxF0vgytyCs9',
});

export default snap;