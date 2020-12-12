function routeHome() {
  window.onload = () => {
    if (screen.availHeight / screen.availWidth > 1.88) {
      document.getElementById("createSadletButton").innerHTML = "<i class='fa fa-plus'></i>"
    }
    if (!window.localStorage.getItem("sadletDarkMode")) {
      window.localStorage.setItem("sadletDarkMode", "false");
    } else {
      if (window.localStorage.getItem("sadletDarkMode") === "true") {
        document.body.className = "darkMode";
      }
    }
    document.getElementById("sadletName").innerText = "Welcome to Sadlet!";
    document.getElementById("posts").innerText = "Welcome to Sadlet, the intuitive class participation tool that's totally not a rip off of Padlet. If your teacher has invited you to a class, click the link they sent you. If you want to create your own class, press that 'Create Sadlet' button up in the top right to get started. Enjoy Sadletting!";
    document.getElementById("floatingButton").className = "hideButton";
  }
}

function route404() {
  document.getElementById("sadletName").innerText = "Sadlet not found!";
  document.getElementById("posts").innerText = "Looks like someone did an oopsie. This Sadlet couldn't be found.";
  document.getElementById("floatingButton").className = "hideButton";
}