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
  let screenWidth = window.innerWidth;
  //   let screenWidth = 250;
  //   let binWidth = screenWidth / dataArray.length;

  p.setup = () => {
    p.createCanvas(screenWidth, screenWidth * 2.5);
    p.frameRate(framerate);
    p.loop();
  };

  let t = 0;

  p.draw = () => {
    t -= 0.01;
    p.background("rgb(154, 209, 223)");
    if (!started) return;
    timer++;
    analyserNode.getByteFrequencyData(dataArray);

    for (let i in dataArray) {
      if (dataArray[i] > intensityThreshold) {
        // console.log(i);
      }
    }

    // for (let i = 0; i < dataArray.length; i++) {
    //   p.rect(i * binWidth, 300 - dataArray[i] * 2, binWidth, dataArray[i] * 2);
    // }

    p.strokeWeight(6);
    // let c1 = p.color(86, 151, 95);
    // let c2 = p.color(148, 69, 69);
    let c1 = p.color(0, 0, 0);
    let c2 = p.color(255, 255, 255);

    let xc = screenWidth / 2;
    let yc = 250;
    let r = screenWidth > 400 ? 64 : screenWidth / (2 * Math.PI);

    for (let i = 2; i < dataArray.length; i = i + 9) {
      let h = dataArray[i] * 0.75;
      let theta = -Math.PI / 2 + (2 * i * Math.PI) / dataArray.length;
      p.stroke(
        p.lerpColor(c1, c2, Math.sin(2 * Math.PI * (t + i / dataArray.length)))
      );
      //   p.stroke(`rgba(86, 151, 95,${1 - i / dataArray.length})`);
      // + Math.exp(-Math.sin(2 * Math.PI * t) ^ 2) * r * 0.1,
      //   let off = Math.cos((6 * Math.PI * i * t) / dataArray.length) * r * 0.1;
      let off = 0;
      p.line(
        xc + r * Math.cos(theta) + off,
        yc + r * Math.sin(theta) + off,
        xc + (r + h) * Math.cos(theta) + off,
        yc + (r + h) * Math.sin(theta) + off
      );
    }

    p.fill("rgba(86, 151, 95, 0)");
    p.stroke("rgba(0,0,0,0)");
    p.circle(xc, yc, 2 * r + 5);

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