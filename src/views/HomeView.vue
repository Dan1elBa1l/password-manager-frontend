<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <div class="charts-container">
      <div class="chart-container">
        <canvas ref="countChart"></canvas>
        <p class="chart-description">Number of Passwords and Credit Cards saved</p>
      </div>
      <div class="chart-container">
        <canvas ref="securityChart"></canvas>
        <p class="chart-description">Complexity of your Passwords</p>
      </div>
    </div>
  </div>
</template>

<script>
import 'chart.js/auto';
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
      secret: import.meta.env.VITE_APP_SECRET
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
          labels: ['Passwords', 'Credit Cards'],
          datasets: [{
            label: 'Count',
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
          labels: ['Strong', 'Medium', 'Weak'],
          datasets: [{
            label: 'Count',
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
  margin-top: 1cm;
}

.charts-container {
  display: flex;
  width: 100%;
  margin-top: 2cm;
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
