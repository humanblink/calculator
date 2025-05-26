# EcoAqua - Calculateur d'Empreinte Hydrique

Un calculateur d'empreinte hydrique avancé pour la région de Genève, développé par HUMANBLINK Innovation.

## Aperçu

EcoAqua est une application web complète qui permet de calculer et d'estimer la consommation d'eau pour différents usages dans la région genevoise. L'outil intègre trois modules principaux pour une analyse complète de l'empreinte hydrique.

## Modules

### Arrosage des Espaces Verts
- Calcul des besoins en irrigation basé sur l'évapotranspiration (ET₀)
- Prise en compte du type de plante, sol, exposition et méthode d'arrosage
- Ajustements saisonniers et option capteurs de sols
- Données climatiques spécifiques à Genève

### Consommation Eau des Bâtiments
- Estimation pour différents types d'usage (ménages, écoles, bureaux, etc.)
- Profils de consommation saisonniers
- Ajustements personnalisables
- Calculs per capita détaillés

### Estimation du Coût (SIG)
- Tarification SIG 2025 avec tranches progressives
- Calcul d'économies potentielles
- Comparaison avant/après optimisation
- Coûts mensuels et annuels

## Fonctionnalités

- Interface responsive - Optimisée pour desktop et mobile
- Calculs en temps réel - Résultats instantanés
- Données officielles - Basé sur sources suisses et genevoises
- Footnotes interactives - Documentation détaillée des méthodologies
- Auto-population - Transfert automatique des résultats entre modules
- Analytics - Suivi d'usage avec Plausible

## Technologies

- Frontend: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- Styling: CSS custom properties, responsive design
- Analytics: Plausible.io
- Performance: Optimisé pour vitesse et accessibilité

## Structure du Projet

calculator/
├── index.html              # Page principale (v1.9.1)
├── css/
│   └── style.css           # Styles principaux (v2.3.0)
├── js/
│   ├── garden.js           # Module arrosage (v2.1.6)
│   ├── building.js         # Module bâtiments (v2.3.3)
│   ├── cost.js             # Module coûts (v2.8.4)
│   └── footnotes.js        # Footnotes interactives (v1.0.2)
├── img/
│   └── humanblink-logo.png # Logo entreprise
└── README.md               # Documentation

## Installation & Usage

### Déploiement Local
# Cloner le repository
git clone https://github.com/humanblink/calculator.git

# Naviguer dans le dossier
cd calculator

# Ouvrir avec un serveur web local
python -m http.server 8000
# ou
npx serve .

### Déploiement GitHub Pages
1. Fork ou clone le repository
2. Activer GitHub Pages dans les settings
3. L'application sera accessible sur https://[username].github.io/calculator/

## Utilisation

1. Arrosage: Entrez la surface, type de plante, sol et sélectionnez les mois
2. Bâtiments: Choisissez le type d'usage et nombre de personnes
3. Coûts: Les valeurs se remplissent automatiquement ou peuvent être ajustées

## Sources de Données

- MétéoSuisse - Données climatiques et précipitations
- FAO - Coefficients culturaux et évapotranspiration
- SIG Genève - Tarification eau 2025
- SSIGE - Statistiques consommation eau Suisse
- OCSTAT - Office cantonal de la statistique Genève
- OFEV - Office fédéral de l'environnement

## Versions

### v1.9.1 (2025-05-26)
- Ajout tracking Plausible Analytics
- Standardisation couleurs boutons (bleu uniforme)
- Performance et utilisabilité maintenues

### v1.9.0 (2025-05-16)
- Header/footer dual placement design
- Label économie arrosage intelligent
- Copyright et informations légales

### Versions antérieures
Voir les commentaires de version dans chaque fichier pour l'historique complet.

## Contribution

Ce projet est développé par HUMANBLINK Innovation. Pour toute suggestion ou amélioration :

1. Créer une issue décrivant la proposition
2. Fork le projet si souhait de contribution code
3. Respecter les conventions de versioning existantes
4. Documenter les changements dans les headers de fichiers

## Licence

© 2025 HUMANBLINK Innovation - Tous droits réservés

Usage: Utilisation à des fins d'évaluation uniquement

## Démonstration

Live Demo: https://humanblink.github.io/calculator/

## Tags

water-calculator geneva irrigation sustainability web-app javascript css-grid responsive-design humanblink

---

Développé avec passion par HUMANBLINK Innovation