const campus = document.querySelector("#moments");
// const pop = document.querySelector("#popup");

function displayMoments(moments) {
  for (let m of moments) {
    const colmd = document.createElement("div");
    colmd.className = "col-md";
    const card = document.createElement("div");
    card.className = "card";
    card.style = "width: 18rem";
    let img = document.createElement("img");
    img.className = "card-img-top";
    img.src = m.image;
    img.alt = "user image";
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    let cardTitle = document.createElement("h5");
    let cardText = document.createElement("p");
    let viewEntire = document.createElement("a");
    viewEntire.className = "btn stretched-link";
    viewEntire.id = "viewEntire";
    cardTitle.className = "card-title";
    cardText.className = "card-text see_less";
    cardTitle.innerHTML = m.title;
    cardText.innerHTML = m.content;
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(viewEntire);
    card.appendChild(img);
    card.appendChild(cardBody);
    colmd.appendChild(card);
    campus.appendChild(colmd);
  }
}

async function reloadMoments() {
  campus.innerHTML = "Loading Moments...";
  campus.innerHTML = "";
  let moments;
  try {
    const res = await fetch("/momentDB");
    if (!res.ok) {
      throw new Error("Response not ok " + res.status);
    }
    moments = await res.json();
  } catch (e) {
    campus.innerHTML = e.msg;
  }
  displayMoments(moments);
}

reloadMoments();
