import createPage from "./createPage.js";
function updatePage(pageNumber, hafsByPage) {

    // Ensure the page number is within valid bounds
    if (pageNumber < 0) pageNumber = 0;
    if (pageNumber > totalPages) pageNumber = totalPages;


    while (pagesContainer.firstChild) {
        pagesContainer.removeChild(pagesContainer.firstChild);
    }

    // Show the current page and the next page
    createPage(pageNumber, hafsByPage);
    if (pageNumber + 1 < totalPages)
        // Create the next page if it exists
        createPage(pageNumber + 1, hafsByPage);

    // Update the global current page variable
    globalThis.currentPage = pageNumber;

}
export default updatePage;