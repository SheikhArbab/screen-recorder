let screenStream;
let mediaRecorder;
let recordedChunks = [];

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const recordedVideo = document.getElementById("recordedVideo");
const downloadButton = document.getElementById("downloadButton");

startButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

function startRecording() {
    const mediaOptions = {
        video: {
            mediaSource: "screen",
        },
        audio: false, // You can set this to true if you also want to record audio from the screen.
    };

    navigator.mediaDevices
        .getDisplayMedia(mediaOptions)
        .then(function (stream) {
            screenStream = stream;
            recordedChunks = [];
            mediaRecorder = new MediaRecorder(screenStream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: "video/webm" });
                recordedVideo.src = URL.createObjectURL(blob);

                downloadButton.href = recordedVideo.src;
                downloadButton.download = "recorded-screen-video.webm";
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
    screenStream.getTracks().forEach((track) => track.stop());

    startButton.disabled = false;
    stopButton.disabled = true;
}

// Reset download button visibility when starting a new recording
startButton.addEventListener("click", function () {
    downloadButton.style.display = "none";
});
