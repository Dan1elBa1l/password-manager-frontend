<template>
  <div>
    <form @submit.prevent="submitPassword">
      <input type="text" v-model="passwordData.service" placeholder="Service" required>
      <input type="text" v-model="passwordData.username" placeholder="Username" required>
      <input type="password" v-model="passwordData.password" placeholder="Password" required>
      <input type="text" v-model="passwordData.description" placeholder="Description">
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      passwordData: {
        service: '',
        username: '',
        password: '',
        description: ''
      }
    };
  },
  methods: {
    async submitPassword() {
      try {
        const response = await axios.post('http://localhost:8080/api/passwords', this.passwordData);
        console.log('Password saved', response.data);
        this.resetForm();
        // Optional: Benachrichtigung über den Erfolg anzeigen
      } catch (error) {
        console.error('Error saving password', error);
        // Optional: Fehlermeldung anzeigen
      }
    },
    resetForm() {
      this.passwordData = { service: '', username: '', password: '', description: '' };
    }
  }
};
</script>



<style scoped>
h3 {
  text-align: center;
}
table {
  margin-left: auto;
  margin-right: auto;
}
button {
  color: black;
}
</style>