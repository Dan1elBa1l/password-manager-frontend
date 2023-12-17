<template>
  <div>
    <h1>Welcome to your Password-Manager</h1>
    <!-- Formular zum Hinzufügen von Passwörtern -->
    <form @submit.prevent="submitPassword">
      <input type="text" v-model="passwordData.service" placeholder="Service" required>
      <input type="text" v-model="passwordData.username" placeholder="Username" required>
      <input type="password" v-model="passwordData.password" placeholder="Password" required>
      <input type="text" v-model="passwordData.description" placeholder="Description">
      <button type="submit">Submit</button>
    </form>
    <!-- Button, um Passwörter anzuzeigen oder zu verstecken -->
    <button @click="toggleShowPasswords">{{ showPasswords ? 'Hide Passwords' : 'Show Passwords' }}</button>

    <!-- Anzeige der abgerufenen Passwörter -->
    <div v-if="showPasswords">
      <ul>
        <li v-for="password in passwords" :key="password.id">
          {{ password.service }} - {{ password.username }} - {{ password.password }} - {{ password.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

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
      showPasswords: false,
      secret: import.meta.env.VITE_APP_SECRET // Test-Geheimschlüssel
    };
  },
  methods: {
    encrypt(data) {
      return CryptoJS.AES.encrypt(data, this.secret).toString();
    },
    decrypt(data) {
      return CryptoJS.AES.decrypt(data, this.secret).toString(CryptoJS.enc.Utf8);
    },
    submitPassword() {
      const passwordData = {
        service: this.passwordData.service,
        username: this.encrypt(this.passwordData.username),
        password: this.encrypt(this.passwordData.password),
        description: this.encrypt(this.passwordData.description)
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
        const encryptedPasswords = await response.json();
        this.passwords = encryptedPasswords.map(pw => {
          return {
            ...pw,
            username: this.decrypt(pw.username),
            password: this.decrypt(pw.password),
            description: this.decrypt(pw.description)
          };
        });
      } catch (error) {
        console.error('Error:', error);
      }
    },
    toggleShowPasswords() {
      this.showPasswords = !this.showPasswords;
      if (this.showPasswords) {
        this.fetchPasswords();
      }
    },
    hidePasswords() {
      this.showPasswords = false;
    }
  }
};
</script>
