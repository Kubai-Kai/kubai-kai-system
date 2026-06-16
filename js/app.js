console.log("App.js geladen")
import { supabase } from './supabase.js'
// LOGIN
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    console.log("Login versucht:", email)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      window.location.href = '/dashboard.html'
    }
  })
}

// REGISTER
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value

    console.log("Registrierung:", email)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Erfolgreich registriert")
    }
  })
}
