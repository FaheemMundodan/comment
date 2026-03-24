import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'comment-dist-secret-key-1234!';

export interface SessionPayload {
    userId: string;
    phone: string;
    isAdmin?: boolean;
}

export async function createSession(payload: SessionPayload) {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 // 30 days
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;

    try {
        const payload = jwt.verify(token, JWT_SECRET) as SessionPayload;
        return payload;
    } catch (error) {
        return null;
    }
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
