document.getElementById("createUserBtn").addEventListener("click", async () => {

  const payload = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,

    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,

    street: document.getElementById("street").value,
    city: document.getElementById("city").value,
    zip: document.getElementById("zip").value,
    phone: document.getElementById("phone").value,

    role: document.getElementById("role").value
  };

  const res = await fetch(
    "https://YOUR_PROJECT.supabase.co/functions/v1/create-admin-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await res.json();

  if (data.success) {
    alert("User erfolgreich erstellt!");
  } else {
    alert("Fehler beim Erstellen");
    console.error(data);
  }
});
if (role !== "admin") {
  document.getElementById("adminWizardModal").style.display = "none";
}
