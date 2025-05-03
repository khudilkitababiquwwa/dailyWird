import adjustFontSizeOnOverflow from "../styles/adjustFontSizeOnOverflow.js";
async function createPage(pageNumber, hafsByPage) {
    
    const pageData = hafsByPage[pageNumber];

    // Main Page Div
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';
    pageDiv.id = `page${pageNumber + 1}`;
    const pageHeader = document.createElement("div")
    pageHeader.className = "page-header"
    // Fancy Pantsy Border
    const borderImage = document.createElement('img');
    borderImage.className = 'border-image';
    borderImage.src = `./assets/pages/border.png`;
    borderImage.style.width = (parseInt(pageDiv.style.width) / 1.2) + 'px';
    borderImage.style.height = (parseInt(pageDiv.style.height) / 1.2) + 'px';


    // Ayahs Container (Parent of all Ayah spans)
    const ayahsContainer = document.createElement('div');
    ayahsContainer.className = 'ayahs-container';


    // Append Everything Gradually to The Hidden Pages Container
    pagesContainer.appendChild(pageDiv);


    // Append Page Elements to The Main Page Div
    pageDiv.appendChild(ayahsContainer);
    pageDiv.appendChild(borderImage);

    pageNumber = parseInt(pageNumber); // Ensure pageNumber is an integer

    const firstAyahOfPage = pageData[0];

    // Page Tooltip (Header)
    const pageTooltip = document.createElement('div');
    pageTooltip.className = 'page-tooltip';

    // Page Number Element
    const pageNum = document.createElement("span");
    const pageNumberElement = document.createElement('span');
    pageNumberElement.className = 'page-number';
    pageNum.innerText = await genNumber(pageNumber + 1);
    pageNum.classList.add('page-number-text');
    pageNumberElement.innerText = `الصفحة `;
    pageNumberElement.appendChild(pageNum);

    // Surah Name
    const surahTooltip = document.createElement('span');
    surahTooltip.className = 'surah-tooltip';
    if (firstAyahOfPage.aya_no >= 2) {
        surahTooltip.innerText = `سُوْرَةُ ${firstAyahOfPage.sura_name}`;
    }

    // Jozz Name
    const jozzTooltip = document.createElement('span');
    jozzTooltip.className = 'jozz-tooltip';
    jozzTooltip.innerText = `الجزء ${await genNumber(firstAyahOfPage.jozz - 1, "jozz")}`;

    pageData.forEach(ayah => {
        const ayahElement = document.createElement('span');
        ayahElement.className = 'ayah';
        ayahElement.innerText = ayah.aya_text + " ";
        ayahElement.id = ayah.sura_no.toString().padStart(3, '0') + ayah.aya_no.toString().padStart(3, '0'); // Format ID as "sura_no" + "ayah_no"
        if (ayah.aya_no <= 1) {
            const suraNameElement = document.createElement('div');
            suraNameElement.className = 'sura-name-element'
            
            const suraNameText = document.createElement('h2');
            suraNameText.className = 'sura-name';
            suraNameText.innerText = `سُوْرَةُ ${ayah.sura_name}`;

            suraNameElement.appendChild(document.createElement('hr'));
            suraNameElement.appendChild(suraNameText);
            suraNameElement.appendChild(document.createElement('hr'));
            ayahsContainer.append(suraNameElement)
            if (ayah.sura_no !== 1 && ayah.sura_no !== 9) {
                const basmalahClone = basmalah.cloneNode(true); // Clone the basmalah element
                basmalahClone.id = "bismillah" // `${ayah.sura_no.toString().padStart(3, '0') + "".padStart(3, '0')}`; // Give it a unique ID
                ayahsContainer.appendChild(basmalahClone); // Clone basmalah to avoid reusing the same element
            }
        }
        ayahsContainer.appendChild(ayahElement);
    });
    pageDiv.style.display = 'block'; // Show the current page
    adjustFontSizeOnOverflow(); // Call the function to adjust font size and line height

    // Append Page Tooltip Content to the Page Tooltip
    pageTooltip.appendChild(pageNumberElement);
    pageTooltip.appendChild(surahTooltip);
    pageTooltip.appendChild(jozzTooltip);
    pageHeader.appendChild(pageTooltip)
    pageHeader.appendChild(document.createElement('hr'))
    pageDiv.insertBefore(pageHeader, pageDiv.firstChild);
}
export default createPage;