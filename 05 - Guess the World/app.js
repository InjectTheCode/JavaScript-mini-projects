const inputsEl = document.querySelector(".inputs"),
   resetBtn = document.querySelector(".reset-btn"),
   hintEl = document.querySelector(".hint span"),
   remainingEl = document.querySelector(".guess-left span"),
   wrongLetterEl = document.querySelector(".wrong-letter span"),
   typingInput = document.querySelector(".typing-input");

let word,
   maxGuess,
   incorrectsArr = [],
   correctArr = [];

function randomWord() {
   const randomObj = wordList[Math.floor(Math.random() * wordList.length)];

   word = randomObj.word;

   maxGuess = 8;
   incorrectsArr = [];
   correctArr = [];

   let hint = randomObj.hint;

   console.log(word);

   let html = "";
   for (let i = 0; i < word.length; i++) {
      html += `<input type="text" disabled />`;
   }

   inputsEl.innerHTML = html;

   remainingEl.innerText = maxGuess;

   hintEl.innerText = hint;
}

randomWord();

function initGame(e) {
   let key = e.target.value;
   if (
      key.match(/^[A-Za-z]+$/) &&
      !incorrectsArr.includes(` ${key}`) &&
      !correctArr.includes(key)
   ) {
      if (word.includes(key)) {
         for (let i = 0; i < word.length; i++) {
            // showing matched letter in the input value.
            if (word[i] === key) {
               correctArr.push(key);
               inputsEl.querySelectorAll("input")[i].value = key;
            }
         }
      } else {
         incorrectsArr.push(` ${key}`);
         maxGuess--;
      }
   }

   setTimeout(() => {
      if (correctArr.length === word.length) {
         alert(`Congrats! you found the word ${word.toUpperCase()}`);
         randomWord();
      } else if (maxGuess < 1) {
         alert("Game over! you don't have remaining guesses");
         for (let i = 0; i < word.length; i++) {
            inputsEl.querySelectorAll("input")[i].value = word[i];
         }
      }
   }, 1000);

   wrongLetterEl.innerText = incorrectsArr;
   remainingEl.innerText = maxGuess;
   typingInput.value = "";
}

resetBtn.addEventListener("click", randomWord);
typingInput.addEventListener("input", initGame);
document.addEventListener("keydown", () => typingInput.focus());
