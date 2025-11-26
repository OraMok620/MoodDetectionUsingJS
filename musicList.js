let uploadedMP3s = []; // store uploaded MP3

document.addEventListener("DOMContentLoaded", () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');

    // When button clicked, open file chooser
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // When mp3 selected, handle it
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        const fileArray = [...files];

        // Filter only MP3 files
        const mp3Files = fileArray.filter(file => file.type === "audio/mpeg");

        if (mp3Files.length === 0) {
            alert("Please select only mp3");
            return;
        }

        uploadedMP3s.push(...mp3Files);
        displayAudioList();

        // Reset input so same file can be uploaded again later if needed
        fileInput.value = "";
    });
});

const displayAudioList = () => {
    const audioList = document.getElementById('audioList');
    audioList.innerHTML = ''; // clear display before re-rendering

    uploadedMP3s.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        const label = document.createElement('span');
        label.textContent = `${index + 1}. ${file.name}`;

        const audio = document.createElement('audio');
        audio.src = URL.createObjectURL(file);

        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.classList.add('play-btn');

        playButton.addEventListener('click', () => {
            if (audio.paused) {
                document.querySelectorAll('audio').forEach(a => a.pause());
                audio.play();
                playButton.textContent = 'Pause';
            } else {
                audio.pause();
                playButton.textContent = 'Play';
            }
        });

        audio.addEventListener('ended', () => {
            playButton.textContent = 'Play';
        });

        fileItem.appendChild(label);
        fileItem.appendChild(playButton);
        audioList.appendChild(fileItem);
    });
};

