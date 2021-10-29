const dorms = document.querySelector("#moments");

const postsData = [
  {
    name: "Anni",
    title: "This is cool",
    content: "Happy to join the community~",
    image: "/images/logo.png",
    time: "2021\\9\\4",
  },
  {
    name: "Anni",
    title: "This is cool",
    content: "Happy to join the community~",
    image: "/images/logo.png",
    time: "2021\\9\\4",
  },
  {
    name: "Anni",
    title: "Just join!",
    content: "Greetings! This is Anni. Glad \
    to meet you all here.",
    image: "/images/logo.png",
    time: "2021\\10\\23",
  },
];

function displayPosts(posts) {
  for (let m of posts) {
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
    dorms.appendChild(colmd);
  }
}

async function reloadPosts() {
  dorms.innerHTML = "Loading Use's Posts...";
  dorms.innerHTML = "";
  let posts;
  try {
    // const res = await fetch("/myPosts");
    // if (!res.ok) {
    //   throw new Error("Response not ok " + res.status);
    // }
    // posts = await res.json();
    posts = postsData;
    console.log(posts);
  } catch (e) {
    dorms.innerHTML = e.msg;
  }
  displayPosts(posts);
}

reloadPosts();
