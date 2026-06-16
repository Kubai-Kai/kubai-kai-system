import { supabase } from './supabase.js'

console.log("App.js geladen")

/* ---------------------------
   ELEMENTE HOLEN
---------------------------- */

const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')

/* ---------------------------
   LOGIN
---------------------------- */

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const emailEl = document.getElementById('login-email')
    const passwordEl = document.getElementById('login-password')

    if (!emailEl || !passwordEl) {
      alert("Login Felder fehlen im HTML")
      return
    }

    const email = emailEl.value
    const password = passwordEl.value

    console.log("Login Versuch:", email)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.log("LOGIN ERROR:", error)
      alert("Login Fehler: " + error.message)
    } else {
      window.location.href = '/dashboard.html'
    }
  })
}

/* ---------------------------
   REGISTRIERUNG
---------------------------- */

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const emailEl = document.getElementById('register-email')
    const passwordEl = document.getElementById('register-password')

    if (!emailEl || !passwordEl) {
      alert("Register Felder fehlen im HTML")
      return
    }

    const email = emailEl.value
    const password = passwordEl.value

    console.log("Registrierung:", email)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      console.log("REGISTER ERROR:", error)
      alert("Registrierung Fehler: " + error.message)
    } else {
      alert("Registrierung erfolgreich! Bitte einloggen.")
    }
  })
}

/* ---------------------------
   SESSION CHECK (optional)
---------------------------- */

async function checkSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.log("SESSION ERROR:", error)
  } else {
    console.log("Session:", data.session)
  }
}

checkSession()
