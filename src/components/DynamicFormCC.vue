<template>
  <div>
    <h1>Welcome to your Credit Card Manager</h1>
    <!-- Formular zum Hinzufügen von Kreditkarten -->
    <form @submit.prevent="submitCreditCard">
      <input type="text" v-model="creditCardData.cardNumber" placeholder="Card Number" required>
      <input type="text" v-model="creditCardData.cardHolderName" placeholder="Card Holder Name" required>
      <input type="text" v-model="creditCardData.expirationDate" placeholder="Expiration Date" required>
      <input type="text" v-model="creditCardData.cvv" placeholder="CVV" required>
      <input type="text" v-model="creditCardData.description" placeholder="Description">
      <button type="submit">Submit</button>
    </form>
    <!-- Anzeige der abgerufenen Kreditkarten -->
    <div v-if="showCreditCards">
      <ul>
        <li v-for="creditCard in creditCards" :key="creditCard.id">
          {{ creditCard.cardNumber }} - {{ creditCard.cardHolderName }} - {{ creditCard.expirationDate }} - {{ creditCard.cvv }} - {{ creditCard.description }}
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
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        cvv: '',
        description: ''
      },
      creditCards: [],
      showCreditCards: false,
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

      fetch('http://localhost:8080/api/creditcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creditCardData)
      })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    },
    async fetchCreditCards() {
      try {
        const response = await fetch('http://localhost:8080/api/creditcards');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const encryptedCreditCards = await response.json();
        this.creditCards = encryptedCreditCards.map(cc => {
          return {
            ...cc,
            cardNumber: this.decrypt(cc.cardNumber),
            cardHolderName: this.decrypt(cc.cardHolderName),
            expirationDate: this.decrypt(cc.expirationDate),
            cvv: this.decrypt(cc.cvv),
            description: this.decrypt(cc.description)
          };
        });
      } catch (error) {
        console.error('Error:', error);
      }
    },
    toggleShowCreditCards() {
      this.showCreditCards = !this.showCreditCards;
      if (this.showCreditCards) {
        this.fetchCreditCards();
      }
    },
    hideCreditCards() {
      this.showCreditCards = false;
    }
  }
};
</script>
