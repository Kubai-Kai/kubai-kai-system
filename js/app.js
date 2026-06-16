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
