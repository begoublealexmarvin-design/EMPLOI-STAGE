// script.js - logique du prototype (stockage local via localStorage)

const STORAGE_CANDIDATURES = 'candidatures';
const STORAGE_PROFILE = 'profile';

// récupère candidatures depuis localStorage
let candidatures = JSON.parse(localStorage.getItem(STORAGE_CANDIDATURES)) || [];

// POSTULER : ajoute une candidature si pas déjà existante
function postuler(offre) {
  if (!offre) return;
  if (!candidatures.includes(offre)) {
    candidatures.push(offre);
    localStorage.setItem(STORAGE_CANDIDATURES, JSON.stringify(candidatures));
    afficherNotification("Candidature envoyée : " + offre);
    chargerCandidatures();
  } else {
    afficherNotification("Vous avez déjà postulé à : " + offre);
  }
}

// Charger candidatures dans la page profil (si élément présent)
function chargerCandidatures() {
  const liste = document.getElementById('liste-candidatures');
  const empty = document.getElementById('empty-calls');
  if (!liste) return;
  liste.innerHTML = '';
  if (!candidatures || candidatures.length === 0) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  candidatures.forEach(offre => {
    const div = document.createElement('div');
    div.className = 'candidature';
    div.innerHTML = `<strong>${offre}</strong><br><small>Status : En attente</small>`;
    liste.appendChild(div);
  });
}

// Notifications visuelles temporaires
function afficherNotification(message, duration = 3000) {
  const root = document.getElementById('notification-root') || document.body;
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.innerText = message;
  root.appendChild(notif);
  setTimeout(() => {
    notif.classList.add('hide');
    try { notif.remove(); } catch(e){ }
  }, duration);
}

// FILTRAGE des offres (utilisé sur offres.html)
function filtrerOffres() {
  const mot = (document.getElementById('filtre-mot')?.value || '').toLowerCase().trim();
  const secteur = (document.getElementById('filtre-secteur')?.value || '').toLowerCase();
  const ville = (document.getElementById('filtre-localisation')?.value || '').toLowerCase().trim();
  const type = (document.getElementById('filtre-type')?.value || '').toLowerCase();

  const offres = document.querySelectorAll('.offer');
  offres.forEach(offre => {
    const offreSecteur = (offre.dataset.secteur || '').toLowerCase();
    const offreVille = (offre.dataset.ville || '').toLowerCase();
    const offreType = (offre.dataset.type || '').toLowerCase();
    const keywords = (offre.dataset.keywords || '').toLowerCase();

    const matchSecteur = !secteur || secteur === offreSecteur;
    const matchVille = !ville || offreVille.includes(ville);
    const matchType = !type || type === offreType;
    const matchMot = !mot || keywords.includes(mot) || offre.innerText.toLowerCase().includes(mot);

    if (matchSecteur && matchVille && matchType && matchMot) {
      offre.style.display = 'block';
    } else {
      offre.style.display = 'none';
    }
  });
}

// Profil: sauvegarde et chargement local
function saveProfile() {
  const nom = document.getElementById('profile-nom')?.value || '';
  const email = document.getElementById('profile-email')?.value || '';
  const phone = document.getElementById('profile-phone')?.value || '';
  const cv = document.getElementById('profile-cv')?.value || '';

  const profile = { nom, email, phone, cv, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
  afficherNotification("Profil enregistré localement.");
}

function loadProfile() {
  const raw = localStorage.getItem(STORAGE_PROFILE);
  if (!raw) {
    // si pas de profil, nettoyer champs s'ils existent
    if (document.getElementById('profile-nom')) {
      document.getElementById('profile-nom').value = '';
      document.getElementById('profile-email').value = '';
      document.getElementById('profile-phone').value = '';
      document.getElementById('profile-cv').value = '';
    }
    return;
  }
  try {
    const profile = JSON.parse(raw);
    if (document.getElementById('profile-nom')) {
      document.getElementById('profile-nom').value = profile.nom || '';
      document.getElementById('profile-email').value = profile.email || '';
      document.getElementById('profile-phone').value = profile.phone || '';
      document.getElementById('profile-cv').value = profile.cv || '';
    }
  } catch (e) {
    console.error("Erreur lecture profile:", e);
  }
}

// Expose functions globalement pour appels inline (postuler)
window.postuler = postuler;
window.filtrerOffres = filtrerOffres;
window.chargerCandidatures = chargerCandidatures;
window.saveProfile = saveProfile;
window.loadProfile = loadProfile;
window.afficherNotification = afficherNotification;
