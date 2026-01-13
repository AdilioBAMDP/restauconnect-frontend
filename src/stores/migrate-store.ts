/**
 * SCRIPT DE MIGRATION AUTOMATIQUE DU STORE
 * Refactorise les modules CM et Professionals en une seule opération
 */

import * as fs from 'fs';
import * as path from 'path';

const STORE_PATH = path.join(__dirname, 'businessStore.ts');
const BACKUP_PATH = path.join(__dirname, 'businessStore.backup-before-refactor.ts');

console.log('🚀 DÉBUT DE LA REFACTORISATION AUTOMATIQUE\n');

// 1. Créer un backup
console.log('1️⃣  Création du backup...');
fs.copyFileSync(STORE_PATH, BACKUP_PATH);
console.log('✅ Backup créé: businessStore.backup-before-refactor.ts\n');

// 2. Lire le fichier
console.log('2️⃣  Lecture du fichier...');
let content = fs.readFileSync(STORE_PATH, 'utf-8');
const originalLines = content.split('\n').length;
console.log(`📄 Fichier original: ${originalLines} lignes\n`);

// 3. Ajouter les imports après les imports existants
console.log('3️⃣  Ajout des imports...');
const importToAdd = `
// Imports des modules refactorisés
import { initialCMServices, initialCMCampaigns, initialCMClients, initialCMStats } from './state/communityManager.state';
import { createCommunityManagerActions } from './actions/communityManager.actions';
import { initialProfessionals, initialPartners } from './state/professionals.state';`;

content = content.replace(
  "import toast from 'react-hot-toast';",
  `import toast from 'react-hot-toast';${importToAdd}`
);
console.log('✅ Imports ajoutés\n');

// 4. Remplacer professionals (trouver le début et la fin)
console.log('4️⃣  Remplacement du bloc professionals...');
const professionalsStart = content.indexOf('professionals: [');
if (professionalsStart === -1) {
  console.error('❌ Impossible de trouver "professionals: ["');
  process.exit(1);
}

// Trouver la fin du tableau professionals (chercher "],\n\n      // Partenaires" ou "],\n\n      partners:")
let professionalsEnd = -1;
let searchPos = professionalsStart;
let bracketCount = 0;
let foundFirstBracket = false;

for (let i = searchPos; i < content.length; i++) {
  if (content[i] === '[' && !foundFirstBracket) {
    foundFirstBracket = true;
    bracketCount = 1;
    continue;
  }
  
  if (foundFirstBracket) {
    if (content[i] === '[') bracketCount++;
    if (content[i] === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        professionalsEnd = i + 1;
        break;
      }
    }
  }
}

if (professionalsEnd === -1) {
  console.error('❌ Impossible de trouver la fin du tableau professionals');
  process.exit(1);
}

const professionalsBlock = content.substring(professionalsStart, professionalsEnd);
const professionalsLines = professionalsBlock.split('\n').length;
console.log(`📏 Bloc professionals trouvé: ${professionalsLines} lignes`);

const newProfessionalsBlock = `professionals: initialProfessionals`;
content = content.substring(0, professionalsStart) + newProfessionalsBlock + content.substring(professionalsEnd);
console.log(`✅ Professionals remplacé: ${professionalsLines} → 1 ligne\n`);

// 5. Remplacer partners
console.log('5️⃣  Remplacement du bloc partners...');
const partnersStart = content.indexOf('partners: [');
if (partnersStart === -1) {
  console.error('❌ Impossible de trouver "partners: ["');
  process.exit(1);
}

// Trouver la fin du tableau partners
searchPos = partnersStart;
bracketCount = 0;
foundFirstBracket = false;
let partnersEnd = -1;

for (let i = searchPos; i < content.length; i++) {
  if (content[i] === '[' && !foundFirstBracket) {
    foundFirstBracket = true;
    bracketCount = 1;
    continue;
  }
  
  if (foundFirstBracket) {
    if (content[i] === '[') bracketCount++;
    if (content[i] === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        partnersEnd = i + 1;
        break;
      }
    }
  }
}

if (partnersEnd === -1) {
  console.error('❌ Impossible de trouver la fin du tableau partners');
  process.exit(1);
}

const partnersBlock = content.substring(partnersStart, partnersEnd);
const partnersLines = partnersBlock.split('\n').length;
console.log(`📏 Bloc partners trouvé: ${partnersLines} lignes`);

const newPartnersBlock = `partners: initialPartners`;
content = content.substring(0, partnersStart) + newPartnersBlock + content.substring(partnersEnd);
console.log(`✅ Partners remplacé: ${partnersLines} → 1 ligne\n`);

// 6. Remplacer CM data (cmServices, cmCampaigns, cmClients, cmStats)
console.log('6️⃣  Remplacement des données Community Manager...');

// cmServices
let cmStart = content.indexOf('cmServices: [');
if (cmStart !== -1) {
  searchPos = cmStart;
  bracketCount = 0;
  foundFirstBracket = false;
  let cmEnd = -1;

  for (let i = searchPos; i < content.length; i++) {
    if (content[i] === '[' && !foundFirstBracket) {
      foundFirstBracket = true;
      bracketCount = 1;
      continue;
    }
    
    if (foundFirstBracket) {
      if (content[i] === '[') bracketCount++;
      if (content[i] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          cmEnd = i + 1;
          break;
        }
      }
    }
  }

  if (cmEnd !== -1) {
    const cmServicesLines = content.substring(cmStart, cmEnd).split('\n').length;
    content = content.substring(0, cmStart) + 'cmServices: initialCMServices' + content.substring(cmEnd);
    console.log(`✅ cmServices: ${cmServicesLines} → 1 ligne`);
  }
}

// cmCampaigns
cmStart = content.indexOf('cmCampaigns: [');
if (cmStart !== -1) {
  searchPos = cmStart;
  bracketCount = 0;
  foundFirstBracket = false;
  let cmEnd = -1;

  for (let i = searchPos; i < content.length; i++) {
    if (content[i] === '[' && !foundFirstBracket) {
      foundFirstBracket = true;
      bracketCount = 1;
      continue;
    }
    
    if (foundFirstBracket) {
      if (content[i] === '[') bracketCount++;
      if (content[i] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          cmEnd = i + 1;
          break;
        }
      }
    }
  }

  if (cmEnd !== -1) {
    const cmCampaignsLines = content.substring(cmStart, cmEnd).split('\n').length;
    content = content.substring(0, cmStart) + 'cmCampaigns: initialCMCampaigns' + content.substring(cmEnd);
    console.log(`✅ cmCampaigns: ${cmCampaignsLines} → 1 ligne`);
  }
}

// cmClients
cmStart = content.indexOf('cmClients: [');
if (cmStart !== -1) {
  searchPos = cmStart;
  bracketCount = 0;
  foundFirstBracket = false;
  let cmEnd = -1;

  for (let i = searchPos; i < content.length; i++) {
    if (content[i] === '[' && !foundFirstBracket) {
      foundFirstBracket = true;
      bracketCount = 1;
      continue;
    }
    
    if (foundFirstBracket) {
      if (content[i] === '[') bracketCount++;
      if (content[i] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          cmEnd = i + 1;
          break;
        }
      }
    }
  }

  if (cmEnd !== -1) {
    const cmClientsLines = content.substring(cmStart, cmEnd).split('\n').length;
    content = content.substring(0, cmStart) + 'cmClients: initialCMClients' + content.substring(cmEnd);
    console.log(`✅ cmClients: ${cmClientsLines} → 1 ligne`);
  }
}

// cmStats
cmStart = content.indexOf('cmStats: {');
if (cmStart !== -1) {
  // Trouver la fin de l'objet cmStats
  let braceCount = 0;
  let foundFirstBrace = false;
  let cmEnd = -1;

  for (let i = cmStart; i < content.length; i++) {
    if (content[i] === '{') {
      if (!foundFirstBrace) foundFirstBrace = true;
      braceCount++;
    }
    if (content[i] === '}') {
      braceCount--;
      if (foundFirstBrace && braceCount === 0) {
        cmEnd = i + 1;
        break;
      }
    }
  }

  if (cmEnd !== -1) {
    const cmStatsLines = content.substring(cmStart, cmEnd).split('\n').length;
    content = content.substring(0, cmStart) + 'cmStats: initialCMStats' + content.substring(cmEnd);
    console.log(`✅ cmStats: ${cmStatsLines} → 1 ligne`);
  }
}

console.log();

// 7. Remplacer les actions CM
console.log('7️⃣  Remplacement des actions Community Manager...');
const cmActionsStart = content.indexOf('// Actions Community Manager');
if (cmActionsStart !== -1) {
  // Trouver la fin des actions CM (avant "// Actions Candidat" ou similar)
  const nextSectionStart = content.indexOf('// Actions Candidat', cmActionsStart);
  if (nextSectionStart !== -1) {
    const cmActionsBlock = content.substring(cmActionsStart, nextSectionStart);
    const cmActionsLines = cmActionsBlock.split('\n').length;
    
    const newCMActions = `// ═══════════════════════════════════════════════════════════════
      // COMMUNITY MANAGER - ACTIONS REFACTORISÉES ✅
      // Actions chargées depuis: ./actions/communityManager.actions.ts
      // ═══════════════════════════════════════════════════════════════
      ...createCommunityManagerActions(set, get),

      `;
    
    content = content.substring(0, cmActionsStart) + newCMActions + content.substring(nextSectionStart);
    console.log(`✅ Actions CM remplacées: ${cmActionsLines} → 6 lignes\n`);
  }
}

// 8. Sauvegarder
console.log('8️⃣  Sauvegarde du fichier refactorisé...');
fs.writeFileSync(STORE_PATH, content, 'utf-8');
const newLines = content.split('\n').length;
console.log(`✅ Fichier sauvegardé: ${newLines} lignes\n`);

// 9. Résumé
console.log('📊 RÉSUMÉ DE LA REFACTORISATION');
console.log('════════════════════════════════');
console.log(`Avant:  ${originalLines} lignes`);
console.log(`Après:  ${newLines} lignes`);
console.log(`Gain:   ${originalLines - newLines} lignes (-${((originalLines - newLines) / originalLines * 100).toFixed(1)}%)`);
console.log('\n✅ REFACTORISATION TERMINÉE AVEC SUCCÈS!');
console.log(`\n💾 Backup disponible: businessStore.backup-before-refactor.ts`);
