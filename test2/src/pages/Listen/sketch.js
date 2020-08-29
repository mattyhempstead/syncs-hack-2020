var audioContext;
var analyserNode;

const UNIT_TIME = 1000;
const UNIT_LENGTH = 60;
const HEADER_THRESHOLD = 0.66;
//const HEADER = [0b10101010, 0b01010101, 0b10101010, 0b01010101];
const HEADER = [0b10001000];

const FREQUENCY_BUCKETS = [4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500];
//const FREQUENCY_BUCKETS = [4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750];
const FREQUENCY_TOLERANCE = 15;
const INTENSITY_THRESHOLD = 150;

var bufferLength;
var dataArray;

let binWidth;
let timer = 0;
let framerate = 10;
let sampleRate;
let bandWidth;

let sample_buffer = [];
let sample_time_buffer = [];
let unit_buffer = [];
let buf_timelength = 0;
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

let passMsg = () => {};

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
        let first = {x: 0, y: 0}
        for (let i = 0; i < dlen + 10; i = i + 8) {
            let h =
                i < dlen / 2
                    ? dataArray[i] * 0.75
                    : dataArray[dlen + 10 - i] * 0.75;
            let theta = -Math.PI / 2 + (2 * i * Math.PI) / dlen;
            //     p.stroke(`rgba(86, 151, 95,${1 - i / dlen})`);
            // + Math.exp(-Math.sin(2 * Math.PI * t) ^ 2) * r * 0.1,
            //     let off = Math.cos((6 * Math.PI * i * t) / dlen) * r * 0.1;
            if (i === 0) first = {x: xc + (r + h * 0.75) * Math.cos(theta), y: yc + (r + h * 0.75) * Math.sin(theta)} 
            p.curveVertex(
                xc + (r + h * 0.75) * Math.cos(theta),
                yc + (r + h * 0.75) * Math.sin(theta)
            );
        }
        
        p.curveVertex(first.x, first.y);
        p.endShape(p.CLOSE);

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
            p.rect(
                i * binWidth,
                600 - dataArray[i] * 2,
                binWidth,
                dataArray[i] * 2
            );
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

    setInterval(recalculateFourier, Math.round(UNIT_TIME / UNIT_LENGTH));

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
            navigator.webkitCancelAnimationFrame ||
            navigator.mozCancelAnimationFrame;
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
    sample_time_buffer = [];
    state = 1;
    header_pos = 1;
};

const get_current_second = () => {
    return Math.floor(new Date()/1000);
}

//States:
//1 - no signal detected
//2 - reading length
//3 - reading raw data

let startSecond = new Date();
let frame_counter = 1;

const decode_message = n => {
    if (new Date() - startSecond >= frame_counter*1000) {
        let value = get_sample_buffer_value(sample_buffer);
        console.log(state, value, sample_buffer)

        if (state === 1) {
            let i = 0;
            let num_seen = 0;
            while (num_seen < 3 && i < sample_buffer.length) {
                if (sample_buffer[i] === 136) {
                    num_seen++;
                } else {
                    num_seen = 0;
                }
                i++;
            }
            i -= 3;
            if (num_seen === 3) {
                console.log("Detected header starting in index " + i);
                state = 4;
                //pastSecond.setMilliseconds(sample_time_buffer[i].getMilliseconds());
                startSecond = new Date();
                frame_counter = 0;
            }
        } else if (state === 4) {
            //Just discard it as it was past one
            state = 2;
        } else if (state === 2) {
            length = value;
            state = 3;
        } else if (state === 3) {
            unit_buffer.push(value);
            if (unit_buffer.length === length) {
                console.log("MESSAGE RECEIVED:");
                console.log("Length:");
                console.log(length);
                console.log("Payload:");
                console.log(unit_buffer);
                for (code of unit_buffer) {
                    console.log(String.fromCharCode(code));
                }
                state = 1;
                sample_buffer = [];
                unit_buffer = [];
            }
        }
        sample_buffer = [];
        sample_time_buffer = [];
        frame_counter++;
    }


    let milli = new Date() % 1000;
    if (state===1 || (300 < milli && milli < 900)) {
        sample_buffer.push(n);
        sample_time_buffer.push(new Date());
    }
}


/**
 * Returns the most common number in the buffer if it is above the THRESHOLD.
 * Returns -1 if nothing above THRESHOLD
 */
const get_sample_buffer_value = (buff) => {
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

    if (seen_values[current_max] >= HEADER_THRESHOLD*buff.length) {
        return current_max;
    } else {
        return -1;
    }
}

export default sketch;
