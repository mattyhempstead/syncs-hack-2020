const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyserNode = audioContext.createAnalyser();

analyserNode.fftSize = 4096 / 2;

const bufferLength = analyserNode.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

let timer = 0;
let framerate = 600;
// interval at which to log data (divide by frame rate to get seconds)
let timerInterval = 600;
// intensity at which a frequency is considered relevant
let intensityThreshold = 150;
let started = false;

const sketch = (p) => {
  let screenWidth = 250;
  let binWidth = screenWidth / dataArray.length;

  p.setup = () => {
    p.createCanvas(screenWidth, screenWidth * 2.5);
    p.frameRate(framerate);
  };

  p.draw = () => {
    p.background("rgb(154, 209, 223)");
    if (!started) return;
    timer++;
    analyserNode.getByteFrequencyData(dataArray);

    for (let i in dataArray) {
      if (dataArray[i] > intensityThreshold) {
        // console.log(i);
      }
    }

    for (let i = 0; i < dataArray.length; i++) {
      p.rect(i * binWidth, 300 - dataArray[i] * 2, binWidth, dataArray[i] * 2);
    }

    if (timer % timerInterval === 0) {
      console.log(dataArray);
    }
  };

  const onStream = (stream) => {
    var inputPoint = audioContext.createGain();
    // Create an AudioNode from the stream
    var realAudioInput = audioContext.createMediaStreamSource(stream);
    var audioInput = realAudioInput;
    audioInput.connect(inputPoint);
    inputPoint.connect(analyserNode);

    // start drawing
    started = true;
  };

  // all the stupid browser compatability stuff
  //    this is the part i yoinked from somewhere online
  const initAudio = () => {
    if (!navigator.getUserMedia)
      navigator.getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
      navigator.cancelAnimationFrame =
        navigator.webkitCancelAnimationFrame ||
        navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
      navigator.requestAnimationFrame =
        navigator.webkitRequestAnimationFrame ||
        navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
      {
        audio: {
          mandatory: {
            googEchoCancellation: "false",
            googAutoGainControl: "false",
            googNoiseSuppression: "false",
            googHighpassFilter: "false",
          },
          optional: [],
        },
      },
      onStream,
      function (e) {
        alert("Couldn't connect to an audio device");
        console.log(e);
      }
    );
  };

  initAudio();
};

export default sketch;
