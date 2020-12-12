firebase.initializeApp(firebaseConfig); // firebaseConfig is a variabled declared in "firebaseConfig.js", a gitignored file
var db = firebase.firestore();
const sadletId = window.location.search.substr(1);

if (sadletId != "") {
  var sadletRef = db.collection("sadlets").doc(sadletId);

  sadletRef.onSnapshot((doc) => {
    if (doc.exists) {
      var sadletData = doc.data();
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
        document.getElementById("posts").innerText = "Welcome to your new Sadlet! Get started by pressing the plus icon in the bottom write to create a post. Make sure you save the URL to this Sadlet, as you'll need it to get back here.";
      }
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

  document.getElementById("createPostMenu").className = "active status";
  document.getElementById("status").innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size: 80px"></i>';

  if (file != undefined) {
    let storageRef = firebase.storage().ref("userImages/" + randomString() + "_" + file.name);
    storageRef.put(file).then((snapshot) => {
      snapshot.ref.getDownloadURL().then((url) => {
        sadletRef.update({
          contents: firebase.firestore.FieldValue.arrayUnion({
            title: "Anonymous",
            body: text,
            image: url
          })
        }).then(() => {
          document.getElementById("status").innerHTML = '<i class="fa fa-check" style="font-size: 80px"></i>';
          window.setTimeout(() => { document.getElementById("createPostMenu").className = "" }, 1000);
        }).catch(() => {
          document.getElementById("status").innerHTML = '<i class="fa fa-cross" style="font-size: 80px"></i>';
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
        title: "Anonymous",
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
  if (title == "") return;
  db.collection("sadlets").add({
    contents: [],
    title: title
  }).then((docRef) => {
    window.location = "/?" + docRef.id;
  }).catch(() => {
    alert("Something went wrong.");
  })
}