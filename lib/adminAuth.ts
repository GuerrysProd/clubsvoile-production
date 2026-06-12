import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

export async function verifyAdmin(username: string, password: string) {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, password_hash')
      .eq('username', username)
      .single();

    if (error || !data) return null;

    const isValid = await bcrypt.compare(password, data.password_hash);
    return isValid ? data.id : null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
