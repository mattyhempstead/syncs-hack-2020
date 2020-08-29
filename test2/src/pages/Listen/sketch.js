var audioContext;
var analyserNode;

const FREQUENCY_BUCKETS = [4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500];
const FREQUENCY_TOLERANCE = 15;
const INTENSITY_THRESHOLD = 150;


var bufferLength;
var dataArray;

let binWidth;
let timer = 0;
let framerate = 60;
let sampleRate = audioContext.sampleRate;
// interval at which to log data (divide by frame rate to get seconds)
let timerInterval = 60;
// intensity at which a frequency is considered relevant
let started = false;

let freqs = [];

let bandWidth = sampleRate / bufferLength;

for (let i = 0; i < bufferLength; i++) {
  freqs.push(i*bandWidth/2)
}


const decodeBits = () => {
  let frequencyHeard = [];

  for (let i in dataArray) {
    if (dataArray[i] > INTENSITY_THRESHOLD) {
      frequencyHeard.push(freqs[i]);
    }
  }

  let bitArray = [];

  for (let i of frequencyHeard) {
    for (let j = 0; j < FREQUENCY_BUCKETS.length; j++) {
      if (bitArray.includes(FREQUENCY_BUCKETS[j])) continue;
      if (Math.abs(i - FREQUENCY_BUCKETS[j]) < FREQUENCY_TOLERANCE) {
        bitArray.push(FREQUENCY_BUCKETS[j]);
      }
    }
  }

  let finalInt = 0;
  for (let i of bitArray) {
    finalInt += 2**FREQUENCY_BUCKETS.indexOf(i);
    //finalInt += frequencyMap[i]
  }

  return finalInt;
}

const sketch = p => {
  let screenWidth = window.innerWidth;
  p.setup = () => {
    p.createCanvas(screenWidth, screenWidth * 2.5);
    p.frameRate(framerate);
    p.loop();

    binWidth = screenWidth / dataArray.length;
  };

  let t = 0;

  p.draw = () => {
    t -= 0.01;
    p.background('rgb(154, 209, 223)');
    if (!started) return;
    timer++;
    analyserNode.getByteFrequencyData(dataArray);
    dataArray.map(i => i**2);

    console.log(decodeBits());
    //console.log('data', dataArray);
    //let index = dataArray.indexOf(Math.max(...dataArray));
    //console.log(freqs[index]);

    for (let i in dataArray) {
      if (dataArray[i] > INTENSITY_THRESHOLD) {
        // console.log(i);
      }
    }

    let dlen = dataArray.length;
    // for (let i = 0; i < dlen; i++) {
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

    for (let i = 2; i < dlen; i = i + 9) {
      let h = i < dlen / 2 ? dataArray[i] * 0.75 : dataArray[dlen - i] * 0.75;
      let theta = -Math.PI / 2 + (2 * i * Math.PI) / dlen;
      p.stroke(p.lerpColor(c1, c2, Math.sin(2 * Math.PI * (t + i / dlen))));
      //   p.stroke(`rgba(86, 151, 95,${1 - i / dlen})`);
      // + Math.exp(-Math.sin(2 * Math.PI * t) ^ 2) * r * 0.1,
      //   let off = Math.cos((6 * Math.PI * i * t) / dlen) * r * 0.1;
      let off = 0;
      p.line(
        xc + r * Math.cos(theta) + off,
        yc + r * Math.sin(theta) + off,
        xc + (r + h / 2) * Math.cos(theta) + off,
        yc + (r + h / 2) * Math.sin(theta) + off
      );
    }

    p.line(0, 150, screenWidth, 150);

    p.fill('rgba(86, 151, 95, 0)');
    p.stroke('rgba(0,0,0,0)');
    p.circle(xc, yc, 2 * r + 5);

  //  if (timer % timerInterval === 0) {
  //     let signal = decodeBits()
  //     console.log(signal)
  //     // uncomment to console log most prominent frequency
  //     ///let index = dataArray.indexOf(Math.max(...dataArray))
  //     // console.log(freqs[index])
  //   }

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
        optional: [],
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
