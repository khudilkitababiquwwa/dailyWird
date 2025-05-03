import updatePage from "./pages/updatePage.js";
// Fetch the JSON file and process it
fetch('./assets/quran/hafsByPage.json')
  .then(response => response.json())
  .then(async data => {
    globalThis.hafsByPage = data;

    // Initialize the first two pages
    updatePage(globalThis.currentPage, data);

  })
  .catch(error => console.error('Error fetching JSON:', error));
