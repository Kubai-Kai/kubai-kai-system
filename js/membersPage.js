import { supabase } from "./supabase.js";
import { getMembers, createMember, updateMember } from "./members.js";
import { openWizard } from "./adminWizard.js";

let currentUserRole = null;
let currentUserId = null;

let currentMember = null;
let allMembers = [];

/**
 * ROLE LOAD
 */
async function loadUserRole() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  currentUserId = user.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Role Load Error:", error);
    return;
  }

  currentUserRole = data.role;

  console.log("ROLE LOADED:", currentUserRole);

  applyRoleUI(); // 👉 WICHTIG HIER
}

/**
 * ROLE UI CONTROL
 */
function applyRoleUI() {
  const btn = document.getElementById("openWizardBtn");

  if (!btn) return;

  if (currentUserRole === "admin") {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}

/**
 * EVENT HELPER
 */
function on(id, event, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, fn);
}

/**
 * LOAD MEMBERS
 */
async function loadMembers() {
  const members = await getMembers();

  allMembers = members || [];

  renderMembers(allMembers);
}

/**
 * RENDER
 */
function renderMembers(members) {
  const table = document.getElementById("membersTable");
  if (!table) return;

  table.innerHTML = "";

  if (!members.length) {
    table.innerHTML = "<tr><td colspan='3'>Keine Mitglieder gefunden</td></tr>";
    return;
  }

  members.forEach(m => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${m.first_name || ""} ${m.last_name || ""}</td>
      <td>${m.email || "-"}</td>
      <td>${renderStatus(m.status)}</td>
    `;

    row.addEventListener("click", () => openModal(m));

    table.appendChild(row);
  });
}

/**
 * STATUS
 */
function renderStatus(status) {
  if (!status) return "-";

  return `
    <span class="status-badge status-${status}">
      ${status}
    </span>
  `;
}

/**
 * MODAL
 */
function openModal(member) {
  currentMember = member;

  setText("profileName", `${member.first_name} ${member.last_name}`);
  setText("viewEmail", member.email);
  setText("viewStatus", member.status);
  setText("viewPhone", member.phone);

  setText(
    "viewAddress",
    `${member.street || ""} ${member.zip || ""} ${member.city || ""}`
  );

  const created = member.created_at
    ? new Date(member.created_at).toLocaleDateString()
    : "-";

  setText("viewCreated", created);

  setVal("editFirstName", member.first_name);
  setVal("editLastName", member.last_name);
  setVal("editEmail", member.email);
  setVal("editPhone", member.phone);
  setVal("editStreet", member.street);
  setVal("editCity", member.city);
  setVal("editZip", member.zip);
  setVal("editStatus", member.status);

  show("viewMode");
  hide("editMode");

  showModal("detailModal");
}

/**
 * HELPERS
 */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "-";
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

function showModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "flex";
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

/**
 * INIT
 */
async function init() {
  await loadUserRole();
  await loadMembers();
}

init();

/**
 * SEARCH
 */
on("searchInput", "input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = allMembers.filter(m => {
    const s = `
      ${m.first_name || ""}
      ${m.last_name || ""}
      ${m.email || ""}
      ${m.city || ""}
      ${m.street || ""}
      ${m.phone || ""}
    `.toLowerCase();

    return s.includes(value);
  });

  renderMembers(filtered);
});

/**
 * CREATE
 */
on("createMemberBtn", "click", async () => {
  const ok = await createMember({
    first_name: document.getElementById("newFirstName")?.value,
    last_name: document.getElementById("newLastName")?.value,
    email: document.getElementById("newEmail")?.value
  });

  if (ok) {
    closeModal("createModal");
    await loadMembers();
  }
});

/**
 * MODALS
 */
on("closeModal", "click", () => closeModal("detailModal"));
on("editBtn", "click", () => { hide("viewMode"); show("editMode"); });
on("cancelEdit", "click", () => { show("viewMode"); hide("editMode"); });

/**
 * SAVE
 */
on("saveEdit", async () => {
  if (!currentMember) return;

  const ok = await updateMember(currentMember.id, {
    first_name: document.getElementById("editFirstName")?.value,
    last_name: document.getElementById("editLastName")?.value,
    email: document.getElementById("editEmail")?.value,
    phone: document.getElementById("editPhone")?.value,
    street: document.getElementById("editStreet")?.value,
    city: document.getElementById("editCity")?.value,
    zip: document.getElementById("editZip")?.value,
    status: document.getElementById("editStatus")?.value
  });

  if (ok) {
    closeModal("detailModal");
    await loadMembers();
  }
});

/**
 * LOGOUT
 */
on("logoutBtn", "click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
});

/**
 * WIZARD OPEN
 */
document.getElementById("openWizardBtn")?.addEventListener("click", () => {
  if (currentUserRole !== "admin") {
    alert("Kein Zugriff");
    return;
  }

  openWizard();
});
