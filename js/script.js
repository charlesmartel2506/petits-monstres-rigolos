/* Petits Monstres Rigolos — Vaelor Design
   IIFE : évite tout conflit avec d'autres scripts. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* Menu mobile ------------------------------------------------------ */
    var bouton = document.getElementById('bouton-menu');
    var nav = document.getElementById('nav-principale');

    if (bouton && nav) {
      bouton.addEventListener('click', function () {
        var ouvert = nav.classList.toggle('pmr-nav--ouvert');
        bouton.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
      });

      // Ferme le menu après un clic sur un lien (mobile).
      nav.querySelectorAll('a').forEach(function (lien) {
        lien.addEventListener('click', function () {
          nav.classList.remove('pmr-nav--ouvert');
          bouton.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* Année automatique au pied de page --------------------------------- */
    var anneeEl = document.getElementById('annee');
    if (anneeEl) {
      anneeEl.textContent = new Date().getFullYear();
    }

    /* Légère apparition au défilement ------------------------------------ */
    var cibles = document.querySelectorAll('.pmr-carte, .pmr-stat, .pmr-histoire__texte, .pmr-quartier__texte');
    if ('IntersectionObserver' in window && cibles.length) {
      cibles.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(14px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });

      var observateur = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.style.opacity = '1';
            entree.target.style.transform = 'translateY(0)';
            observateur.unobserve(entree.target);
          }
        });
      }, { threshold: 0.15 });

      cibles.forEach(function (el) { observateur.observe(el); });
    }

  });

})();
