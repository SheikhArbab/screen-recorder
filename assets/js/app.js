let screenStream;
let audioStream;
let mediaRecorder;
let recordedChunks = [];

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const recordedVideo = document.getElementById("recordedVideo");
const downloadButton = document.getElementById("downloadButton");

startButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

const mediaOptions = {
    video: {
        cursor: "always",
        displaySurface: "browser",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
    },
    audio: true,
};

function startRecording() {
    navigator.mediaDevices.getDisplayMedia(mediaOptions)
        .then(function (stream) {
            screenStream = stream;
            return navigator.mediaDevices.getUserMedia({ audio: true });
        })
        .then(function (stream) {
            audioStream = stream;
            const combinedStream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);

            recordedChunks = [];
            mediaRecorder = new MediaRecorder(combinedStream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: "video/mp4" });
                recordedVideo.src = URL.createObjectURL(blob);

                downloadButton.href = recordedVideo.src;
                downloadButton.download = "recorded-video.webm";
                downloadButton.style.display = "flex";
            };

            startButton.disabled = true;
            stopButton.disabled = false;

            mediaRecorder.start();
        })
        .catch(function (error) {
            console.error("Error starting recording:", error);
        });
}

function stopRecording() {
    mediaRecorder.stop();
    screenStream.getTracks().forEach(track => track.stop());
    audioStream.getTracks().forEach(track => track.stop());

    startButton.disabled = false;
    stopButton.disabled = true;
}

// Reset download button visibility when starting a new recording
startButton.addEventListener("click", function () {
    downloadButton.style.display = "none";
});
