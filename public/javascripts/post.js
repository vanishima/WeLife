const welcome = document.querySelector(".welcome-user");

async function postWelcome() {
  const res = await fetch("/momentDB");
  if (res.status === 401) {
    window.location.replace("./signin.html");
  }
  const moments = await res.json();
  const user = await moments.user;
  welcome.innerHTML = "Hi, " + user;
}

postWelcome();
