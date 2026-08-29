import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Internal-only endpoint, called by 04_upload_to_website.py right after a
// successful upload -- the Patent Analytics homepage's "Growing daily"
// stats (getLiveVolumeStats) are a genuinely live DB query, but the page
// itself carries `export const revalidate = 3600`, so without this a real
// upload wouldn't show up there for up to an hour. Same shared-secret
// protection as publish-article/route.ts, since this is only ever called
// by the pipeline, never the browser.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-internal-secret')
  if (!secret || secret !== process.env.INTERNAL_NOTIFY_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/patent-analytics')
  return NextResponse.json({ revalidated: true })
}
