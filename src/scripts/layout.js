var msnry;

window.onload = () => {
  var elem = document.querySelector('#posts');
  msnry = new Masonry(elem, {
    itemSelector: '.post',
    percentPosition: true
  });
  if (!window.localStorage.getItem("sadletDarkMode")) {
    window.localStorage.setItem("sadletDarkMode", "false");
  } else {
    if (window.localStorage.getItem("sadletDarkMode") === "true") {
      document.body.className = "darkMode";
      document.querySelector("meta[name='theme-color']").setAttribute("content", "#313638");
    }
  }
}

function toggleAddMenu(menuName = "createPostMenu") {
  let menu = document.getElementById(menuName);
  menu.className = menu.className == "" ? "active" : "";
  if (menuName == "createPostMenu") document.getElementById("postTextInput").value = "";
}

function showLightbox(image) {
  document.getElementById("lightboxImage").src = image;
  document.getElementById("lightbox").className = "show";
}

function hideLightbox() {
  document.getElementById("lightboxImage").src = "";
  document.getElementById("lightbox").className = "";
}

function toggleDarkMode() {
  if (window.localStorage.getItem("sadletDarkMode") === "true") {
    window.localStorage.setItem("sadletDarkMode", "false");
    document.body.className = "";
    document.querySelector("meta[name='theme-color']").setAttribute("content", "#ef6461");
  } else {
    window.localStorage.setItem("sadletDarkMode", "true");
    document.body.className = "darkMode";
    document.querySelector("meta[name='theme-color']").setAttribute("content", "#313638");
  }
}