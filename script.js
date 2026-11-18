/* Vanilla JS, bez zavisnosti i bez build koraka. Učitan sa `defer`.
   Sve što skripta radi je progresivno unapređenje: bez JS-a sajt ostaje čitljiv. */

(function () {
  "use strict";

  var root = document.documentElement;
  var storageKey = "sajt01-theme";

  /* localStorage ume da baci SecurityError (npr. kada se fajl otvori preko
     file://), pa svaki pristup ide kroz try/catch. */
  function readTheme() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch (error) {
      /* Nema perzistencije — tema i dalje važi za trenutnu stranicu. */
    }
  }

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var button = document.querySelector("[data-theme-toggle]");
    if (button) {
      button.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  var saved = readTheme();
  applyTheme(saved === "dark" || saved === "light" ? saved : systemTheme());

  var themeButton = document.querySelector("[data-theme-toggle]");
  if (themeButton) {
    /* Dugme je u HTML-u skriveno (`hidden`), pa ga otkrivamo tek sada —
       bez JS-a nema beskorisnog dugmeta. */
    themeButton.hidden = false;

    themeButton.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
    });
  }

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
