import { Resend } from 'resend'
import { resolveCompoundToSmiles, findPatentsForCompound, type FtoLiveHit } from './pubchemFtoSearch'

// Shared by both check-payment/compound routes (PayPal, Razorpay) -- the
// compound-input side of Instant Compound Check, alongside the existing
// patent-number side. Unlike a patent-number lookup (which resolves to one
// pre-computed, reusable product_results row), a compound search is
// query-specific to the client's own input, so there's nothing to persist
// for future customers to reuse -- the result is built once, per purchase,
// and both returned in the API response (so the modal can show it
// immediately) and emailed (so the client has a copy).
export type CompoundCheckResult =
  | { status: 'unresolved' } // couldn't turn the input into a real structure at all
  | { status: 'resolved'; smiles: string; hits: FtoLiveHit[] }

export async function runCompoundCheck(compoundInput: string): Promise<CompoundCheckResult> {
  const smiles = await resolveCompoundToSmiles(compoundInput)
  if (!smiles) return { status: 'unresolved' }
  const hits = await findPatentsForCompound(smiles)
  return { status: 'resolved', smiles, hits }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}

const TIER_LABEL: Record<FtoLiveHit['tier'], string> = {
  LIKELY_SAME_SCAFFOLD: 'Likely same scaffold',
  RELATED_SCAFFOLD_REVIEW: 'Related scaffold — worth a closer look',
}

function statusNote(status: FtoLiveHit['status']): string {
  switch (status) {
    case 'found':
      return ''
    case 'confirmed_no_patents':
      return ' (no patents found for this specific structure)'
    case 'too_many_to_list':
      return ' (this compound is linked to many more patents than shown — likely a common/generic structure)'
    case 'unknown':
      return " (couldn't check this one in time — not confirmed either way)"
  }
}

export function renderCompoundCheckResultHtml(compoundInput: string, result: CompoundCheckResult): string {
  if (result.status === 'unresolved') {
    return `<p>We couldn't resolve <b>${escapeHtml(compoundInput)}</b> to a known chemical structure. If you have a SMILES string, try pasting that directly instead of a name.</p>`
  }
  if (result.hits.length === 0) {
    return `<p>No structurally similar compounds found in PubChem's index for <b>${escapeHtml(compoundInput)}</b>. This doesn't guarantee freedom to operate — it means this specific structure (or close relatives) isn't among what PubChem's patent cross-reference index covers.</p>`
  }
  const rows = result.hits
    .map(
      (h) => `
      <tr>
        <td>${escapeHtml(TIER_LABEL[h.tier])}</td>
        <td><a href="https://pubchem.ncbi.nlm.nih.gov/compound/${h.cid}">CID ${h.cid}</a></td>
        <td>${h.patentIds.length ? escapeHtml(h.patentIds.join(', ')) : '—'}${statusNote(h.status)}</td>
      </tr>`
    )
    .join('')
  return `
    <p>Structural matches for <b>${escapeHtml(compoundInput)}</b>:</p>
    <table style="border-collapse: collapse; width: 100%;">
      <thead><tr><th style="text-align:left; padding: 4px 8px;">Tier</th><th style="text-align:left; padding: 4px 8px;">Similar compound</th><th style="text-align:left; padding: 4px 8px;">Patents linked</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-size: 12px; color: #64748b;">This is a first-pass structural screen, not a legal freedom-to-operate opinion — patents listed are structural cross-references from PubChem, not confirmed claim-scope matches.</p>
  `
}

export async function emailCompoundCheckResult(email: string, compoundInput: string, result: CompoundCheckResult) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    console.warn('RESEND_API_KEY/RESEND_FROM_EMAIL not set — skipping compound check result email.')
    return
  }
  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to: email,
      subject: `Your Instant Compound Check result: ${compoundInput}`,
      html: renderCompoundCheckResultHtml(compoundInput, result),
    })
  } catch (err) {
    console.warn('compound check result email failed (non-blocking):', err)
  }
}
