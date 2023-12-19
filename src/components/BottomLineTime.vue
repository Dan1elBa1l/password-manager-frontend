<template>
  <div class="bottom-line custom-navbar">
    {{ currentTime }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTime: '',
    };
  },
  created() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
    },
  },
};
</script>

<style scoped>
.custom-navbar {
  text-align: center;
  padding: 1px;
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
