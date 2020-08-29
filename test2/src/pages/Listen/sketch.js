const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyserNode = audioContext.createAnalyser();

analyserNode.fftSize = 4096 / 2;

const bufferLength = analyserNode.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

let binWidth
let timer = 0;
let framerate = 60;
let sampleRate = audioContext.sampleRate;
// interval at which to log data (divide by frame rate to get seconds)
let timerInterval = 60;
// intensity at which a frequency is considered relevant
let intensityThreshold = 150;
let started = false;

let freqs = [];

let bandWidth = sampleRate / bufferLength;

for (let i = 0; i < bufferLength; i++) {
  freqs.push(i*bandWidth/2)
}

let frequencyBuckets = [110, 220, 330, 440, 550, 660, 770, 880];
let frequencyMap = {
  110: 1,
  220: 2,
  330: 4,
  440: 8,
  550: 16,
  660: 32,
  770: 64,
  880: 128
}

let frequencyTolerance = 15;

const decodeBits = () => {
  let frequencyHeard = [];

  for (let i in dataArray) {
    if (dataArray[i] > intensityThreshold) {
      frequencyHeard.push(freqs[i]);
    }
  }

  let bitArray = [];

  for (let i of frequencyHeard) {
    for (let j = 0; j < frequencyBuckets.length; j++) {
      if (bitArray.includes(frequencyBuckets[j])) continue;
      if (Math.abs(i - frequencyBuckets[j]) < frequencyTolerance) {
        bitArray.push(frequencyBuckets[j]);
      }
    }
  }

  let finalInt = 0;
  for (let i of bitArray) {
    finalInt += frequencyMap[i]
  }

  return finalInt;
}

const sketch = p => {
  let screenWidth = window.innerWidth;
  p.setup = () => {
    p.createCanvas(screenWidth, screenWidth * 2.5);
    p.frameRate(framerate);
    p.loop();

    binWidth = screenWidth / dataArray.length
  };

  let t = 0;

  p.draw = () => {
    t -= 0.01;
    p.background('rgb(154, 209, 223)');
    if (!started) return;
    timer++;
    analyserNode.getByteFrequencyData(dataArray);
    dataArray.map(i => i**2)

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
        p.lerpColor(c1, c2, Math.sin(2 * Math.PI * (t + i / dataArray.length))),
      );
      //   p.stroke(`rgba(86, 151, 95,${1 - i / dataArray.length})`);
      // + Math.exp(-Math.sin(2 * Math.PI * t) ^ 2) * r * 0.1,
      //   let off = Math.cos((6 * Math.PI * i * t) / dataArray.length) * r * 0.1;
      let off = 0;
      p.line(
        xc + r * Math.cos(theta) + off,
        yc + r * Math.sin(theta) + off,
        xc + (r + h) * Math.cos(theta) + off,
        yc + (r + h) * Math.sin(theta) + off,
      );
    }

    p.fill('rgba(86, 151, 95, 0)');
    p.stroke('rgba(0,0,0,0)');
    p.circle(xc, yc, 2 * r + 5);

    if (timer % timerInterval === 0) {
      let signal = decodeBits()
      console.log(signal)
      // uncomment to console log most prominent frequency
      // let index = dataArray.indexOf(Math.max(...dataArray))
      // console.log(freqs[index])
    }

    p.fill('black')

    for (let i = 0; i < dataArray.length; i++) {
      p.rect(i * binWidth, 600 - dataArray[i] * 2, binWidth, dataArray[i] * 2);
    }

  };

  const onStream = stream => {
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
            googEchoCancellation: 'false',
            googAutoGainControl: 'false',
            googNoiseSuppression: 'false',
            googHighpassFilter: 'false',
          },
          optional: [],
        },
      },
      onStream,
      function(e) {
        alert("Couldn't connect to an audio device");
        console.log(e);
      },
    );
  };

  initAudio();
};

export default sketch;
