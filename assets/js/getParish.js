// Global variable for the Leaflet map
let map;

// Run code after the HTML document has fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // Create the map and set initial view
  // Coordinates point to Jamaica
  map = L.map("map").setView([18.1096, -77.2975], 9);

  // Add OpenStreetMap tiles to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // Parish class
  // Used to create parish objects with cards and map markers
  class Parish {

    // Constructor method
    constructor(id, name, image, description1, description2, location) {
      this.id = id;
      this.name = name;
      this.image = image;
      this.description1 = description1;
      this.description2 = description2;
      this.location = location;
    }

    // Create parish card HTML
    card() {
      return `
       <div class="parish-card">
        <div class="body">
            <h3>${this.name}</h3>
            <p>${this.description1}</p>
            <p>${this.description2}</p>
        </div>
        <div class="art">
          <!-- Parish image -->
          <img src="assets/images/${this.image}.webp" alt="Image of ${this.name} parish">
        </div>
      </div>`;
    }

    // Create marker on the map
    marker(map) {

      // Save marker reference so we can control it later
      this.leafletMarker = L.marker(
        [this.location.lat, this.location.lng],
        { riseOnHover: true }
      )

      // Add marker to map
      .addTo(map)

      // Add popup to marker
      .bindPopup(`<h4><b>${this.name}</b></h4>`);
    }
  }

  // Array containing all parish objects
  const parishes = [

    // Kingston
    new Parish(
      1,
      "Kingston",
      "kingston",
      "Kingston is the capital and largest city of Jamaica, located on the southeastern coast of the island.",
      "It faces a natural harbour protected by the Palisadoes, a long sand spit which connects the town of Port Royal and the Norman Manley International Airport to the rest of the island.",
      { lat: 18.017874, lng: -76.809906 }
    ),

    // Saint Mary
    new Parish(
      2,
      "Saint Mary",
      "st-mary",
      "Saint Mary is a parish located in the northeast section of Jamaica. With a population of 114,227 it is one of Jamaica's smallest parishes, located in the county of Middlesex.",
      "Its chief town and capital is Port Maria, located on the coast. It is also the birthplace of established dancehall reggae artists.",
      { lat: 18.375110, lng: -76.893270 }
    ),

    // Portmore
    new Parish(
      3,
      "Portmore",
      "portmore",
      "Portmore is a large coastal city in southern Jamaica in Saint Catherine, and a dormitory town for the neighbouring cities of Kingston and Spanish Town.",
      "Much of the land is reclaimed swamp. Port Henderson Hill, formerly known as Salt Pond Hill, is visible from neighbouring parishes.",
      { lat: 17.973789, lng: -76.868698 }
    ),

    // Saint Ann
    new Parish(
      4,
      "Saint Ann",
      "st-ann",
      "Saint Ann is the largest parish in Jamaica. It is situated on the north coast of the island, in the county of Middlesex.",
      "Saint Ann is the birthplace of reggae singers such as Bob Marley and many others.",
      { lat: 18.434610, lng: -77.200050 }
    )
  ];

  // Get container where cards will be displayed
  const list = document.getElementById("parishList");

  // Clear existing content
  list.innerHTML = "";

  // Loop through each parish
  parishes.forEach(p => {

    // Add parish card to page
    list.innerHTML += p.card();

    // Add marker to map
    p.marker(map);
  });

  // Add hover events to each parish card
  document.querySelectorAll(".region").forEach((card, i) => {

    // Open popup when mouse enters card
    card.addEventListener("mouseenter", () =>
      parishes[i].leafletMarker.openPopup()
    );

    // Close popup when mouse leaves card
    card.addEventListener("mouseleave", () =>
      parishes[i].leafletMarker.closePopup()
    );
  });

});