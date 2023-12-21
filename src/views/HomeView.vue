<template>
  <div class="dashboard">
    <h1>Welcome to your Dashboard</h1>
    <div class="charts-container">
      <!-- Container für das Anzahl-Diagramm -->
      <div class="chart-container">
        <canvas ref="countChart"></canvas>
        <p class="chart-description">Number of Passwords and Credit Cards saved</p>
      </div>
      <!-- Container für das Sicherheitsbewertungs-Diagramm -->
      <div class="chart-container">
        <canvas ref="securityChart"></canvas>
        <p class="chart-description">Sicherheitsbewertung der Passwörter</p>
      </div>
    </div>
  </div>
</template>

<script>
import 'chart.js/auto'; // Automatisches Registrieren der benötigten Komponenten
import CryptoJS from 'crypto-js';
import {Chart} from "chart.js";

export default {
  data() {
    return {
      passwords: [],
      creditCards: [],
      securityRatings: {
        strong: 0,
        medium: 0,
        weak: 0
      },
      countChart: null,
      securityChart: null,
      secret: import.meta.env.VITE_APP_SECRET // Test-Geheimschlüssel für die Entschlüsselung
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Promise.all([
        fetch('http://localhost:8080/api/passwords').then(response => response.json()),
        fetch('http://localhost:8080/api/creditcards').then(response => response.json())
      ]).then(([passwordsData, creditCardsData]) => {
        this.passwords = passwordsData.map(pw => ({
          ...pw,
          password: this.decrypt(pw.password)
        }));
        this.creditCards = creditCardsData;
        this.evaluateSecurity();
        this.createCountChart();
        this.createSecurityChart();
      }).catch(error => console.error('Error fetching data:', error));
    },
    decrypt(data) {
      return CryptoJS.AES.decrypt(data, this.secret).toString(CryptoJS.enc.Utf8);
    },
    evaluateSecurity() {
      this.securityRatings = {strong: 0, medium: 0, weak: 0};
      this.passwords.forEach(password => {
        const passwordLength = password.password.length;
        if (passwordLength > 12) {
          this.securityRatings.strong++;
        } else if (passwordLength > 8) {
          this.securityRatings.medium++;
        } else {
          this.securityRatings.weak++;
        }
      });
    },
    createCountChart() {
      const ctx = this.$refs.countChart.getContext('2d');
      if (this.countChart) this.countChart.destroy();
      this.countChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Passwörter', 'Kreditkarten'],
          datasets: [{
            label: 'Anzahl',
            data: [this.passwords.length, this.creditCards.length],
            backgroundColor: ['rgba(128, 128, 128, 0.2)', 'rgba(192, 192, 192, 0.2)'],
            borderColor: ['rgba(128, 128, 128, 1)', 'rgba(192, 192, 192, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {y: {beginAtZero: true}}
        }
      });
    },
    createSecurityChart() {
      const ctx = this.$refs.securityChart.getContext('2d');
      if (this.securityChart) this.securityChart.destroy();
      this.securityChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Stark', 'Mittel', 'Schwach'],
          datasets: [{
            label: 'Sicherheitsbewertung',
            data: [this.securityRatings.strong, this.securityRatings.medium, this.securityRatings.weak],
            backgroundColor: ['rgba(50, 50, 50, 0.2)', 'rgba(100, 100, 100, 0.2)', 'rgba(150, 150, 150, 0.2)'],
            borderColor: ['rgba(50, 50, 50, 1)', 'rgba(100, 100, 100, 1)', 'rgba(150, 150, 150, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }
};
</script>

<style>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.charts-container {
  display: flex;
  width: 100%;
  margin-top: 5cm;
}

.chart-container {
  flex: 1;
  position: relative;
  height: 40vh;
}

.chart-description {
  text-align: center;
  margin-top: 1em;
}
</style>
