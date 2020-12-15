firebase.initializeApp(firebaseConfig); // firebaseConfig is a variabled declared in "firebaseConfig.js", a gitignored file

var db = firebase.firestore();
var auth = firebase.auth();

var requiresAuth = false;
var readonly = false;

function updateAuthDisplay(user) {
  if (user) {
    document.getElementById("loginIcon").className = "fa fa-user-times loginGreen";
    document.getElementById("loginIcon").parentNode.onclick = () => { auth.signOut(); };
    if (!readonly) document.getElementById("floatingButton").style.display = "block";
    try { document.getElementById("authSpan").innerHTML = "" } catch (_) { };
  } else {
    document.getElementById("loginIcon").className = "fa fa-user-plus loginRed";
    document.getElementById("loginIcon").parentNode.onclick = login;
    if (requiresAuth) {
      document.getElementById("authSpan").innerHTML = "This Sadlet requires you to be logged in to post. Please press the button in the top right to authenticate.<br><br>";
      document.getElementById("floatingButton").style.display = "none";
    }
  }
}

auth.onAuthStateChanged(updateAuthDisplay);

const sadletId = window.location.search.substr(1);

if (sadletId != "") {
  var sadletRef = db.collection("sadlets").doc(sadletId);

  sadletRef.onSnapshot((doc) => {
    if (doc.exists) {
      var sadletData = doc.data();
      readonly = sadletData.readonly;
      if (sadletData.readonly || (sadletData.authRequired && !auth.currentUser)) document.getElementById("floatingButton").style.display = "none";
      else document.getElementById("floatingButton").style.display = "block";
      requiresAuth = sadletData.authRequired;
      updateAuthDisplay(auth.currentUser);
      document.getElementById("sadletName").innerText = sadletData.title;
      document.getElementById("posts").innerHTML = "";
      sadletData.contents.slice().reverse().forEach((post) => {
        if (post.image != "") {
          document.getElementById("posts").innerHTML +=
            `<div class='post'><span>${sanitizeHTML(post.title)}</span>${sanitizeHTML(post.body)}<img src=${post.image} onclick="showLightbox('${post.image}');"></div>`;
        } else {
          document.getElementById("posts").innerHTML +=
            `<div class='post'><span>${sanitizeHTML(post.title)}</span>${sanitizeHTML(post.body)}</div>`;
        }
      });
      if (sadletData.contents.length == 0) {
        document.getElementById("posts").innerText = "Welcome to your new Sadlet! Get started by pressing the plus icon in the bottom right to create a post. Make sure you save the URL to this Sadlet, as you'll need it to get back here.";
      }
      saveSadlet(sadletId, sadletData.title, sadletData.author);
      msnry.reloadItems();
      msnry.layout();
    } else {
      route404();
    }
  });
} else {
  routeHome();
}

function sanitizeHTML(text) {
  let element = document.createElement('div');
  element.innerText = text;
  return element.innerHTML;
}

function randomString() {
  return [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
}

function openFileDialog() {
  let dialog = document.getElementById("fileUploader");
  dialog.click();
}

function createPost() {
  let file = document.getElementById("fileUploader").files[0];
  let text = document.getElementById("postTextInput").value;

  if (file == undefined && text == "") return;

  document.getElementById("createPostMenu").className = "active status";
  document.getElementById("status").innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size: 80px"></i>';

  if (file != undefined) {
    let storageRef = firebase.storage().ref("userImages/" + randomString() + "_" + file.name);
    storageRef.put(file).then((snapshot) => {
      snapshot.ref.getDownloadURL().then((url) => {
        sadletRef.update({
          contents: firebase.firestore.FieldValue.arrayUnion({
            title: auth.currentUser == undefined ? "Anonymous" : auth.currentUser.displayName,
            body: text,
            image: url
          })
        }).then(() => {
          document.getElementById("status").innerHTML = '<i class="fa fa-check" style="font-size: 80px"></i>';
          document.getElementById("fileUploader").value = "";
          window.setTimeout(() => { document.getElementById("createPostMenu").className = "" }, 1000);
        }).catch(() => {
          document.getElementById("status").innerHTML = '<i class="fa fa-cross" style="font-size: 80px"></i>';
          document.getElementById("fileUploader").value = "";
          window.setTimeout(() => { document.getElementById("createPostMenu").className = "" }, 1000);
        });
      });
    }).catch(() => {
      document.getElementById("status").innerHTML = '<i class="fa fa-cross" style="font-size: 80px"></i>';
      window.setTimeout(() => { document.getElementById("createPostMenu").className = "" }, 1000);
    });
  } else {
    sadletRef.update({
      contents: firebase.firestore.FieldValue.arrayUnion({
        title: auth.currentUser == undefined ? "Anonymous" : auth.currentUser.displayName,
        body: text,
        image: ""
      })
    }).then(() => {
      document.getElementById("status").innerHTML = '<i class="fa fa-check" style="font-size: 80px"></i>';
      window.setTimeout(() => { document.getElementById("createPostMenu").className = "" }, 1000);
    }).catch(() => {
      document.getElementById("status").innerHTML = '<i class="fa fa-cross" style="font-size: 80px"></i>';
      window.setTimeout(() => { document.getElementById("createPostMenu").className = "" }, 1000);
    });;
  }
}

function createSadlet() {
  let title = document.getElementById("newSadletName").value;
  let authRequired = document.getElementById("authCheckbox").checked;

  if (title == "") return;
  db.collection("sadlets").add({
    contents: [],
    title: title,
    readonly: false,
    authRequired: authRequired,
    author: auth.currentUser == undefined ? "Anonymous" : auth.currentUser.displayName
  }).then((docRef) => {
    window.location = "/?" + docRef.id;
  }).catch(() => {
    alert("Something went wrong.");
  })
}

function saveSadlet(id, name, author) {
  if (id == "tutorial") return;
  if (!window.localStorage.getItem("mySadlets")) {
    window.localStorage.setItem("mySadlets", JSON.stringify([
      { name, id, author }
    ]));
  } else {
    let currentSadlets = JSON.parse(window.localStorage.getItem("mySadlets"));
    let alreadySaved = false;
    currentSadlets.forEach((sadlet) => {
      if (sadlet.id == id) {
        alreadySaved = true;
      }
    });
    if (!alreadySaved) {
      currentSadlets.push({ name, id, author });
      window.localStorage.setItem("mySadlets", JSON.stringify(currentSadlets));
    }
  }
}

// allow pasting into image upload
window.addEventListener('paste', e => {
  document.getElementById("fileUploader").files = e.clipboardData.files;
  createPost();
});