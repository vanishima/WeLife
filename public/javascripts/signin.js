const formSignIn = document.querySelector("#form-signIn");
const alert = document.querySelector(".alert");

/* eslint-disable no-unused-vars */
async function onFormSignInSubmit(event) {
  event.preventDefault();

  const formData = new FormData(formSignIn);

  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  let credentials;
  try {
    console.log("Checking database for credentials...");
    const res = await fetch("/userSignIn");
    if (!res.ok) {
      throw new Error("Response not ok " + res.status);
    }
    credentials = await res.json();
  } catch (e) {
    console.log("Error Receiving credentials from database ", e);
  }

  let hasUser = false;
  for (let c of credentials) {
    if (c.username === data.username) {
      console.log(c.username + " " + c.password);
      console.log(data.username + " " + data.password);
      hasUser = true;
      if (c.password !== data.password) {
        alert.style.display = "block";
        alert.innerHTML = "Wrong password, try again";
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        await delay(3000);
      } else {
        alert.style.display = "block";
        alert.innerHTML = "Log in successful! Redirecting to dorm";
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        await delay(3000);
        window.location.assign("../home.html");
      }
    }
  }

  if (hasUser === false) {
    alert.style.display = "block";
    alert.innerHTML = "User not found, sign up now";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(3000);
    window.location.assign("../signup.html");
  }

  // const resRaw = await fetch("/userSignIn", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // });

  // if (!resRaw.ok) {
  //   const res = await resRaw.json();
  //   // show alert to user
  //   if (res.signin === "user not found") {
  //     alert.style.display = "block";
  //     alert.innerHTML = "This username does not exist.";
  //   }
  //   if (res.signin === "wrong password") {
  //     alert.style.display = "block";
  //     alert.innerHTML = "Username and password does not match.";
  //   }

  //   // hide the alert after 3s
  //   const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  //   await delay(3000);
  //   alert.style.display = "none";
  //   alert.innerHTML = "";
  // } else {
  //   // redirect to user's home page
  //   window.location.assign("/home.html");
  // }
}
