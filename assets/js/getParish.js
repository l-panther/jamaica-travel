
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

    // Westmoreland
    new Parish(
      1,
      "Westmoreland",
      "westmoreland",
      "Westmoreland is located at the western end of Jamaica, in the county of Cornwall. Its capital is Savanna-la-Mar.",
      "The parish is known for Negril's beautiful beaches, dramatic limestone cliffs and spectacular Caribbean sunsets.",
      { lat: 18.2700, lng: -78.1500 }
    ),

    // Saint Mary
    new Parish(
      2,
      "Saint Mary",
      "st-mary",
      "Saint Mary is a scenic parish on Jamaica's northeastern coast, in the county of Middlesex. Its capital is Port Maria.",
      "Known for lush hills, peaceful beaches and the coastal community of Oracabessa, it offers a quieter side of Jamaica.",
      { lat: 18.375110, lng: -76.893270 }
    ),

    // Saint Catherine
    new Parish(
      3,
      "Saint Catherine",
      "st-catherine",
      "Saint Catherine is a parish in southeastern Jamaica, in the county of Middlesex. Its capital, Spanish Town, was once Jamaica's capital.",
      "The parish includes Portmore, historic Spanish Town, Hellshire Beach and the scenic Rio Cobre area.",
      { lat: 18.0400, lng: -77.0200 }
    ),

    // Saint Ann
    new Parish(
      4,
      "Saint Ann",
      "st-ann",
      "Saint Ann is Jamaica's largest parish by area, located on the northern coast in the county of Middlesex. Its capital is Saint Ann's Bay.",
      "Often called the Garden Parish, it is home to Ocho Rios, Dunn's River Falls and Nine Mile, the birthplace of Bob Marley.",
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
