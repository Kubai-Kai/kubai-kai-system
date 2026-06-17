import { supabase } from "./supabase.js";

/**
 * 🔐 Prüft ob User eingeloggt ist
 * Wenn nicht → zurück zum Login
 */
export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "login.html";
    return null;
  }

  return user;
}

/**
 * 👤 Aktuellen User holen
 */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * 🚪 Logout
 */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}
/**
 * 👤 Rolle des aktuellen Users holen
 */
export async function getUserRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data.role;
}

/**
 * 📋 Alle User laden (nur für Admin)
 */
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

/**
 * ✏️ Rolle eines Users ändern (nur für Admin)
 */
export async function updateUserRole(userId, newRole) {
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  return !error;
}
