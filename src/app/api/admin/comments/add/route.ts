import { NextResponse } from 'next/server';
import { addComments } from '@/lib/models';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { comments } = await request.json();
    if (!Array.isArray(comments)) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    await addComments(comments);
    return NextResponse.json({ success: true, count: comments.length });
}
