var audioContext;
var analyserNode;

const UNIT_TIME = 1000;
const UNIT_LENGTH = 60;
const HEADER_THRESHOLD = 38;
const RELAXED_THRESHOLD = 38;

// const FREQUENCY_BUCKETS = [4000, 4200, 4400, 4600, 4800, 5000, 5200, 5400];
const FREQUENCY_BUCKETS = [
  4000,
  4200,
  4400,
  4600,
  4800,
  5000,
  5200,
  5400,
  5600,
  5800,
  6000,
  6200,
  6400,
];
// const FREQUENCY_BUCKETS = [3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400, 4600, 4800, 5000, 5200, 5400];
const INTENSITY_THRESHOLD = 100;

const FREQUENCY_POS = [];

const HEADER = [0, 1];
let message_length = -1;

const SAMPLE_RATE = 16000;

var bufferLength;
var dataArray;

let binWidth;
let timer = 0;
let framerate = 10;
let sampleRate;
let bandWidth;

let sample_buffer = [];
let unit_buffer = [];
let state = 0;
let header_pos = 1;
let counter = 0;
let length = null;
let unit = null;
let code = null;
let seen_values = null;
let current_max = null;
let value = null;

// intensity at which a frequency is considered relevant
let started = false;

let freqs = [];

let passMsg = () => {};

const avgDataArray = (start, end) => {
  let avg = 0;
  for (let i = start; i <= end; i++) {
    avg += dataArray[i];
  }
  return avg / (end - start + 1);
};

const decodeBits = () => {
  let freqStrengths = [];
  for (let i = 0; i < FREQUENCY_BUCKETS.length; i++) {
    let nearAvg = avgDataArray(FREQUENCY_POS[i] - 5, FREQUENCY_POS[i] + 5);
    freqStrengths.push([i, nearAvg]);
  }
  freqStrengths.sort((a, b) => {
    return b[1] - a[1];
  });
  // console.log(freqStrengths[0][1], freqStrengths[1][1]);

  let finalInt = 0;
  for (let i = 0; i < 3; i++) {
    finalInt += 2 ** (FREQUENCY_BUCKETS.length - 1 - freqStrengths[i][0]);
  }

  finalInt = binary_to_int(finalInt);

  return finalInt;
};

function num_1s(n) {
  return n.toString(2).split("1").length - 1;
}

function binary_to_int(n) {
  let i = 0;
  let num_valid_seen = 0;
  while (i !== n) {
    if (num_1s(i) === 3) {
      num_valid_seen++;
    }
    i++;
  }
  return num_valid_seen;
}

const recalculateFourier = () => {
  analyserNode.getByteFrequencyData(dataArray);
  dataArray.map((i) => i ** 2);
  decode_message(decodeBits());
};

const sketch = (p) => {
  let screenWidth = window.innerWidth;
  let xc = screenWidth / 2;
  let yc = 250;
  let r = screenWidth > 400 ? 64 : screenWidth / (2 * Math.PI);

  p.setup = () => {
    p.createCanvas(screenWidth, screenWidth * 2.5);
    p.frameRate(framerate);
    p.loop();
  };

  p.mouseClicked = () => {
    if (((p.mouseX - xc) ** 2 + (p.mouseY - yc) ** 2 <= r ** 2) & !started) {
      initAudio();
    }
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    passMsg = props.updateFunction;
  };

  let t = 0;

  p.draw = () => {
    p.background("rgb(154, 209, 223)");
    if (!started) {
      p.fill("rgb(255, 255, 255)");
      p.circle(xc, yc, 2 * r);
      p.textSize(32);
      p.fill("rgb(0, 0, 0)");
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont("Amatic SC", 50);
      p.text("start", xc, yc);
      return;
    }
    let dlen = dataArray.length;
    t -= 0.01;
    timer++;

    //console.log(decodeBits());
    //console.log('data', dataArray);
    //let index = dataArray.indexOf(Math.max(...dataArray));
    //console.log(freqs[index]);

    for (let i in dataArray) {
      if (dataArray[i] > INTENSITY_THRESHOLD) {
        // console.log(i);
      }
    }

    // for (let i = 0; i < dlen; i++) {
    //     p.rect(i * binWidth, 300 - dataArray[i] * 2, binWidth, dataArray[i] * 2);
    // }

    p.strokeWeight(6);
    let c1 = p.color(86, 151, 95);
    let c2 = p.color(148, 69, 69);
    // let c1 = p.color(0, 0, 0);
    // let c2 = p.color(255, 255, 255);

    // for (let i = 2; i < dlen; i = i + 9) {
    //     let h = i < dlen / 2 ? dataArray[i] * 0.75 : dataArray[dlen - i] * 0.75;
    //     let theta = -Math.PI / 2 + (2 * i * Math.PI) / dlen;
    //     p.stroke(p.lerpColor(c1, c2, Math.sin(2 * Math.PI * (t + i / dlen))));
    //     //     p.stroke(`rgba(86, 151, 95,${1 - i / dlen})`);
    //     // + Math.exp(-Math.sin(2 * Math.PI * t) ^ 2) * r * 0.1,
    //     //     let off = Math.cos((6 * Math.PI * i * t) / dlen) * r * 0.1;
    //     let off = 0;
    //     p.line(
    //         xc + r * Math.cos(theta) + off,
    //         yc + r * Math.sin(theta) + off,
    //         xc + (r + h / 2) * Math.cos(theta) + off,
    //         yc + (r + h / 2) * Math.sin(theta) + off
    //     );
    // }

    p.stroke("rgb(0,0,0)");
    p.beginShape();
    // p.noFill();
    p.fill(p.lerpColor(c1, c2, Math.sin(Math.PI * t) ** 2));
    for (let i = 0; i <= dlen + 9; i = i + 8) {
      let h =
        i < dlen / 2 ? dataArray[i] * 0.75 : dataArray[dlen + 8 - i] * 0.75;
      let theta = -Math.PI / 2 + (2 * i * Math.PI) / dlen;
      //     p.stroke(`rgba(86, 151, 95,${1 - i / dlen})`);
      // + Math.exp(-Math.sin(2 * Math.PI * t) ^ 2) * r * 0.1,
      //     let off = Math.cos((6 * Math.PI * i * t) / dlen) * r * 0.1;
      p.curveVertex(
        xc + (r + h * 0.75) * Math.cos(theta),
        yc + (r + h * 0.75) * Math.sin(theta)
      );
    }
    p.endShape();

    p.fill("rgb(0, 0, 0)");
    // p.stroke("rgba(0,0,0)");
    p.circle(xc, yc, 2 * r);

    //    if (timer % timerInterval === 0) {
    //         let signal = decodeBits()
    //         console.log(signal)
    //         // uncomment to console log most prominent frequency
    //         ///let index = dataArray.indexOf(Math.max(...dataArray))
    //         // console.log(freqs[index])
    //     }
    binWidth = screenWidth / dataArray.length;
    for (let i = 0; i < dataArray.length; i++) {
      p.rect(i * binWidth, 600 - dataArray[i] * 2, binWidth, dataArray[i] * 2);
    }

    p.rect(0, 600 - 2 * INTENSITY_THRESHOLD, screenWidth, 1);
    // p.rect(0, 0, screenWidth, 1);
  };
};

var inputPoint;
var realAudioInput;
var audioInput;

const onStream = (stream) => {
  inputPoint = audioContext.createGain();
  // Create an AudioNode from the stream
  realAudioInput = audioContext.createMediaStreamSource(stream);
  audioInput = realAudioInput;
  audioInput.connect(inputPoint);
  inputPoint.connect(analyserNode);

  setInterval(recalculateFourier, Math.round(UNIT_TIME / UNIT_LENGTH));

  // start drawing
  started = true;
};

export const stopAudio = () => {
  // started = false;
};

export const initAudio = () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyserNode = audioContext.createAnalyser();

  analyserNode.fftSize = 4096 / 2;
  bufferLength = analyserNode.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // sampleRate = audioContext.sampleRate;
  // sampleRate = 16000;
  sampleRate = SAMPLE_RATE;
  bandWidth = sampleRate / bufferLength;

  for (let i = 0; i < bufferLength; i++) {
    freqs.push((i * bandWidth) / 2);
  }

  console.log(sampleRate, bufferLength);
  for (let i = 0; i < FREQUENCY_BUCKETS.length; i++) {
    FREQUENCY_POS.push(
      Math.round((FREQUENCY_BUCKETS[i] / (sampleRate / 2)) * bufferLength)
    );
  }
  console.log(FREQUENCY_POS);

  if (!navigator.getUserMedia)
    navigator.getUserMedia =
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  if (!navigator.cancelAnimationFrame)
    navigator.cancelAnimationFrame =
      navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
  if (!navigator.requestAnimationFrame)
    navigator.requestAnimationFrame =
      navigator.webkitRequestAnimationFrame ||
      navigator.mozRequestAnimationFrame;

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      onStream(stream);
    })
    .catch((err) => {
      alert(err);
      console.log(err);
    });
  //navigator.getUserMedia(
  //{
  //audio: {
  //mandatory: {
  //googEchoCancellation: "false",
  //googAutoGainControl: "false",
  //googNoiseSuppression: "false",
  //googHighpassFilter: "false",
  //},
  //optional: [],
  //},
  //optional: [],
  //},
  //
  //onStream,
  //function (e) {
  //alert("Couldn't connect to an audio device");
  //console.log(e);
  //}
  //);
};

const restart_state_machine = () => {
  sample_buffer = [];
  unit_buffer = [];
  state = 1;
  header_pos = 1;
};

const decode_message = (n) => {
  console.log(String.fromCharCode(n), n);

  // Add to buffer until its full
  sample_buffer.push(n);
  if (sample_buffer.length > UNIT_LENGTH) sample_buffer.shift();

  unit = get_sample_buffer_value(sample_buffer);
  if (unit == -1) return;
  sample_buffer = [];

  if (state < HEADER.length) {
    if (unit == HEADER[state]) {
      console.log("Found header no.", state);
      state++;
    } else {
      state = 0;
    }
  } else if (state == HEADER.length) {
    // get length
    message_length = unit;
    state++;
    console.log("Found length of ", unit);
  } else if (state <= HEADER.length + message_length) {
    console.log("Found char", unit, String.fromCharCode(unit));
    state++;
  } else {
    console.log("DONE");
  }
};

/**
 * Returns the most common number in the buffer if it is above the THRESHOLD.
 * Returns -1 if nothing above THRESHOLD
 */
const get_sample_buffer_value = (buff, relaxed_thresh) => {
  seen_values = {};
  current_max = null;
  for (value of buff) {
    if (value in seen_values) {
      seen_values[value] += 1;
      if (current_max == null) {
        current_max = value;
      } else {
        if (seen_values[value] > seen_values[current_max]) {
          current_max = value;
        }
      }
    } else {
      seen_values[value] = 1;
    }
  }

  if (
    seen_values[current_max] >=
    (relaxed_thresh ? RELAXED_THRESHOLD : HEADER_THRESHOLD)
  ) {
    return current_max;
  } else {
    return -1;
  }
};

export default sketch;
