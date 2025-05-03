import updatePage from "./updatePage.js";
const button = document.getElementById('goToPage');
const input = document.getElementById('goToPageInput');
const previousButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const reciterSelect = document.getElementById('reciterSelect');

fetch('https://github.com/khudilkitababiquwwa/dailyWird/tree/869bab3d6651664440ec5ecbd7e2b45bdede8284/assets/quran/recitations.json')
    .then(response => response.json())
    .then(data => {
        data.forEach((recitation, index) => {
            const option = document.createElement('option');
            option.value = recitation.subfolder;
            option.textContent = recitation.name;
            option.id = `reciter${index}`;
            reciterSelect.appendChild(option);
            reciterSelect.value = data[60].subfolder; // Set default value to the first recitation   
            globalThis.selectedNarrator = reciterSelect.value
        })
    })

function movePage(intensity) {    
    if (globalThis.currentPage + intensity < totalPages - 1 && globalThis.currentPage >= 0) {
        globalThis.currentPage += intensity; // Move forward by 2 pages
        updatePage(globalThis.currentPage, hafsByPage);
    }
}

async function goToPage(value) {    
    const pageNumber = parseInt(value, 10) -1;
    if (pageNumber >= 0 && pageNumber <= totalPages - 1 && input.value.length > 0) {
        globalThis.currentPage = pageNumber;
        
        updatePage(globalThis.currentPage, globalThis.hafsByPage);
    } else if (pageNumber < 0 || pageNumber > totalPages - 1 && input.value.length > 0) {
        alert('رقم الصفحة غير موجود! اختر رقمًا بين ' + await genNumber(1) + " و " + await genNumber(totalPages) + '.');
    }
}

nextButton.onclick = () => movePage(2);
previousButton.onclick = () => movePage(-2);
button.onclick = () => goToPage(document.getElementsByClassName('page-input')[0].value);
input.oninput = () => goToPage(document.getElementsByClassName('page-input')[0].value);
reciterSelect.addEventListener("change", function () {
    globalThis.selectedNarrator = this.value;
});
window.onkeydown = (event) => {
    if (event.keyCode == 37) movePage(2);
    if (event.keyCode == 39) movePage(-2);
};
export default goToPage;
