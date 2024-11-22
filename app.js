// const searchFrom = document.querySelector("#search");
// const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#search-btn");
// const gameSelector = document.querySelector("#game-selector");
const container = document.querySelector("#container");
// const masterToggle = document.querySelector("#master-toggle");
// const masterContainer = document.querySelector("#master-container");
const categorySelector = document.querySelector("#category");
const itemInfo = document.querySelector("#item-info");
const header = document.querySelector("#header");

let searchText = "";
let searchInput = null;

// let masterText = "";

/* if (gameSelector.value === "totk") masterContainer.classList.add("invisible");

gameSelector.addEventListener("change", () => {
  masterContainer.classList.toggle("invisible");
  getdata("category", categorySelector.value);
}); */

searchBtn.addEventListener("click", () => {
  categorySelector.classList.toggle("invisible");
  if (searchInput) {
    searchInput.remove();
    searchInput = null;
    searchText = "";
    getdata(`category/${categorySelector.value}`);
  } else {
    searchInput = document.createElement("input");
    searchInput.type = "search";
    getdata("all");
    searchInput.addEventListener("input", () => {
      getdata("all");
      searchText = searchInput.value;
    });
    header.append(searchInput);
  }
});

// masterToggle.addEventListener("change", () => {
//   // masterText = masterToggle.checked ? "/master_mode" : "";
//   //master_mode/entry/
//   getdata("master_mode/all");
// });

// searchFrom.addEventListener("submit", (e) => {
//   e.preventDefault();
// });

categorySelector.addEventListener("change", () => {
  getdata(`category/${categorySelector.value}`);
});

const apiEndpoint = "https://botw-compendium.herokuapp.com/api/v3/compendium";

async function getdata(dataType) {
  try {
    const result = await fetch(`${apiEndpoint}/${dataType}`);
    const data = await result.json();

    if (Array.isArray(data.data)) {
      generateCategory(data.data);
    } else {
      generateSingle(data.data);
    }
  } catch (error) {
    console.error(error);
  }
}

getdata(`category/${categorySelector.value}`);

function generateCategory(data) {
  const filteredData = data.filter((item) => item.name.includes(searchText));
  while (container.firstChild) container.firstChild.remove();
  filteredData.forEach((item) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("list-item");

    itemContainer.addEventListener("click", () => getdata(`entry/${item.id}`));

    const itemImg = document.createElement("img");
    itemImg.src = item.image;

    const itemName = document.createElement("p");
    itemName.textContent = wordsToUpperCase(item.name);

    itemContainer.append(itemImg, itemName);
    container.append(itemContainer);
  });
}

function generateSingle(data) {
  while (itemInfo.firstChild) itemInfo.firstChild.remove();

  const itemImg = document.createElement("img");
  itemImg.src = data.image;

  const itemName = document.createElement("h2");
  itemName.textContent = wordsToUpperCase(data.name);

  const itemDesc = document.createElement("p");
  itemDesc.textContent = data.description;

  const itemLocations = document.createElement("ul");
  itemLocations.textContent = "Locations:";

  if (data.common_locations) {
    data.common_locations.forEach((loc) => {
      const location = document.createElement("li");
      location.textContent = loc;
      itemLocations.append(location);
    });
  } else {
    const location = document.createElement("li");
    location.textContent = "Unkown";
    itemLocations.append(location);
  }

  itemInfo.append(itemImg, itemName, itemDesc, itemLocations);

  if (data.drops) {
    const itemDrops = document.createElement("ul");
    itemDrops.textContent = "Drops:";
    data.drops.forEach((drop) => {
      const location = document.createElement("li");
      location.textContent = wordsToUpperCase(drop);
      itemDrops.append(location);
    });
    itemInfo.append(itemDrops);
  }

  if (data.properties) {
    if (data.properties.attack > 0) {
      const itemAttack = document.createElement("p");
      itemAttack.textContent = `Attack Damage: ${data.properties.attack}`;
      itemInfo.append(itemAttack);
    }
    if (data.properties.defense > 0) {
      const itemDefense = document.createElement("p");
      itemDefense.textContent = `Defense: ${data.properties.defense}`;
      itemInfo.append(itemDefense);
    }
  }

  if (data.hearts_recovered) {
    const heartsRecoveredLabel = document.createElement("p");
    heartsRecoveredLabel.textContent = "Hearts Recovered:";
    const heartsRecovered = document.createElement("p");
    heartsRecovered.textContent = data.hearts_recovered;
    itemInfo.append(heartsRecoveredLabel, heartsRecovered);
  }

  if (data.cooking_effect) {
    const cookingEffectLabel = document.createElement("p");
    cookingEffectLabel.textContent = "Cooking Effect:";
    const cookingEffect = document.createElement("p");
    cookingEffect.textContent = wordsToUpperCase(data.cooking_effect);
    itemInfo.append(cookingEffectLabel, cookingEffect);
  }

  itemInfo.showModal();
  document.body.addEventListener("click", closeModal);
  function closeModal() {
    document.body.removeEventListener("click", closeModal);
    itemInfo.close();
  }
}

function wordsToUpperCase(name) {
  const wordArray = name.split(" ");
  wordArray.forEach(
    (word, i) => (wordArray[i] = word[0].toUpperCase() + word.slice(1))
  );
  return wordArray.join(" ");
}
