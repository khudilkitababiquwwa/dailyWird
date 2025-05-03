import updatePage from "./pages/updatePage.js";
// Fetch the JSON file and process it
fetch('https://github.com/khudilkitababiquwwa/dailyWird/tree/869bab3d6651664440ec5ecbd7e2b45bdede8284/assets/quran/hafsByPage.json', {mode:"same-origin"})
  .then(response => response.json())
  .then(async data => {
    globalThis.hafsByPage = data;

    // Initialize the first two pages
    updatePage(globalThis.currentPage, data);

  })
  .catch(error => console.error('Error fetching JSON:', error));
