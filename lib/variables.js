
globalThis.lineHeightDecrement = 1.2;
globalThis.fontSizeDecrement = 0.5;
globalThis.minFontSize = 14.4; // Minimum font size in pixels

globalThis.totalPages = 604; // Total number of pages in the Quran
globalThis.currentPage = 0; // Inital Page


globalThis.hafsByPage = []; // Array That'll Contain Pages

const pagesContainer = document.getElementsByClassName('pages-container')[0];
const pages = document.getElementsByClassName('page');
const PagesContainer = document.getElementsByClassName('pages-container')[0];


const basmalah = document.createElement('span');
basmalah.className = 'basmalah ayah';
basmalah.innerText = "بِـــسۡـــمِ ٱللَّهِ ٱلرَّحۡمَٰــنِ ٱلرَّحِـــيــمِ\n";

const numbersDataPromise = fetch("../assets/quran/numbers.json").then((e) =>
  e.json()
);
async function genNumber(number, type = "numbers") {
  number = number.toString();
  const data = await numbersDataPromise;

  if (type == "numbers") {
    return number
      .split("")
      .map((digit) => data[type][digit])
      .join("");
  }

  return data[type][number];
}
