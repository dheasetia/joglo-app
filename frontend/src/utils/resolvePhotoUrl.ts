import api from '../services/api';

export const resolvePhotoUrl = (url?: string | null) => {
  if (!url) return '';
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '';

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
    return '';
  }

  if (/^https?:\/\//i.test(trimmedUrl)) return trimmedUrl;

  const normalizedPath = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;
  const baseUrl = api.defaults.baseURL || process.env.REACT_APP_API_URL || window.location.origin;

  return new URL(normalizedPath, baseUrl).toString();
};
