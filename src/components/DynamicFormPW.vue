<template>
  <div class="password-manager">
    <h1 class="page-title">Password-Management</h1>
  </div>
  <div class="mt-custom d-flex justify-content-center flex-column align-items-center">

    <form @submit.prevent="submitPassword" class="w-50">
      <input type="text" class="form-control mb-2" v-model="passwordData.service" placeholder="Service" required>
      <input type="text" class="form-control mb-2" v-model="passwordData.username" placeholder="Username" required>
      <input type="password" class="form-control mb-2" v-model="passwordData.password" placeholder="Password" required>
      <input type="text" class="form-control mb-2" v-model="passwordData.description" placeholder="Description">
      <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update' : 'Submit' }}</button>
    </form>

    <button @click="toggleShowPasswords" class="btn btn-secondary mt-2">{{ showPasswords ? 'Hide Passwords' : 'Show Passwords' }}</button>

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
      secret: import.meta.env.VITE_APP_SECRET
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
        username: password.username,
        password: password.password,
        description: password.description
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
  margin-top: 1cm;
}

.page-title {
  margin-bottom: 0.1cm;
}


.mt-custom {
  margin-top: 2cm;
}


input[type="text"],
input[type="password"] {
  margin-bottom: 0.5rem;
  background-color: #f7f7f7;
  border-color: #d1d1d1;
  color: #333;
}


button {
  margin-top: 0.5rem;
}


.btn-primary {
  background-color: #e9ecef;
  border-color: #d1d1d1;
  color: #333;
}


.table {
  color: #333;
}

.table th {
  background-color: #f7f7f7;
  border-bottom: 2px solid #d1d1d1;
}

.table td {
  background-color: #ffffff;
}


.btn-warning {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}


.btn-danger {
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
}


.btn-warning:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.btn-danger:hover {
  background-color: #23272b;
  border-color: #1d2124;
}

</style>