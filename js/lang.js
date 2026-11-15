/*
 * Tiny Tank — language handling for the homepage and the privacy policy.
 * index.html / privacy-policy.html are the English pages. When a visitor opens them for the first time,
 * we move them to the page in their phone/PC language (e.g. index-ko.html).
 * A language picked by hand is remembered, so it never bounces back.
 */
(function () {
  var SUPPORTED = ['en', 'ko'];
  var KEY = 'tinytank-lang';
  var root = document.documentElement;
  root.classList.add('js');
  var page = root.getAttribute('data-page'); // "index" or "privacy-policy"
  var current = root.getAttribute('lang');

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode: just skip */ }
  }
  function urlFor(lang) {
    return page + (lang === 'en' ? '' : '-' + lang) + '.html';
  }

  // Only the default (English) page redirects. Language pages never move the visitor.
  if (current === 'en' && page) {
    var wanted = read();
    if (!wanted) {
      var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
      for (var i = 0; i < list.length; i++) {
        var code = String(list[i]).slice(0, 2).toLowerCase();
        if (SUPPORTED.indexOf(code) >= 0) { wanted = code; break; }
      }
    }
    if (wanted && wanted !== 'en' && SUPPORTED.indexOf(wanted) >= 0) {
      location.replace(urlFor(wanted) + location.hash);
      return;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () { save(this.getAttribute('data-set-lang')); });
    }
  });
})();
