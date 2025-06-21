import midtransClient from 'midtrans-client';

// Konfigurasi Midtrans Snap
const snap = new midtransClient.Snap({
    isProduction: false, // Ubah menjadi `true` jika menggunakan mode produksi
    serverKey: 'SB-Mid-server-CEsX-3UaJAvJb8VUlnppza10',
    clientKey: 'SB-Mid-client-5QfeNVJ5TYsqWP2C',
});

// Konfigurasi Midtrans Core API (untuk status checking)
const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'SB-Mid-server-CEsX-3UaJAvJb8VUlnppza10',
    clientKey: 'SB-Mid-client-5QfeNVJ5TYsqWP2C',
});

export { snap, coreApi };
export default snap;