const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global variables


var countDownTimer;
var timeLimit = 5;
var currentTime;
var clueHoldTime = 200; //how long to hold each clue's light/sound
// var pattern = [2, 3, 1, 4, 6, 1, 2, 4, 3, 5];
var pattern = [];
var clueLength = 6;
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

let twoStrikes = 0;

function startGame() {
  progress = 0;

  pattern = []; // reset so array doesn't get longer then 10 if we restart game
  for (var i = 0; i < clueLength; i++) {
    pattern.push(getRandomInt(5));
  }
  console.log("pattern: " + pattern);

  gamePlaying = true;

  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  document.getElementById("timeDiv").classList.remove("hidden");
  

  playClueSequence();
  
  twoStrikes = 0;
}

function stopGame() {
  clearInterval(countDownTimer);
  gamePlaying = false;

  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max) + 1);
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    setTimeout(() => {
      if (i === progress) {
        // document.getElementById("timeDiv").classList.remove("hidden"); // might be useful for styling timer
        console.log('played final clue ...');

        currentTime = timeLimit; // this should reset every round
        countDownTimer = setInterval(() => {
                    myTimer();
                }, 1000);

      }
    }, delay);

    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function myTimer() {
  console.log('counting down');

  currentTime = (currentTime - 1); // can also do currentTime --

  if (currentTime <= 0) {
    currentTime = 0;
     document.getElementById("timeDiv").innerHTML = ('Time remaining: ' + currentTime);

    clearInterval(countDownTimer);
    loseGame();
  }

  document.getElementById("timeDiv").innerHTML = ('Time remaining: ' + currentTime);
}


function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}
function winGame() {
  stopGame();
  alert("Yayyyyy, you win!!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        clearInterval(countDownTimer);
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
    //guessCounter++;
  } else {
    if (twoStrikes < 2) 
    { 
      twoStrikes++;
      alert("Oops, try again");
    } else loseGame();
  }
}
// Sound Synthesis Functions
const freqMap = {
  1: 876.6,
  2: 329.6,
  3: 235.7,
  4: 466.2,
  5: 698.9,
  6: 336.2,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

