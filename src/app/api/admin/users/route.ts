import { NextResponse } from 'next/server';
import { getAllUsers, getCommentCount } from '@/lib/models';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const users = await getAllUsers();
    const commentCount = await getCommentCount();
    return NextResponse.json({ users, commentCount });
}
