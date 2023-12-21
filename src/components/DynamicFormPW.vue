<template>
  <div>
    <h1>Welcome to your Password-Manager</h1>
    <!-- Formular zum Hinzufügen/Bearbeiten von Passwörtern -->
    <form @submit.prevent="submitPassword">
      <input type="text" v-model="passwordData.service" placeholder="Service" required>
      <input type="text" v-model="passwordData.username" placeholder="Username" required>
      <input type="password" v-model="passwordData.password" placeholder="Password" required>
      <input type="text" v-model="passwordData.description" placeholder="Description">
      <button type="submit">{{ isEditMode ? 'Update' : 'Submit' }}</button>
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
            <button @click="editPassword(password)">Edit</button>
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
        id: null,
        service: '',
        username: '',
        password: '',
        description: ''
      },
      passwords: [],
      showPasswords: false,
      isEditMode: false,
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

      let url = 'http://localhost:8080/api/passwords';
      let method = 'POST';
      if (this.isEditMode) {
        url += `/${this.passwordData.id}`;
        method = 'PUT';
      }

      fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      })
          .then(response => response.json())
          .then(() => {
            this.fetchPasswords();
            this.clearForm();
            this.isEditMode = false;
          })
          .catch(error => console.error('Error:', error));
    },
    fetchPasswords() {
      fetch('http://localhost:8080/api/passwords')
          .then(response => response.json())
          .then(data => {
            console.log('Empfangene Passwörter:', data);
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
    editPassword(password) {
      this.isEditMode = true;
      this.passwordData = {
        id: password.id,
        service: password.service,
        username: password.username, // Möglicherweise müssen Sie hier entschlüsseln
        password: password.password, // Möglicherweise müssen Sie hier entschlüsseln
        description: password.description // Möglicherweise müssen Sie hier entschlüsseln
      };
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
      this.passwordData = {id: null, service: '', username: '', password: '', description: ''};
      this.isEditMode = false;
    }
  },
  mounted() {
    this.fetchPasswords();
  }
};
</script>
