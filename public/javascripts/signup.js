const passwordConfirmInput = document.getElementById("passwordConfirmInput");
const passwordInput = document.getElementById("passwordInput");
const formSignUp = document.querySelector("#form-register");
const alert = document.querySelector(".alert");

/* eslint-disable no-unused-vars */
async function onFormSignUpSubmit(event) {
  event.preventDefault();
  const formData = new FormData(formSignUp);

  const date = Date.now().toString();
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const username = formData.get("username");
  const password = formData.get("password");

  const data = {
    id: date,
    username: username,
    password: password,
    firstname: firstname,
    lastname: lastname,
  };

  const resRaw = await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // fail to sign up
  if (!resRaw.ok) {
    alert.style.display = "block";
    alert.innerHTML = "This username already exists. Please go to sign in.";

    // hide the alert after 3s
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(3000);
    alert.style.display = "none";
    alert.innerHTML = "";
  } else {
    window.location.assign("/signin.html");
  }
}

/* eslint-disable no-unused-vars */
async function validatePassword() {
  if (passwordConfirmInput.value !== passwordInput.value) {
    alert.style.display = "block";
    alert.innerHTML = "Passwords Do not Match";
    // hide the alert after 3s
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(3000);
    alert.style.display = "none";
    alert.innerHTML = "";
  }
}
