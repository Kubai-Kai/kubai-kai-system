import { supabase } from "./supabase.js";
import { getMembers, createMember, updateMember } from "./members.js";

let currentMember = null;

/**
 * TABLE LOAD
 */
async function loadMembers() {
  const members = await getMembers();
  const table = document.getElementById("membersTable");
  table.innerHTML = "";

  members.forEach(m => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${m.first_name} ${m.last_name}</td>
      <td>${m.email || "-"}</td>
      <td>${m.status}</td>
    `;

    row.addEventListener("click", () => openModal(m));

    table.appendChild(row);
  });
}

/**
 * MODAL OPEN
 */
function openModal(member) {
  currentMember = member;

  document.getElementById("editFirstName").value = member.first_name;
  document.getElementById("editLastName").value = member.last_name;
  document.getElementById("editEmail").value = member.email || "";
  document.getElementById("editStatus").value = member.status;

  document.getElementById("detailModal").style.display = "flex";
}

/**
 * MODAL CLOSE
 */
document.getElementById("closeModal").onclick = () => {
  document.getElementById("detailModal").style.display = "none";
};

/**
 * SAVE EDIT (OHNE RELOAD)
 */
document.getElementById("saveEdit").onclick = async () => {

  const ok = await updateMember(currentMember.id, {
    first_name: document.getElementById("editFirstName").value,
    last_name: document.getElementById("editLastName").value,
    email: document.getElementById("editEmail").value,
    status: document.getElementById("editStatus").value
  });

  if (ok) {
    document.getElementById("detailModal").style.display = "none";
    await loadMembers();
  } else {
    alert("Fehler");
  }
};

/**
 * CREATE MODAL
 */
document.getElementById("openCreateModal").onclick = () => {
  document.getElementById("createModal").style.display = "flex";
};

document.getElementById("closeCreateModal").onclick = () => {
  document.getElementById("createModal").style.display = "none";
};

/**
 * CREATE MEMBER
 */
document.getElementById("createMemberBtn").onclick = async () => {

  const ok = await createMember({
    first_name: document.getElementById("newFirstName").value,
    last_name: document.getElementById("newLastName").value,
    email: document.getElementById("newEmail").value
  });

  if (ok) {
    document.getElementById("createModal").style.display = "none";
    await loadMembers();
  }
};

/**
 * LOGOUT
 */
document.getElementById("logoutBtn").onclick = async () => {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
};

/**
 * INIT
 */
loadMembers();
