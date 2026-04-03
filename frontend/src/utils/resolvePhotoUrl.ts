import api from '../services/api';

export const resolvePhotoUrl = (url?: string | null) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  const baseUrl = api.defaults.baseURL || process.env.REACT_APP_API_URL || window.location.origin;

  return new URL(normalizedPath, baseUrl).toString();
};
