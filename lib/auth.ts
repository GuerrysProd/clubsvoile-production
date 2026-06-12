// lib/auth.ts
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function registerClub(email: string, password: string, clubId: string) {
  try {
    const hashedPassword = await hashPassword(password);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          club_id: clubId,
          is_admin: false,
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error };
  }
}

export async function loginClub(email: string, password: string) {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !users) {
      return { success: false, error: 'User not found' };
    }

    const passwordMatch = await verifyPassword(password, users.password_hash);

    if (!passwordMatch) {
      return { success: false, error: 'Invalid password' };
    }

    return { success: true, user: users };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error };
  }
}
