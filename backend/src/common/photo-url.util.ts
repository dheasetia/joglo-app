const LEGACY_LOCAL_UPLOAD_PREFIXES = ['/uploads/', 'uploads/'];

export const sanitizePhotoUrl = (photoUrl?: string | null) => {
  if (!photoUrl) {
    return null;
  }

  const trimmed = photoUrl.trim();
  if (!trimmed) {
    return null;
  }

  const isLegacyLocalPath = LEGACY_LOCAL_UPLOAD_PREFIXES.some((prefix) =>
    trimmed.startsWith(prefix),
  );

  const isLegacyLocalAbsoluteUrl = (() => {
    if (!/^https?:\/\//i.test(trimmed)) {
      return false;
    }

    try {
      const parsed = new URL(trimmed);
      return LEGACY_LOCAL_UPLOAD_PREFIXES.some((prefix) => parsed.pathname.startsWith(prefix));
    } catch {
      return false;
    }
  })();

  if (isLegacyLocalPath || isLegacyLocalAbsoluteUrl) {
    return null;
  }

  return trimmed;
};
