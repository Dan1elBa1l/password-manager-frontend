<template>
  <div>
    <h1>Kreditkarten</h1>
    <!-- Verwenden Sie die DynamicFormCC.vue-Komponente, um Kreditkartendaten hinzuzufügen -->
    <DynamicFormCC />

    <!-- Anzeige der abgerufenen Kreditkarten -->
    <div v-if="showCreditCards">
      <h2>Ihre gespeicherten Kreditkarten:</h2>
      <ul>
        <li v-for="creditCard in creditCards" :key="creditCard.id">
          {{ creditCard.cardNumber }} - {{ creditCard.cardHolderName }} - {{ creditCard.expirationDate }} - {{ creditCard.cvv }} - {{ creditCard.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import DynamicFormCC from "@/components/DynamicFormCC.vue"; // Stellen Sie sicher, dass der Pfad korrekt ist

export default {
  name: "CreditCardView",
  components: {
    DynamicFormCC, // Registrieren Sie die DynamicFormCC-Komponente
  },
  data() {
    return {
      showCreditCards: false,
      creditCards: [], // Hier sollten Ihre abgerufenen Kreditkarten gespeichert werden
    };
  },
  // Ihre JavaScript-Logik hier, um Kreditkartendaten abzurufen und anzuzeigen
};
</script>

<style scoped>
/* Ihre Styles hier */
</style>
