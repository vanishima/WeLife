const campus = document.querySelector("#moments");
const welcome = document.querySelector(".welcome-user");

function displayMoments(moments) {
  const mycard = document.createElement("div");
  mycard.className = "mycard col";
  mycard.style = "18rem";
  const title = document.createElement("h4");
  const username = document.createElement("div");
  username.style = "float: left";
  const content = document.createElement("div");
  content.style = "float: left";
  const time = document.createElement("div");
  time.className = "time";
  const deleteForm = document.createElement("form");
  deleteForm.className = "deleteform";
  deleteForm.action = "/deletePost";
  deleteForm.method = "POST";
  deleteForm.style = "";
  const idInput = document.createElement("input");
  idInput.type = "hidden";
  idInput.name = "id";
  idInput.value = moments.id;
  const del = document.createElement("button");
  del.className = "like-btn btn btn-lg";
  del.type = "submit";
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa fa-heart love-icon";
  del.appendChild(deleteIcon);
  deleteForm.appendChild(idInput);
  deleteForm.appendChild(del);
  title.innerHTML = moments.title;
  username.innerHTML = "@" + moments.name + ":";
  content.innerHTML = moments.content;
  mycard.appendChild(title);
  mycard.appendChild(username);
  mycard.appendChild(content);
  mycard.appendChild(time);
  mycard.appendChild(del);
  campus.appendChild(mycard);
}

async function reloadMoments() {
  campus.innerHTML = "Loading Moments...";
  campus.innerHTML = "";
  const res = await fetch("/myOwnPosts");
  if (res.status === 401) {
    window.location.replace("./signin.html");
  }
  const moments = await res.json();
  console.log("moments", moments);
  moments.files.forEach(displayMoments);
  const user = await moments.user;
  welcome.innerHTML = "Hi, " + user;
}

async function deletePost(title) {
  const data = { title: title };
  const resRaw = await fetch("/deletePost", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign("/signin.html");
    return;
  }

  // need to reload the collections when user delete data from collections
  reloadMoments();
}

async function editPost(title, content) {
  const data = { title: title, content: content };
  const resRaw = await fetch("/editPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign("/signin.html");
    return;
  }

  // need to reload the collections when user update data from collections
  reloadMoments();
}

reloadMoments();
