// Version JS 2.1.7 - Auteur : HUMANBLINK Innovation - Date : 2025-06-05
// Changes in v2.1.7: Updated source links as requested
// - Updated MétéoSuisse link to OpenData documentation
// - Updated OFEV link to specific water data page
// - Maintained all existing functionality and calculations
// Previous changes in v2.1.6: Fixed decimal precision in stored totalNeed value

// Create global variable to store garden irrigation total
window.gardenTotalNeed = 0;

// Geneva Garden Irrigation Calculator JS script
// Author: HUMANBLINK Innovation
// JS Version: 3.0.0 (Added total line in table footer)

const ET0 = {
  Janvier: 0.5, Février: 0.75, Mars: 1.41, Avril: 2.37,
  Mai: 3.31, Juin: 4.27, Juillet: 4.75, Août: 4.29,
  Septembre: 2.85, Octobre: 1.9, Novembre: 0.95, Décembre: 0.5
};

const averageMonthlyRain = {
  Janvier: 60, Février: 55, Mars: 65, Avril: 70,
  Mai: 80, Juin: 90, Juillet: 75, Août: 70,
  Septembre: 65, Octobre: 80, Novembre: 75, Décembre: 65
};

const kcValues = {
  "Gazon": 0.95,
  "Plantes ornementales": 0.90,
  "Jardin mixte": 0.85,
  "Légumes": 0.90
};

const irrigationEfficiency = {
  "Goutte-à-goutte": 0.90,
  "Sprinkler": 0.75,
  "Arrosage manuel": 0.60
};

const soilLossFactor = {
  "Argileux": 0.85,
  "Limoneux": 1.00,
  "Sableux": 1.20,
  "Tourbeux": 1.10
};

const frequencyToEvents = {
  "Chaque jour": 30,
  "Chaque 2 jours": 15,
  "Chaque 3 jours": 10,
  "1 fois par semaine": 4
};

const monthDays = {
  Janvier: 31, Février: 28, Mars: 31, Avril: 30,
  Mai: 31, Juin: 30, Juillet: 31, Août: 31,
  Septembre: 30, Octobre: 31, Novembre: 30, Décembre: 31
};

function getSelectedMonths() {
  const checkboxes = document.querySelectorAll('input[name="month"]:checked');
  return Array.from(checkboxes).map(cb => cb.labels[0].innerText);
}

function formatSwiss(val) {
  const rounded = Math.ceil(val);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function calculateIrrigation() {
  const area = parseFloat(document.getElementById('area').value);
  const plantType = document.getElementById('plantType').value;
  const soilType = document.getElementById('soilType').value;
  const irrigationType = document.getElementById('irrigationType').value;
  const frequency = document.getElementById('frequency').value;
  const months = getSelectedMonths();

  if (isNaN(area) || months.length === 0) {
    alert("Veuillez entrer une surface valide et sélectionner au moins un mois.");
    return;
  }

  const Kc = kcValues[plantType];
  const efficiency = irrigationEfficiency[irrigationType];
  const soilFactor = soilLossFactor[soilType];
  const eventsPerMonth = frequencyToEvents[frequency];

  let resultHTML = '<h3>📊 Résultats</h3>';
  resultHTML += '<table class="result-table">';
  // Updated table headers with units
  resultHTML += '<thead><tr><th>Mois</th><th>Pluie (m³)</th><th>ET₀ (m³)</th><th>Pertes (m³)</th><th>Besoin (m³)</th><th>Fréq.</th><th>Vol/arros. (m³)</th></tr></thead>';
  resultHTML += '<tbody>';

  // Track totals for each column
  let totalNeed = 0;
  let totalRain = 0;
  let totalET0 = 0;
  let totalLoss = 0;
  let totalVolPerWatering = 0;

  months.forEach(month => {
    const days = monthDays[month];
    const et0 = ET0[month];
    const rain = averageMonthlyRain[month];

    const grossNeed = (et0 * Kc * area * days) / 1000 / efficiency;
    const effectiveRain = 0.85 * rain * area / 1000;
    const rainLoss = effectiveRain * 0.15;
    let adjustedNetNeed = Math.max(0, (grossNeed - (effectiveRain - rainLoss)) * soilFactor);
    if (document.getElementById('sensorAdjustment').checked) {
      adjustedNetNeed *= 0.65;
    }

    const perEvent = adjustedNetNeed / eventsPerMonth;
    
    // Add to totals
    totalNeed += adjustedNetNeed;
    totalRain += effectiveRain;
    totalET0 += grossNeed;
    totalLoss += rainLoss;
    totalVolPerWatering += perEvent;

    resultHTML += `<tr>
      <td>${month}</td>
      <td>${formatSwiss(effectiveRain)}</td>
      <td>${formatSwiss(grossNeed)}</td>
      <td>${formatSwiss(rainLoss)}</td>
      <td>${formatSwiss(adjustedNetNeed)}</td>
      <td>${frequency}</td>
      <td>${formatSwiss(perEvent)}</td>
    </tr>`;
  });

  resultHTML += '</tbody>';
  // Updated total row - only Besoin column is bold
  resultHTML += `<tfoot><tr>
    <td>Total Annuel</td>
    <td>${formatSwiss(totalRain)}</td>
    <td>${formatSwiss(totalET0)}</td>
    <td>${formatSwiss(totalLoss)}</td>
    <td class="highlighted-total"><strong>${formatSwiss(totalNeed)}</strong></td>
    <td></td>
    <td>${formatSwiss(totalVolPerWatering)}</td>
  </tr></tfoot>`;
  resultHTML += '</table>';

  // Add the Base de Calcul section with updated source links
  const calculationBaseHTML = `
  <div class="calculation-base">
    <h4>Base de Calcul :</h4>
    
    <p>
    Surface : ${formatSwiss(area)} m²<br>
    Type de plante : ${plantType} (facteur Kc: ${Kc})<br>
    Type de sol : ${soilType} (facteur de perte: ${soilFactor})<br>
    Méthode d'irrigation : ${irrigationType} (efficacité: ${Math.round(efficiency * 100)}%)<br>
    Fréquence : ${frequency} (${eventsPerMonth} événements par mois)<br>
    ${document.getElementById('sensorAdjustment').checked ? 'Ajustement pour capteurs de sols appliqué (-35%)' : 'Aucun ajustement pour capteurs'}
    </p>
    
    <p>
    <strong>Méthodologie :</strong><br>
    Le calcul utilise l'équation du besoin net en irrigation basée sur l'évapotranspiration.<br>
    Besoin brut = ET₀ × Kc × Surface × Jours / 1000 / Efficacité<br>
    Pluie efficace = 0.85 × Pluie moyenne × Surface / 1000<br>
    Besoin net = (Besoin brut - (Pluie efficace - Perte)) × Facteur du sol<br>
    Volume par arrosage = Besoin net / Nombre d'événements
    </p>
    
    <p>
    <strong>Sources :</strong><br>
    <span class="source-link"><a href="https://opendatadocs.meteoswiss.ch/fr/a-data-groundbased" target="_blank">MétéoSuisse</a></span> - Données de précipitations et climatiques<br>
    <span class="source-link"><a href="https://www.fao.org/land-water/databases-and-software/crop-information/fr/" target="_blank">FAO</a></span> - Coefficients culturaux et évapotranspiration<br>
    <span class="source-link"><a href="https://www.bafu.admin.ch/bafu/fr/home/themes/eaux/donnees-et-cartes.html" target="_blank">OFEV</a></span> - Directives pour l'économie d'eau
    </p>
  </div>
  `;

  document.getElementById('results').innerHTML = resultHTML + calculationBaseHTML;
  
  // Store the total need in the global variable for cost calculator
  // Fixed: Now storing with one decimal place instead of using Math.ceil()
  window.gardenTotalNeed = parseFloat(totalNeed.toFixed(1));
  
  // Update cost calculator irrigation field if it exists
  if (document.getElementById('irrigation')) {
    document.getElementById('irrigation').value = window.gardenTotalNeed;
    // Add visual feedback that the field was auto-populated
    document.getElementById('irrigation').classList.add('auto-populated');
    setTimeout(() => {
      document.getElementById('irrigation').classList.remove('auto-populated');
    }, 2000);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  // Set up irrigation type change handler
  document.getElementById('irrigationType').addEventListener('change', () => {
    const type = document.getElementById('irrigationType').value;
    const defaultEff = Math.round(irrigationEfficiency[type] * 100);
    document.getElementById('efficiency').value = defaultEff.toString();
  });
  
  // Additional event handler for growing season selection
  document.getElementById('growingSeason').addEventListener('change', function() {
    const growingMonths = ['apr', 'may', 'jun', 'jul', 'aug', 'sep'];
    growingMonths.forEach(month => {
      document.getElementById(month).checked = this.checked;
    });
  });
  
  // Set up calculate button
  document.querySelector('.btn-calculate').addEventListener('click', calculateIrrigation);
});