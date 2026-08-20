/* =========================================================================
   VAELOR DESIGN — protection des démos envoyées aux prospects
   -------------------------------------------------------------------------
   À COLLER dans chaque démo de prospect, juste avant </body> :

     <script>
       window.VAELOR_DEMO = {
         entreprise : "Boulangerie du Coin",
         expire     : "2026-09-30",     // AAAA-MM-JJ
         prenom     : "Marie"           // facultatif
       };
     </script>
     <script src="protection-demo.js"></script>

   Ce que ça fait :
     1. empêche Google d'indexer la démo (elle ne doit exister que pour eux) ;
     2. affiche une barre discrète qui rappelle que c'est ton travail ;
     3. ferme la démo à la date prévue, avec un message poli et ton numéro ;
     4. décourage la copie facile (clic droit sur les images, glisser-déposer).

   ⚠️ CE QUE ÇA NE FAIT PAS — lis bien :
   Ce script est un RALENTISSEUR, pas une serrure. Quiconque sait ouvrir les
   outils de développement du navigateur peut le contourner en 30 secondes.
   La vraie protection est ailleurs : ne jamais livrer les fichiers, garder
   l'adresse secrète, et retirer le dossier du serveur quand c'est terminé.
   Voir METHODE.md, section « Protéger ses démos ».
   ========================================================================= */
(function () {
  'use strict';

  var cfg = window.VAELOR_DEMO || {};
  var ENTREPRISE = cfg.entreprise || 'votre entreprise';
  var COURRIEL   = 'charlesmartel2506@gmail.com';
  var TEL        = '514 833-1429';
  var TEL_BRUT   = '+15148331429';
  var SITE       = 'https://vaelordesign.com/';

  /* ---------------------------------------------------------------------
     1. Ne jamais laisser Google indexer une démo de prospect.
        Sinon elle peut sortir dans les résultats de recherche au nom du
        prospect — embarrassant pour lui, et mauvais pour toi.
     --------------------------------------------------------------------- */
  var robots = document.createElement('meta');
  robots.name = 'robots';
  robots.content = 'noindex, nofollow, noarchive, nosnippet';
  document.head.appendChild(robots);

  /* ---------------------------------------------------------------------
     2. Expiration. Si la date est passée, on remplace la page.
        Rappel : ceci est une courtoisie, pas une sécurité. Pour fermer
        vraiment l'accès, supprime le dossier du serveur.
     --------------------------------------------------------------------- */
  function expiree() {
    if (!cfg.expire) { return false; }
    var fin = new Date(cfg.expire + 'T23:59:59');
    if (isNaN(fin.getTime())) { return false; }
    return new Date() > fin;
  }

  function afficherExpiration() {
    document.documentElement.innerHTML = '';
    var d = document.implementation.createHTMLDocument('');
    document.documentElement.innerHTML =
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>Cette démo a expiré — Vaelor Design</title>' +
      '<meta name="robots" content="noindex,nofollow"></head><body></body>';

    var s = document.createElement('style');
    s.textContent =
      'body{margin:0;min-height:100vh;display:grid;place-items:center;background:#07070E;' +
      'color:#F4F3FF;font-family:Inter,Segoe UI,system-ui,sans-serif;padding:24px;line-height:1.7}' +
      '.b{max-width:520px;text-align:center}' +
      '.m{width:64px;height:64px;margin:0 auto 26px}' +
      'h1{font-size:1.7rem;margin:0 0 14px;letter-spacing:-.02em}' +
      'p{color:#B7B4D4;margin:0 0 14px}' +
      '.a{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin:6px 5px 0;' +
      'padding:15px 26px;border-radius:100px;text-decoration:none;font-weight:600;' +
      'background:linear-gradient(120deg,#12D8C5,#4FA6FF,#7C5CFF);color:#080812}' +
      '.a.s{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.18);color:#F4F3FF}';
    document.head.appendChild(s);

    var box = document.createElement('div');
    box.className = 'b';
    box.innerHTML =
      '<svg class="m" viewBox="0 0 64 64" aria-hidden="true">' +
      '<defs><linearGradient id="x1" x1="6" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="#12D8C5"/><stop offset="1" stop-color="#2E8FE0"/></linearGradient>' +
      '<linearGradient id="x2" x1="58" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="#A184FF"/><stop offset="1" stop-color="#5B63EE"/></linearGradient></defs>' +
      '<path d="M5 9h16l11 26v22Z" fill="url(#x1)"/><path d="M59 9H43L32 35v22Z" fill="url(#x2)"/></svg>' +
      '<h1>Cette démo n\'est plus en ligne</h1>' +
      '<p>Le site que j\'avais préparé pour <strong>' + echapper(ENTREPRISE) +
      '</strong> a été retiré, comme prévu.</p>' +
      '<p>Il n\'est pas perdu : écrivez-moi et je le remets en ligne le jour même.</p>' +
      '<p><a class="a" href="mailto:' + COURRIEL + '?subject=' +
      encodeURIComponent('Remettre en ligne la démo — ' + ENTREPRISE) + '">M\'écrire</a>' +
      '<a class="a s" href="tel:' + TEL_BRUT + '">' + TEL + '</a></p>' +
      '<p style="margin-top:26px;font-size:.86rem;color:#7F7CA0">Charles Martel · ' +
      '<a href="' + SITE + '" style="color:#12D8C5">Vaelor Design</a></p>';
    document.body.appendChild(box);
  }

  function echapper(t) {
    var d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  if (expiree()) { afficherExpiration(); return; }

  /* ---------------------------------------------------------------------
     3. La barre du bas : elle rappelle qui a fait le site, et elle vend.
        C'est aussi ta trace : si la page circule, ton nom circule avec.
     --------------------------------------------------------------------- */
  function poserBarre() {
    if (document.querySelector('.vd-barre')) { return; }

    var st = document.createElement('style');
    st.textContent =
      '.vd-barre{position:fixed;inset:auto 0 0 0;z-index:2147483000;' +
      'background:linear-gradient(120deg,#12D8C5,#4FA6FF,#7C5CFF);color:#080812;' +
      'font-family:Inter,Segoe UI,system-ui,sans-serif;font-size:.84rem;font-weight:600;' +
      'padding:11px 18px;display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;' +
      'justify-content:center;text-align:center;box-shadow:0 -6px 24px rgba(0,0,0,.28)}' +
      '.vd-barre a{color:#080812;text-decoration:underline;text-underline-offset:3px;white-space:nowrap}' +
      '.vd-barre b{font-weight:700}' +
      '@media(max-width:620px){.vd-barre{font-size:.74rem;padding:9px 12px}}' +
      'body{padding-bottom:56px!important}' +
      /* Le panneau « on en parle ». Il remplace l'ancien lien mailto:, qui ne
         faisait RIEN sur un ordinateur sans logiciel de courriel configuré
         (constaté le 19 août 2026 — le seul appel a l'action de la barre etait mort). */
      '.vd-panneau{position:fixed;inset:0;z-index:2147483001;display:grid;place-items:center;' +
      'background:rgba(6,6,14,.74);padding:20px;font-family:Inter,Segoe UI,system-ui,sans-serif}' +
      '.vd-carte{background:#0E0E1A;color:#F4F3FF;max-width:420px;width:100%;border-radius:16px;' +
      'padding:26px 24px;box-shadow:0 30px 70px -20px rgba(0,0,0,.7);text-align:center;line-height:1.6}' +
      '.vd-carte h3{margin:0 0 8px;font-size:1.25rem;font-weight:700}' +
      '.vd-carte p{margin:0 0 18px;color:#B7B4D4;font-size:.92rem;font-weight:400}' +
      '.vd-b{display:block;margin:0 0 10px;padding:14px 18px;border-radius:100px;text-decoration:none;' +
      'font-weight:600;font-size:.95rem;background:linear-gradient(120deg,#12D8C5,#4FA6FF,#7C5CFF);color:#080812}' +
      '.vd-b.s{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);color:#F4F3FF}' +
      '.vd-adr{display:flex;gap:8px;align-items:center;justify-content:center;margin:16px 0 0;flex-wrap:wrap}' +
      '.vd-adr code{background:rgba(255,255,255,.07);padding:6px 10px;border-radius:8px;' +
      'color:#F4F3FF;font-size:.84rem;word-break:break-all}' +
      '.vd-copier{cursor:pointer;background:none;border:1px solid rgba(255,255,255,.2);color:#12D8C5;' +
      'border-radius:8px;padding:6px 10px;font:inherit;font-size:.8rem}' +
      '.vd-fermer{margin-top:18px;background:none;border:0;color:#7F7CA0;font:inherit;' +
      'font-size:.85rem;cursor:pointer;text-decoration:underline}';
    document.head.appendChild(st);

    var bar = document.createElement('div');
    bar.className = 'vd-barre';
    bar.innerHTML =
      '<span>Démo privée préparée pour <b>' + echapper(ENTREPRISE) +
      '</b> par <b>Vaelor Design</b></span>' +
      '<a href="tel:' + TEL_BRUT + '">' + TEL + '</a>' +
      '<a href="#" class="vd-parler">J\'aime ça, on en parle</a>';
    document.body.appendChild(bar);

    var lien = bar.querySelector('.vd-parler');
    if (lien) { lien.addEventListener('click', ouvrirPanneau); }
  }

  /* Le panneau de contact. Trois chemins, parce qu'aucun ne marche pour tout
     le monde : le téléphone (toujours), Gmail dans le navigateur (la majorité
     des commerçants), et le logiciel de courriel local (les téléphones). Plus
     l'adresse en clair, à copier — le dernier recours qui ne rate jamais. */
  function ouvrirPanneau(ev) {
    if (ev) { ev.preventDefault(); }
    if (document.querySelector('.vd-panneau')) { return; }

    var sujet = encodeURIComponent('Ma démo — ' + ENTREPRISE);
    var gmail = 'https://mail.google.com/mail/?view=cm&fs=1&to=' +
                encodeURIComponent(COURRIEL) + '&su=' + sujet;

    var pan = document.createElement('div');
    pan.className = 'vd-panneau';
    pan.innerHTML =
      '<div class="vd-carte" role="dialog" aria-modal="true" aria-label="Nous joindre">' +
      '<h3>Avec plaisir.</h3>' +
      '<p>Prenez le chemin le plus simple pour vous — je réponds le jour même.</p>' +
      '<a class="vd-b" href="tel:' + TEL_BRUT + '">Appeler le ' + TEL + '</a>' +
      '<a class="vd-b s" href="' + gmail + '" target="_blank" rel="noopener">Écrire depuis Gmail</a>' +
      '<a class="vd-b s" href="mailto:' + COURRIEL + '?subject=' + sujet + '">' +
      'Écrire depuis mon application courriel</a>' +
      '<div class="vd-adr"><code>' + echapper(COURRIEL) + '</code>' +
      '<button class="vd-copier" type="button">copier</button></div>' +
      '<button class="vd-fermer" type="button">Fermer</button></div>';
    document.body.appendChild(pan);

    function fermer() {
      if (pan.parentNode) { pan.parentNode.removeChild(pan); }
      document.removeEventListener('keydown', surTouche);
    }
    function surTouche(e) { if (e.key === 'Escape') { fermer(); } }

    pan.addEventListener('click', function (e) { if (e.target === pan) { fermer(); } });
    pan.querySelector('.vd-fermer').addEventListener('click', fermer);
    document.addEventListener('keydown', surTouche);

    var bouton = pan.querySelector('.vd-copier');
    bouton.addEventListener('click', function () {
      function reussi() { bouton.textContent = 'copié ✓'; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(COURRIEL).then(reussi, secours);
      } else { secours(); }
      function secours() {
        var z = document.createElement('textarea');
        z.value = COURRIEL;
        z.setAttribute('readonly', '');
        z.style.cssText = 'position:fixed;top:-1000px';
        document.body.appendChild(z);
        z.select();
        try { document.execCommand('copy'); reussi(); } catch (err) { bouton.textContent = COURRIEL; }
        document.body.removeChild(z);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', poserBarre);
  } else {
    poserBarre();
  }

  /* ---------------------------------------------------------------------
     4. Freins à la copie facile.
        Volontairement DISCRETS : bloquer le clic droit sur toute la page
        ou désactiver la sélection de texte donne une impression de site
        cassé, et c'est l'inverse de l'effet recherché. On se limite aux
        images, que quelqu'un pourrait enregistrer d'un clic.
     --------------------------------------------------------------------- */
  document.addEventListener('contextmenu', function (e) {
    if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'svg' ||
        (e.target.closest && e.target.closest('svg')))) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', function (e) {
    if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'svg')) {
      e.preventDefault();
    }
  });

  /* ---------------------------------------------------------------------
     5. Trace discrète dans le code source.
        Si quelqu'un donne le fichier à un autre développeur, ton nom et la
        date y sont. Ça n'empêche rien, mais ça établit l'antériorité.
     --------------------------------------------------------------------- */
  document.documentElement.insertBefore(
    document.createComment(
      ' Site conçu par Vaelor Design (Charles Martel, Montreal) pour ' + ENTREPRISE + '. ' +
      'Demo privee, tous droits reserves. Genere le ' + new Date().toISOString().slice(0, 10) + '. ' +
      'Reutilisation interdite sans entente ecrite. ' + COURRIEL + ' '
    ),
    document.documentElement.firstChild
  );

})();
