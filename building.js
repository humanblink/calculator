// Version JS 2.7 - Auteur : HUMANBLINK Innovation - Date : 2025-05-13

const constants = {
  months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
  daysPerMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  monthlyWeights: {
    "Households": [0.08, 0.07, 0.08, 0.08, 0.09, 0.09, 0.10, 0.10, 0.09, 0.08, 0.07, 0.07],
    "Schools / Universities": [0.10, 0.10, 0.11, 0.11, 0.11, 0.07, 0.00, 0.00, 0.11, 0.11, 0.10, 0.08],
    "Municipal Buildings": [0.08, 0.08, 0.09, 0.09, 0.10, 0.10, 0.07, 0.07, 0.09, 0.09, 0.07, 0.07],
    "Sport Clubs": [0.09, 0.09, 0.10, 0.10, 0.10, 0.08, 0.05, 0.05, 0.09, 0.09, 0.09, 0.07],
    "Business Buildings": [0.08, 0.08, 0.09, 0.09, 0.10, 0.10, 0.07, 0.07, 0.09, 0.09, 0.07, 0.07]
  },
  dailyLiters: {
    "Households": 160,
    "Schools / Universities": 50,
    "Municipal Buildings": 90,
    "Sport Clubs": 40,
    "Business Buildings": 80
  }
};

function formatM3(val) {
  return val.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function formatLiters(val) {
  return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function calculateWaterUse() {
  const useCase = document.getElementById("useCase").value;
  const population = parseInt(document.getElementById("population").value);
  const adjustment = parseFloat(document.getElementById("adjustment").value);
  let attendance = parseFloat(document.getElementById("attendance").value);
  if (isNaN(attendance)) attendance = 100;

  const baseLiters = constants.dailyLiters[useCase];
  const adjustedLiters = baseLiters * (1 + adjustment / 100);
  const seasonalWeights = constants.monthlyWeights[useCase];
  const months = constants.months;

  let annualTotal = 0;
  let totalAnnualLiters = adjustedLiters * population * 365;
  if (useCase === "Business Buildings") {
    totalAnnualLiters *= attendance / 100;
  }

  let tableRows = "";
  months.forEach((month, i) => {
    let monthlyLiters = totalAnnualLiters * seasonalWeights[i];
    const m3 = monthlyLiters / 1000;
    const perCapitaLiters = population > 0 ? monthlyLiters / population : 0;
    annualTotal += m3;

    tableRows += `
      <tr>
        <td>${month}</td>
        <td>${formatM3(m3)}</td>
        <td>${formatLiters(perCapitaLiters)}</td>
      </tr>
    `;
  });

  tableRows += `
    <tr>
      <td><strong>Total Annuel</strong></td>
      <td><strong>${formatM3(annualTotal)}</strong></td>
      <td><strong>${formatLiters(totalAnnualLiters / population)}</strong></td>
    </tr>
  `;

  const tableHTML = `
    <table class="result-table">
      <thead>
        <tr><th>Mois</th><th>Conso</th><th>/ pers. (L)</th></tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

  const summaryText = `
    <p><strong>Base de Calcul :</strong><br>
    Type d'usage : ${useCase}<br>
    Population : ${formatLiters(population)}<br>
    Consommation journalière de base : ${formatLiters(baseLiters)} L/jour/personne<br>
    Ajustement utilisateur : ${formatM3(adjustment)}% → Ajustée à ${formatLiters(adjustedLiters)} L/jour/personne<br>
    ${useCase === "Business Buildings" ? `Présence appliquée : ${formatM3(attendance)}%<br>` : ""}
    Total annuel estimé : ${formatLiters(totalAnnualLiters)} L<br>
    Réparti mensuellement selon les profils saisonniers de Genève.
    </p>
  `;

  document.getElementById("buildingResults").innerHTML = tableHTML + `<div class="calculation-base">${summaryText}</div>`;
}
