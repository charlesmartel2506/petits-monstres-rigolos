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
      'body{padding-bottom:56px!important}';
    document.head.appendChild(st);

    var bar = document.createElement('div');
    bar.className = 'vd-barre';
    bar.innerHTML =
      '<span>Démo privée préparée pour <b>' + echapper(ENTREPRISE) +
      '</b> par <b>Vaelor Design</b></span>' +
      '<a href="tel:' + TEL_BRUT + '">' + TEL + '</a>' +
      '<a href="mailto:' + COURRIEL + '?subject=' +
      encodeURIComponent('Ma démo — ' + ENTREPRISE) + '">J\'aime ça, on en parle</a>';
    document.body.appendChild(bar);
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
