"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePhotoUrl = void 0;
const LEGACY_LOCAL_UPLOAD_PREFIXES = ['/uploads/', 'uploads/'];
const sanitizePhotoUrl = (photoUrl) => {
    if (!photoUrl) {
        return null;
    }
    const trimmed = photoUrl.trim();
    if (!trimmed) {
        return null;
    }
    const isLegacyLocalPath = LEGACY_LOCAL_UPLOAD_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
    const isLegacyLocalAbsoluteUrl = (() => {
        if (!/^https?:\/\//i.test(trimmed)) {
            return false;
        }
        try {
            const parsed = new URL(trimmed);
            return LEGACY_LOCAL_UPLOAD_PREFIXES.some((prefix) => parsed.pathname.startsWith(prefix));
        }
        catch {
            return false;
        }
    })();
    if (isLegacyLocalPath || isLegacyLocalAbsoluteUrl) {
        return null;
    }
    return trimmed;
};
exports.sanitizePhotoUrl = sanitizePhotoUrl;
//# sourceMappingURL=photo-url.util.js.map