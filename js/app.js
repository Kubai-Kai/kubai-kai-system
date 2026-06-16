console.log("App.js geladen")
import { supabase } from './supabase.js'

// LOGIN
const loginForm = document.getElementById('login-form')

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('login-email').value
    const password = document.getElementById('password').value

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert('Login fehlgeschlagen: ' + error.message)
    } else {
      window.location.href = '/dashboard.html'
    }
  })
}

// REGISTER
const registerForm = document.getElementById('register-form')

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert('Registrierung fehlgeschlagen: ' + error.message)
    } else {
      alert('Registrierung erfolgreich! Bitte einloggen.')
    }
  })
}
