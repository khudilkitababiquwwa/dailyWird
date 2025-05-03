function adjustFontSizeOnOverflow() {
  const containers = document.querySelectorAll('.ayahs-container');
  containers.forEach(container => {
    const ayahs = container.querySelectorAll('.ayah');
    let fontSize = parseFloat(window.getComputedStyle(container).fontSize);
    let lineHeight = parseFloat(window.getComputedStyle(container).lineHeight);

    // Reduce font size and line height until overflow is resolved
    while (container.scrollHeight > container.clientHeight || container.scrollWidth > container.clientWidth) {
      lineHeight -= globalThis.lineHeightDecrement; // Decrease line height
      fontSize -= globalThis.fontSizeDecrement; // Decrease font size
      ayahs.forEach(ayah => {
        ayah.style.fontSize = `${fontSize}px`;
        ayah.style.lineHeight = `${lineHeight}px`;
      });

      // Break if font size becomes too small
      if (fontSize <= globalThis.minFontSize) break;
    }
  });
}
export default adjustFontSizeOnOverflow;