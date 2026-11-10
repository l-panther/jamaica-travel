
let map;

document.addEventListener("DOMContentLoaded", () => {

  const list = document.getElementById("parishList");
  const mapElement = document.getElementById("map");

  if (!list || !mapElement || typeof L === "undefined") return;

  // Initialise Jamaica map
  map = L.map("map", {
    scrollWheelZoom: false
  }).setView([18.1096, -77.2975], 9);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(map);

  class Parish {

   
constructor(id, name, subtitle, image, description1, description2, location) {
  this.id = id;
  this.name = name;
  this.subtitle = subtitle;
  this.image = image;
  this.description1 = description1;
  this.description2 = description2;
  this.location = location;
  this.leafletMarker = null;
}

card() {
  return `
    <article class="parish-card" data-parish="${this.id}">

      <div class="body">
        <h3>${this.name}</h3>

        <p class="parish-location">
          <span aria-hidden="true">⌖</span>
          ${this.subtitle}
        </p>

        <div class="parish-description">
          <p>${this.description1}</p>
          <p>${this.description2}</p>
        </div>
      </div>

      <div class="art">
        <img
          src="assets/images/${this.image}.webp"
          alt="Scenery representing ${this.name}, Jamaica"
          loading="lazy"
        >
      </div>

      <button
        type="button"
        class="parish-map-btn"
        data-parish="${this.id}"
      >
        <span>View on map</span>
        <span aria-hidden="true">↗</span>
      </button>

    </article>
  `;
}


    marker(map) {
      this.leafletMarker = L.marker(
        [this.location.lat, this.location.lng],
        { riseOnHover: true }
      )
        .addTo(map)
        .bindPopup(`<strong>${this.name}</strong>`);
    }
  }

  const parishes = [
  new Parish(
    1,
    "Westmoreland",
    "Western Jamaica · Savanna-la-Mar",
    "westmoreland",
    "Westmoreland is located in western Jamaica, in the county of Cornwall. Its capital is Savanna-la-Mar, and the parish is known for its beautiful coastline, agricultural communities and relaxed atmosphere.",
    "The parish is home to Negril, famous for its Seven Mile Beach, limestone cliffs and spectacular sunsets. Westmoreland also has a rich cultural heritage and a strong connection to Jamaica's tourism and agricultural industries.",
    { lat: 18.2700, lng: -78.1500 }
  ),

  new Parish(
    2,
    "Saint Mary",
    "Northeastern Jamaica · Port Maria",
    "st-mary",
    "Saint Mary is a parish located in the northeast section of Jamaica. With a population of 114,227 it is one of Jamaica's smaller parishes, located in the county of Middlesex.",
    "Its chief town and capital is Port Maria, located on the coast. The parish is known for its lush landscapes, rivers, beaches and connections to Jamaican music and culture.",
    { lat: 18.375110, lng: -76.893270 }
  ),

  new Parish(
    3,
    "Saint Catherine",
    "Southeastern Jamaica · Spanish Town",
    "st-catherine",
    "Saint Catherine is one of Jamaica's most populous parishes, located in the southeastern part of the island. Its capital, Spanish Town, served as Jamaica's capital before Kingston.",
    "The parish includes Portmore, Hellshire Beach and the Rio Cobre. It combines historic landmarks, expanding urban communities, agricultural areas and important commercial centres.",
    { lat: 18.0400, lng: -77.0200 }
  ),

  new Parish(
    4,
    "Saint Ann",
    "Northern Jamaica · Saint Ann's Bay",
    "st-ann",
    "Saint Ann is Jamaica's largest parish by area, situated on the northern coast in the county of Middlesex. It is known for its beautiful beaches, green hills and popular tourist attractions.",
    "The parish includes Ocho Rios and attractions such as Dunn's River Falls. Saint Ann is also the birthplace of reggae legend Bob Marley and an important part of Jamaica's cultural heritage.",
    { lat: 18.434610, lng: -77.200050 }
  )
];


  // Render cards
  list.innerHTML = parishes.map(parish => parish.card()).join("");

  // Add map markers
  parishes.forEach(parish => parish.marker(map));

  // Fit map to the four locations
  const bounds = L.latLngBounds(
    parishes.map(parish => [
      parish.location.lat,
      parish.location.lng
    ])
  );

  map.fitBounds(bounds, {
    padding: [40, 40],
    maxZoom: 9
  });

  // Connect cards to map markers
  document.querySelectorAll(".parish-card").forEach(card => {

    const id = Number(card.dataset.parish);
    const parish = parishes.find(p => p.id === id);

    if (!parish) return;

    card.addEventListener("mouseenter", () => {
      parish.leafletMarker.openPopup();
    });

    card.addEventListener("mouseleave", () => {
      parish.leafletMarker.closePopup();
    });

    const mapButton = card.querySelector(".parish-card__map");

    mapButton.addEventListener("click", () => {

      map.setView(
        [parish.location.lat, parish.location.lng],
        11,
        { animate: true }
      );

      parish.leafletMarker.openPopup();

      mapElement.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    });

  });

});
