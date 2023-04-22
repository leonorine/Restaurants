

 // Liste des restaurants avec leurs informations
    const restaurants = [
    {
        nom: "Le Bloempot",
        moyennePrix: "€€€€",
        adresse: "22 Rue des Bouchers, 59000 Lille",
        description: "Le Bloempot est un restaurant étoilé au Michelin qui propose une cuisine créative et raffinée, mettant en valeur les produits locaux de saison. Le décor est moderne et élégant, avec une ambiance chaleureuse et conviviale.",
        notes: []
    },
    {
        nom: "L'Auberge du Vert Mont",
        moyennePrix: "€€€€",
        adresse: "1318 Rue du Mont Noir, 59299 Boeschepe",
        description: " L'Auberge du Vert Mont est un restaurant étoilé au Michelin situé dans les collines verdoyantes à proximité de Lille. La cuisine est basée sur les produits du terroir, avec une approche contemporaine et créative. Le cadre est charmant, avec une vue panoramique sur la campagne environnante.\n",
        notes: []
    },
    // Ajouter d'autres restaurants avec leurs informations ici
    ];

 let suggestions = [];
 // Fonction pour récupérer les notes stockées dans le localStorage

 function getStoredNotes() {
     const storedNotes = localStorage.getItem("notes");
     if (storedNotes) {
         return JSON.parse(storedNotes);
     } else {
         return {};
     }
 }

 // Fonction pour enregistrer les notes dans le localStorage
 function storeNotes(notes) {
     localStorage.setItem("notes", JSON.stringify(notes));
 }

 document.addEventListener('DOMContentLoaded', function() {
     const sliders = document.querySelectorAll('.image-slider');
     sliders.forEach(slider => {
         const images = slider.getElementsByTagName('img');
         let currentImageIndex = 0;
         const autoplaySpeed = 2000; // en millisecondes
         let intervalId;

         // Fonction pour afficher l'image suivante dans le slider
         function showNextImage() {
             images[currentImageIndex].classList.remove('active');
             currentImageIndex = (currentImageIndex + 1) % images.length;
             images[currentImageIndex].classList.add('active');
         }

         // Fonction pour démarrer l'autoplay du slider
         function startAutoplay() {
             intervalId = setInterval(showNextImage, autoplaySpeed);
         }

         // Fonction pour arrêter l'autoplay du slider
         function stopAutoplay() {
             clearInterval(intervalId);
         }

         // Initialisation du slider
         function initSlider() {
             // Ajouter la classe 'active' à la première image
             images[currentImageIndex].classList.add('active');

             // Démarrer l'autoplay
             startAutoplay();
         }

         // Écouter les événements de survol et de sortie du slider
         slider.addEventListener('mouseover', stopAutoplay);
         slider.addEventListener('mouseout', startAutoplay);

         // Appeler la fonction d'initialisation du slider
         initSlider();
     });
 });

 // Fonction pour ajouter une note
 function ajouterNote() {
     const noteElement = event.target.previousElementSibling.querySelector("input[type='number']");
     const note = noteElement.value;
     const restaurantElement = noteElement.closest("li");


     // Créer un nouvel élément pour afficher la note
     const noteDisplayElement = document.createElement("span");
     noteDisplayElement.textContent = `${note} ⭐️`;
     restaurantElement.appendChild(noteDisplayElement);

     // Cacher le bouton Ajouter et l'input de note
     event.target.style.display = "none";
     noteElement.style.display = "none";

     // Enregistrer la note dans le localStorage
     const restaurantName = restaurantElement.textContent;
     const notes = getStoredNotes();
     notes[restaurantName] = note;
     storeNotes(notes);


 }

 // Charger les notes à partir du localStorage au chargement de la page
 // Charger les notes à partir du localStorage au chargement de la page
 window.addEventListener("load", function() {
     console.log('wow');
     const notes = getStoredNotes();
     const restaurantListElement = document.getElementById("restaurant-list");
     const rows = restaurantListElement.getElementsByTagName("li");
     for (let i = 1; i < rows.length; i++) {
         const row = rows[i];
         const restaurantName = row.cells[0].textContent;
         const note = notes[restaurantName];
         if (note) {
             const noteDisplayElement = document.createElement("span");
             noteDisplayElement.textContent = `${note} ⭐️`;
             row.cells[4].appendChild(noteDisplayElement);

             // Cacher le bouton Ajouter et l'input de note
             const addButton = row.querySelector("button");
             const noteInput = row.querySelector("input[type='number']");
             addButton.style.display = "none";
             noteInput.style.display = "none";


         }
     }
 });


 function afficherRestaurants() {
     const restaurantList = document.getElementById("restaurant-list");
     restaurantList.innerHTML = ""; // Effacer le contenu existant

     restaurants.forEach(function(restaurant, index) {
         const restaurantElement = document.createElement("div");

         // Afficher le nom du restaurant
         const nameElement = document.createElement("h3");
         nameElement.textContent = restaurant.nom;
         restaurantElement.appendChild(nameElement);

         // Afficher la description du restaurant
         const descriptionElement = document.createElement("p");
         descriptionElement.textContent = restaurant.description;
         restaurantElement.appendChild(descriptionElement);

         // Afficher la moyenne des prix du restaurant
         const prixElement = document.createElement("p");
         prixElement.textContent = "Moyenne des prix : " + restaurant.moyennePrix + "€";
         restaurantElement.appendChild(prixElement);

         // Créer un input pour la note
         const noteElement = document.createElement("input");
         noteElement.id = "note-" + index;
         noteElement.placeholder = "Note sur 5";
         noteElement.setAttribute("min", "0");
         noteElement.setAttribute("max", "5");
         noteElement.setAttribute("step", "1");
         restaurantElement.appendChild(noteElement);

         // Créer un bouton pour ajouter la note
         const boutonElement = document.createElement("button");
         boutonElement.textContent = "Ajouter Note";
         boutonElement.addEventListener("click", function() {
             const note = parseFloat(noteElement.value);
             if (!isNaN(note)) {
                 ajouterNote(index, note);
                 afficherRestaurants();
                 rechercherSuggestions(restaurant.notes, restaurant.description);
             }
         });
         restaurantElement.appendChild(boutonElement);

         restaurantList.appendChild(restaurantElement);
     });
 }

 function afficherSuggestions() {
     const suggestionsContainer = document.getElementById("suggestions");
     suggestionsContainer.innerHTML = "";
     for (let i = 0; i < suggestions.length; i++) {
         const suggestion = suggestions[i];
         const suggestionHTML = `
        <li>${suggestion.nom} - ${suggestion.moyennePrix} - ${suggestion.adresse} - ${suggestion.description}</li>`;
         suggestionsContainer.innerHTML += suggestionHTML;
     }
 }

 function rechercherSuggestions(notes, description) {
     suggestions = [];
     for (let i = 0; i < restaurants.length; i++) {
         const restaurant = restaurants[i];
         if (restaurant.notes.length > 0 && restaurant.description.toLowerCase().includes(description.toLowerCase())) {
             const score = similariteCosinus(notes, restaurant.notes);
             if (score >= 0.5) {
                 suggestions.push(restaurant);
             }
         }
     }
     afficherSuggestions();
 }

 function similariteCosinus(notes1, notes2) {
     let produitScalaire = 0;
     let normeNotes1 = 0;
     let normeNotes2 = 0;

     for (let i = 0; i < notes1.length; i++) {
         produitScalaire += notes1[i] * notes2[i];
         normeNotes1 += notes1[i] * notes1[i];
         normeNotes2 += notes2[i] * notes2[i];
     }

     normeNotes1 = Math.sqrt(normeNotes1);
     normeNotes2 = Math.sqrt(normeNotes2);

     if (normeNotes1 === 0 || normeNotes2 === 0) {
         if (normeNotes1 === 0 || normeNotes2 === 0) {
             return 0;
         }

         return produitScalaire / (normeNotes1 * normeNotes2);
     }

     document.addEventListener("keydown", function(event) {
         if (event.code === "ArrowUp" || event.code === "ArrowDown") {
             const input = event.target;
             const note = parseFloat(input.value);
             if (!isNaN(note)) {
                 const index = parseInt(input.id.split("-")[1]);
                 ajouterNote(index, note);
                 afficherRestaurants();
                 const notes = restaurants[index].notes;
                 const description = restaurants[index].description;
                 rechercherSuggestions(notes, description);
             }
         }
     });

     afficherRestaurants();
 }



