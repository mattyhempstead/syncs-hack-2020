const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyserNode = audioContext.createAnalyser();

analyserNode.fftSize = 4096 / 2;

const bufferLength = analyserNode.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

let timer = 0
let framerate = 60
// interval at which to log data (divide by frame rate to get seconds)
let timerInterval = 600
// intensity at which a frequency is considered relevant
let intensityThreshold = 150
let started = false

let screenWidth = 500
let binWidth = screenWidth / dataArray.length

function setup() {
  createCanvas(screenWidth, screenWidth);
  frameRate(600);
}


function draw() {
  if (!started) return
  timer++
  analyserNode.getByteFrequencyData(dataArray);
  background(220); 

  for(let i in dataArray) {
    if (dataArray[i] > intensityThreshold) {
      console.log(i)
    }
  }

  for (let i = 0; i < dataArray.length; i++) {
    rect(i * binWidth, 0, binWidth, dataArray[i])
  }

  if (timer % 600 === 0) {
    console.log(dataArray)
  }
}


const onStream = (stream) => {
    inputPoint = audioContext.createGain();
    // Create an AudioNode from the stream
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);
    inputPoint.connect(analyserNode);

    // start drawing
    started = true;
}

// all the stupid browser compatability stuff
//    this is the part i yoinked from somewhere online
const initAudio = () => {
        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.cancelAnimationFrame)
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        if (!navigator.requestAnimationFrame)
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, onStream, function(e) {
            alert('Couldn\'t connect to an audio device');
            console.log(e);
        });
}

window.addEventListener('load', initAudio );
