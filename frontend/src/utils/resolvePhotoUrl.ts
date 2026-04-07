import api from '../services/api';

export const resolvePhotoUrl = (url?: string | null): string | null => {
  if (!url) return null;
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  const isLegacyLocalUploadPath = /^\/?uploads\//i.test(trimmedUrl);
  const isLegacyLocalUploadAbsoluteUrl = (() => {
    if (!/^https?:\/\//i.test(trimmedUrl)) return false;
    try {
      const parsed = new URL(trimmedUrl);
      return /^\/uploads\//i.test(parsed.pathname);
    } catch {
      return false;
    }
  })();

  if (isLegacyLocalUploadPath || isLegacyLocalUploadAbsoluteUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmedUrl)) return trimmedUrl;

  const isS3ObjectKey = trimmedUrl.includes('/') && !trimmedUrl.startsWith('http') && !trimmedUrl.startsWith('/');
  if (isS3ObjectKey) {
    // Jika path S3, biarkan backend yang membuat presigned URL. 
    // Di frontend kita kembalikan null agar tidak mencoba memuat URL lokal yang salah.
    // KECUALI jika URL mengandung parameter presigned (misal ?X-Amz-Algorithm)
    if (trimmedUrl.includes('?X-Amz-Algorithm=') || trimmedUrl.includes('&X-Amz-Algorithm=')) {
      return trimmedUrl;
    }
    return null;
  }

  const normalizedPath = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;

  // Aset lokal aplikasi (misal: /logo.png atau /joglo_icon.png)
  // File statis di folder public React
  const staticAssets = ['/joglo_icon.png', '/logo.png', '/favicon.ico', '/tahmis.png'];
  if (staticAssets.includes(normalizedPath) || !trimmedUrl.includes('/')) {
    return `${window.location.origin}${normalizedPath}`;
  }

  const baseUrl = api.defaults.baseURL || process.env.REACT_APP_API_URL || window.location.origin;

  return new URL(normalizedPath, baseUrl).toString();
};
