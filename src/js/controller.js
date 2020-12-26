// // import icons from '../img/icons.svg'; //Parcel 1 syntax
// import icons from 'url:../img/icons.svg'; //Parcel 2 syntax

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');


// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// // https://forkify-api.herokuapp.com/v2

// ///////////////////////////////////////

// const renderSpinner = function (parentEl) {
//   const markup = `
//     <div class="spinner">
//     <svg>
//       <use href="src/img/icons.svg#icon-loader"></use>
//     </svg>
//   </div>
//     `;
// parentEl.innerHTML ='';
//   parentEl.insertAdjacentHTML('afterbegin', markup);
// }


// const showRecipe = async function() {
//   try {
//     // Loading Recipe
// const id = window.location.hash.slice(1);
//     if(!id) return;
// console.log(id)
//     const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
//     // const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bca5d`);
// // console.log(await res.json())
//     const data = await res.json();
//     if(!res.ok) throw new Error(`${data.message} (${res.status})`)
//     console.log(res, data);

//     let {recipe} = data.data;
//     // console.log(recipe)
//     recipe = {
//       id: recipe.id,
//       title: recipe.title,
//       publisher: recipe.publisher,
//       sourceUrl: recipe.source_url,
//       image: recipe.image_url,
//       servings: recipe.servings,
//       cookingTime: recipe.cooking_time,
//       ingredients: recipe.ingredients
//     }
//     // console.log(recipe)


//     // Rendering recipe:: 
//     const markup = `
//     <figure class="recipe__fig">
//     <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
//     <h1 class="recipe__title">
//       <span>${recipe.title}</span>
//     </h1>
//   </figure>

//   <div class="recipe__details">
//     <div class="recipe__info">
//       <svg class="recipe__info-icon">
//         <use href="${icons}#icon-clock"></use>
//       </svg>
//       <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
//       <span class="recipe__info-text">minutes</span>
//     </div>
//     <div class="recipe__info">
//       <svg class="recipe__info-icon">
//         <use href="${icons}#icon-users"></use>
//       </svg>
//       <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
//       <span class="recipe__info-text">servings</span>

//       <div class="recipe__info-buttons">
//         <button class="btn--tiny btn--increase-servings">
//           <svg>
//             <use href="${icons}#icon-minus-circle"></use>
//           </svg>
//         </button>
//         <button class="btn--tiny btn--increase-servings">
//           <svg>
//             <use href="${icons}#icon-plus-circle"></use>
//           </svg>
//         </button>
//       </div>
//     </div>

//     <div class="recipe__user-generated">
//       <svg>
//         <use href="${icons}#icon-user"></use>
//       </svg>
//     </div>
//     <button class="btn--round">
//       <svg class="">
//         <use href="${icons}#icon-bookmark-fill"></use>
//       </svg>
//     </button>
//   </div>

//   <div class="recipe__ingredients">
//     <h2 class="heading--2">Recipe ingredients</h2>
//     <ul class="recipe__ingredient-list">
//     ${recipe.ingredients.map(ing => {
//       return `
//       <li class="recipe__ingredient">
//       <svg class="recipe__icon">
//         <use href="${icons}#icon-check"></use>
//       </svg>
//       <div class="recipe__quantity">${ing.quantity}</div>
//       <div class="recipe__description">
//         <span class="recipe__unit">${ing.unit}</span>
//         ${ing.description}
//       </div>
//     </li>
//       `;

//     }).join('')}
//   </div>

//   <div class="recipe__directions">
//     <h2 class="heading--2">How to cook it</h2>
//     <p class="recipe__directions-text">
//       This recipe was carefully designed and tested by
//       <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
//       directions at their website.
//     </p>
//     <a
//       class="btn--small recipe__btn"
//       href="${recipe.sourceUrl}"
//       target="_blank"
//     >
//       <span>Directions</span>
//       <svg class="search__icon">
//         <use href="${icons}#icon-arrow-right"></use>
//       </svg>
//     </a>
//   </div>
//     `;
//     recipeContainer.innerHTML = '';
//     recipeContainer.insertAdjacentHTML('afterbegin', markup);
//   } catch (error) {
//     alert(error);
//     // console.error(error);
//   }
// };

// showRecipe();

// // Listening for changed url hashChange &page load
// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe)) //Running a specific action on multiple events








import * as model from './model.js'
import {MODAL_CLOSE_SEC} from '../js/config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import {async} from 'regenerator-runtime/runtime';


// if(module.hot) {//Coming from Parcel
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipe = async function() {
  try {
    // Getting the id from the URL hash
    const id = window.location.hash.slice(1);
    if(!id) return;
  
    // Running the Loading gear
    await recipeView.renderSpinner(); //Creating a spinner gear before the data arrives

    // Updating the results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // Updating bookmarks
    bookmarksView.update(model.state.bookmarks)

    // Loading Recipe
    await model.loadRecipe(id);

    // Rendering recipe:: 
    recipeView.render(model.state.recipe);

  } catch (error) {
    recipeView.renderError()
    // alert(error);
    // console.error(error);
  }
};
// controlRecipe();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // Load search results
    await model.loadSearchResults(query)
    
    // Render results
    // console.log(model.getSearchResultsPage())
    resultsView.render(model.getSearchResultsPage());

    // Render the Initial pagination buttons
    paginationView.render(model.state.search)
  } catch (error) {
    throw error;
    // console.log(error);
  }
};

const controlPagination = function(goToPage) {
  // 1 Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2 Render New pagination buttons
  paginationView.render(model.state.search)
};

const controlServings = function(newServings){
  // Update the recipe servings in the state
  model.updateServings(newServings)

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function (){
  //  Add / Remove a bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks)
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try {
    // Show loading spinner
    addRecipeView.renderSpinner()

    // Upload the newRecipe data
    await model.uploadRecipe(newRecipe)

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message after successful upload
    addRecipeView.renderMessage();

    // render the bookmarksView
    bookmarksView.render(model.state.bookmarks)

    // Change the ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

  // close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC * 1000 )
  // console.log(model.state.recipe)
  } catch (error) {
    // console.error('🔥', error);
    addRecipeView.renderError(error.message)
  }
  
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe); 
};

init();
