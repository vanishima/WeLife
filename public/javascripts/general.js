const campus = document.querySelector("#moments");
const welcome = document.querySelector(".welcome-user");

function displayMoments(moments) {
  const mycard = document.createElement("div");
  mycard.className = "mycard col";
  const title = document.createElement("h4");
  const username = document.createElement("div");
  username.className = "display-username";
  const content = document.createElement("div");
  content.className = "display-content";
  const time = document.createElement("div");
  time.className = "time";
  const likeForm = document.createElement("form");
  likeForm.className = "likeform";
  likeForm.action = "/likePost";
  likeForm.method = "POST";
  const idInput = document.createElement("input");
  idInput.type = "hidden";
  idInput.name = "id";
  idInput.value = moments.id;
  const like = document.createElement("button");
  like.className = "like-btn btn btn-lg";
  like.type = "submit";
  const love = document.createElement("i");
  love.className = "fa fa-heart love-icon";
  const likeCount = document.createElement("p");
  likeCount.innerHTML = moments.like;
  like.appendChild(love);
  likeForm.appendChild(idInput);
  likeForm.appendChild(like);
  likeForm.appendChild(likeCount);
  title.innerHTML = moments.title;
  username.innerHTML = "@" + moments.name + ":";
  content.innerHTML = moments.content;
  time.innerHTML = moments.time;
  mycard.appendChild(title);
  mycard.appendChild(username);
  mycard.appendChild(content);
  mycard.appendChild(time);
  mycard.appendChild(likeForm);
  campus.appendChild(mycard);
}

async function reloadMoments() {
  campus.innerHTML = "Loading Moments...";
  campus.innerHTML = "";
  const res = await fetch("/momentDB");
  if (res.status === 401) {
    window.location.replace("./signin.html");
  }
  const moments = await res.json();
  moments.files.forEach(displayMoments);
  const user = await moments.user;
  welcome.innerHTML = "Hi, " + user;
}
reloadMoments();
