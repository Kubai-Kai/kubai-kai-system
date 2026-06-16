import { supabase } from "./js/supabase.js";

document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;

  // 🔥 WICHTIG: Profil sicher laden
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    alert("Profil nicht gefunden");
    return;
  }

  // 🔀 Routing
  if (profile.role === "admin") {
    window.location.href = "dashboard.html";
  }

  else if (profile.role === "trainer") {
    window.location.href = "dashboard.html";
  }

  else if (profile.role === "parent") {
    window.location.href = "parent.html";
  }

  else if (profile.role === "child") {
    window.location.href = "child.html";
  }

  else {
    window.location.href = "dashboard.html";
  }
});
