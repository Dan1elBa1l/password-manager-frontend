<template>
  <div>
    <!-- Bootstrap Navbar -->
    <nav class="navbar navbar-expand-lg custom-navbar">
      <div class="container-fluid">
        <!-- Navbar Brand mit Favicon -->
        <RouterLink class="navbar-brand" to="/">
          <img src="/icons8-password.gif" alt="Favicon" class="favicon">
          Passwort-Manager
        </RouterLink>

        <!-- Navbar Toggle für kleinere Bildschirme -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: isActive('/passwords') }" to="/passwords">Passwords</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: isActive('/credit-card') }" to="/credit-card">Credit Cards</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :class="{ active: isActive('/PasswordGenerator') }" to="/PasswordGenerator">Password Generator</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Router-View -->
    <RouterView />

    <!-- BottomLineTime Komponente -->
    <BottomLineTime />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import BottomLineTime from './components/BottomLineTime.vue';

const route = useRoute();

const isActive = (path) => {
  return route.path === path;
};
</script>

<style scoped>
/* Favicon-Styling */
.favicon {
  height: 30px;
  margin-right: 10px;
}

/* Direktes Überschreiben der Bootstrap-Navbar-Farbe */
.navbar {
  background-color: white !important;
  border-bottom: 1px solid black; /* Fügt eine dünne schwarze Linie hinzu */
}

/* Setzt die Schriftfarbe auf Schwarz */
.custom-navbar {
  color: black;

  /* Setzt die Schriftfarbe für alle Links in der Navbar auf Schwarz */
  .nav-link {
    color: black !important;
    text-decoration: none; /* Entfernt die Textdekoration */
    transition: 0.4s; /* Übergang für den Hover-Effekt */
    border-radius: 5px; /* Rundet die Ecken ab */
    padding: 5px 10px; /* Padding hinzufügen */

    /* Hover-Effekt für Links */
    &:hover {
      background-color: hsla(0, 0%, 50%, 0.2); /* Grauer Hintergrund beim Hover */
    }

    /* Stil für aktiven Link */
    &.active {
      background-color: hsla(0, 0%, 50%, 0.2); /* Grauer Hintergrund für aktiven Tab */
    }
  }
}

/* Stile für größere Bildschirme */
@media (min-width: 1024px) {
  /* Hier können Sie zusätzliche Stile für größere Bildschirme hinzufügen */
}
</style>
