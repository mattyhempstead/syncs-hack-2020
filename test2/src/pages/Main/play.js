import { TextEncoder } from "text-encoding";

/*
    see https://github.com/mdn/violent-theremin/blob/gh-pages/scripts/app.js
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Audio_data_whats_in_a_sample
    https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency
*/
var audioCtx;
var oscillator;
var gainNode;
var isPlaying = true;

/*
    see https://github.com/mdn/violent-theremin/blob/gh-pages/scripts/app.js
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Audio_data_whats_in_a_sample
    https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency
*/

function init() {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();

  var oscillators = [];
  var gainNodes = [];

  var merger = audioCtx.createChannelMerger(8);
  var num_output_channels = 10; // ?
  var splitter = audioCtx.createChannelSplitter(num_output_channels);

  merger.connect(splitter); // THIS MIGHT BE WHY IT BREAKS
  for (let i = 0; i < num_output_channels; i++) {
    splitter.connect(audioCtx.destination, i);
  }

  for (let i = 0; i < 8; i++) {
    oscillators[i] = audioCtx.createOscillator();
    gainNodes[i] = audioCtx.createGain();
    oscillators[i].connect(gainNodes[i]);
    gainNodes[i].connect(merger);

    oscillators[i].frequency.setValueAtTime(
      1000 * (i + 1), // TODO: Update to desired frequencies
      audioCtx.currentTime
    );
    gainNodes[i].gain.setValueAtTime(10 / 1000, audioCtx.currentTime);

    oscillators[i].start();
  }

  //   var oscillator1 = audioCtx.createOscillator();
  //   var gainNode1 = audioCtx.createGain();
  //   var oscillator2 = audioCtx.createOscillator();
  //   var gainNode2 = audioCtx.createGain();
  //   var oscillator3 = audioCtx.createOscillator();
  //   var gainNode3 = audioCtx.createGain();
  //   var oscillator4 = audioCtx.createOscillator();
  //   var gainNode4 = audioCtx.createGain();
  //   var oscillator5 = audioCtx.createOscillator();
  //   var gainNode5 = audioCtx.createGain();
  //   var oscillator6 = audioCtx.createOscillator();
  //   var gainNode6 = audioCtx.createGain();
  //   var oscillator7 = audioCtx.createOscillator();
  //   var gainNode7 = audioCtx.createGain();
  //   var oscillator8 = audioCtx.createOscillator();
  //   var gainNode8 = audioCtx.createGain();

  //   document.getElementById("vol1").value = 1;
  //   document.getElementById("freq1").value = 1000;
  //   document.getElementById("vol2").value = 1;
  //   document.getElementById("freq2").value = 2000;
  //   document.getElementById("vol3").value = 1;
  //   document.getElementById("freq3").value = 3000;
  //   document.getElementById("vol4").value = 1;
  //   document.getElementById("freq4").value = 4000;
  //   document.getElementById("vol5").value = 1;
  //   document.getElementById("freq5").value = 5000;
  //   document.getElementById("vol6").value = 1;
  //   document.getElementById("freq6").value = 6000;
  //   document.getElementById("vol7").value = 1;
  //   document.getElementById("freq7").value = 7000;
  //   document.getElementById("vol8").value = 1;
  //   document.getElementById("freq8").value = 8000;

  //   oscillator1.connect(gainNode1);
  //   gainNode1.connect(merger);
  //   oscillator2.connect(gainNode2);
  //   gainNode2.connect(merger);
  //   oscillator3.connect(gainNode3);
  //   gainNode3.connect(merger);
  //   oscillator4.connect(gainNode4);
  //   gainNode4.connect(merger);
  //   oscillator5.connect(gainNode5);
  //   gainNode5.connect(merger);
  //   oscillator6.connect(gainNode6);
  //   gainNode6.connect(merger);
  //   oscillator7.connect(gainNode7);
  //   gainNode7.connect(merger);
  //   oscillator8.connect(gainNode8);
  //   gainNode8.connect(merger);

  //   oscillator1.frequency.setValueAtTime(
  //     document.getElementById("freq1").value,
  //     audioCtx.currentTime
  //   );
  //   gainNode1.gain.setValueAtTime(
  //     document.getElementById("vol1").value / 1000,
  //     audioCtx.currentTime
  //   );
  //   oscillator2.frequency.setValueAtTime(
  //     document.getElementById("freq2").value,
  //     audioCtx.currentTime
  //   );
  //   gainNode2.gain.setValueAtTime(
  //     document.getElementById("vol2").value / 1000,
  //     audioCtx.currentTime
  //   );
  //   oscillator3.frequency.setValueAtTime(
  //     document.getElementById("freq3").value,
  //     audioCtx.currentTime
  //   );
  //   gainNode3.gain.setValueAtTime(
  //     document.getElementById("vol3").value / 1000,
  //     audioCtx.currentTime
  //   );
  //   oscillator4.frequency.setValueAtTime(
  //     document.getElementById("freq4").value,
  //     audioCtx.currentTime
  //   );
  //   gainNode4.gain.setValueAtTime(
  //     document.getElementById("vol4").value / 1000,
  //     audioCtx.currentTime
  //   );
  //   oscillator5.frequency.setValueAtTime(
  //     document.getElementById("freq5").value,
  //     audioCtx.currentTime
  //   );
  //   gainNode5.gain.setValueAtTime(
  //     document.getElementById("vol5").value / 1000,
  //     audioCtx.currentTime
  //   );
  //   oscillator5.frequency.setValueAtTime(
  //     document.getElementById("freq5").value,
  //     audioCtx.currentTime
  //   );
  //   gainNode5.gain.setValueAtTime(
  //     document.getElementById("vol5").value / 1000,
  //     audioCtx.currentTime
  //   );
  //   oscillator6.frequency.setValueAtTime(
  //     document.getElementById("freq6").value,
  //     audioCtx.currentTime
  //   );
  //   gainNode6.gain.setValueAtTime(
  //     document.getElementById("vol6").value / 1000,
  //     audioCtx.currentTime
  //   );
  //   oscillator7.frequency.setValueAtTime(
  //     document.getElementById("freq7").value,
  //     audioCtx.currentTime
  //   );
  //   gainNode7.gain.setValueAtTime(
  //     document.getElementById("vol7").value / 1000,
  //     audioCtx.currentTime
  //   );
  //   oscillator8.frequency.setValueAtTime(
  //     document.getElementById("freq8").value,
  //     audioCtx.currentTime
  //   );
  //   gainNode8.gain.setValueAtTime(
  //     document.getElementById("vol8").value / 1000,
  //     audioCtx.currentTime
  //   );

  //   oscillator1.start();
  //   oscillator2.start();
  //   oscillator3.start();
  //   oscillator4.start();
  //   oscillator5.start();
  //   oscillator6.start();
  //   oscillator7.start();
  //   oscillator8.start();

  //   document.getElementById("freq1").oninput = function () {
  //     document.getElementById("freq-display1").innerHTML = this.value;
  //     oscillator1.frequency.setValueAtTime(
  //       document.getElementById("freq1").value,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("vol1").oninput = function () {
  //     document.getElementById("vol-display1").innerHTML = this.value;
  //     gainNode1.gain.setValueAtTime(
  //       document.getElementById("vol1").value / 1000,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("freq2").oninput = function () {
  //     document.getElementById("freq-display2").innerHTML = this.value;
  //     oscillator2.frequency.setValueAtTime(
  //       document.getElementById("freq2").value,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("vol2").oninput = function () {
  //     document.getElementById("vol-display2").innerHTML = this.value;
  //     gainNode2.gain.setValueAtTime(
  //       document.getElementById("vol2").value / 1000,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("freq3").oninput = function () {
  //     document.getElementById("freq-display3").innerHTML = this.value;
  //     oscillator3.frequency.setValueAtTime(
  //       document.getElementById("freq3").value,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("vol3").oninput = function () {
  //     document.getElementById("vol-display3").innerHTML = this.value;
  //     gainNode3.gain.setValueAtTime(
  //       document.getElementById("vol3").value / 1000,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("freq4").oninput = function () {
  //     document.getElementById("freq-display4").innerHTML = this.value;
  //     oscillator4.frequency.setValueAtTime(
  //       document.getElementById("freq4").value,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("vol4").oninput = function () {
  //     document.getElementById("vol-display4").innerHTML = this.value;
  //     gainNode4.gain.setValueAtTime(
  //       document.getElementById("vol4").value / 1000,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("freq5").oninput = function () {
  //     document.getElementById("freq-display5").innerHTML = this.value;
  //     oscillator1.frequency.setValueAtTime(
  //       document.getElementById("freq5").value,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("vol5").oninput = function () {
  //     document.getElementById("vol-display5").innerHTML = this.value;
  //     gainNode5.gain.setValueAtTime(
  //       document.getElementById("vol5").value / 1000,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("freq6").oninput = function () {
  //     document.getElementById("freq-display6").innerHTML = this.value;
  //     oscillator6.frequency.setValueAtTime(
  //       document.getElementById("freq6").value,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("vol6").oninput = function () {
  //     document.getElementById("vol-display6").innerHTML = this.value;
  //     gainNode6.gain.setValueAtTime(
  //       document.getElementById("vol6").value / 1000,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("freq7").oninput = function () {
  //     document.getElementById("freq-display7").innerHTML = this.value;
  //     oscillator7.frequency.setValueAtTime(
  //       document.getElementById("freq7").value,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("vol7").oninput = function () {
  //     document.getElementById("vol-display7").innerHTML = this.value;
  //     gainNode7.gain.setValueAtTime(
  //       document.getElementById("vol7").value / 1000,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("freq8").oninput = function () {
  //     document.getElementById("freq-display8").innerHTML = this.value;
  //     oscillator8.frequency.setValueAtTime(
  //       document.getElementById("freq8").value,
  //       audioCtx.currentTime
  //     );
  //   };

  //   document.getElementById("vol8").oninput = function () {
  //     document.getElementById("vol-display8").innerHTML = this.value;
  //     gainNode8.gain.setValueAtTime(
  //       document.getElementById("vol8").value / 1000,
  //       audioCtx.currentTime
  //     );
  //   };
}

function encode(txt) {
  encodedTxt = new TextEncoder("utf-8").encode(txt);
  encodedArray = [];
  for (i = 0; i < encodedTxt.length; i++) {
    binEnc = encodedTxt[i].toString(2).padStart(8, "0");
    encodedArray.push(binEnc);
  }
  console.log(encodedArray);
}

encode("asdfasdfadsfhretrewrtywe4");
init();
