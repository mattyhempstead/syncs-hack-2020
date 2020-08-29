var audioContext;
var analyserNode;

const UNIT_LENGTH = 60;
const HEADER_THRESHOLD = 40;
const RELAXED_THRESHOLD = 40;
const HEADER = [0b10101010, 0b01010101, 0b10101010, 0b01010101];

const FREQUENCY_BUCKETS = [4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500];
const FREQUENCY_TOLERANCE = 15;
const INTENSITY_THRESHOLD = 150;

var bufferLength;
var dataArray;

let binWidth;
let timer = 0;
let framerate = 60;
let sampleRate;
let bandWidth;

let sample_buffer = [];
let unit_buffer = [];
let state = 1;
let header_pos = 1;
let counter = 0;
let length = null;
let unit = null;
let code = null;
let seen_values = null;
let current_max = null;
let value = null;

// interval at which to log data (divide by frame rate to get seconds)
let timerInterval = 60;
// intensity at which a frequency is considered relevant
let started = false;

let freqs = [];

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
    finalInt += 2 ** (7 - FREQUENCY_BUCKETS.indexOf(i));
    //finalInt += frequencyMap[i]
  }

  return finalInt;
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
    if ((p.mouseX - xc) ** 2 + (p.mouseY - yc) ** 2 <= r ** 2) {
      initAudio();
    }
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
    analyserNode.getByteFrequencyData(dataArray);
    dataArray.map((i) => i ** 2);
    decode_message(decodeBits())
    
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
    //   p.rect(i * binWidth, 300 - dataArray[i] * 2, binWidth, dataArray[i] * 2);
    // }

    p.strokeWeight(6);
    let c1 = p.color(86, 151, 95);
    let c2 = p.color(148, 69, 69);
    // let c1 = p.color(0, 0, 0);
    // let c2 = p.color(255, 255, 255);

    // for (let i = 2; i < dlen; i = i + 9) {
    //   let h = i < dlen / 2 ? dataArray[i] * 0.75 : dataArray[dlen - i] * 0.75;
    //   let theta = -Math.PI / 2 + (2 * i * Math.PI) / dlen;
    //   p.stroke(p.lerpColor(c1, c2, Math.sin(2 * Math.PI * (t + i / dlen))));
    //   //   p.stroke(`rgba(86, 151, 95,${1 - i / dlen})`);
    //   // + Math.exp(-Math.sin(2 * Math.PI * t) ^ 2) * r * 0.1,
    //   //   let off = Math.cos((6 * Math.PI * i * t) / dlen) * r * 0.1;
    //   let off = 0;
    //   p.line(
    //     xc + r * Math.cos(theta) + off,
    //     yc + r * Math.sin(theta) + off,
    //     xc + (r + h / 2) * Math.cos(theta) + off,
    //     yc + (r + h / 2) * Math.sin(theta) + off
    //   );
    // }

    p.stroke("rgb(0,0,0)");
    p.beginShape();
    // p.noFill();
    p.fill(p.lerpColor(c1, c2, Math.sin(Math.PI * t) ** 2));
    for (let i = 0; i < dlen + 10; i = i + 8) {
      let h =
        i < dlen / 2 ? dataArray[i] * 0.75 : dataArray[dlen + 10 - i] * 0.75;
      let theta = -Math.PI / 2 + (2 * i * Math.PI) / dlen;
      //   p.stroke(`rgba(86, 151, 95,${1 - i / dlen})`);
      // + Math.exp(-Math.sin(2 * Math.PI * t) ^ 2) * r * 0.1,
      //   let off = Math.cos((6 * Math.PI * i * t) / dlen) * r * 0.1;
      p.curveVertex(
        xc + (r + h * 0.75) * Math.cos(theta),
        yc + (r + h * 0.75) * Math.sin(theta)
      );
    }
    p.endShape();

    p.fill("rgb(0, 0, 0)");
    // p.stroke("rgba(0,0,0)");
    p.circle(xc, yc, 2 * r);

    //  if (timer % timerInterval === 0) {
    //     let signal = decodeBits()
    //     console.log(signal)
    //     // uncomment to console log most prominent frequency
    //     ///let index = dataArray.indexOf(Math.max(...dataArray))
    //     // console.log(freqs[index])
    //   }
    binWidth = screenWidth / dataArray.length;
    for (let i = 0; i < dataArray.length; i++) {
      p.rect(i * binWidth, 600 - dataArray[i] * 2, binWidth, dataArray[i] * 2);
    }
  };
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

export const initAudio = () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyserNode = audioContext.createAnalyser();

  analyserNode.fftSize = 4096 / 2;
  bufferLength = analyserNode.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  sampleRate = audioContext.sampleRate;
  bandWidth = sampleRate / bufferLength;

  for (let i = 0; i < bufferLength; i++) {
    freqs.push((i * bandWidth) / 2);
  }

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

  navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(stream => {
    onStream(stream)
  }).catch(err => {alert(err)})
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
}

//States:
//1 : Fill up buffer, search if value is first header if full
//2 : gobble any more first header values you see
//3 : in header-reading mode: read a unit, see if is next header-value (and repeat till done). If fail, go to 2
//4 : read message length
//5 : read message payload

const decode_message = n => {
  // Add to buffer until its full
  sample_buffer.push(n);
  if (sample_buffer.length > UNIT_LENGTH) sample_buffer.shift();
  console.log(state, sample_buffer.join());

  if (state === 1) {
    if (sample_buffer.length === UNIT_LENGTH) {
      unit = get_sample_buffer_value(sample_buffer);
      if (unit === HEADER[0]) {
        state = 2;
        counter = 0;
      }
    }
  } else if (state === 2) {
    if (n !== HEADER[0]) {
      state = 3;
      header_pos = 1;
      sample_buffer = [];
    }
    if (counter === (UNIT_LENGTH - HEADER_THRESHOLD)/2) {
        state = 3;
    }
  } else if (state === 3) {
    if (sample_buffer.length === UNIT_LENGTH) {
      unit = get_sample_buffer_value(sample_buffer);
      if (unit === HEADER[header_pos]) {
        header_pos++;
        if (header_pos === HEADER.length) {
          counter = 0;
          state = 4;
        }
        sample_buffer = [];
      } else {
          state = 1;
      }
    }
  } else if (state === 4) {
    if (sample_buffer.length === UNIT_LENGTH) {
        length = get_sample_buffer_value(sample_buffer, true);
        state = 5;
        counter = 0;
        sample_buffer = [];
     }
  } else if (state === 5) {
    if (sample_buffer.length === UNIT_LENGTH) {
        unit_buffer.push(get_sample_buffer_value(sample_buffer, true));
        sample_buffer = [];
        counter++;
        if (counter === length) {
            console.log("MESSAGE RECEIVED:");
            console.log("Length:");
            console.log(length);
            console.log("Payload:");
            console.log(unit_buffer);
            for (code of unit_buffer) {
                console.log(String.fromCharCode(code));
            }
            restart_state_machine();
        }
    }
  }

 /* if (sample_buffer.length == UNIT_LENGTH) {
    unit = get_sample_buffer_value(sample_buffer);
    
    if (unit !== -1) {
      found_header = true;

      unit_buffer.push(unit);
      console.log("Got unit", unit);

      // Clear buffer once we find a unit
      sample_buffer = [];
    } else {
      if (found_header) throw new Error("wow idk was kinda expecting a value but ok");
    }
  }*/
}



/**
 * Returns the most common number in the buffer if it is above the THRESHOLD.
 * Returns -1 if nothing above THRESHOLD
 */
const get_sample_buffer_value = (buff, relaxed_thresh) => {
  seen_values = {}
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
      seen_values[value] = 1
    }
  }
  
  if (seen_values[current_max] >= (relaxed_thresh ? RELAXED_THRESHOLD : HEADER_THRESHOLD)) {
    return current_max;
  } else {
    return -1;
  }
  
}

export default sketch;


