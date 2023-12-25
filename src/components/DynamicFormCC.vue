<template>
  <div class="credit-card-manager">
    <h1 class="page-title">Credit Card Management</h1>
    <div class="mt-custom d-flex justify-content-center flex-column align-items-center">
      <!-- Formular zum Hinzufügen/Bearbeiten von Kreditkarten -->
      <form @submit.prevent="isEditMode ? updateCreditCard() : submitCreditCard()" class="w-100">
        <input type="text" class="form-control mb-3" v-model="creditCardData.cardNumber" placeholder="Card Number" required>
        <input type="text" class="form-control mb-3" v-model="creditCardData.cardHolderName" placeholder="Card Holder Name" required>
        <input type="text" class="form-control mb-3" v-model="creditCardData.expirationDate" placeholder="Expiration Date" required>
        <input type="text" class="form-control mb-3" v-model="creditCardData.cvv" placeholder="CVV" required maxlength="3" pattern="\d{3}">
        <input type="text" class="form-control mb-3" v-model="creditCardData.description" placeholder="Description">
        <button type="submit" class="btn btn-primary" :disabled="!isValidCVV">{{ isEditMode ? 'Update' : 'Submit' }}</button>
      </form>
      <!-- Button, um Kreditkarten anzuzeigen oder zu verstecken -->
      <button @click="toggleShowCreditCards" class="btn btn-secondary mt-2">{{ showCreditCards ? 'Hide Credit Cards' : 'Show Credit Cards' }}</button>

      <!-- Anzeige der abgerufenen Kreditkarten -->
      <div v-if="showCreditCards" class="mt-3">
        <table class="table">
          <thead>
          <tr>
            <th>Card Number</th>
            <th>Card Holder Name</th>
            <th>Expiration Date</th>
            <th>CVV</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="creditCard in creditCards" :key="creditCard.id">
            <td>{{ creditCard.cardNumber }}</td>
            <td>{{ creditCard.cardHolderName }}</td>
            <td>{{ creditCard.expirationDate }}</td>
            <td>{{ creditCard.cvv }}</td>
            <td>{{ creditCard.description }}</td>
            <td>
              <button @click="editCreditCard(creditCard)" class="btn btn-warning btn-sm">Edit</button>
              <button @click="deleteCreditCard(creditCard.id)" class="btn btn-danger btn-sm">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  data() {
    return {
      creditCardData: {
        id: null,
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        cvv: '',
        description: ''
      },
      creditCards: [],
      showCreditCards: false,
      isEditMode: false,
      secret: import.meta.env.VITE_APP_SECRET // Test-Geheimschlüssel
    };
  },

  computed: {
    isValidCVV() {
      return /^\d{3}$/.test(this.creditCardData.cvv);
    }
  },

  methods: {
    encrypt(data) {
      return CryptoJS.AES.encrypt(data, this.secret).toString();
    },
    decrypt(data) {
      return CryptoJS.AES.decrypt(data, this.secret).toString(CryptoJS.enc.Utf8);
    },
    submitCreditCard() {
      const creditCardData = {
        cardNumber: this.encrypt(this.creditCardData.cardNumber),
        cardHolderName: this.encrypt(this.creditCardData.cardHolderName),
        expirationDate: this.encrypt(this.creditCardData.expirationDate),
        cvv: this.encrypt(this.creditCardData.cvv),
        description: this.encrypt(this.creditCardData.description)
      };

      let url = 'http://localhost:8080/api/creditcards';
      let method = 'POST';
      if (this.isEditMode) {
        url += `/${this.creditCardData.id}`;
        method = 'PUT';
      }

      fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creditCardData)
      })
          .then(response => response.json())
          .then(() => {
            this.fetchCreditCards();
            this.clearForm();
            this.isEditMode = false;
          })
          .catch(error => console.error('Error:', error));
    },
    fetchCreditCards() {
      fetch('http://localhost:8080/api/creditcards')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            this.creditCards = data.map(cc => ({
              id: cc.id,
              cardNumber: this.decrypt(cc.cardNumber),
              cardHolderName: this.decrypt(cc.cardHolderName),
              expirationDate: this.decrypt(cc.expirationDate),
              cvv: this.decrypt(cc.cvv),
              description: this.decrypt(cc.description)
            }));
          })
          .catch(error => console.error('Error:', error));
    },
    toggleShowCreditCards() {
      this.showCreditCards = !this.showCreditCards;
      if (this.showCreditCards) {
        this.fetchCreditCards();
      }
    },
    editCreditCard(creditCard) {
      this.isEditMode = true;
      this.creditCardData = {
        id: creditCard.id,
        cardNumber: creditCard.cardNumber, // Möglicherweise müssen Sie hier entschlüsseln
        cardHolderName: creditCard.cardHolderName, // Möglicherweise müssen Sie hier entschlüsseln
        expirationDate: creditCard.expirationDate, // Möglicherweise müssen Sie hier entschlüsseln
        cvv: creditCard.cvv, // Möglicherweise müssen Sie hier entschlüsseln
        description: creditCard.description // Möglicherweise müssen Sie hier entschlüsseln
      };
    },
    updateCreditCard() {
      const creditCardData = {
        cardNumber: this.encrypt(this.creditCardData.cardNumber),
        cardHolderName: this.encrypt(this.creditCardData.cardHolderName),
        expirationDate: this.encrypt(this.creditCardData.expirationDate),
        cvv: this.encrypt(this.creditCardData.cvv),
        description: this.encrypt(this.creditCardData.description)
      };

      fetch(`http://localhost:8080/api/creditcards/${this.creditCardData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creditCardData)
      })
          .then(() => {
            this.fetchCreditCards();
            this.clearForm();
          })
          .catch(error => console.error('Error:', error));
    },
    deleteCreditCard(id) {
      fetch(`http://localhost:8080/api/creditcards/${id}`, {
        method: 'DELETE'
      })
          .then(() => this.fetchCreditCards())
          .catch(error => console.error('Error:', error));
    },
    clearForm() {
      this.creditCardData = { id: null, cardNumber: '', cardHolderName: '', expirationDate: '', cvv: '', description: '' };
      this.isEditMode = false;
    }
  },
  mounted() {
    this.fetchCreditCards();
  }
};
</script>

<style>
.credit-card-manager {
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
  font-size: 1.1em;
  padding: 0.5em; /* Zusätzlicher Innenabstand für bessere Lesbarkeit */
}

button {
  margin-top: 0.5rem;
  background-color: #e9ecef;
  border-color: #d1d1d1;
  color: #333;
  padding: 0.5em 1em;
  border-radius: 0.25em; /* Leicht abgerundete Ecken für Buttons */
  font-size: 1em; /* Anpassung der Schriftgröße für bessere Lesbarkeit */
}

.btn-primary, .btn-secondary {
  cursor: pointer; /* Cursor-Stil als Hinweis auf Klickbarkeit */
  transition: background-color 0.3s, border-color 0.3s; /* Glatter Übergang für Hover-Effekte */
}

.btn-primary:hover, .btn-secondary:hover {
  background-color: #d6d6d6; /* Farbänderung beim Überfahren mit der Maus */
  border-color: #c0c0c0;
}

.btn-warning, .btn-danger {
}

.btn-warning:hover, .btn-danger:hover {
}

/* Hinzugefügte Tabellenstile */
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


</style>
