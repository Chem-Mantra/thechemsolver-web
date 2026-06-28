// Exact-match only — never a guess. If the IUPAC name isn't in this table, no
// common name is shown (RULES.md / design doc: "fallback behaviour" for
// common names is to show nothing, not to approximate one).
export const COMMON_NAMES: Record<string, string> = {
  ethene: 'ethylene',
  propene: 'propylene',
  ethyne: 'acetylene',
  '2-methylpropane': 'isobutane',
  '2-methylbutane': 'isopentane',
  '2,2-dimethylpropane': 'neopentane',
  'propan-2-ol': 'isopropyl alcohol',
  methanamine: 'methylamine',
  ethanamine: 'ethylamine',
  methylbenzene: 'toluene',
  '1,2-dimethylbenzene': 'ortho-xylene',
  '1,3-dimethylbenzene': 'meta-xylene',
  '1,4-dimethylbenzene': 'para-xylene',
  'methanoic acid': 'formic acid',
  'ethanoic acid': 'acetic acid',
  'propanoic acid': 'propionic acid',
  methanal: 'formaldehyde',
  ethanal: 'acetaldehyde',
  'propan-2-one': 'acetone',
  ethanenitrile: 'acetonitrile',
  ethanamide: 'acetamide',
  'ethanoyl chloride': 'acetyl chloride',
  'methyl ethanoate': 'methyl acetate',
  'bicyclo[4.4.0]decane': 'decalin',
}

export function lookupCommonName(iupacName: string): string | undefined {
  return COMMON_NAMES[iupacName]
}
