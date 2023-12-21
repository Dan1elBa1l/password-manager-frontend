<template>
  <div>
    <h1>Welcome to your Credit Card Manager</h1>
    <!-- Formular zum Hinzufügen/Bearbeiten von Kreditkarten -->
    <form @submit.prevent="isEditMode ? updateCreditCard() : submitCreditCard()">
      <input type="text" v-model="creditCardData.cardNumber" placeholder="Card Number" required>
      <input type="text" v-model="creditCardData.cardHolderName" placeholder="Card Holder Name" required>
      <input type="text" v-model="creditCardData.expirationDate" placeholder="Expiration Date" required>
      <input type="text" v-model="creditCardData.cvv" placeholder="CVV" required>
      <input type="text" v-model="creditCardData.description" placeholder="Description">
      <button type="submit">{{ isEditMode ? 'Update' : 'Submit' }}</button>
    </form>
    <!-- Button, um Kreditkarten anzuzeigen oder zu verstecken -->
    <button @click="toggleShowCreditCards">{{ showCreditCards ? 'Hide Credit Cards' : 'Show Credit Cards' }}</button>

    <!-- Anzeige der abgerufenen Kreditkarten -->
    <div v-if="showCreditCards">
      <ul>
        <li v-for="creditCard in creditCards" :key="creditCard.id">
          {{ creditCard.cardNumber }} - {{ creditCard.cardHolderName }} - {{ creditCard.expirationDate }} - {{ creditCard.cvv }} - {{ creditCard.description }}
          <button @click="editCreditCard(creditCard)">Edit</button>
          <button @click="deleteCreditCard(creditCard.id)">Delete</button>
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
