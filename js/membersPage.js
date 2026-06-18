import { supabase } from "./supabase.js";
import { getMembers, createMember, updateMember } from "./members.js";

let currentMember = null;
let allMembers = [];

/**
 * SAFE EVENT BINDER
 */
function on(id, event, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, fn);
}

/**
 * LOAD TABLE
 */
async function loadMembers() {
  allMembers = await getMembers();
renderMembers(allMembers);
return;
  const table = document.getElementById("membersTable");
  if (!table) return;

  table.innerHTML = "";

  members.forEach(m => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${m.first_name} ${m.last_name}</td>
      <td>${m.email || "-"}</td>
      <td>${renderStatus(m.status)}</td>
    `;

    row.addEventListener("click", () => openModal(m));

    table.appendChild(row);
  });
}
function renderStatus(status) {
  if (!status) return "-";

  return `
    <span class="status-badge status-${status}">
      ${status}
    </span>
  `;
}
function renderMembers(members) {
  const table = document.getElementById("membersTable");
  if (!table) return;

  table.innerHTML = "";

  members.forEach(m => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${m.first_name} ${m.last_name}</td>
      <td>${m.email || "-"}</td>
      <td>${renderStatus(m.status)}</td>
    `;

    row.addEventListener("click", () => openModal(m));

    table.appendChild(row);
  });
}
function renderStatus(status) {
  if (!status) return "-";

  return `
    <span class="status-badge status-${status}">
      ${status}
    </span>
  `;
}
/**
 * OPEN DETAIL MODAL
 */
function openModal(member) {
  currentMember = member;

  document.getElementById("profileName").textContent =
    member.first_name + " " + member.last_name;

  // VIEW
  setText("viewEmail", member.email);
  setText("viewStatus", member.status);
  setText("viewPhone", member.phone);
  setText("viewAddress",
    `${member.street || ""} ${member.zip || ""} ${member.city || ""}`
  );

  const created = member.created_at
    ? new Date(member.created_at).toLocaleDateString()
    : "-";

  setText("viewCreated", created);

  // EDIT
  setVal("editFirstName", member.first_name);
  setVal("editLastName", member.last_name);
  setVal("editEmail", member.email);
  setVal("editPhone", member.phone);
  setVal("editStreet", member.street);
  setVal("editCity", member.city);
  setVal("editZip", member.zip);
  setVal("editStatus", member.status);

  // MODE RESET
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
loadMembers();

/**
 * LOGOUT
 */
on("logoutBtn", "click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
});

/**
 * OPEN CREATE MODAL
 */
on("openCreateModal", "click", () => {
  showModal("createModal");
});

/**
 * CLOSE CREATE MODAL
 */
on("closeCreateModal", "click", () => {
  closeModal("createModal");
});

/**
 * CREATE MEMBER
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
 * CLOSE DETAIL MODAL
 */
on("closeModal", "click", () => {
  closeModal("detailModal");
});

/**
 * EDIT MODE
 */
on("editBtn", "click", () => {
  hide("viewMode");
  show("editMode");
});

on("cancelEdit", "click", () => {
  show("viewMode");
  hide("editMode");
});
on("searchInput", "input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = allMembers.filter(m => {

    const searchString = `
      ${m.first_name || ""}
      ${m.last_name || ""}
      ${m.email || ""}
      ${m.city || ""}
      ${m.street || ""}
      ${m.phone || ""}
    `.toLowerCase();

    return searchString.includes(value);
  });

  renderMembers(filtered);
});
/**
 * SAVE EDIT
 */
on("saveEdit", "click", async () => {

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
 * FAMILY (STUB – später UI)
 */
async function linkFamily(parentId, childId) {
  await supabase.from("family_links").insert({
    parent_id: parentId,
    child_id: childId
  });
}
