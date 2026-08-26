/**
 * Notify founder WhatsApp via Chem Mantra's secured internal endpoint
 * (reuses live Meta Cloud API credentials without duplicating tokens).
 *
 * Fallback: direct Graph API if WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID
 * are set on this project.
 */

const ADMIN_WHATSAPP = '919136255574'

const CM_NOTIFY_URL =
  process.env.CM_WHATSAPP_NOTIFY_URL ||
  'https://www.chem-mantra.online/api/internal/whatsapp-notify'

export async function notifyAdminWhatsApp(text: string): Promise<{ ok: boolean; detail?: string }> {
  const secret = process.env.INTERNAL_NOTIFY_SECRET
  if (secret) {
    try {
      const res = await fetch(CM_NOTIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': secret,
        },
        body: JSON.stringify({ to: ADMIN_WHATSAPP, message: text }),
      })
      if (res.ok) return { ok: true, detail: 'via_cm_notify' }
      const body = await res.text()
      console.error('[whatsapp] CM notify failed', res.status, body)
      // fall through to direct Graph if configured
    } catch (err) {
      console.error('[whatsapp] CM notify network error', err)
    }
  }

  const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneId) {
    return { ok: false, detail: 'WhatsApp not configured (set INTERNAL_NOTIFY_SECRET or WHATSAPP_*)' }
  }

  const res = await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: ADMIN_WHATSAPP,
      type: 'text',
      text: { body: text },
    }),
  })
  if (!res.ok) {
    const errText = await res.text()
    console.error('[whatsapp] Graph send failed', res.status, errText)
    return { ok: false, detail: errText }
  }
  return { ok: true, detail: 'via_graph' }
}
