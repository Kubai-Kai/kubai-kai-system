import { supabase } from "./supabase.js";
import { loadMembers } from "./membersPage.js";

const modal = document.getElementById("adminWizardModal");

function getVal(id) {
  return document.getElementById(id)?.value;
}

/**
 * OPEN / CLOSE
 */
document.getElementById("closeWizardBtn").onclick = () => {
  modal.style.display = "none";
};

/**
 * CREATE USER FLOW
 */
document.getElementById("createWizardUserBtn").onclick = async () => {

  const payload = {
    email: getVal("wizEmail"),
    password: getVal("wizPassword"),
    first_name: getVal("wizFirstName"),
    last_name: getVal("wizLastName"),
    street: getVal("wizStreet"),
    city: getVal("wizCity"),
    zip: getVal("wizZip"),
    phone: getVal("wizPhone"),
    role: getVal("wizRole")
  };

  // einfache Validierung
  if (!payload.email || !payload.password) {
    alert("Email und Passwort erforderlich");
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke(
      "create-admin-user",
      {
        body: payload
      }
    );

    if (error) {
      console.error(error);
      alert("Fehler beim Erstellen");
      return;
    }

    alert("User erfolgreich erstellt!");

    // UI reset
    modal.style.display = "none";

    document.querySelectorAll("#adminWizardModal input").forEach(i => i.value = "");

    // Mitglieder neu laden
    if (typeof loadMembers === "function") {
      loadMembers();
    }

  } catch (err) {
    console.error(err);
    alert("Serverfehler");
  }
};
