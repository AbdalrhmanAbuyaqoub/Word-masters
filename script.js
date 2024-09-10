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
  wordOfTheDay = response.word.toUpperCase();
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
  keyPressed = e.key.toUpperCase();
  work(keyPressed);
});

function work(keyPressed) {
  if (isLetter(keyPressed)) addLetter(keyPressed);
  else {
    switch (keyPressed) {
      case "ENTER":
        handleEnter(keyPressed);
        break;
      case "BACKSPACE":
        handleBackspace();
        break;
    }
  }

  async function handleEnter(keyPressed) {
    if (word.length !== 5) return;
    try {
      if (await validateWord()) {
        valid();
        if (!didWin()) {
          hasLetters();
          isGameOver();
          newWord(keyPressed);
        }
      } else {
        notValid();
      }
    } catch (e) {
      console.error(e);
    }
  }

  console.log(`keyPressed:${keyPressed}`);
  console.log(`filledCells:${filledCells}`);
  console.log(`word:${word}`);
  console.log(`count:${count}`);
  console.log(`wordOfTheDay:${wordOfTheDay}`);
}

function isGameOver() {
  if (filledCells === 30) {
    alert("game over!!, you lost");
    canRemove = 0;
    return;
  }
}

function didWin() {
  if (word !== wordOfTheDay) return false;
  else {
    for (let i = filledCells - 5; i < filledCells; i++) {
      colorCell(i, "green");
    }
    alert("you win!!");
    canRemove = 0;
    return true;
  }
}

function hasLetters() {
  for (let i = filledCells - 5; i < filledCells; i++) {
    let mappedIndex = i - (filledCells - 5);
    for (let j = 0; j < 5; j++) {
      if (gridItems[i].textContent === wordOfTheDay[j]) {
        if (mappedIndex === j) {
          colorCell(i, "green");
          break;
        } else {
          colorCell(i, "#daa520");
        }
      }
    }
  }
}

function valid() {
  for (let i = filledCells - 5; i < filledCells; i++) {
    gridItems[i].style.borderColor = "";
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
  if (count < 5 && inputLetter !== "ENTER") {
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

function handleBackspace() {
  if (canRemove > 0) {
    gridItems[filledCells - 1].textContent = "";
    filledCells--;
    count--;
    canRemove--;
    word = word.slice(0, -1);
  }
}

function colorCell(index, color) {
  gridItems[index].style.backgroundColor = color;
}
