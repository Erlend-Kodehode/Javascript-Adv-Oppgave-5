// const searchFrom = document.querySelector("#search");
const searchInput = document.querySelector("#search");
// const gameSelector = document.querySelector("#game-selector");
const container = document.querySelector("#container");
const masterToggle = document.querySelector("#master-toggle");
const masterContainer = document.querySelector("#master-container");
const categorySelector = document.querySelector("#category");

let masterText = "";

/* if (gameSelector.value === "totk") masterContainer.classList.add("invisible");

gameSelector.addEventListener("change", () => {
  masterContainer.classList.toggle("invisible");
  getdata("category", categorySelector.value);
}); */

searchInput.addEventListener("input", () =>
  getdata("category", categorySelector.value)
);

masterToggle.addEventListener("change", () => {
  masterText = masterToggle.checked ? "/master_mode" : "";
  //master_mode/entry/
});

// searchFrom.addEventListener("submit", (e) => {
//   e.preventDefault();
// });

categorySelector.addEventListener("change", (e) => {
  getdata("category", categorySelector.value);
});

const apiEndpoint = "https://botw-compendium.herokuapp.com/api/v3/compendium";

async function getdata(dataType, id) {
  try {
    const result = await fetch(`${apiEndpoint}/${dataType}/${id}`);
    const data = await result.json();
    if (dataType === "category") generateCategory(data);
  } catch (error) {
    console.error(error);
  }
}

getdata("category", categorySelector.value);

function generateCategory(data) {
  const filteredData = data.data.filter((item) =>
    item.name.includes(searchInput.value)
  );
  while (container.firstChild) container.firstChild.remove();
  filteredData.forEach((item) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("list-item");

    itemContainer.addEventListener("click", () => {
      console.log(item);
    });

    const itemImg = document.createElement("img");
    itemImg.src = item.image;

    const itemName = document.createElement("p");
    const wordArray = item.name.split(" ");
    wordArray.forEach(
      (word, i) => (wordArray[i] = word[0].toUpperCase() + word.slice(1))
    );
    itemName.textContent = wordArray.join(" ");

    itemContainer.append(itemImg, itemName);
    container.append(itemContainer);
  });
}

function generateSingle(data) {}
