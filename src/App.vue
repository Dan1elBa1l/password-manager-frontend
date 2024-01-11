<template>
  <div>
    <nav class="navbar navbar-expand-lg custom-navbar">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/">
          <img src="/icons8-password.gif" alt="Favicon" class="favicon">
          Passwort-Manager
        </RouterLink>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

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

    <RouterView />

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

.favicon {
  height: 30px;
  margin-right: 10px;
}

.navbar {
  background-color: white !important;
  border-bottom: 1px solid black;
}

.custom-navbar {
  color: black;

  .nav-link {
    color: black !important;
    text-decoration: none;
    transition: 0.4s;
    border-radius: 5px;
    padding: 5px 10px;


    &:hover {
      background-color: hsla(0, 0%, 50%, 0.2);
    }


    &.active {
      background-color: hsla(0, 0%, 50%, 0.2);
    }
  }
}


@media (min-width: 1024px) {
}
</style>
