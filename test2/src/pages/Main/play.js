/*
    see https://github.com/mdn/violent-theremin/blob/gh-pages/scripts/app.js
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Audio_data_whats_in_a_sample
    https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency
*/
var audioCtx;
var oscillator;
var gainNode;
var isPlaying = true;


function iniT() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();


    document.getElementById("vol").value = 1;
    document.getElementById("freq").value = 200;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.setValueAtTime(document.getElementById("freq").value, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(document.getElementById("vol").value/1000, audioCtx.currentTime);
    oscillator.start();

    document.getElementById("freq").oninput = function() {
        document.getElementById("freq-display").innerHTML = this.value;
        oscillator.frequency.setValueAtTime(document.getElementById("freq").value, audioCtx.currentTime);
    }

    document.getElementById("vol").oninput = function() {
        document.getElementById("vol-display").innerHTML = this.value;
        gainNode.gain.setValueAtTime(document.getElementById("vol").value/1000, audioCtx.currentTime);
    }
}


function freQ_halF() {
    oscillator.frequency.setValueAtTime(document.getElementById("freq").value/2, audioCtx.currentTime + 0.5);
    oscillator.frequency.setValueAtTime(document.getElementById("freq").value, audioCtx.currentTime + 1.0);
    oscillator.frequency.setValueAtTime(document.getElementById("freq").value/2, audioCtx.currentTime + 1.1);
    oscillator.frequency.setValueAtTime(document.getElementById("freq").value, audioCtx.currentTime + 1.11);
}

function encode(txt) {
    encodedTxt = new TextEncoder("utf-8").encode(txt);
    encodedArray = []
    for (i = 0; i < encodedTxt.length; i++) {
        binEnc = (encodedTxt[i]).toString(2).padStart(8,"0");
        encodedArray.push(binEnc);
    }
    console.log(encodedArray);
}

encode('abcdefg');