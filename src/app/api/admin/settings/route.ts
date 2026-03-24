import { NextResponse } from 'next/server';
import { setSetting, getSetting } from '@/lib/models';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const igLink = await getSetting('latest_reel_link');
    const fbLink = await getSetting('latest_fb_link');

    return NextResponse.json({
        latest_reel_link: igLink || '',
        latest_fb_link: fbLink || ''
    });
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    if (body.latest_reel_link !== undefined) {
        await setSetting('latest_reel_link', body.latest_reel_link);
    }

    if (body.latest_fb_link !== undefined) {
        await setSetting('latest_fb_link', body.latest_fb_link);
    }

    return NextResponse.json({ success: true });
}
