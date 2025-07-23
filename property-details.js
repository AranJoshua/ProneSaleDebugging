// Leaflet map for property location
window.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('propertyMap')) {
    var map = L.map('propertyMap', { scrollWheelZoom: false }).setView([41.3139, 19.4414], 14); // Durrës, Albania
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    L.marker([41.3139, 19.4414]).addTo(map)
      .bindPopup('Luxury Villa with Pool, Durrës Beachfront')
      .openPopup();
  }
}); 