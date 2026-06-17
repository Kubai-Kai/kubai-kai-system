import { supabase } from "./supabase.js";
import { getMembers, createMember } from "./members.js";

/**
 * Logout
 */
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
});

/**
 * Mitglieder laden
 */
async function loadMembers() {
  const members = await getMembers();

  const container = document.getElementById("membersList");
  container.innerHTML = "";

  members.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${m.first_name} ${m.last_name}</h3>
      <p>${m.email || "-"}</p>
      <p>Status: ${m.status}</p>
    `;

    container.appendChild(card);
  });

  return members;
}

/**
 * Suche (einfach)
 */
document.getElementById("searchInput").addEventListener("input", async (e) => {
  const term = e.target.value.toLowerCase();

  const members = await getMembers();

  const filtered = members.filter(m =>
    (m.first_name + " " + m.last_name).toLowerCase().includes(term)
  );

  const container = document.getElementById("membersList");
  container.innerHTML = "";

  filtered.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${m.first_name} ${m.last_name}</h3>
      <p>${m.email || "-"}</p>
    `;

    container.appendChild(card);
  });
});

/**
 * Rollen prüfen → Formular anzeigen
 */
async function checkRole() {
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (data.role === "admin" || data.role === "trainer") {
    document.getElementById("memberForm").style.display = "block";
  }
}

/**
 * Neues Mitglied speichern
 */
document.getElementById("saveMember").addEventListener("click", async () => {

  const member = {
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    email: document.getElementById("emailMember").value
  };

  const ok = await createMember(member);

  if (ok) {
    alert("Gespeichert");
    location.reload();
  } else {
    alert("Fehler");
  }

});

/**
 * INIT
 */
await loadMembers();
await checkRole();
