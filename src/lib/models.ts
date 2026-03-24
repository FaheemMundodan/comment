import { supabase } from './db';
import { randomUUID } from 'crypto';

export interface User {
    id: string;
    name: string;
    phone: string;
    assigned_comment_id: string | null;
}

export interface Comment {
    id: string;
    text: string;
    assigned_user_id: string | null;
}

export interface Setting {
    key: string;
    value: string;
}

// Users
export async function getUser(phone: string): Promise<User | null> {
    const { data } = await supabase.from('users').select('*').eq('phone', phone).single();
    return data || null;
}

export async function createUser(id: string, name: string, phone: string): Promise<User> {
    const { data, error } = await supabase.from('users').insert({ id, name, phone }).select().single();
    if (error) throw error;
    return data;
}

export async function getAllUsers(): Promise<User[]> {
    const { data } = await supabase.from('users').select('*').order('name');
    return data || [];
}

export async function assignCommentToUser(userId: string, commentId: string) {
    // Update both tables. Since Supabase JS client doesn't support interactive transactions, 
    // we do them sequentially.
    await supabase.from('comments').update({ assigned_user_id: userId }).eq('id', commentId);
    await supabase.from('users').update({ assigned_comment_id: commentId }).eq('id', userId);
}

// Comments
export async function getCommentCount(): Promise<number> {
    const { count } = await supabase.from('comments').select('*', { count: 'exact', head: true });
    return count || 0;
}

export async function getUnassignedComment(): Promise<Comment | null> {
    const { data } = await supabase.from('comments').select('*').is('assigned_user_id', null).limit(1).maybeSingle();
    return data || null;
}

export async function getCommentById(id: string): Promise<Comment | null> {
    const { data } = await supabase.from('comments').select('*').eq('id', id).single();
    return data || null;
}

export async function addComments(comments: string[]) {
    const toInsert = comments.filter(t => t.trim()).map(text => ({
        id: randomUUID(),
        text: text.trim(),
        assigned_user_id: null
    }));
    if (toInsert.length > 0) {
        await supabase.from('comments').insert(toInsert);
    }
}

export async function clearComments() {
    await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows safely
    await supabase.from('users').update({ assigned_comment_id: null }).neq('id', '00000000-0000-0000-0000-000000000000');
}

// Settings
export async function getSetting(key: string): Promise<string | undefined> {
    const { data } = await supabase.from('settings').select('value').eq('key', key).maybeSingle();
    return data?.value;
}

export async function setSetting(key: string, value: string) {
    await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
}
