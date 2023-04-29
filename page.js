

 // Liste des restaurants avec leurs informations
    const restaurants = [
    {
        nom: "Le Bloempot",
        moyennePrix: "€€€€",
        adresse: "22 Rue des Bouchers, 59000 Lille",
        description: "Le Bloempot est un restaurant étoilé au Michelin qui propose une cuisine créative et raffinée, mettant en valeur les produits locaux de saison. Le décor est moderne et élégant, avec une ambiance chaleureuse et conviviale.",
        notes: ""
    },
    {
        nom: "L'Auberge du Vert Mont",
        moyennePrix: "€€€€",
        adresse: "1318 Rue du Mont Noir, 59299 Boeschepe",
        description: " L'Auberge du Vert Mont est un restaurant étoilé au Michelin situé dans les collines verdoyantes à proximité de Lille. La cuisine est basée sur les produits du terroir, avec une approche contemporaine et créative. Le cadre est charmant, avec une vue panoramique sur la campagne environnante.\n",
        notes: ""
    },
    // Ajouter d'autres restaurants avec leurs informations ici
    ];

 let suggestions = [];
 // Fonction pour récupérer les notes stockées dans le localStorage

 /*
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
  */

 // Fonction pour récupérer les notes à partir du fichier JSON
 async function getStoredNotes() {
     const response = await fetch('data.json');
     const data = await response.json();
     return data.notes || {};
 }

 // Fonction pour enregistrer les notes dans le fichier JSON
 async function storeNotes(notes) {
     const response = await fetch('data.json');
     const data = await response.json();
     data.notes = notes;
     const saveResponse = await fetch('data.json', {
         method: 'PUT',
         body: JSON.stringify(data)
     });
     return saveResponse.ok;
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
 async function ajouterNote() {
     const noteElement = event.target.previousElementSibling.querySelector("input[type='number']");
     let note = noteElement.value;
     const restaurantElement = noteElement.closest("li");


     // Créer un nouvel élément pour afficher la note
     const noteDisplayElement = document.createElement("span");
     noteDisplayElement.className = 'note';
     noteDisplayElement.textContent = `${note} ⭐️`;
     restaurantElement.appendChild(noteDisplayElement);

     // Cacher le bouton Ajouter et l'input de note
     event.target.style.display = "none";
     noteElement.style.display = "none";

     // Enregistrer la note dans data
     const restaurantName = restaurantElement.textContent;
     const notes = await getStoredNotes();
     notes[restaurantName] = note;
     await storeNotes(notes);

 }

 // Charger les notes à partir du localStorage au chargement de la page
 // Charger les notes à partir du localStorage au chargement de la page
 window.addEventListener("load", function() {
     const notes = getStoredNotes();
     const restaurants = document.querySelectorAll(".resto")
     for (let i = 0; i < restaurants.length; i++) {
         const restaurant_i = restaurants[i];
         const restaurantName = restaurant_i.querySelector(".nomResto").textContent;
         const note = notes[restaurantName];
         if (note) {
             const noteDisplayElement = document.createElement("span");
             noteDisplayElement.className = 'note';
             noteDisplayElement.textContent = `${note} ⭐️`;
             restaurant_i.querySelector(".ajoutNote").appendChild(noteDisplayElement);

             // Cacher le bouton Ajouter et l'input de note
             const addButton = restaurant_i.querySelector("button");
             const noteInput = restaurant_i.querySelector("input[type='number']");
             addButton.style.display = "none";
             noteInput.style.display = "none";


         }
     }
 });





/*
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
                 const notes = restaurants[index].notes;
                 const description = restaurants[index].description;
                 rechercherSuggestions(notes, description);
             }
         }
     });
     }

*/




