<template>
  <div class="BottomLinePW">
    Zuletzt angezeigt: {{ lastShown }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastShown: '',
    };
  },
  methods: {
    updateLastShownTime() {
      const now = new Date();
      this.lastShown = now.toLocaleString();
    },
  },
  created() {
    // Rufe die Methode updateLastShownTime() beim Erstellen der Komponente auf
    this.updateLastShownTime();

    // Hör auf den Event 'showPasswords', um die Zeit zu aktualisieren, wenn der Button geklickt wird
    this.$root.$on('showPasswords', this.updateLastShownTime);
  },
};
</script>

<style scoped>
.custom-navbar {
  text-align: center;
  padding: 10px;
  background-color: white !important;
  border-top: 1px solid black;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: black;
  border-radius: 0; /* Zurücksetzen der Eckenrundung */
  /* Füge hier weitere gewünschte Stile hinzu */
}
</style>
