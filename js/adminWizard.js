import { supabase } from "./supabase.js";

/**
 * SAFE DOM GET
 */
function el(id) {
  return document.getElementById(id);
}

function val(id) {
  return document.getElementById(id)?.value || "";
}

/**
 * OPEN WIZARD
 */
export function openWizard() {
  const panel = el("adminWizardPanel");
  if (!panel) {
    console.error("Wizard Panel nicht gefunden");
    return;
  }

  panel.classList.add("open");
}

/**
 * CLOSE WIZARD
 */
function closeWizard() {
  const panel = el("adminWizardPanel");
  if (!panel) return;

  panel.classList.remove("open");
}

/**
 * INIT EVENTS (wichtig: erst wenn DOM da ist)
 */
function initWizard() {

  const closeBtn = el("closeWizardBtn");
  const createBtn = el("createWizardUserBtn");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeWizard);
  }

  if (createBtn) {
    createBtn.addEventListener("click", createUser);
  }
}

/**
 * CREATE USER VIA SUPABASE FUNCTION
 */
async function createUser() {

  const payload = {
    email: val("wizEmail"),
    password: val("wizPassword"),
    first_name: val("wizFirstName"),
    last_name: val("wizLastName"),
    street: val("wizStreet"),
    city: val("wizCity"),
    zip: val("wizZip"),
    phone: val("wizPhone"),
    role: val("wizRole")
  };

  const { error } = await supabase.functions.invoke(
    "create-admin-user",
    { body: payload }
  );

  if (error) {
    console.error(error);
    alert("Fehler beim Erstellen");
    return;
  }

  alert("User erstellt!");

  closeWizard();

  // 👉 UI refresh EVENT statt direkter Funktion
  window.dispatchEvent(new Event("members:reload"));
}

/**
 * AUTO INIT
 */
document.addEventListener("DOMContentLoaded", initWizard);
