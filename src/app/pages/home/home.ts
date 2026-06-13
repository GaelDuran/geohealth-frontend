import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import * as L from 'leaflet';
import 'leaflet-draw';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {

  API_BASE = 'https://geohealth-backend-a2i9.onrender.com';

  map: any;
  markersLayer: any;
  drawnItems: any;

  places: any[] = [];

  searchText = '';

  placeName = '';
  placeDescription = '';

  selectedLat = 0;
  selectedLng = 0;

  editingId: string | null = null;

  ngAfterViewInit(): void {

    this.map = L.map('map').setView([20.67, -101.35], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    console.log('Leaflet Draw:', (L as any).Draw);

    const drawControl = new (L as any).Control.Draw({
      edit: { featureGroup: this.drawnItems },
      draw: {
        polygon: true,
        rectangle: true,
        polyline: false,
        circle: false,
        marker: false,
        circlemarker: false
      }
    });

    this.map.addControl(drawControl);

/* ===== ZONAS ===== */

this.map.on(
  'draw:created',
  async (e: any) => {

    const layer = e.layer;

    this.drawnItems.addLayer(layer);

    if (
      e.layerType === 'polygon' ||
      e.layerType === 'rectangle'
    ) {

      const points =
        layer.getLatLngs()[0].map(
          (p: any) => ({
            lat: p.lat,
            lng: p.lng
          })
        );

      await fetch(
        `${this.API_BASE}/api/zones`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'Zona',
            points
          })
        }
      );

      this.loadZones();
    }
  }
);

/* ===== CENTROS ===== */

this.map.on('click', (e: any) => {

  this.selectedLat = e.latlng.lat;
  this.selectedLng = e.latlng.lng;

  L.marker([
    this.selectedLat,
    this.selectedLng
  ]).addTo(this.map);

});

    this.loadPlaces();
    this.loadStats();
    this.loadZones();

    // === SOLUCIÓN MAPA INCOMPLETO ===
    // Espera 200ms a que el CSS termine de renderizar el contenedor y recalcula el tamaño del mapa
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);
  }

  // ================= LOAD =================
  async loadPlaces() {

    const res = await fetch(`${this.API_BASE}/api/places`);
    this.places = await res.json();

    this.renderMarkers();
  }

  renderMarkers() {

    this.markersLayer.clearLayers();

    this.places.forEach(p => {

      const lat = p.location.coordinates[1];
      const lng = p.location.coordinates[0];

      L.marker([lat, lng])
        .addTo(this.markersLayer)
        .bindPopup(`
          <b>${p.name}</b><br>
          ${p.description}
        `);

    });
  }

  async loadZones() {

  try {

    const res = await fetch(
      `${this.API_BASE}/api/zones`
    );

    const zones = await res.json();

    this.drawnItems.clearLayers();

    zones.forEach((zone: any) => {

      const coordinates = zone.points.map(
        (p: any) => [p.lat, p.lng]
      );

      L.polygon(
        coordinates,
        {
          color: '#2563eb',
          fillColor: '#3b82f6',
          fillOpacity: 0.3
        }
      ).addTo(this.drawnItems);

    });

    this.totalZones = zones.length;

  } catch (err) {

    console.error(
      'Error cargando zonas',
      err
    );

  }

}

  // ================= SAVE =================
  async savePlace() {

    const url = this.editingId
      ? `${this.API_BASE}/api/places/${this.editingId}`
      : `${this.API_BASE}/api/places`;

    const method = this.editingId ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.placeName,
        description: this.placeDescription,
        latitude: this.selectedLat,
        longitude: this.selectedLng
      })
    });

    this.placeName = '';
    this.placeDescription = '';
    this.editingId = null;

    this.loadPlaces();
    this.loadStats();
    this.loadZones();
  }

  // ================= DELETE =================
  async deletePlace(id: string) {

    await fetch(`${this.API_BASE}/api/places/${id}`, {
      method: 'DELETE'
    });

    this.loadPlaces();
    this.loadStats();
    this.loadZones();
  }

  // ================= EDIT =================
  editPlace(place: any) {

    this.placeName = place.name;
    this.placeDescription = place.description;

    this.selectedLat = place.location.coordinates[1];
    this.selectedLng = place.location.coordinates[0];

    this.editingId = place._id;
  }

  // ================= SEARCH =================
  searchPlaces() {

    if (!this.searchText || this.searchText.trim() === '') {
      this.loadPlaces();
      return;
    }

    const text = this.searchText.toLowerCase();

    const filtered = this.places.filter(p =>
      p.name.toLowerCase().includes(text)
    );

    this.markersLayer.clearLayers();

    filtered.forEach(p => {

      const lat = p.location.coordinates[1];
      const lng = p.location.coordinates[0];

      L.marker([lat, lng])
        .addTo(this.markersLayer)
        .bindPopup(`<b>${p.name}</b><br>${p.description}`);

    });
  }
  totalPlaces = 0;
totalDoctors = 0;
totalSpecialties = 0;
totalZones = 0;

async loadStats() {

  try {

    const [
      placesRes,
      doctorsRes,
      specialtiesRes
    ] = await Promise.all([

      fetch(`${this.API_BASE}/api/places`),

      fetch(`${this.API_BASE}/api/medicalStaff`),

      fetch(`${this.API_BASE}/api/specialties`)

    ]);

    const places =
      await placesRes.json();

    const doctors =
      await doctorsRes.json();

    const specialties =
      await specialtiesRes.json();

    this.totalPlaces =
      places.length;

    this.totalDoctors =
      doctors.length;

    this.totalSpecialties =
      specialties.length;


    /*
      Mientras no tengas CRUD de zonas
      mostramos la cantidad de lugares
    */


  } catch (err) {

    console.error(
      'Error cargando estadísticas',
      err
    );

  }

}
}
