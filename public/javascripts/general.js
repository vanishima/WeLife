const campus = document.querySelector("#moments");

function displayMoments(moments) {
  const colmd = document.createElement("div");
  colmd.className = "col-md";
  const card = document.createElement("div");
  card.className = "card";
  card.style = "width: 18rem";
  let cardBody = document.createElement("div");
  cardBody.className = "card-body";
  let cardTitle = document.createElement("h5");
  let cardText = document.createElement("p");
  let viewEntire = document.createElement("a");
  viewEntire.className = "btn stretched-link";
  viewEntire.id = "viewEntire";
  cardTitle.className = "card-title";
  cardText.className = "card-text see_less";
  cardTitle.innerHTML = moments.title;
  cardText.innerHTML = moments.content;
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(viewEntire);
  card.appendChild(cardBody);
  colmd.appendChild(card);
  campus.appendChild(colmd);
}

async function reloadMoments() {
  campus.innerHTML = "Loading Moments...";
  campus.innerHTML = "";
  const res = await fetch("/momentDB");
  if (!res.ok) {
    throw new Error("Response not ok " + res.status);
  }
  const moments = await res.json();
  console.log("Got data", moments);
  moments.files.forEach(displayMoments);
}

reloadMoments();
