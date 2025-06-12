// Version JS 2.6.0 - Auteur : HUMANBLINK Innovation - Date : 2025-06-11 15:45
// Changes in v2.6.0: Added Geneva canton working days calculation for Schools/Universities
// - Schools/Universities now use 252 working days/year (Geneva canton working days excluding holidays)
// - Sport Clubs continue using 104 visits/year (2 visits/week × 52 weeks)
// - All other building types use 365 days/year
// - Updated "Base de Calcul" section to show specific time periods for each building type
// - More accurate calculations reflecting actual operational periods
// Previous changes in v2.5.0: Enhanced functionality for all building types with universal attendance

// Create global variable to store building water consumption total
window.buildingTotalConsumption = 0;

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
  let totalAnnualLiters;
  
  // ENHANCED: Different time periods for different building types
  if (useCase === "Sport Clubs") {
    const visitsPerYear = 2 * 52; // 2 visits/week × 52 weeks = 104 visits/year
    totalAnnualLiters = adjustedLiters * population * visitsPerYear;
  } else if (useCase === "Schools / Universities") {
    const workingDaysPerYear = 252; // Geneva canton working days excluding holidays and weekends
    totalAnnualLiters = adjustedLiters * population * workingDaysPerYear;
  } else {
    totalAnnualLiters = adjustedLiters * population * 365; // All other types use full year
  }
  
  // ENHANCED: Apply attendance to ALL building types, not just Business Buildings
  totalAnnualLiters *= (100 + attendance) / 100;

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

  // Enhanced "Base de Calcul" section with comprehensive parameter information
  const summaryText = `
    <div class="calculation-base">
      <h4>Base de Calcul :</h4>
      
      <p>
      Type d'usage : ${useCase}<br>
      Population : ${formatLiters(population)}<br>
      Consommation journalière de base : ${formatLiters(baseLiters)} L/${useCase === "Sport Clubs" ? "visite" : "jour"}/personne<br>
      ${useCase === "Sport Clubs" ? `Fréquence de visite : 2 visites/semaine = 104 visites/an<br>` : ""}
      ${useCase === "Schools / Universities" ? `Jours d'école : 252 jours ouvrables/an (Genève, hors week-ends et jours fériés)<br>` : ""}
      Ajustement de consommation : ${formatM3(adjustment)}% → Ajustée à ${formatLiters(adjustedLiters)} L/${useCase === "Sport Clubs" ? "visite" : "jour"}/personne<br>
      Taux d'occupation appliqué : ${attendance >= 0 ? '+' : ''}${formatM3(attendance)}% → Facteur: ${formatM3((100 + attendance) / 100)}<br>
      Total annuel estimé : ${formatLiters(totalAnnualLiters)} L<br>
      Réparti mensuellement selon les profils saisonniers de Genève.
      </p>
      
      <p>
      <strong>Méthodologie :</strong><br>
      Le calcul se base sur des valeurs moyennes de consommation pour différents types d'usage.<br>
      ${useCase === "Sport Clubs" ? "Pour les clubs sportifs, la consommation est basée sur 2 visites par semaine par personne (104 visites/an).<br>" : ""}
      ${useCase === "Schools / Universities" ? "Pour les écoles/universités, la consommation est basée sur 252 jours ouvrables annuels du canton de Genève.<br>" : ""}
      L'ajustement de consommation modifie la consommation de base selon les spécificités du bâtiment.<br>
      Le taux d'occupation ajuste la consommation totale selon la présence réelle des occupants.<br>
      Les profils saisonniers ont été établis sur base de données historiques pour Genève.
      </p>
      
      <p>
      <strong>Sources :</strong><br>
      <span class="source-link"><a href="https://www.svgw.ch/fr/eau/statistique-de-leau/" target="_blank">SSIGE</a></span> - Société Suisse de l'Industrie du Gaz et des Eaux<br>
      <span class="source-link"><a href="https://www.ge.ch/statistique/domaines/welcome.asp?id=02" target="_blank">OCSTAT</a></span> - Office cantonal de la statistique
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