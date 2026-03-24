import { NextResponse } from 'next/server';
import { getUser, createUser } from '@/lib/models';
import { createSession } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone } = body;

        if (!phone || typeof phone !== 'string') {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        const isAdmin = phone === (process.env.ADMIN_PHONE || 'admin');

        let user = await getUser(phone);

        if (!user) {
            if (!name && !isAdmin) {
                return NextResponse.json({ error: 'User not found. Please provide a name to sign up.' }, { status: 404 });
            }
            if (!isAdmin) {
                const id = randomUUID();
                user = await createUser(id, name, phone);
            }
        }

        await createSession({
            userId: user ? user.id : 'admin-id',
            phone,
            isAdmin
        });

        return NextResponse.json({ success: true, isAdmin, user: user || { id: 'admin-id', phone } });

    } catch (error: any) {
        // Supabase unique constraint error code is usually '23505'
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Phone number is already in use.' }, { status: 400 });
        }
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
