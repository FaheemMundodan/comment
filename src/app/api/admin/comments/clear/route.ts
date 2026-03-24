import { NextResponse } from 'next/server';
import { clearComments } from '@/lib/models';
import { getSession } from '@/lib/auth';

export async function POST() {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await clearComments();
    return NextResponse.json({ success: true });
}
