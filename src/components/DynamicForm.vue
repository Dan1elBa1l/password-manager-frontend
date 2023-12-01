<template>
  <div>
    <h1> Welcome to your Password-Manager</h1>
    <!-- Formular zum Hinzufügen von Passwörtern -->
    <form @submit.prevent="submitPassword">
      <input type="text" v-model="passwordData.service" placeholder="Service" required>
      <input type="text" v-model="passwordData.username" placeholder="Username" required>
      <input type="password" v-model="passwordData.password" placeholder="Password" required>
      <input type="text" v-model="passwordData.description" placeholder="Description">
      <button type="submit">Submit</button>
    </form>
    <!-- Button, um Passwörter anzuzeigen -->
    <button @click="fetchPasswords" v-if="!showPasswords">Show Passwords</button>
    <!-- Button, um Passwörter zu verstecken -->
    <button @click="hidePasswords" v-if="showPasswords">Hide Passwords</button>

    <!-- Anzeige der abgerufenen Passwörter -->
    <div v-if="showPasswords">
      <ul>
        <li v-for="password in passwords" :key="password.id">
          {{ password.service }} - {{ password.username }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      passwordData: {
        service: '',
        username: '',
        password: '',
        description: ''
      },
      passwords: [],
      showPasswords: false // Variable, um den Status des Anzeige-Buttons zu verfolgen
    };
  },
  methods: {
    submitPassword() {
      const passwordData = {
        service: this.passwordData.service,
        username: this.passwordData.username,
        password: this.passwordData.password,
        description: this.passwordData.description
      };

      fetch('http://localhost:8080/api/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData)
      })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            // Hier können Sie weitere Aktionen nach dem Absenden des Passworts ausführen, wenn erforderlich.
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    },
    async fetchPasswords() {
      try {
        const response = await fetch('http://localhost:8080/api/passwords');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.passwords = await response.json();
        this.showPasswords = true; // Passwörter anzeigen, wenn erfolgreich abgerufen
      } catch (error) {
        console.error('Error:', error);
      }
    },
    hidePasswords() {
      this.showPasswords = false; // Verstecke die Passwörter
    }
  }
};
</script>
