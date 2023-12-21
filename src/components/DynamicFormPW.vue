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

    <!-- Tabelle der Passwörter -->
    <div v-if="showPasswords">
      <table>
        <thead>
        <tr>
          <th>Service</th>
          <th>Username</th>
          <th>Password</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="password in passwords" :key="password.id">
          <td>{{ password.service }}</td>
          <td>{{ password.username }}</td>
          <td>{{ password.password }}</td>
          <td>{{ password.description }}</td>
          <td>
            <button @click="editPassword(password.id)">Edit</button>
            <button @click="deletePassword(password.id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
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
            this.passwords.push(data);
            this.clearForm();
          })
          .catch(error => console.error('Error:', error));
    },
    fetchPasswords() {
      fetch('http://localhost:8080/api/passwords')
          .then(response => response.json())
          .then(data => {
            console.log('Empfangene Passwörter:', data); // Protokollieren der empfangenen Daten
            this.passwords = data.map(pw => ({
              id: pw.id,
              service: pw.service,
              username: this.decrypt(pw.username),
              password: this.decrypt(pw.password),
              description: this.decrypt(pw.description)
            }));
          })
          .catch(error => console.error('Error:', error));
    },
    toggleShowPasswords() {
      this.showPasswords = !this.showPasswords;
      if (this.showPasswords) {
        this.fetchPasswords();
      }
    },
    editPassword(id) {
      // Implementieren Sie die Logik zum Bearbeiten eines Passworts
    },
    deletePassword(id) {
      if (typeof id === 'undefined' || id === null) {
        console.error('Die ID ist undefined oder null.');
        return;
      }
      fetch(`http://localhost:8080/api/passwords/${id}`, {
        method: 'DELETE'
      })
          .then(() => this.fetchPasswords())
          .catch(error => console.error('Error:', error));
    },

    clearForm() {
      this.passwordData = { service: '', username: '', password: '', description: '' };
    }
  },
  mounted() {
    this.fetchPasswords();
  }
};
</script>
