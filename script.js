const container = document.querySelector(".container");
const gridItems = document.querySelectorAll(".cell");

let filledCells = 0;
let word = "";
let count = 0;
let wordOfTheDay = "";
let canRemove = 0;

const WORD_OF_THE_DAY_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";

async function getWordOfTheDay() {
  const promiseFromApi = await fetch(WORD_OF_THE_DAY_URL);
  const response = await promiseFromApi.json();
  wordOfTheDay = response.word;
}
getWordOfTheDay();

async function validateWord() {
  const promiseFromApi = await fetch(VALIDATE_WORD_URL, {
    method: "POST",
    body: JSON.stringify({
      word: word,
    }),
  });
  const response = await promiseFromApi.json();
  return response.validWord;
}

addEventListener("keyup", function (e) {
  work(e.key);
});

async function work(keyPressed) {
  if (isLetter(keyPressed)) {
    addLetter(keyPressed);
  } else {
    switch (keyPressed) {
      case "Enter":
        if (word.length === 5) {
          try {
            if (await validateWord()) {
              valid();
              if (isItRight()) {
                alert("you win!!");
                canRemove = 0;
              } else hasLetters(keyPressed);
            } else {
              notValid();
            }
          } catch (e) {
            console.error(e);
          }
        }
        break;
      case "Backspace":
        removeLastLetter();
        break;
    }
  }

  console.log(`keyPressed:${keyPressed}`);
  console.log(`filledCells:${filledCells}`);
  console.log(`word:${word}`);
  console.log(`count:${count}`);
  console.log(`wordOfTheDay:${wordOfTheDay}`);
}

function hasLetters(keyPressed) {
  console.log(`word from hasLetters:${word}`);

  for (let i = filledCells - 5; i < filledCells; i++) {
    let mappedIndex = i - (filledCells - 5);

    for (let j = 0; j < 5; j++) {
      if (gridItems[i].textContent === wordOfTheDay[j] && mappedIndex === j) {
        gridItems[i].style.backgroundColor = "green";
        break; // Correct letter, correct position
      }
      // If the character matches but the position is different
      else if (
        gridItems[i].textContent === wordOfTheDay[j] &&
        mappedIndex !== j
      ) {
        gridItems[i].style.backgroundColor = "rgb(190, 190, 43)"; // Correct letter, wrong position
      }
    }
  }
  newWord(keyPressed);
}

function isItRight() {
  if (word === wordOfTheDay) {
    for (let i = filledCells - 5; i < filledCells; i++) {
      gridItems[i].style.backgroundColor = "green";
    }
    return true;
  } else return false;
}

function valid() {
  for (let i = filledCells - 5; i < filledCells; i++) {
    gridItems[i].style.borderColor = "inherit";
  }
}
function notValid() {
  for (let i = filledCells - 5; i < filledCells; i++) {
    gridItems[i].style.borderColor = "red";
  }
}

function newWord(keyPressed) {
  count = 0;
  word = "";
  addLetter(keyPressed);
  canRemove = 0;
}

function addLetter(inputLetter) {
  if (count < 5 && inputLetter !== "Enter") {
    gridItems[filledCells].textContent = inputLetter;
    filledCells++;
    count++;
    canRemove++;
    word += inputLetter;
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function removeLastLetter() {
  if (canRemove > 0) {
    gridItems[filledCells - 1].textContent = "";
    filledCells--;
    count--;
    canRemove--;
    word = word.slice(0, -1);
  }
}
