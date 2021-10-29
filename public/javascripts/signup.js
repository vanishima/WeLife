const formSignUp = document.querySelector("#form-register");
const passwordConfirmInput = document.querySelector("#passwordConfirmInput");
const passwordInput = document.querySelector("#passwordInput");
const alert = document.querySelector(".alert");

async function onFormSignUpSubmit(event) {
  event.preventDefault();
  console.log("Submitting data");

  const formData = new FormData(formSignUp);

  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const username = formData.get("username");
  const password = formData.get("password");

  const data = {
    firstname: firstname,
    lastname: lastname,
    username: username,
    password: password,
  };
  const resRaw = await fetch("/userSignUp", {
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
    window.location.assign("/general.html");
  }
}

function validatePassword() {
  if (passwordConfirmInput.value != passwordInput.value) {
    passwordConfirmInput.setCustomValidity("Passwords Do not Match");
  } else {
    passwordConfirmInput.setCustomValidity("");
  }
}
