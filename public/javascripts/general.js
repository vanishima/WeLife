const campus = document.querySelector("#moments");
const welcome = document.querySelector(".welcome-user");

//     <div class="mycard col-md" style="18rem">
//       <div class="mycard-title"></div>
//       <div class="mycard-username"></div>
//       <div class="mycard-content"></div>
//       <a class="mycard-like"></a>
//       <div class="mycard-time"></div>
//       <div class="mycard-comments"></div>
//     </div>
// function displayMoments(moments) {
//   const mycard = document.createElement("div");
//   mycard.className = "mycard col-md";
//   mycard.style = "width: 18rem";
//   const title = document.createElement("h5");
//   const username = document.createElement("div");
//   const content = document.createElement("div");
//   const comments = document.createElement("div");
//   const like = document.createElement("a");
//   title.innerHTML =
// }

// async function reloadMoments() {
//   campus.innerHTML = "Loading Moments...";
//   campus.innerHTML = "";
//   const res = await fetch("/momentDB");
//   if (res.status === 401) {
//     window.location.replace("./signin.html");
//   }
//   const moments = await res.json();
//   moments.files.forEach(displayMoments);
//   const user = await moments.user;
//   welcome.innerHTML = "Hi, " + user;
// }

// reloadMoments();
