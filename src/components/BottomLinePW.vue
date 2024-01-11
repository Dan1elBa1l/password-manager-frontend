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
    this.updateLastShownTime();
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
}
</style>
