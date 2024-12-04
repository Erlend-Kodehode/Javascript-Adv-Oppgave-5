const searchBtn = document.querySelector("#search-btn");
const container = document.querySelector("#container");
const categorySelector = document.querySelector("#category");
const itemInfo = document.querySelector("#item-info");
const ui = document.querySelector("#ui");
const itemtxtConatiner = document.querySelector("#txt-container");
const itemImg = document.querySelector("#item-img");
const searchImg = document.querySelector("#search-img");

const apiEndpoint = "https://botw-compendium.herokuapp.com/api/v3/compendium";

let searchText = "";
let searchInput = null;

//loads data on pageload
getdata(categorySelector.value);

searchBtn.addEventListener("click", () => {
  //changes the styling on the button
  searchBtn.classList.toggle("close");
  //if the search bar already exist removes it
  if (searchInput) {
    searchInput.remove();
    searchInput = null;
    searchText = "";
    //changes icon on search button
    searchImg.src = "Images/magnifying-glass.svg";
    getdata(categorySelector.value);
  } else {
    //changes icon on search button
    searchImg.src = "Images/cross.svg";
    //creates the search bar if it doesnt exist
    searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.id = "search-input";

    //refreshes the list after every input
    searchInput.addEventListener("input", () => {
      searchText = searchInput.value;
      getdata(categorySelector.value);
    });
    ui.prepend(searchInput);
    searchInput.focus();
  }
});

//refreshes list when the category selector changes
categorySelector.addEventListener("change", () =>
  getdata(categorySelector.value)
);

//function for fetching data
async function getdata(dataType) {
  try {
    const result = await fetch(`${apiEndpoint}/${dataType}`);
    const data = await result.json();

    if (Array.isArray(data.data)) {
      //refreshes the list if it recieves and array
      generateCategory(data.data);
    } else {
      //creates a modal when it recieves data for a single entry
      generateSingle(data.data);
    }
  } catch (error) {
    console.error(error);
  }
}

function generateCategory(data) {
  //filters the list when searching
  const filteredData = data.filter((item) => item.name.includes(searchText));
  //empties the list
  while (container.firstChild) container.firstChild.remove();
  //goes through the recieved array
  filteredData.forEach((item) => {
    //creates the entries
    const itemContainer = document.createElement("div");
    //classes for styling
    itemContainer.classList.add("list-item");
    itemContainer.classList.add("flex");

    //fetches and displays it's own data when clicked
    itemContainer.addEventListener("click", () => getdata(`entry/${item.id}`));

    //creates this entry's image
    const itemImg = document.createElement("img");
    itemImg.src = item.image;

    //creates the entry's name
    const itemName = document.createElement("p");
    itemName.textContent = wordsToUpperCase(item.name);

    //appending
    itemContainer.append(itemImg, itemName);
    container.append(itemContainer);
  });
}

function generateSingle(data) {
  //removes previous text
  while (itemtxtConatiner.firstChild) itemtxtConatiner.firstChild.remove();

  //updates the image source
  itemImg.src = data.image;

  //creates the entry's title
  const itemName = document.createElement("h2");
  itemName.textContent = wordsToUpperCase(data.name);

  //creates description
  const itemDesc = document.createElement("p");
  itemDesc.textContent = data.description;

  //creates locations list
  const itemLocations = document.createElement("ul");
  itemLocations.textContent = "Locations:";

  //if there are common locations puts them under the locations list
  if (data.common_locations) {
    data.common_locations.forEach((loc) => {
      const location = document.createElement("li");
      location.textContent = loc;
      itemLocations.append(location);
    });
  } else {
    //if there are no common locations sets the location as "Unkown"
    const location = document.createElement("li");
    location.textContent = "Unkown";
    itemLocations.append(location);
  }

  //appending
  itemtxtConatiner.append(itemName, itemDesc, itemLocations);

  //creates a list of items dropped by the entry if there is data for it
  if (data.drops) {
    const itemDrops = document.createElement("ul");
    itemDrops.textContent = "Drops:";
    data.drops.forEach((drop) => {
      const location = document.createElement("li");
      location.textContent = wordsToUpperCase(drop);
      itemDrops.append(location);
    });
    itemtxtConatiner.append(itemDrops);
  }

  //creates attack and defense stats if there is data for it
  if (data.properties) {
    if (data.properties.attack > 0) {
      const itemAttack = document.createElement("p");
      itemAttack.textContent = `Attack Power: ${data.properties.attack}`;
      itemtxtConatiner.append(itemAttack);
    }
    if (data.properties.defense > 0) {
      const itemDefense = document.createElement("p");
      itemDefense.textContent = `Defense: ${data.properties.defense}`;
      itemtxtConatiner.append(itemDefense);
    }
  }

  //creates a paragraph to show the amount of hearts the entry recovers if there is data for it
  if (data.hearts_recovered) {
    const heartsRecovered = document.createElement("p");
    heartsRecovered.textContent = `Hearts Recovered: ${data.hearts_recovered}`;
    itemtxtConatiner.append(heartsRecovered);
  }

  //creates a paragraph to show the cooking effect of the entry if there is data for it
  if (data.cooking_effect) {
    const cookingEffect = document.createElement("p");
    cookingEffect.textContent = `Cooking Effect: ${wordsToUpperCase(
      data.cooking_effect
    )}`;
    itemtxtConatiner.append(cookingEffect);
  }

  //displays the modal
  itemInfo.showModal();

  //creates an eventlistener on the body
  document.body.addEventListener("click", closeModal);
  function closeModal() {
    //removes the eventlistener and closes the modal
    document.body.removeEventListener("click", closeModal);
    itemInfo.close();
  }
}

//a function that when given a sentence returns said sentence with the first letter of each word in uppercase
function wordsToUpperCase(sentence) {
  //makes the received string into an array
  const wordArray = sentence.split(" ");
  //goes through each word and makes the first letter capatilized
  wordArray.forEach(
    (word, i) => (wordArray[i] = word[0].toUpperCase() + word.slice(1))
  );
  //returns the array as a single string
  return wordArray.join(" ");
}
