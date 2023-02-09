let correct = 0;
let wrong = 0;
let nextNumber = 0;
let isGuessing = false;

document.getElementById('stats').innerHTML = '0/0';
document.getElementById('rate').innerHTML = '0%';

document.getElementById('enter').addEventListener('click', function (event) {
	event.preventDefault();
  enter();
});

document.getElementById('guessInput').addEventListener('keypress', function (event) {
  if (event.key === 'Enter' || event.keyCode === 13) {
    const numberGuess = document.getElementById('guessInput').value;
    if (numberGuess) {
      guess();
    } else {
      enter();
    }
  }
});

function enter() {
  const maxNumber = document.getElementById('maxNumber').value;
  if (!maxNumber) {
    alert('Please enter Max Number');
    return;
  }

  document.getElementById('message').innerHTML = 'What is the number? (press ENTER to listen again)';

  const numberGuess = document.getElementById('guessInput').value;
  if (!numberGuess && isGuessing) {
    speak(nextNumber);
  } else {

    nextNumber = Math.round(Math.random() * maxNumber);
    isGuessing = true;
    document.getElementById('result').innerHTML = '&nbsp;'
    speak(nextNumber);
  }
}

const synth = window.speechSynthesis;

function speak(text) {
  var utterThis = new SpeechSynthesisUtterance(text);
  voices = synth.getVoices();
  let foundJapanese = false;
  voices.forEach(x => {
    if (x.lang.toLowerCase().includes('ja')) {
      utterThis.voice = x;
      foundJapanese = true;
    }
  })

  if (!foundJapanese) {
    alert('Your browser does not have a Japanese voice. Please try on Desktop instead.');
  }

  synth.speak(utterThis);
}

function guess() {
  const numberGuess = document.getElementById('guessInput').value;

  const result = numberGuess == nextNumber;
  if (result) {
    correct++;
    document.getElementById('result').innerHTML = `✅ ${nextNumber}`
    speak('正解');
  } else {
    wrong++;
    document.getElementById('result').innerHTML = `❌ correct number: ${nextNumber}`;
    speak('違う');
  }
  isGuessing = false;
  document.getElementById('message').innerHTML = 'Press ENTER for next number';
  document.getElementById('guessInput').value = '';

  const totalRounds = correct + wrong;
  const successRate = Math.round((correct / totalRounds) * 100);
  document.getElementById('stats').innerHTML = `${correct}/${totalRounds}`;
  document.getElementById('rate').innerHTML = `${successRate}%`;
}

document.getElementById('guess').addEventListener('click', function (event) {
	event.preventDefault();
  guess();
});

console.log(`
  (\\-/)
 (='.'=)
 (")-(")o
`);
