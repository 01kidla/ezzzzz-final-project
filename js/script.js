// ===== Helpers for form validation =====
// Every form on the site uses these small functions instead of HTML attributes like "required".

var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var phonePattern = /^\+?[0-9]{10,15}$/;

// Shows an error under the field and paints the field red.
function showError(inputId, message) {
  var input = document.getElementById(inputId);
  var errorBox = document.getElementById(inputId + "-error");
  if (errorBox) errorBox.textContent = message;
  if (input) input.classList.add("is-invalid");
}

// Removes the error from the field.
function clearError(inputId) {
  var input = document.getElementById(inputId);
  var errorBox = document.getElementById(inputId + "-error");
  if (errorBox) errorBox.textContent = "";
  if (input) input.classList.remove("is-invalid");
}

// Checks that the field is not empty.
function checkRequired(inputId, message) {
  var value = document.getElementById(inputId).value.trim();
  if (value === "") {
    showError(inputId, message);
    return false;
  }
  clearError(inputId);
  return true;
}

// Checks that the email looks like name@site.com
function checkEmail(inputId) {
  var value = document.getElementById(inputId).value.trim();
  if (value === "") {
    showError(inputId, "Please enter your email address.");
    return false;
  }
  if (!emailPattern.test(value)) {
    showError(inputId, "Email should look like name@example.com");
    return false;
  }
  clearError(inputId);
  return true;
}

// Checks the phone number. Spaces, dashes and brackets are removed first,
// then we need 10-15 digits with an optional "+" at the start.
function checkPhone(inputId) {
  var value = document.getElementById(inputId).value.trim();
  var digitsOnly = value.replace(/[\s\-()]/g, "");
  if (value === "") {
    showError(inputId, "Please enter your phone number.");
    return false;
  }
  if (!phonePattern.test(digitsOnly)) {
    showError(inputId, "Phone number should have 10-15 digits, for example +7 777 123 4567");
    return false;
  }
  clearError(inputId);
  return true;
}

// Checks password length and complexity (uppercase, lowercase and a number).
function checkPassword(inputId) {
  var value = document.getElementById(inputId).value;
  if (value === "") {
    showError(inputId, "Please enter a password.");
    return false;
  }
  if (value.length < 8) {
    showError(inputId, "Password must be at least 8 characters long.");
    return false;
  }
  if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
    showError(inputId, "Password needs an uppercase letter, a lowercase letter and a number.");
    return false;
  }
  clearError(inputId);
  return true;
}

// When the user starts typing again, the old error message disappears.
document.querySelectorAll("form[novalidate] .form-control").forEach(function (input) {
  input.addEventListener("input", function () {
    if (input.id) clearError(input.id);
  });
});


// ===== Contact form =====

var contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("form-success").textContent = "";

    var nameOk = checkRequired("name", "Please enter your full name.");
    var emailOk = checkEmail("email");
    var phoneOk = checkPhone("phone");
    var messageOk = checkRequired("message", "Please write a message.");

    if (nameOk && emailOk && phoneOk && messageOk) {
      contactForm.dispatchEvent(new Event("valid-submit"));
    }
  });
}


// ===== FAQ accordion on the Pricing page =====

var faqQuestions = document.querySelectorAll(".faq-question");

for (var i = 0; i < faqQuestions.length; i++) {
  faqQuestions[i].addEventListener("click", function () {
    var answer = this.nextElementSibling;

    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
      this.classList.remove("active");
    } else {
      answer.style.maxHeight = answer.scrollHeight + "px";
      this.classList.add("active");
    }
  });
}


// ===== Subscribe popup on the Home page =====

var popup = document.getElementById("popup");
var subscribeBtn = document.getElementById("subscribe-btn");
var popupClose = document.getElementById("popup-close");
var subscribeForm = document.getElementById("subscribe-form");

if (popup) {
  subscribeBtn.addEventListener("click", function () {
    popup.classList.add("show");
  });

  popupClose.addEventListener("click", function () {
    popup.classList.remove("show");
  });

  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      popup.classList.remove("show");
    }
  });

  subscribeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!checkEmail("subscribe-email")) return;

    subscribeForm.reset();
    popup.classList.remove("show");
    subscribeForm.dispatchEvent(new Event("valid-submit"));
  });
}


// ===== Light / dark mode =====
// The choice is saved in localStorage, so every page opens with the same theme.

var colorBtn = document.getElementById("color-btn");

function updateButtonText() {
  var icon = colorBtn.querySelector(".theme-icon");
  var text = colorBtn.querySelector(".theme-text");

  if (document.body.classList.contains("dark-mode")) {
    text.textContent = "Light Mode";
    icon.className = "bi bi-sun theme-icon";
  } else {
    text.textContent = "Dark Mode";
    icon.className = "bi bi-moon-stars theme-icon";
  }
}

if (colorBtn) {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
  updateButtonText();

  colorBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
    updateButtonText();
  });
}


// ===== Live date and time on the Home page =====

var datetime = document.getElementById("datetime");

function showDateTime() {
  var now = new Date();
  var date = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  var time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  datetime.textContent = date + ", " + time;
}

if (datetime) {
  showDateTime();
  setInterval(showDateTime, 1000);
}


// ===== Arrow keys move focus between menu links =====

var navigationLinks = document.querySelectorAll("#mainNav .nav-link");
navigationLinks.forEach(function (link, index) {
  link.addEventListener("keydown", function (event) {
    var nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % navigationLinks.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + navigationLinks.length) % navigationLinks.length;
    } else {
      return;
    }
    event.preventDefault();
    navigationLinks[nextIndex].focus();
  });
});


// ===== Gallery category filter =====
// The selected category is saved in localStorage and restored next time.

var filterButtons = document.querySelectorAll("[data-filter]");
var artworkCards = document.querySelectorAll(".filter-artwork");
var galleryFeedback = document.getElementById("gallery-feedback");
var currentFilter = localStorage.getItem("ezGalleryFilter") || "all";

function filterArtworks(category) {
  artworkCards.forEach(function (card) {
    var shouldShow;
    switch (category) {
      case "fantasy":
        shouldShow = card.dataset.category === "fantasy";
        break;
      case "character":
        shouldShow = card.dataset.category === "character";
        break;
      case "abstract":
        shouldShow = card.dataset.category === "abstract";
        break;
      default:
        shouldShow = true;
    }
    card.classList.toggle("is-hidden", !shouldShow);
  });
  if (galleryFeedback) {
    galleryFeedback.textContent = category === "all"
      ? "Showing all artworks."
      : "Showing " + category + " artwork.";
  }
}

// Marks the right button as active.
function setActiveFilterButton(category) {
  filterButtons.forEach(function (item) {
    item.classList.toggle("active", item.dataset.filter === category);
  });
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    localStorage.setItem("ezGalleryFilter", currentFilter);
    setActiveFilterButton(currentFilter);
    filterArtworks(currentFilter);
    playUiSound();
  });
});

if (filterButtons.length > 0) {
  setActiveFilterButton(currentFilter);
  filterArtworks(currentFilter);
}


// ===== Star ratings (saved in localStorage) =====

document.querySelectorAll(".rating-stars").forEach(function (ratingGroup) {
  var artworkName = ratingGroup.dataset.artwork;
  var savedRating = Number(localStorage.getItem("rating-" + artworkName)) || 0;
  var stars = ratingGroup.querySelectorAll(".star");
  var message = ratingGroup.parentElement.querySelector(".rating-message");

  function paintStars(rating) {
    stars.forEach(function (star) {
      star.classList.toggle("selected", Number(star.dataset.rating) <= rating);
    });
  }
  paintStars(savedRating);
  if (savedRating && message) message.textContent = "Your rating: " + savedRating + "/5";

  stars.forEach(function (star) {
    star.addEventListener("click", function () {
      var rating = Number(star.dataset.rating);
      localStorage.setItem("rating-" + artworkName, rating);
      paintStars(rating);
      if (message) message.textContent = "Your rating: " + rating + "/5 — thank you!";
      playUiSound();
    });
  });
});


// ===== "Show More Artworks" button =====
// Builds new cards from an array of objects with map().

var extraArtworks = [
  { title: "City Facade", category: "architecture", image: "images/gallery4.jpg", description: "A modern city-inspired digital artwork." },
  { title: "Color Study", category: "abstract", image: "images/gallery5.jpg", description: "A colorful study of shape and texture." },
  { title: "Collage Wall", category: "abstract", image: "images/gallery6.jpeg", description: "A bright digital collage." }
];

var loadArtworkButton = document.getElementById("load-artwork-btn");
if (loadArtworkButton) {
  loadArtworkButton.addEventListener("click", function () {
    var container = document.getElementById("filterable-artworks");
    var newCards = extraArtworks.map(function (artwork) {
      var card = document.createElement("article");
      card.className = "card filter-artwork";
      card.dataset.category = artwork.category === "architecture" ? "fantasy" : artwork.category;
      var image = document.createElement("img");
      image.src = artwork.image;
      image.alt = artwork.title;
      var title = document.createElement("h3");
      title.textContent = artwork.title;
      var description = document.createElement("p");
      description.textContent = artwork.description;
      card.append(image, title, description);
      return card;
    });
    newCards.forEach(function (card) { container.appendChild(card); });
    artworkCards = document.querySelectorAll(".filter-artwork");
    filterArtworks(currentFilter);
    loadArtworkButton.disabled = true;
    loadArtworkButton.textContent = "All Artworks Loaded";
    if (galleryFeedback) galleryFeedback.textContent = "Three more artworks have been added to the gallery.";
    playUiSound();
  });
}


// ===== Short "click" sound made with the Web Audio API =====

function playUiSound() {
  try {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    var audioContext = new AudioContextClass();
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 660;
    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
    oscillator.onended = function () { audioContext.close(); };
  } catch (error) {
    // If the browser has no sound support we just skip the sound.
  }
}

var soundButton = document.getElementById("sound-btn");
if (soundButton) {
  soundButton.addEventListener("click", function () {
    playUiSound();
    soundButton.textContent = "Sound played ✓";
  });
}


// ===== Small "pop" animation when a gallery card is clicked =====

document.querySelectorAll(".filter-artwork").forEach(function (card) {
  card.addEventListener("click", function (event) {
    if (event.target.closest(".rating-stars")) return;
    card.classList.remove("keyboard-focus");
    card.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.025)" }, { transform: "scale(1)" }],
      { duration: 300, easing: "ease-out" }
    );
  });
});


// ===== License filter on the Pricing page =====
// Shows only Personal or Commercial plans when a button is clicked.

var licenseButtons = document.querySelectorAll(".license-btn");
var licenseRows = document.querySelectorAll(".license-row");

licenseButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var type = button.dataset.license;

    licenseButtons.forEach(function (item) { item.classList.remove("active"); });
    button.classList.add("active");

    licenseRows.forEach(function (row) {
      var show = type === "all" || row.dataset.license === type;
      row.style.display = show ? "" : "none";
    });
  });
});


// ===== Authentication simulation with localStorage =====
// All users are saved as an array in "ezUsers".
// The email of the logged in user is saved in "ezCurrentUser".

function getUsers() {
  var saved = localStorage.getItem("ezUsers");
  return saved ? JSON.parse(saved) : [];
}

function findUserByEmail(email) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) return users[i];
  }
  return null;
}

function getCurrentUser() {
  var email = localStorage.getItem("ezCurrentUser");
  return email ? findUserByEmail(email) : null;
}

// Changes "Log In" in the menu to the user's first name when logged in.
var authLink = document.getElementById("auth-link");
var loggedUser = getCurrentUser();
if (authLink && loggedUser) {
  authLink.href = "profile.html";
  document.getElementById("auth-link-text").textContent = loggedUser.name.split(" ")[0];
}


// ----- Sign Up -----

var signupForm = document.getElementById("signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var nameOk = checkRequired("signup-name", "Please enter your full name.");
    var emailOk = checkEmail("signup-email");
    var phoneOk = checkPhone("signup-phone");
    var passwordOk = checkPassword("signup-password");
    var confirmOk = checkRequired("signup-confirm", "Please confirm your password.");

    var password = document.getElementById("signup-password").value;
    var confirmPassword = document.getElementById("signup-confirm").value;
    if (confirmOk && password !== confirmPassword) {
      showError("signup-confirm", "Passwords do not match.");
      confirmOk = false;
    }

    var termsOk = document.getElementById("signup-terms").checked;
    document.getElementById("signup-terms-error").textContent = termsOk ? "" : "Please accept the store rules.";

    var email = document.getElementById("signup-email").value.trim().toLowerCase();
    if (emailOk && findUserByEmail(email)) {
      showError("signup-email", "An account with this email already exists.");
      emailOk = false;
    }

    if (!(nameOk && emailOk && phoneOk && passwordOk && confirmOk && termsOk)) return;

    var users = getUsers();
    users.push({
      name: document.getElementById("signup-name").value.trim(),
      email: email,
      phone: document.getElementById("signup-phone").value.trim(),
      password: password,
      joined: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    });
    localStorage.setItem("ezUsers", JSON.stringify(users));

    signupForm.reset();
    document.getElementById("signup-success").textContent = "Account created! Redirecting to the login page...";
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1500);
  });
}


// ----- Log In -----

var loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var loginError = document.getElementById("login-error");
    loginError.textContent = "";

    var emailOk = checkEmail("login-email");
    var passwordOk = checkRequired("login-password", "Please enter your password.");
    if (!emailOk || !passwordOk) return;

    var email = document.getElementById("login-email").value.trim().toLowerCase();
    var password = document.getElementById("login-password").value;
    var user = findUserByEmail(email);

    if (!user || user.password !== password) {
      loginError.textContent = "Wrong email or password. Please try again.";
      return;
    }

    localStorage.setItem("ezCurrentUser", user.email);
    window.location.href = "profile.html";
  });

  // The eye button shows or hides the password.
  var togglePassword = document.getElementById("toggle-password");
  togglePassword.addEventListener("click", function () {
    var input = document.getElementById("login-password");
    var icon = togglePassword.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      icon.className = "bi bi-eye-slash";
    } else {
      input.type = "password";
      icon.className = "bi bi-eye";
    }
  });
}


// ----- Profile page -----

var profileName = document.getElementById("profile-name");

if (profileName) {
  var user = getCurrentUser();

  // Only logged in users can see this page.
  if (!user) {
    window.location.href = "login.html";
  } else {
    profileName.textContent = user.name;
    document.getElementById("profile-avatar").textContent = user.name.charAt(0).toUpperCase();
    document.getElementById("profile-email").textContent = user.email;
    document.getElementById("profile-phone").textContent = user.phone;
    document.getElementById("profile-date").textContent = user.joined;

    // Collects all ratings saved on the Gallery page.
    var ratingsList = document.getElementById("profile-ratings");
    for (var r = 0; r < localStorage.length; r++) {
      var key = localStorage.key(r);
      if (key.indexOf("rating-") === 0) {
        var item = document.createElement("li");
        item.textContent = key.replace("rating-", "") + " — " + localStorage.getItem(key) + "/5 ★";
        ratingsList.appendChild(item);
      }
    }
    if (ratingsList.children.length === 0) {
      ratingsList.innerHTML = '<li class="muted-text">No ratings yet. <a href="gallery.html">Rate an artwork</a></li>';
    }

    // Shows the last searches from the Gallery and Museum pages.
    var searchList = document.getElementById("profile-searches");
    var gallerySearch = localStorage.getItem("ezGallerySearch");
    var museumSearch = localStorage.getItem("ezMuseumSearch");
    if (gallerySearch) {
      var galleryItem = document.createElement("li");
      galleryItem.textContent = "Gallery: \"" + gallerySearch + "\"";
      searchList.appendChild(galleryItem);
    }
    if (museumSearch) {
      var museumItem = document.createElement("li");
      museumItem.textContent = "Museum: \"" + museumSearch + "\"";
      searchList.appendChild(museumItem);
    }
    if (searchList.children.length === 0) {
      searchList.innerHTML = '<li class="muted-text">No saved searches yet.</li>';
    }
  }

  document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("ezCurrentUser");
    window.location.href = "login.html";
  });
}


// ===== External API: Cleveland Museum of Art (Open Access) =====
// Loads real artworks with fetch() + async/await.
// Shows a loading spinner while waiting and an error message if something goes wrong.

var museumForm = document.getElementById("museum-form");

if (museumForm) {
  var museumInput = document.getElementById("museum-query");
  var museumStatus = document.getElementById("museum-status");
  var museumResults = document.getElementById("museum-results");

  // Creates one card for one artwork from the API.
  function createMuseumCard(artwork) {
    var card = document.createElement("article");
    card.className = "card museum-card";

    var image = document.createElement("img");
    image.src = artwork.images.web.url;
    image.alt = artwork.title;
    image.loading = "lazy";
    image.onerror = function () {
      image.replaceWith(createNoImageBox());
    };

    var title = document.createElement("h3");
    title.textContent = artwork.title;

    var artist = document.createElement("p");
    var artistName = "Unknown artist";
    if (artwork.creators && artwork.creators.length > 0) {
      artistName = artwork.creators[0].description;
    }
    artist.textContent = artistName + (artwork.creation_date ? " — " + artwork.creation_date : "");

    var link = document.createElement("a");
    link.href = artwork.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "btn btn-outline-primary btn-sm";
    link.innerHTML = '<i class="bi bi-box-arrow-up-right"></i> View in museum';

    card.append(image, title, artist, link);
    return card;
  }

  function createNoImageBox() {
    var box = document.createElement("div");
    box.className = "no-image";
    box.innerHTML = '<i class="bi bi-image"></i> Image not available';
    return box;
  }

  async function loadMuseumArtworks(query) {
    museumStatus.className = "museum-status";
    museumStatus.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Loading artworks...';
    museumResults.innerHTML = "";

    var url = "https://openaccess-api.clevelandart.org/api/artworks/?q=" + encodeURIComponent(query) +
      "&limit=12&has_image=1";

    try {
      var response = await fetch(url);
      if (!response.ok) {
        throw new Error("Server answered with status " + response.status);
      }
      var data = await response.json();

      // Some artworks have no picture, so we skip them.
      var artworks = data.data.filter(function (artwork) {
        return artwork.images && artwork.images.web;
      });

      if (artworks.length === 0) {
        museumStatus.textContent = "No artworks found for \"" + query + "\". Try another word.";
        return;
      }

      artworks.forEach(function (artwork) {
        museumResults.appendChild(createMuseumCard(artwork));
      });
      museumStatus.textContent = "Found " + artworks.length + " artworks for \"" + query + "\".";
    } catch (error) {
      museumStatus.className = "museum-status error-text";
      museumStatus.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Could not load artworks. Check your internet connection and try again.';
    }
  }

  // Runs a search and remembers the word in localStorage.
  function searchMuseum(query) {
    museumInput.value = query;
    localStorage.setItem("ezMuseumSearch", query);
    loadMuseumArtworks(query);
  }

  museumForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!checkRequired("museum-query", "Please type something to search.")) return;
    searchMuseum(museumInput.value.trim());
  });

  document.querySelectorAll("[data-topic]").forEach(function (button) {
    button.addEventListener("click", function () {
      clearError("museum-query");
      searchMuseum(button.dataset.topic);
    });
  });

  // On first visit we show landscapes, later we show the last saved search.
  searchMuseum(localStorage.getItem("ezMuseumSearch") || "landscape");
}


// ===== jQuery features =====

$(document).ready(function () {

  // ----- Toast notifications in the corner -----
  $("body").append('<div id="toast-container"></div>');

  function showToast(message) {
    var $toast = $('<div class="site-toast"></div>').text(message);
    $("#toast-container").append($toast);
    $toast.hide().fadeIn(300).delay(2500).fadeOut(500, function () {
      $(this).remove();
    });
  }

  $("#subscribe-form").on("valid-submit", function () {
    showToast("Subscribed successfully!");
  });

  $(document).on("click", ".star", function () {
    var name = $(this).closest(".rating-stars").data("artwork");
    showToast("You rated " + name + " " + $(this).data("rating") + "/5");
  });

  $("#load-artwork-btn").on("click", function () {
    showToast("3 more artworks added");
  });

  $("#logout-btn").on("click", function () {
    showToast("You have been logged out");
  });

  // ----- Live search in the gallery (saved in localStorage) -----
  function applySearch() {
    var query = $("#artwork-search").val().toLowerCase().trim();
    var $cards = $(".filter-artwork");
    var $matches = $cards.filter(function () {
      var text = $(this).find("h3").text() + " " + $(this).children("p").text();
      return text.toLowerCase().indexOf(query) > -1;
    });
    $cards.addClass("search-hidden");
    $matches.removeClass("search-hidden");
    $("#search-empty").toggle($matches.length === 0);

    if (query === "") {
      localStorage.removeItem("ezGallerySearch");
    } else {
      localStorage.setItem("ezGallerySearch", query);
    }
  }

  $("#artwork-search").on("input", applySearch);
  $("#load-artwork-btn").on("click", applySearch);

  $("#clear-search-btn").on("click", function () {
    $("#artwork-search").val("");
    $("#suggestions").hide();
    applySearch();
  });

  // Puts the saved search back into the box when the page opens.
  var savedSearch = localStorage.getItem("ezGallerySearch");
  if (savedSearch && $("#artwork-search").length) {
    $("#artwork-search").val(savedSearch);
    applySearch();
  }

  // ----- Autocomplete suggestions under the search box -----
  var artworkNames = [
    "Sunset Ridge", "Neon Drifter", "Fragments",
    "City Facade", "Color Study", "Collage Wall",
    "Luna Ray", "Kenji Voss", "Mira Solis"
  ];

  $("#artwork-search").on("input", function () {
    var query = $(this).val().toLowerCase().trim();
    var $list = $("#suggestions").empty();
    if (query === "") {
      $list.hide();
      return;
    }
    var found = $.grep(artworkNames, function (name) {
      return name.toLowerCase().indexOf(query) > -1;
    });
    $.each(found, function (index, name) {
      $list.append($("<li></li>").text(name));
    });
    $list.toggle(found.length > 0);
  });

  $("#suggestions").on("click", "li", function () {
    $("#artwork-search").val($(this).text());
    $("#suggestions").hide();
    applySearch();
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".search-wrap").length) {
      $("#suggestions").hide();
    }
  });

  // ----- Highlight search words on the Pricing page -----
  var $searchTexts = $(".faq-question, .faq-answer p, .included-list li");

  $searchTexts.each(function () {
    $(this).data("original", $(this).html());
  });

  $("#page-search").on("input", function () {
    var query = $(this).val().trim();
    var total = 0;

    $searchTexts.each(function () {
      $(this).html($(this).data("original"));
    });
    $(".faq-question").removeClass("active");
    $(".faq-answer").css("max-height", "");

    if (query === "") {
      $("#search-count").text("");
      return;
    }

    // Special symbols like "." or "?" are escaped so the search does not break.
    var safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var regex = new RegExp("(" + safeQuery + ")", "gi");

    $searchTexts.each(function () {
      var text = $(this).text();
      var matches = text.match(regex);
      if (matches) {
        total += matches.length;
        $(this).html(text.replace(regex, '<mark class="search-mark">$1</mark>'));
      }
    });

    $(".faq-item").has("mark").each(function () {
      var $answer = $(this).find(".faq-answer");
      $(this).find(".faq-question").addClass("active");
      $answer.css("max-height", $answer.prop("scrollHeight") + "px");
    });

    $("#search-count").text(total + " match(es) found");
  });

  // ----- Scroll progress bar at the top -----
  $("body").prepend(
    '<div id="scroll-progress"><div id="scroll-progress-bar"></div></div>' +
    '<span id="scroll-progress-label">0%</span>'
  );

  function updateProgress() {
    var maxScroll = $(document).height() - $(window).height();
    var percent = maxScroll > 0 ? Math.round($(window).scrollTop() / maxScroll * 100) : 0;
    $("#scroll-progress-bar").css("width", percent + "%");
    $("#scroll-progress-label").text(percent + "%");
  }

  $(window).on("scroll resize", updateProgress);
  updateProgress();

  // ----- Numbers count up when the stats block is visible -----
  var countersStarted = false;

  function startCounters() {
    var $stats = $("#stats");
    if (countersStarted || !$stats.length) return;
    if ($(window).scrollTop() + $(window).height() < $stats.offset().top + 50) return;
    countersStarted = true;

    $(".stat-number").each(function () {
      var $number = $(this);
      var target = $number.data("target");
      var suffix = $number.data("suffix") || "";
      $({ value: 0 }).animate({ value: target }, {
        duration: 2000,
        step: function (now) {
          $number.text(Math.floor(now) + suffix);
        },
        complete: function () {
          $number.text(target + suffix);
        }
      });
    });
  }

  $(window).on("scroll resize", startCounters);
  startCounters();

  // ----- Loading spinner on the contact form button -----
  $("#contact-form").on("valid-submit", function () {
    var form = this;
    var $button = $(form).find("button[type='submit']");
    var originalHtml = $button.html();

    $button.prop("disabled", true).html(
      '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Please wait…'
    );

    setTimeout(function () {
      $button.prop("disabled", false).html(originalHtml);
      $("#form-success").text("Your message has been sent successfully!");
      form.reset();
      showToast("Form submitted successfully!");
    }, 2000);
  });

  // ----- Copy email / promo code to clipboard -----
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    var $temp = $("<textarea></textarea>").val(text).appendTo("body");
    $temp[0].select();
    document.execCommand("copy");
    $temp.remove();
    return Promise.resolve();
  }

  $(".copy-btn").on("click", function () {
    var $button = $(this);
    copyText($button.data("copy")).then(function () {
      $button.find(".copy-icon").text("✔");
      $button.siblings(".copy-tooltip").stop(true, true).fadeIn(150).delay(1500).fadeOut(300);
      showToast("Copied to clipboard!");
      setTimeout(function () {
        $button.find(".copy-icon").text("📋");
      }, 2000);
    });
  });

  $(".copy-text").on("copy", function () {
    showToast("Copied to clipboard!");
  });

  // ----- Lazy loading: pictures load only when you scroll to them -----
  function loadVisibleImages() {
    var viewBottom = $(window).scrollTop() + $(window).height();
    $("img.lazy").each(function () {
      var $image = $(this);
      if ($image.offset().top < viewBottom + 100) {
        $image.attr("src", $image.data("src")).removeClass("lazy").addClass("lazy-loaded");
      }
    });
  }

  $(window).on("scroll resize load", loadVisibleImages);
  loadVisibleImages();
});
