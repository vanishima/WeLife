const campus = document.querySelector("#moments");
const welcome = document.querySelector(".welcome-user");

function displayMoments(moments) {
  const mycard = document.createElement("div");
  mycard.className = "mycard col";
  const title = document.createElement("h4");
  const username = document.createElement("div");
  const content = document.createElement("div");
  const time = document.createElement("div");
  time.className = "time-home";
  time.innerHTML = moments.time;
  const deleteForm = document.createElement("form");
  deleteForm.className = "deleteform";
  deleteForm.action = "/deletePost";
  deleteForm.method = "POST";
  const idInputForDeletion = document.createElement("input");
  idInputForDeletion.type = "hidden";
  idInputForDeletion.name = "id";
  idInputForDeletion.value = moments.id;
  const del = document.createElement("button");
  del.className = "btn btn-lg";
  del.type = "submit";
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa fa-times-circle";
  del.appendChild(deleteIcon);
  deleteForm.appendChild(idInputForDeletion);
  deleteForm.appendChild(del);

  const idInputForEdit = document.createElement("input");
  idInputForEdit.type = "hidden";
  idInputForEdit.name = "id";
  idInputForEdit.value = moments.id;

  const editForm = document.createElement("form");
  editForm.className = "deleteform";
  editForm.action = "/editPost";
  editForm.method = "POST";
  const edit = document.createElement("button");
  edit.className = "btn btn-lg";
  edit.type = "submit";
  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit";
  edit.appendChild(editIcon);
  editForm.appendChild(idInputForEdit);
  editForm.appendChild(edit);

  title.innerHTML = moments.title;
  username.innerHTML = "@" + moments.name + ":";
  content.innerHTML = moments.content;
  mycard.appendChild(deleteForm);
  mycard.appendChild(title);
  mycard.appendChild(username);
  mycard.appendChild(content);
  mycard.appendChild(time);
  mycard.appendChild(editForm);
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
  moments.files.forEach(displayMoments);
  const user = await moments.user;
  welcome.innerHTML = "Hi, " + user;
}

reloadMoments();
