<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/passwords">Passwords</RouterLink>
        <RouterLink to="/credit-card">Credit Cards</RouterLink>
        <RouterLink to="/PasswordGenerator">Password Generator</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 14px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active {
  color: var(--color-text);
  background-color: grey; /* Hinzufügen eines grauen Hintergrunds für aktive Tabs */
  border-radius: 4px; /* Optional: Fügt abgerundete Ecken hinzu */
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
