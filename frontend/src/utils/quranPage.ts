const MADINAH_MUSHAF_TOTAL_PAGES = 604;

const MADINAH_JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182,
  202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

const normalizePage = (page?: number | null): number | undefined => {
  if (typeof page !== 'number' || Number.isNaN(page)) {
    return undefined;
  }

  const normalized = Math.trunc(page);
  if (normalized < 1 || normalized > MADINAH_MUSHAF_TOTAL_PAGES) {
    return undefined;
  }

  return normalized;
};

export const getJuzFromMadinahPage = (page?: number | null): number | undefined => {
  const validPage = normalizePage(page);
  if (!validPage) {
    return undefined;
  }

  for (let i = MADINAH_JUZ_START_PAGES.length - 1; i >= 0; i -= 1) {
    if (validPage >= MADINAH_JUZ_START_PAGES[i]) {
      return i + 1;
    }
  }

  return undefined;
};

export const formatPageRangeWithJuz = (startPage?: number | null, endPage?: number | null): string => {
  const start = normalizePage(startPage);
  const end = normalizePage(endPage);

  if (!start && !end) {
    return '-';
  }

  if (start && end) {
    const startJuz = getJuzFromMadinahPage(start);
    const endJuz = getJuzFromMadinahPage(end);

    if (startJuz && endJuz) {
      const juzText = startJuz === endJuz
        ? `Juz ${startJuz}`
        : `Juz ${startJuz} - Juz ${endJuz}`;

      return `Hal ${start}-${end} (${juzText})`;
    }

    return `Hal ${start}-${end}`;
  }

  const page = start || end;
  const juz = getJuzFromMadinahPage(page);
  return juz ? `Hal ${page} (Juz ${juz})` : `Hal ${page}`;
};
