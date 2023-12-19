<template>
  <div>
    <h2>Passwordgenerator</h2>
    <div class="form-group">
      <label for="passwordLength">Passwortlänge:</label>
      <input type="number" v-model="passwordLength" id="passwordLength" class="form-control">
    </div>
    <div class="form-group">
      <label for="includeUppercase">Großbuchstaben einbeziehen:</label>
      <input type="checkbox" v-model="includeUppercase" id="includeUppercase" class="form-check-input">
    </div>
    <div class="form-group">
      <label for="includeNumbers">Zahlen einbeziehen:</label>
      <input type="checkbox" v-model="includeNumbers" id="includeNumbers" class="form-check-input">
    </div>
    <div class="form-group">
      <label for="includeSpecialChars">Sonderzeichen einbeziehen:</label>
      <input type="checkbox" v-model="includeSpecialChars" id="includeSpecialChars" class="form-check-input">
    </div>
    <button @click="generatePassword" class="btn btn-primary">Passwort generieren</button>
    <div v-if="generatedPassword" class="mt-3">
      <h3>Generiertes Passwort:</h3>
      <p>{{ generatedPassword }}</p>
    </div>
    <!-- Hier füge die BottomLineTime-Komponente ein -->
    <bottom-line-time></bottom-line-time>
  </div>
</template>

<script>
import BottomLineTime from '../components/BottomLineTime.vue';

export default {
  components: {
    BottomLineTime,
  },
  data() {
    return {
      passwordLength: 12,
      includeUppercase: true,
      includeNumbers: true,
      includeSpecialChars: false,
      generatedPassword: '',
    };
  },
  methods: {
    generatePassword() {
      const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
      const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numberChars = '0123456789';
      const specialChars = '!@#$%^&*()_-+=<>?';

      let chars = lowercaseChars;

      if (this.includeUppercase) {
        chars += uppercaseChars;
      }

      if (this.includeNumbers) {
        chars += numberChars;
      }

      if (this.includeSpecialChars) {
        chars += specialChars;
      }

      let password = '';
      for (let i = 0; i < this.passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
      }

      this.generatedPassword = password;
    },
  },
};
</script>

<style scoped>
/* Bootstrap-Stile können hier hinzugefügt werden, wenn benötigt */
</style>
