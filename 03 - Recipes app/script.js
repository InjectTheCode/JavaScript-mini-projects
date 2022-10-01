const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

getRandomMeal();
fetchFavMeal();

// get random meal on main container.
async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const data = await resp.json();
  const randomMeal = data.meals[0];

  addMeal(randomMeal, true);
}

// get meal with ID, we use this for get meal for localStorage.
async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const data = await resp.json();
  const mealData = data.meals[0];

  return mealData;
}

// get meal with search input.
async function getMealsBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const data = await resp.json();
  const searchMealData = data.meals;

  return searchMealData;
}

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
    <div class="meal-header">
            ${
              random
                ? `
            <span class="random"> Random Recipe </span>`
                : ""
            }
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn">
            <i class="fas fa-heart"></i>
        </button>
    </div>
  `;
  mealsEl.appendChild(meal);

  const heartBtn = meal.querySelector(".meal-body .fav-btn");

  heartBtn.addEventListener("click", function (e) {
    if (heartBtn.classList.contains("active")) {
      removeMealLS(mealData.idMeal);
      heartBtn.classList.remove("active");
      console.log(e.target);
    } else {
      addMealLS(mealData.idMeal);
      heartBtn.classList.add("active");
    }

    // we call it here, cause show my fav list dynamic, no need to reload.
    fetchFavMeal();
  });

  meal.addEventListener("click", () => {
    showMealInfo(mealData);
  });
}

// add to localStorage.
function addMealLS(mealId) {
  const mealIds = getMealLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

// remove from localStorage.
function removeMealLS(mealId) {
  const mealIds = getMealLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

// get object from localStorage.
function getMealLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

// get my favorite meals from localStorage
async function fetchFavMeal() {
  favoriteContainer.innerHTML = "";
  const mealIds = getMealLS();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);
    addMealFav(meal);
  }
}

// show favorite meals in header.
function addMealFav(mealData) {
  const favMeal = document.createElement("li");
  favMeal.innerHTML = `
    <img
        src="${mealData.strMealThumb}"
         alt="${mealData.strMeal}"
    />
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

  favMeal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  favoriteContainer.appendChild(favMeal);

  closeBtn = favMeal.querySelector(".clear");
  closeBtn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);
    fetchFavMeal();
  });
}

// search icon handler listening.
searchBtn.addEventListener("click", async () => {
  mealsEl.innerHTML = "";

  const searchValue = searchTerm.value;

  const searchedMeal = await getMealsBySearch(searchValue);

  searchedMeal.forEach((meal) => {
    addMeal(meal);
  });
});

// close pop-up function
popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});

// show meal info's modal
function showMealInfo(mealData) {
  // clean it up
  mealInfoEl.innerHTML = "";
  console.log(mealData);
  // update the Meal info
  const mealEl = document.createElement("div");

  const ingredients = [];

  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <p>
        ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
              .map(
                (ing) => `
            <li>${ing}</li>
            `
              )
              .join("")}
        </ul>
    `;

  mealInfoEl.appendChild(mealEl);

  // show the popup
  mealPopup.classList.remove("hidden");
}
