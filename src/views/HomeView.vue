<template>
  <main>
    <DynamicForm title="Welcome to your Password-Manager"/>

    <!-- Hinzufügen der Links -->
    <div class="links">
      <RouterLink to="/passwords">Passwords </RouterLink>
      <RouterLink to="/credit-card">Credit Cards </RouterLink>
      <RouterLink to="/passwordGenerator">Password Generator </RouterLink>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Grundlegendes Styling für den Links-Container */
.links {
  display: flex; /* Flexbox-Layout verwenden */
  flex-direction: column; /* Elemente vertikal stapeln */
  align-items: flex-start; /* Elemente am Anfang der Flex-Container ausrichten */
  margin-left: 30%; /* Links von der Seite etwas abrücken */
  margin-top: -20%; /* Oben von der Seite etwas abrücken */
}

/* Styling für einzelne Links */
.links a {
  margin: 30px 0; /* Größerer vertikaler Abstand zwischen den Links */
  display: block; /* Block-Display für genaue Positionierung */
  text-align: center; /* Text zentrieren */
  font-size: 1.7em; /* Vergrößern der Schriftgröße */
  opacity: 0; /* Starten mit Unsichtbarkeit */
  animation: slideIn 2.0s ease forwards; /* Animation hinzufügen */
  transform: translateX(var(--offset)); /* Horizontalen Abstand für die Diagonale anwenden */
}

/* CSS Variable für den horizontalen Abstand */
.links a:nth-child(1) { --offset: -150px; }
.links a:nth-child(2) { --offset: -75px; }
.links a:nth-child(3) { --offset: 0px; }

/* Keyframes für Slide-In Animation */
@keyframes slideIn {
  from {
    transform: translateX(calc(var(--offset) - 100%));
    opacity: 0;
  }
  to {
    transform: translateX(var(--offset));
    opacity: 1;
  }
}

/* Responsives Design für kleinere Bildschirme */
@media (max-width: 600px) {
  .links {
    align-items: center; /* Zentrieren der Elemente auf kleinen Bildschirmen */
    margin-left: 0; /* Kein linker Abstand auf kleinen Bildschirmen */
  }

  .links a {
    font-size: 1em; /* Kleinere Schriftgröße auf kleinen Bildschirmen */
    transform: translateX(0); /* Keine horizontale Verschiebung auf kleinen Bildschirmen */
  }
}
</style>
