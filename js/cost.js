// Version JS 2.15.0 - Auteur : HUMANBLINK Innovation - Date : 2025-06-05
// Changes in v2.15.0: Moved TVA and Prix/m³ text under Remarques section
// - Reorganized text layout for better logical grouping
// - TVA and pricing details now appear with other remarks
// - Maintained all existing functionality and calculations
// Previous changes in v2.9.0: Improved results page layout with numbered lists and better structure

// Définition des tranches tarifaires SIG 2025 (particulier)
const tiers = [
  { upTo: 100, unitPrice: 0.00, fixed: 579 },
  { upTo: 500, unitPrice: 5.00, fixed: 579 },
  { upTo: 5000, unitPrice: 3.89, fixed: 2579 },
  { upTo: 20000, unitPrice: 3.24, fixed: 19634 },
  { upTo: Infinity, unitPrice: 2.87, fixed: 68234 }
];

// Formateur suisse : 1 décimale + apostrophe
function formatSwiss(val) {
  return val.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

// Fonction principale de calcul des coûts
function calculateCost() {
  const irrigationInput = parseFloat(document.getElementById('irrigation').value) || 0;
  const reduction = parseFloat(document.getElementById('reduction').value) || 0;
  const building = parseFloat(document.getElementById('building').value) || 0;

  // Application de la réduction sur la consommation d'irrigation
  const reducedIrrigation = irrigationInput * (1 + reduction / 100);
  const total = reducedIrrigation + building;

  let cost = 0;
  let fixed = 0;
  let explanation = [];

  // Calcul du coût en fonction de la tranche tarifaire applicable
  for (let i = 0, prev = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    if (total <= tier.upTo) {
      const m3 = total - prev;
      cost += m3 * tier.unitPrice;
      fixed = tier.fixed;
      explanation.push(
        `Tranche ${formatSwiss(prev + 1)} à ${formatSwiss(tier.upTo)} m³ → ` +
        `${formatSwiss(m3)} m³ × CHF ${formatSwiss(tier.unitPrice)} = CHF ${formatSwiss(m3 * tier.unitPrice)} (fixe: CHF ${formatSwiss(tier.fixed)})`
      );
      break;
    } else {
      prev = tier.upTo;
    }
  }

  const totalCost = cost + fixed;
  const monthlyCost = totalCost / 12;

  const irrigationBefore = irrigationInput;
  const irrigationAfter = reducedIrrigation;
  const savedWater = irrigationBefore - irrigationAfter;
  const tierUsed = tiers.find(t => total <= t.upTo) || tiers[tiers.length - 1];
  const savedCHF = savedWater * tierUsed.unitPrice;

  const totalInitial = irrigationBefore + building;
  const totalInitialCost = totalCost + savedCHF;
  const savingsPct = (100 * savedCHF / totalInitialCost);

  // Construction du bloc de sortie HTML avec la nouvelle structure numérotée
  const outputHTML = `
    <h2>Résultats détaillés</h2>
    
    <h3 style="color: #0288d1;">A. État Actuel</h3>
    <div class="results-list">
      <div class="result-item">
        <span class="item-number">1.</span>
        <span class="item-text">Consommation d'eau en <u>espaces</u> verts :</span>
        <span class="item-value">${formatSwiss(irrigationBefore)} m³/an</span>
      </div>
      <div class="result-item">
        <span class="item-number">2.</span>
        <span class="item-text">Consommation d'eau en <u>bâtiments</u> :</span>
        <span class="item-value">${formatSwiss(building)} m³/an</span>
      </div>
      <div class="result-item highlight-red">
        <span class="item-number">3.</span>
        <span class="item-text"><strong>Consommation totale</strong> :</span>
        <span class="item-value"><strong>${formatSwiss(totalInitial)} m³/an</strong></span>
      </div>
      <div class="result-item highlight-red">
        <span class="item-number">4.</span>
        <span class="item-text"><strong>Cout total</strong> :</span>
        <span class="item-value"><strong>${formatSwiss(totalInitialCost)} CHF</strong></span>
      </div>
      <div class="result-item">
        <span class="item-number">5.</span>
        <span class="item-text">Consommation <u>mensuelle</u> <u>moyenne</u> :</span>
        <span class="item-value">${formatSwiss(totalInitial / 12)} m³/mois</span>
      </div>
      <div class="result-item">
        <span class="item-number">6.</span>
        <span class="item-text">Coût mensuel :</span>
        <span class="item-value">${formatSwiss(totalInitialCost / 12)} CHF</span>
      </div>
    </div>

    <h3 style="color: #0288d1;">B. État Futur (avec Smart Water)</h3>
    <div class="results-list">
      <div class="result-item">
        <span class="item-number">1.</span>
        <span class="item-text">Économies d'eau <u>avec</u> Smart Water :</span>
        <span class="item-value">${formatSwiss(Math.abs(reduction))} %</span>
      </div>
      <div class="result-item">
        <span class="item-number">2.</span>
        <span class="item-text">Consommation d'eau en <u>espaces</u> verts :</span>
        <span class="item-value">${formatSwiss(irrigationAfter)} m³/an</span>
      </div>
      <div class="result-item">
        <span class="item-number">3.</span>
        <span class="item-text">Cantité d'eau <u>économisée</u> :</span>
        <span class="item-value">${formatSwiss(savedWater)} m³/an</span>
      </div>
      <div class="result-item highlight-green">
        <span class="item-number">4.</span>
        <span class="item-text"><strong>Consommation Totale</strong> :</span>
        <span class="item-value"><strong>${formatSwiss(total)} m³/an</strong></span>
      </div>
      <div class="result-item highlight-green">
        <span class="item-number">5.</span>
        <span class="item-text"><strong>Cout total</strong> :</span>
        <span class="item-value"><strong>${formatSwiss(totalCost)} CHF</strong></span>
      </div>
      <div class="result-item">
        <span class="item-number">6.</span>
        <span class="item-text">Consommation <u>mensuelle</u> <u>moyenne</u> :</span>
        <span class="item-value">${formatSwiss(total / 12)} m³/mois</span>
      </div>
      <div class="result-item">
        <span class="item-number">7.</span>
        <span class="item-text">Coût mensuel :</span>
        <span class="item-value">${formatSwiss(monthlyCost)} CHF</span>
      </div>
    </div>

    <h3 style="color: #0288d1;">C. Économies Réalisées</h3>
    <div class="results-list">
      <div class="result-item highlight-green">
        <span class="item-number">1.</span>
        <span class="item-text"><strong>Économies totale</strong> :</span>
        <span class="item-value"><strong>${formatSwiss(savedCHF)} CHF</strong></span>
      </div>
      <div class="result-item">
        <span class="item-number">2.</span>
        <span class="item-text">Économie totale en % :</span>
        <span class="item-value">${formatSwiss(savingsPct)} %</span>
      </div>
    </div>

    <div class="calculation-base">
      <h4>Base de Calcul :</h4>
      
      <p>
      Abonnement annuel fixe : CHF ${formatSwiss(fixed)}<br>
      Tranche tarifaire appliquée : ${tierUsed.upTo === Infinity ? ">" + formatSwiss(tiers[tiers.length-2].upTo) : "≤" + formatSwiss(tierUsed.upTo)} m³<br>
      Prix unitaire : CHF ${formatSwiss(tierUsed.unitPrice)}/m³<br>
      Détails du calcul : ${explanation.join(', ')}
      </p>
      
      <p>
      <strong>Détails du coût :</strong><br>
      Coût variable (eau utilisée) : CHF ${formatSwiss(cost)}<br>
      Abonnement annuel fixe : CHF ${formatSwiss(fixed)}
      </p>
      
      <p>
      <strong>Sources :</strong><br>
      <span class="source-link"><a href="https://ww2.sig-ge.ch/particuliers/offres/tarifs-reglements" target="_blank">SIG Genève</a></span> - Données tarifaires 2025<br>
      <span class="source-link"><a href="https://ge.ch/grandconseil/data/texte/M02860A.pdf" target="_blank">Canton de Genève</a></span> - En 2022, hydratons notre agriculture ! 
      </p>
      
      <p>
      <strong>Remarques :</strong><br>
      Ce calcul suppose un profil "particulier". Pour les entreprises ou collectivités, les tarifs peuvent varier.<br>
      La première tranche (0–100 m³) est incluse dans l'abonnement fixe sans surcoût.<br>
      Les réductions simulées sont indicatives et doivent être validées par des données réelles de capteurs.<br>
      TVA non incluse.<br>
      Prix/m³ inclut : eau potable, traitement eaux usées, réseau secondaire, redevance fédérale.
      </p>
    </div>
  `;

  document.getElementById('output').innerHTML = outputHTML;
}

// Function to auto-load values from garden and building calculators
function autoLoadValues() {
  // Check if garden total is available
  if (window.gardenTotalNeed && document.getElementById('irrigation')) {
    document.getElementById('irrigation').value = window.gardenTotalNeed;
    document.getElementById('irrigation').classList.add('auto-populated');
    setTimeout(() => {
      document.getElementById('irrigation').classList.remove('auto-populated');
    }, 2000);
  }
  
  // Check if building total is available
  if (window.buildingTotalConsumption && document.getElementById('building')) {
    document.getElementById('building').value = window.buildingTotalConsumption;
    document.getElementById('building').classList.add('auto-populated');
    setTimeout(() => {
      document.getElementById('building').classList.remove('auto-populated');
    }, 2000);
  }
}

// Set up event listeners when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  // Auto-load values when the page loads
  autoLoadValues();
  
  // Add event listeners for calculate button
  const calculateButton = document.querySelector('#cost-section button');
  if (calculateButton) {
    calculateButton.addEventListener('click', calculateCost);
  }
});