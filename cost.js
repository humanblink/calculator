// Version JS 2.0 - Auteur : HUMANBLINK Innovation - Date : 2025-05-13

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

  // Construction du bloc de sortie HTML avec les résultats
  const outputHTML = `
    <h2>Résultats détaillés</h2>
    <p><strong>Consommation espaces verts initiale :</strong> ${formatSwiss(irrigationBefore)} m³/an</p>
    <p><strong>Consommation bâtiments :</strong> ${formatSwiss(building)} m³/an</p>
    <p><strong>Consommation totale initial (espaces verts + bâtiment) :</strong> <span style="color: red;">${formatSwiss(totalInitial)} m³/an</span></p>
    <p><strong>Cout total initial :</strong> <span style="color: red;">CHF ${formatSwiss(totalInitialCost)}</span></p>

    <hr>

    <p><strong>Réduction appliquée à la consommation d'espaces verts :</strong> ${formatSwiss(Math.abs(reduction))}%</p>
    <p><strong>Consommation espaces verts après réduction :</strong> ${formatSwiss(irrigationAfter)} m³/an</p>

    <hr>

    <p><strong>Consommation totale (espaces verts + bâtiment) après réduction :</strong> ${formatSwiss(total)} m³/an</p>
    <p><strong>Consommation mensuelle moyenne :</strong> ${formatSwiss(total / 12)} m³/mois</p>

    <hr>

    <p><strong>Coût total après réduction :</strong> <span style="color: red;">CHF ${formatSwiss(totalCost)}</span></p>
    <p><strong>Coût mensuel :</strong> CHF ${formatSwiss(monthlyCost)}</p>

    <hr>

    <p><strong>Coût variable (eau utilisée) :</strong> CHF ${formatSwiss(cost)}</p>
    <p><strong>Abonnement annuel fixe :</strong> CHF ${formatSwiss(fixed)}</p>

    <hr>

    <p><strong>Économie totale (Cout total initial - Cout total après réduction) :</strong> <span style="color: green;">CHF ${formatSwiss(savedCHF)}</span></p>
    <p><strong>Économie totale en % du Cout total après réduction :</strong> ${formatSwiss(savingsPct)}%</p>

    <h3>Détails du calcul :</h3>
    <pre>${explanation.join('\n')}</pre>

    <h3>Sources et hypothèses :</h3>
    <ul>
      <li>Données SIG 2025 : https://ww2.sig-ge.ch/particuliers/offres/eau</li>
      <li>Tarifs appliqués aux particuliers (ménages).</li>
      <li>TVA non incluse.</li>
      <li>Prix/m³ inclut : eau potable, traitement eaux usées, réseau secondaire, redevance fédérale.</li>
    </ul>

    <h3>Remarques :</h3>
    <ul>
      <li>Ce calcul suppose un profil "particulier". Pour les entreprises ou collectivités, les tarifs peuvent varier.</li>
      <li>La première tranche (0–100 m³) est incluse dans l’abonnement fixe sans surcoût.</li>
      <li>Les réductions simulées sont indicatives et doivent être validées par des données réelles de capteurs.</li>
    </ul>
  `;

  document.getElementById('output').innerHTML = outputHTML;
}
