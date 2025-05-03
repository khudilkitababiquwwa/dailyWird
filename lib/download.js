document.getElementById("scale").addEventListener("change", function () {
    globalThis.scale = parseInt(this.value);
});
// #region BUFFER TO WAVE
function bufferToWave(abuffer, len, extension = "mp3") {
    const numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [],
        sampleRate = abuffer.sampleRate;

    let offset = 0;

    function setUint16(data) {
        view.setUint16(offset, data, true);
        offset += 2;
    }

    function setUint32(data) {
        view.setUint32(offset, data, true);
        offset += 4;
    }

    // RIFF chunk descriptor
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // FMT sub-chunk
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // size of fmt chunk
    setUint16(1); // format = 1
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);

    // data sub-chunk
    setUint32(0x61746164); // "data"
    setUint32(length - offset - 4);

    // write interleaved data
    for (let i = 0; i < abuffer.length; i++) {
        for (let channel = 0; channel < numOfChan; channel++) {
            channels[channel] = abuffer.getChannelData(channel);
            const sample = Math.max(-1, Math.min(1, channels[channel][i]));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }
    }

    return new Blob([buffer], { type: "audio/" + extension });
}
//#endregion

//#region DOWNLOAD FUNCTIONS
async function downloadPng(scale) {
    const filename = `page-${globalThis.currentPage + 1}-${globalThis.currentPage + 2}`;

    try {
        const dataurl = await domtoimage.toPng(pagesContainer, {
            width: pagesContainer.style.width * scale,
            height: pagesContainer.style.height * scale,
            scale: scale,
            style: {
                border: 'none',
                margin: '0',
            }
        });

        const a = document.createElement('a');
        a.href = dataurl;
        a.style.display = 'none';
        a.classList.add('download-link');

        a.download = `${filename}.png`;
        a.click();
    } catch (error) {
        console.error('Error generating PNG:', error);
    }
}
async function downloadAudio(extension = "mp3") {
    const filename = `page-${globalThis.currentPage + 1}-${globalThis.currentPage + 2}`;
    const ayahs = document.getElementsByClassName("ayah");
    const audioFiles = [];
    for (ayahsIndex = 0; ayahsIndex < ayahs.length; ayahsIndex++) {
        const ayah = ayahs[ayahsIndex];
        if (ayah.classList.contains("basmalah")) {
            let audioFile = `https://everyayah.com/data/${globalThis.selectedNarrator}/002000.mp3`;
            audioFiles.push(audioFile);

        } else {
            const audioFile = `https://everyayah.com/data/${globalThis.selectedNarrator}/${ayah.id}.mp3`;
            audioFiles.push(audioFile);
        }
    }


    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffers = [];

    // Use Promise.all with indexed mapping to ensure order is preserved
    Promise.all(
        audioFiles.map((file, index) =>
            fetch(file)
                .then(response => response.arrayBuffer())
                .then(data => audioContext.decodeAudioData(data))
                .then(buffer => {
                    audioBuffers[index] = buffer; // Store buffer at the correct index
                })
        )
    )
        .then(() => {
            const totalLength = audioBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
            const outputBuffer = audioContext.createBuffer(
                1,
                totalLength,
                audioContext.sampleRate
            );

            let offset = 0;
            audioBuffers.forEach(buffer => {
                outputBuffer.getChannelData(0).set(buffer.getChannelData(0), offset);
                offset += buffer.length;
            });

            const offlineContext = new OfflineAudioContext(1, outputBuffer.length, audioContext.sampleRate);
            const source = offlineContext.createBufferSource();
            source.buffer = outputBuffer;
            source.connect(offlineContext.destination);
            source.start(0);
            offlineContext.startRendering().then(renderedBuffer => {
                const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length, extension);
                const url = URL.createObjectURL(wavBlob);
                const a = document.createElement('a');
                a.classList.add('download-link');
                a.href = url;
                a.download = `${filename}-${globalThis.selectedNarrator}.mp3`;
                a.click();
            });
        })
        .catch(error => console.error('Error processing audio files:', error));


}
//#endregion

function download() {
    downloadPng(globalThis.scale);
    downloadAudio();
}
