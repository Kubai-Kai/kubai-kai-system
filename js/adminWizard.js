import { supabase } from "./supabase.js";
import { loadMembers } from "./membersPage.js";

const panel = document.getElementById("adminWizardPanel");

function get(id) {
  return document.getElementById(id)?.value;
}

/**
 * OPEN
 */
export function openWizard() {
  panel.classList.add("open");
}

/**
 * CLOSE
 */
function closeWizard() {
  panel.classList.remove("open");
}

document.getElementById("closeWizardBtn").onclick = closeWizard;

/**
 * CREATE USER
 */
document.getElementById("createWizardUserBtn").onclick = async () => {

  const payload = {
    email: get("wizEmail"),
    password: get("wizPassword"),
    first_name: get("wizFirstName"),
    last_name: get("wizLastName"),
    street: get("wizStreet"),
    city: get("wizCity"),
    zip: get("wizZip"),
    phone: get("wizPhone"),
    role: get("wizRole")
  };

  const { error } = await supabase.functions.invoke(
    "create-admin-user",
    { body: payload }
  );

  if (error) {
    alert("Fehler beim Erstellen");
    return;
  }

  alert("User erstellt!");

  panel.classList.remove("open");
  loadMembers();
};
