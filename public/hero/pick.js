/* Picks the hero photo for this visit. Load it as a plain (blocking)
   script right after <img id="hero-img">, so it runs before the image is
   fetched and only the chosen photo downloads. Never repeats the previous
   visit's photo when it can avoid it. Credits: CREDITS.md next to this file. */
(function () {
  var photos = [
    ['cliffs', 1390, 'Cosmic Cliffs in the Carina Nebula: glowing orange gas under a blue, star-filled sky.', 'NASA, ESA, CSA, STScI (James Webb Space Telescope)'],
    ['city-lights', 1200, 'Earth at night, with city lights tracing the outlines of the continents.', 'Craig Mayhew and Robert Simmon, NASA GSFC; data: Marc Imhoff, NASA GSFC, and Christopher Elvidge, NOAA NGDC'],
    ['saturn', 1162, 'Saturn at equinox, its rings seen nearly edge-on against black space.', 'NASA, JPL, Space Science Institute (Cassini)'],
    ['sombrero', 1345, 'The Sombrero Galaxy in infrared: a glowing blue core inside a thin red ring of dust.', 'NASA, JPL-Caltech and the Hubble Heritage Team (STScI, AURA)'],
    ['deep-field', 1200, 'The Hubble Ultra Deep Field: thousands of faraway galaxies scattered across black sky.', 'NASA and ESA (Hubble Space Telescope)']
  ];
  var last = -1;
  try { last = Number(localStorage.getItem('hero.last')); } catch (e) {}
  var i = Math.floor(Math.random() * photos.length);
  if (i === last) i = (i + 1 + Math.floor(Math.random() * (photos.length - 1))) % photos.length;
  try { localStorage.setItem('hero.last', String(i)); } catch (e) {}
  var p = photos[i], img = document.getElementById('hero-img');
  img.height = p[1];
  img.alt = p[2];
  img.src = '/hero/' + p[0] + '.webp';
  /* the credit line may sit further down the page, not parsed yet */
  function setCredit() {
    var credit = document.getElementById('hero-credit');
    if (credit) credit.textContent = 'Image: ' + p[3] + '. Public domain.';
  }
  if (document.getElementById('hero-credit')) setCredit();
  else document.addEventListener('DOMContentLoaded', setCredit);
})();
