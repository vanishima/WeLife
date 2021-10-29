const formMoment = document.querySelector("#form-moment");
const successMessage = document.querySelector("#success-message");

/* eslint-disable no-unused-vars */
async function onFormMomentSubmit(event) {
  event.preventDefault();

  const formData = new FormData(formMoment);

  const data = {
    title: "Happy Zoo",
    content: "I'm so happy to go to the Happy Zoo....",
    image: "../images/logo.png",
  };

  const resRaw = await fetch("/postMoment", {
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

  // successfully post data
  if (resRaw.ok) {
    // reset form content
    formMoment.reset();

    // show success message to users and delete the message after 3 seconds
    successMessage.innerHTML = "<p>Success!</p>";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(3000);
    successMessage.innerHTML = "";
  }
}
/* eslint-enable no-unused-vars */
