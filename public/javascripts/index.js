const userButtons = document.querySelector(".user-buttons");
const welcome = document.querySelector(".welcome-user");

async function addButtons() {
  const login = await fetch("/getUser");

  if (login.status === 401) {
    let signinbtn = document.createElement("a");
    signinbtn.className = "btn btn-secondary";
    signinbtn.href = "./signin.html";
    signinbtn.innerHTML = "Sign in";
    let signupbtn = document.createElement("a");
    signupbtn.className = "btn btn-warning";
    signupbtn.href = "./signup.html";
    signupbtn.innerHTML = "Sign up";
    userButtons.appendChild(signinbtn);
    userButtons.appendChild(signupbtn);
  } else {
    let logoutform = document.createElement("form");
    logoutform.action = "/logout?_method=DELETE";
    logoutform.method = "POST";
    let logoutbtn = document.createElement("button");
    logoutbtn.className = "btn btn-secondary";
    logoutbtn.innerHTML = "Log out";
    logoutbtn.type = "submit";
    logoutform.appendChild(logoutbtn);
    userButtons.appendChild(logoutform);

    const res = await fetch("/momentDB");
    const moments = await res.json();
    const user = await moments.user;
    welcome.innerHTML = user + "!";
  }
}

addButtons();
