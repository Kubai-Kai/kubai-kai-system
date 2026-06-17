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
