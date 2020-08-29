/*
        see https://github.com/mdn/violent-theremin/blob/gh-pages/scripts/app.js
        https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Audio_data_whats_in_a_sample
        https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency
*/

const TONE_DURATION = 1.0; // Seconds for each 8-bit tone to be played
// const FREQUENCIES = [110, 220, 330, 440, 550, 660, 770, 880]; //Frequencies for each bit
//const FREQUENCIES = [210, 212, 214, 216, 218, 220, 222, 224]; //Frequencies for each bit
//const FREQUENCIES = [4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500]
// const FREQUENCIES = [4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000];
const FREQUENCIES = [4000, 4200, 4400, 4600, 4800, 5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400];
// const FREQUENCIES = [3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400, 4600, 4800, 5000, 5200, 5400];
const TONE_VOL = 0.2;

const FREQUENCY_COUNT = 13;

var audioCtx;

/*
        see https://github.com/mdn/violent-theremin/blob/gh-pages/scripts/app.js
        https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Audio_data_whats_in_a_sample
        https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency
*/

function init() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    var oscillators = [];
    var gainNodes = [];

    var merger = audioCtx.createChannelMerger(8);
    var num_output_channels = 10; // ?
    var splitter = audioCtx.createChannelSplitter(num_output_channels);

    merger.connect(splitter); // THIS MIGHT BE WHY IT BREAKS
    for (let i = 0; i < num_output_channels; i++) {
        splitter.connect(audioCtx.destination, i);
    }

    for (let i = 0; i < FREQUENCY_COUNT; i++) {
        oscillators[i] = audioCtx.createOscillator();
        gainNodes[i] = audioCtx.createGain();
        oscillators[i].connect(gainNodes[i]);
        gainNodes[i].connect(merger);

        oscillators[i].frequency.setValueAtTime(
            FREQUENCIES[i], // TODO: Update to desired frequencies
            audioCtx.currentTime
        );
        gainNodes[i].gain.setValueAtTime(0, audioCtx.currentTime); // INITIAL VOLUME

        oscillators[i].start();
    }
    return audioCtx, gainNodes;
}

function runTones(encodedArray, gainNodes) {
    console.log(encodedArray);
    var playStartTime = audioCtx.currentTime;
    for (let i = 0; i < encodedArray.length; i++) {
        let startTime = playStartTime + TONE_DURATION * i;
        for (let j = 0; j < FREQUENCY_COUNT; j++) {
            var freqStatus = encodedArray[i][j];
            if (freqStatus === "1") {
                gainNodes[j].gain.setValueAtTime(TONE_VOL, startTime);
            } else {
                gainNodes[j].gain.setValueAtTime(0, startTime); //TODO: change to desired volume level when activated
            }
        }
    }
    //Set all oscillators to 0 after playing full tone
    for (let k = 0; k < FREQUENCY_COUNT; k++) {
        gainNodes[k].gain.setValueAtTime(
            0,
            playStartTime + TONE_DURATION * encodedArray.length
        );
    }
}

function num_1s(n) {
    return n.toString(2).split('1').length-1;
}

function int_to_binary(n) {
    let num_valid_seen = 0;
    let i = 0;
    while (num_valid_seen <= n) {
        if (num_1s(i) === 3) {
            num_valid_seen++;
        }
        i++;
    }
    return (i-1).toString(2).padStart(FREQUENCY_COUNT, "0");
}


function encode(txt) {
    var encodedTxt = new TextEncoder("utf-8").encode(txt);
    var lenPayload = encodedTxt.length;
    // var lenPayloadBin = lenPayload.toString(2).padStart(FREQUENCY_COUNT, "0"); //TODO: Add another byte to support longer strings.
    var lenPayloadBin = int_to_binary(lenPayload);
    console.log(lenPayloadBin);
    var encodedArray = [
        int_to_binary(0),
        int_to_binary(1),
        // "100000000",
        // "010000000",
        // "001000000",
        // "000100000",
        // "000010000",
        // "000001000",
        // "000000100",
        // "000000010",
        // "000000001",
        lenPayloadBin,
    ];
    for (let i = 0; i < encodedTxt.length; i++) {
        // var binEnc = encodedTxt[i].toString(2).padStart(FREQUENCY_COUNT, "0");
        var binEnc = int_to_binary(encodedTxt[i]);
        encodedArray.push(binEnc);
    }
    return encodedArray;
}

export function play(stringToEncode) {
    var gainNodes = init();
    runTones(encode(stringToEncode), gainNodes);
}
