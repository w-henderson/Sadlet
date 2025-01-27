function routeHome(goAnyway = false) {
  window.onload = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('serviceWorker.js', {
        scope: "/"
      }).then(function (reg) {
        console.log("Service worker registered.");
      }).catch(function (err) {
        console.log("Service worker not registered. This happened:", err)
      });
    }
    if (!window.localStorage.getItem("sadletDarkMode")) {
      window.localStorage.setItem("sadletDarkMode", "false");
    } else {
      if (window.localStorage.getItem("sadletDarkMode") === "true") {
        document.body.className = "darkMode";
        document.querySelector("meta[name='theme-color']").setAttribute("content", "#313638");
      }
    }

    if (!window.localStorage.getItem("mySadlets")) {
      window.localStorage.setItem("mySadlets", "[]");
    }

    let mySadlets = "";
    JSON.parse(window.localStorage.getItem("mySadlets")).forEach((sadlet) => {
      mySadlets = `<div class="post clickable" onclick="window.location='/?${sadlet.id}';"><span>${sadlet.author}</span>${sadlet.name}</div>` + mySadlets;
    });
    mySadlets += `<div class="post clickable" onclick="window.location='/?tutorial';"><span>William Henderson</span>Tutorial Sadlet</div>`;

    document.getElementById("sadletName").innerText = "Welcome to Sadlet!";
    document.getElementById("posts").innerHTML =
      `Welcome to Sadlet, the intuitive class participation tool that's totally not a rip off of Padlet.\
      If your teacher has invited you to a class, click the link they sent you.\
      If you want to create your own class, press the document icon up in the top right to get started.\
      Happy Sadletting!\
      <h2>My Sadlets (<u style="cursor:pointer;" onclick="window.localStorage.setItem('mySadlets','[]');routeHome(true);">clear</u>)</h2><div class='sadlets'>${mySadlets}</div>`;
    document.getElementById("floatingButton").className = "hideButton";

    var elem = document.querySelector('.sadlets');
    msnry = new Masonry(elem, {
      itemSelector: '.post',
      percentPosition: true
    });
  }

  if (goAnyway) window.onload();
}

function route404() {
  document.getElementById("sadletName").innerText = "Sadlet not found!";
  document.getElementById("posts").innerText = "Looks like someone did an oopsie. This Sadlet couldn't be found.";
  document.getElementById("floatingButton").className = "hideButton";
}