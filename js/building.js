// Version JS 2.3.3 - Auteur : HUMANBLINK Innovation - Date : 2025-05-16
// Changes in v2.1: Added "📊 Résultats" title to match garden irrigation calculator styling
// Changes in v2.2: Enhanced calculation base styling and added sources
// Changes in v2.3: Updated Base de Calcul formatting to match Cost Calculator footnote style
// Changes in v2.3.1: Version increment for cache busting, fixed function declaration
// Changes in v2.3.2: Updated total line to match Garden table format with highlighted total
// Changes in v2.3.3: Added global variable to store total consumption for cost calculator

// Create global variable to store building water consumption total
window.buildingTotalConsumption = 0;

// Version JS 2.7 - Auteur : HUMANBLINK Innovation - Date : 2025-05-15

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

  // Modified to use tfoot for the total line and match Garden table format
  tableRows += `
    </tbody>
    <tfoot>
      <tr>
        <td>Total Annuel</td>
        <td class="highlighted-total"><strong>${formatM3(annualTotal)}</strong></td>
        <td>${formatLiters(totalAnnualLiters / population)}</td>
      </tr>
    </tfoot>
  `;

  const tableHTML = `
    <h3>📊 Résultats</h3>
    <table class="result-table">
      <thead>
        <tr><th>Mois</th><th>Conso (m³)</th><th>/ pers. (L)</th></tr>
      </thead>
      <tbody>
        ${tableRows}
    </table>
  `;

  const summaryText = `
    <div class="calculation-base">
      <h4>Base de Calcul :</h4>
      
      <p>
      Type d'usage : ${useCase}<br>
      Population : ${formatLiters(population)}<br>
      Consommation journalière de base : ${formatLiters(baseLiters)} L/jour/personne<br>
      Ajustement utilisateur : ${formatM3(adjustment)}% → Ajustée à ${formatLiters(adjustedLiters)} L/jour/personne<br>
      ${useCase === "Business Buildings" ? `Présence appliquée : ${formatM3(attendance)}%<br>` : ""}
      Total annuel estimé : ${formatLiters(totalAnnualLiters)} L<br>
      Réparti mensuellement selon les profils saisonniers de Genève.
      </p>
      
      <p>
      <strong>Méthodologie :</strong><br>
      Le calcul se base sur des valeurs moyennes de consommation pour différents types d'usage.<br>
      Les profils saisonniers ont été établis sur base de données historiques pour Genève.<br>
      Un ajustement peut être appliqué pour tenir compte de spécificités locales.
      </p>
      
      <p>
      <strong>Sources :</strong><br>
      <span class="source-link"><a href="https://www.ssige.ch/fr/eau/consommation" target="_blank">SSIGE</a></span> - Société Suisse de l'Industrie du Gaz et des Eaux<br>
      <span class="source-link"><a href="https://www.ge.ch/statistique/domaines/welcome.asp?id=02" target="_blank">OCSTAT</a></span> - Office cantonal de la statistique<br>
      <span class="source-link"><a href="https://www.bafu.admin.ch/bafu/fr/home/themes/eaux.html" target="_blank">OFEV</a></span> - Office fédéral de l'environnement
      </p>
    </div>
  `;

  document.getElementById("buildingResults").innerHTML = tableHTML + summaryText;
  
  // Store the total consumption in the global variable for cost calculator
  window.buildingTotalConsumption = parseFloat(annualTotal.toFixed(1));
  
  // Update cost calculator building field if it exists
  if (document.getElementById('building')) {
    document.getElementById('building').value = window.buildingTotalConsumption;
    // Add visual feedback that the field was auto-populated
    document.getElementById('building').classList.add('auto-populated');
    setTimeout(() => {
      document.getElementById('building').classList.remove('auto-populated');
    }, 2000);
  }
}