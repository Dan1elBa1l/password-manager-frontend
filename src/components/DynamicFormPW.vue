<template>
  <div class="password-manager">
    <h1 class="page-title">Password-Management</h1>
  </div>
  <div class="mt-custom d-flex justify-content-center flex-column align-items-center">
    <!-- Formular zum Hinzufügen/Bearbeiten von Passwörtern -->
    <form @submit.prevent="submitPassword" class="w-50">
      <input type="text" class="form-control mb-2" v-model="passwordData.service" placeholder="Service" required>
      <input type="text" class="form-control mb-2" v-model="passwordData.username" placeholder="Username" required>
      <input type="password" class="form-control mb-2" v-model="passwordData.password" placeholder="Password" required>
      <input type="text" class="form-control mb-2" v-model="passwordData.description" placeholder="Description">
      <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update' : 'Submit' }}</button>
    </form>
    <!-- Button, um Passwörter anzuzeigen oder zu verstecken -->
    <button @click="toggleShowPasswords" class="btn btn-secondary mt-2">{{ showPasswords ? 'Hide Passwords' : 'Show Passwords' }}</button>

    <!-- Tabelle der Passwörter -->
    <div v-if="showPasswords" class="mt-3">
      <table class="table">
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
            <button @click="editPassword(password)" class="btn btn-warning btn-sm">Edit</button>
            <button @click="deletePassword(password.id)" class="btn btn-danger btn-sm">Delete</button>
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
<style>
.password-manager {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1cm; /* Stellt den gleichen Abstand wie bei .dashboard ein */
}

.page-title {
  margin-bottom: 0.1cm;
}

/* Benutzerdefinierte Klasse für spezifischen Abstand */
.mt-custom {
  margin-top: 2cm;
}

/* Stil für die Formularelemente */
input[type="text"],
input[type="password"] {
  margin-bottom: 0.5rem;
  background-color: #f7f7f7; /* Heller Grauton für den Hintergrund */
  border-color: #d1d1d1; /* Dunklerer Grauton für den Rand */
  color: #333; /* Dunkler Grauton für den Text */
}

/* Stil für die Buttons */
button {
  margin-top: 0.5rem;
}

/* Stil für den Submit-Button, gleiches Grau wie 'Show Passwords' */
.btn-primary {
  background-color: #e9ecef; /* Mittlerer Grauton */
  border-color: #d1d1d1; /* Dunklerer Grauton für den Rand */
  color: #333; /* Dunkler Grauton für den Text */
}

/* Stil für die Tabelle */
.table {
  color: #333; /* Dunkler Grauton für den Text */
}

.table th {
  background-color: #f7f7f7; /* Heller Grauton für den Hintergrund */
  border-bottom: 2px solid #d1d1d1; /* Dunklerer Grauton für den unteren Rand */
}

.table td {
  background-color: #ffffff; /* Weißer Hintergrund */
}

/* Button-Stil für Edit-Aktion */
.btn-warning {
  color: #fff; /* Weißer Text */
  background-color: #6c757d; /* Dunkelgrau */
  border-color: #6c757d; /* Dunkelgrau */
}

/* Button-Stil für Delete-Aktion, dunkler als Edit */
.btn-danger {
  color: #fff; /* Weißer Text */
  background-color: #343a40; /* Sehr dunkles Grau */
  border-color: #343a40; /* Sehr dunkles Grau */
}

/* Hover-Effekte für Edit und Delete Buttons */
.btn-warning:hover {
  background-color: #5a6268; /* Etwas dunkleres Grau */
  border-color: #545b62; /* Etwas dunkleres Grau */
}

.btn-danger:hover {
  background-color: #23272b; /* Noch dunkleres Grau */
  border-color: #1d2124; /* Noch dunkleres Grau */
}


/* Optional: Weitere Stile für Hover-Effekte und Fokus-Zustände */
</style>