import { NextResponse } from 'next/server';
import { getUser, getCommentById, getUnassignedComment, assignCommentToUser, getSetting } from '@/lib/models';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (session.isAdmin) {
        return NextResponse.json({ error: 'Admins cannot receive comments' }, { status: 400 });
    }

    const user = await getUser(session.phone);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let comment = null;
    if (user.assigned_comment_id) {
        comment = await getCommentById(user.assigned_comment_id);
    } else {
        const unassigned = await getUnassignedComment();
        if (unassigned) {
            await assignCommentToUser(user.id, unassigned.id);
            comment = unassigned;
        }
    }

    const reelLink = await getSetting('latest_reel_link');
    const fbLink = await getSetting('latest_fb_link');

    return NextResponse.json({
        comment,
        latest_reel_link: reelLink || '',
        latest_fb_link: fbLink || ''
    });
}
