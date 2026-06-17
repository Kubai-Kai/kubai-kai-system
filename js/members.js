import { supabase } from "./supabase.js";

export async function getMembers() {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
export async function createMember(member) {
  const { error } = await supabase
    .from("members")
    .insert([member]);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}
export async function getMyMember() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
export async function updateMember(id, updates) {
  const { error } = await supabase
    .from("members")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}
