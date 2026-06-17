import { supabase } from "./supabase.js";

/**
 * 1. Aktuellen User holen
 */
async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * 2. Zugehöriges Mitglied laden
 */
async function getMyMember(userId) {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("profile_id", userId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

/**
 * 3. Profil updaten
 */
async function updateMember(id, updates) {
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

/**
 * MAIN
 */
const user = await getUser();

if (!user) {
  document.body.innerHTML = "Nicht eingeloggt";
}

const member = await getMyMember(user.id);

const box = document.getElementById("profileBox");
const form = document.getElementById("editForm");

if (member) {

  box.innerHTML = `
    <p><b>Name:</b> ${member.first_name} ${member.last_name}</p>
    <p><b>Status:</b> ${member.status}</p>
  `;

  form.style.display = "block";

  document.getElementById("first_name").value = member.first_name || "";
  document.getElementById("last_name").value = member.last_name || "";
  document.getElementById("phone").value = member.phone || "";

  document.getElementById("saveBtn").addEventListener("click", async () => {

    const ok = await updateMember(member.id, {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      phone: document.getElementById("phone").value
    });

    if (ok) {
      alert("Gespeichert");
      location.reload();
    } else {
      alert("Fehler beim Speichern");
    }

  });

} else {
  box.innerHTML = "Kein Mitgliedsprofil gefunden";
}
