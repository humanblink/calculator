## 🌟 Aperçu

EcoAqua est une application web complète qui permet de calculer et d'estimer la consommation d'eau pour différents usages dans la région genevoise. L'outil intègre trois modules principaux pour une analyse complète de l'empreinte hydrique, avec fonctionnalités avancées de rapport PDF et retour utilisateur.
'''Documentation v.1.0.9'''

### 🎯 Contexte du Projet

EcoAqua s'inscrit dans une démarche de développement durable et de gestion responsable des ressources hydriques dans la région genevoise.
Face aux enjeux croissants de la préservation de l'eau et de l'optimisation de sa consommation, cet outil répond aux besoins concrets des particuliers, entreprises et collectivités.

**Objectifs principaux :**
- **Sensibilisation** à la consommation d'eau réelle des espaces verts et bâtiments
- **Optimisation** des systèmes d'arrosage et de gestion hydrique
- **Économies** substantielles sur les factures d'eau SIG
- **Aide à la décision** pour projets d'aménagement et rénovation
- **Conformité** aux standards environnementaux suisses et genevois

**Public cible :**
- Propriétaires de jardins et espaces verts
- Gestionnaires d'immeubles et facilities managers
- Bureaux d'études en environnement et développement durable
- Collectivités publiques et administrations
- Entreprises engagées dans une démarche RSE

**Valeur ajoutée :**
- Calculs basés sur **données officielles suisses** (MétéoSuisse, SSIGE, OCSTAT)
- **Spécificités genevoises** : jours ouvrables, climat local, tarification SIG
- **Méthodologies transparentes** avec sources scientifiques référencées
- **Rapports professionnels** pour présentation et suivi de projets

## 📊 Modules

### 🌿 Arrosage des Espaces Verts
- Calcul des besoins en irrigation basé sur l'évapotranspiration (ET₀)
- Prise en compte du type de plante, sol, exposition et méthode d'arrosage
- Ajustements saisonniers et option capteurs de sols
- Données climatiques spécifiques à Genève
- Sélection interactive des mois d'arrosage

### 🏢 Consommation Eau des Bâtiments
- Estimation pour différents types d'usage (ménages, écoles, bureaux, clubs sportifs, municipaux)
- **Calculs précis par type :** Sport Clubs (104 visites/an), Écoles (252 jours ouvrables Genève)
- **Sliders interactifs :** Ajustement de consommation (-100% à +100%) et taux d'occupation (-50% à +50%)
- Profils de consommation saisonniers spécifiques à Genève
- Calculs per capita détaillés avec méthodologie transparente

### 💰 Estimation du Coût (SIG)
- Tarification SIG 2025 avec tranches progressives
- Calcul d'économies potentielles avec arrosage intelligent
- Comparaison avant/après optimisation
- Coûts mensuels et annuels détaillés
- Auto-population des résultats entre modules

### 📄 Rapport PDF Professionnel
- **Génération PDF** avec branding HUMANBLINK complet
- **Print-to-PDF** natif sans dépendances externes
- Inclut tous les résultats de calcul et méthodologies
- Contact direct HUMANBLINK pour suivi
- Avertissements professionnels et disclaimers

### 💬 Retour Utilisateur
- Section commentaires intégrée
- Lien vers page de feedback HUMANBLINK
- Amélioration continue basée sur retours utilisateurs

## 🚀 Fonctionnalités

- **Interface responsive** - Optimisée pour desktop et mobile
- **Calculs en temps réel** - Résultats instantanés avec sliders interactifs
- **Données officielles** - Basé sur des sources genevoises, suisses et européennes. (SSIGE, OCSTAT, MétéoSuisse, FAO)
- **Footnotes interactives** - Documentation détaillée des méthodologies (collapsibles)
- **Auto-population** - Transfert automatique des résultats entre modules
- **Analytics** - Suivi d'usage avec Plausible
- **PDF Download** - Rapport professionnel
- **Validation intelligente** - Contrôles de cohérence et messages d'aide

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **Styling**: CSS custom properties, responsive design, print media queries
- **Analytics**: Plausible.io
- **Performance**: Optimisé pour vitesse et accessibilité
- **Print**: Native browser PDF generation (zero dependencies)

## 📁 Structure du Projet

```
calculator/
├── index.html              # Page principale (v1.9.17)
├── css/
│   └── style.css           # Styles principaux (v3.17.0)
├── js/
│   ├── garden.js           # Module arrosage (v2.1.7)
│   ├── building.js         # Module bâtiments (v2.6.0)
│   ├── cost.js             # Module coûts (v2.15.0)
│   ├── footnotes.js        # Footnotes interactives (v1.0.2)
│   └── download.js         # Génération PDF (v1.0.0)
├── img/
│   ├── humanblink-logo.png # Logo entreprise
│   └── smart-water-logo.svg # Logo EcoAqua
└── README.md               # Documentation (v1.0.9)
```

## 📋 Utilisation

1. **Arrosage**: Entrez la surface, type de plante, sol, méthode et sélectionnez les mois
2. **Bâtiments**: Choisissez le type d'usage, population, ajustez avec les sliders interactifs
3. **Coûts**: Les valeurs se remplissent automatiquement ou peuvent être ajustées manuellement
4. **PDF**: Téléchargez un rapport professionnel avec tous les résultats
5. **Feedback**: Partagez vos commentaires pour améliorer l'outil

## 🎯 Spécificités Techniques

### Calculs par Type de Bâtiment
- **Ménages, Bureaux, Municipaux**: 365 jours/an
- **Écoles/Universités**: 252 jours ouvrables/an (Genève, hors week-ends et jours fériés)
- **Clubs Sportifs**: 104 visites/an (2 visites/semaine × 52 semaines)

### Ajustements Avancés
- **Ajustement consommation**: -100% à +100% (équipements, efficacité)
- **Taux d'occupation**: -50% à +50% (télétravail, vacances, etc.)
- **Application universelle**: Tous les types de bâtiments

### Génération PDF
- **Print-to-PDF natif** sans librairies externes
- **Validation automatique** des données avant génération
- **Layout optimisé A4** avec branding complet
- **Contact HUMANBLINK** pour communication

## 📚 Sources de Données

- **MétéoSuisse** - Données climatiques et précipitations
- **FAO** - Coefficients culturaux et évapotranspiration  
- **SIG Genève** - Tarification eau 2025
- **SSIGE** - Statistiques consommation eau Suisse
- **OCSTAT** - Office cantonal de la statistique Genève
- **OFEV** - Directives pour l'économie d'eau

## 🔄 Versions Récentes

### v1.9.16 (2025-06-11)
- ✅ Génération PDF professionnelle avec branding HUMANBLINK
- ✅ Contact direct (tél: 076 295 68 36, email: gavardo.rettaroli@humanblink.ch)
- ✅ Avertissements professionnels et disclaimers

### v1.9.15 (2025-06-11)
- ✅ Section feedback utilisateur intégrée
- ✅ Lien vers page commentaires HUMANBLINK

### v1.9.14 (2025-06-11)
- ✅ Sliders interactifs pour ajustements (bâtiments)
- ✅ Textes explicatifs sous les inputs
- ✅ Taux d'occupation pour tous les types de bâtiments

## 🎨 Design & UX

- **Smart Water Branding** - Logo SVG avec droplets animées
- **HUMANBLINK Blue** - Couleurs consolidées pour cohérence marque
- **Sliders Interactifs** - Contrôles visuels pour ajustements
- **Responsive Design** - Optimisé mobile, tablet, desktop
- **Print Optimization** - Mise en page A4 professionnelle

## 👥 Contribution

Ce projet est développé par **HUMANBLINK Innovation**. Pour toute suggestion ou amélioration :

1. Utiliser la section commentaires intégrée dans l'application
2. Visiter https://www.humanblink.ch/eco-aqua-comentaires
3. Contact direct : gavardo.rettaroli@humanblink.ch
4. Respecter les conventions de versioning existantes

## 📞 Contact & Support

**HUMANBLINK Innovation**
- **Téléphone**: 076 295 68 36
- **Email**: gavardo.rettaroli@humanblink.ch  
- **Web**: www.humanblink.ch

## 📄 Licence

© 2025 HUMANBLINK Innovation - Tous droits réservés

**Usage**: Utilisation à des fins d'évaluation uniquement

## 🌐 Démonstration

**Live Demo**: [https://humanblink.github.io/calculator/](https://humanblink.github.io/calculator/)

## 🏷️ Tags

`water-calculator` `geneva` `irrigation` `sustainability` `web-app` `javascript` `css-grid` `responsive-design` `humanblink` `pdf-generation` `swiss-data`

---

**Développé avec 💧❤️ par HUMANBLINK Innovation**  

