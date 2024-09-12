const container = document.querySelector(".container");
const gridItems = document.querySelectorAll(".cell");
const animationBar = document.querySelector(".animation-bar");

const WORD_OF_THE_DAY_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";
const WORD_LENGTH = 5;
let filledCells = 0;
let word = "";
let count = 0;
let wordOfTheDay = "";
let canRemove = 0;
let done = false;
let isLoading = false;
setLoading(false);

async function init() {
  addEventListener("keyup", function (e) {
    if (done || isLoading) {
    } else {
      keyPressed = e.key.toUpperCase();
      work(keyPressed);
    }
  });
}
init();

async function getWordOfTheDay() {
  const promiseFromApi = await fetch(WORD_OF_THE_DAY_URL);
  const response = await promiseFromApi.json();
  wordOfTheDay = response.word.toUpperCase();
}
getWordOfTheDay();

async function validateWord() {
  setLoading(true);
  const promiseFromApi = await fetch(VALIDATE_WORD_URL, {
    method: "POST",
    body: JSON.stringify({
      word: word,
    }),
  });
  const response = await promiseFromApi.json();
  setLoading(false);
  return response.validWord;
}

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
}
async function handleEnter(keyPressed) {
  if (word.length !== WORD_LENGTH) return;
  try {
    if (await validateWord()) {
      if (!done) {
        hasLettersOrWinLose();
        newRow(keyPressed);
      }
    } else {
      notValid();
    }
  } catch (e) {
    console.error(e);
  }
}

function hasLettersOrWinLose() {
  const map = makeMap(wordOfTheDay);
  for (let i = filledCells - WORD_LENGTH, j = 0; j < WORD_LENGTH; j++, i++) {
    if (word[j] === wordOfTheDay[j]) {
      gridItems[i].classList.add("correct");
      map[word[j]]--;
    }
  }
  //--i did not do it in a separate function because in both ways you need to have a for loop to color the cells so no point of the separate function
  if (word === wordOfTheDay) {
    alert("you win");
    // haveWon = true;
    done = true;
    return;
  }
  for (let i = filledCells - WORD_LENGTH, j = 0; i < filledCells; j++, i++) {
    if (word[j] === wordOfTheDay[j]) {
      //do nothing, didWin
    } else if (wordOfTheDay.includes(word[j]) && map[word[j]] > 0) {
      gridItems[i].classList.add("close");
      map[word[j]]--;
    } else {
      gridItems[i].classList.add("false");
    }
  }

  if (filledCells === 30) {
    alert(`game over!!, the word was ${wordOfTheDay}`);
    canRemove = 0;
    done = true;
    return;
  }
}

function makeMap(str) {
  const obj = {};
  for (let i = 0; i < str.length; i++) {
    const letter = str[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }
  return obj;
}

function notValid() {
  for (let i = filledCells - 5; i < filledCells; i++) {
    gridItems[i].classList.remove("invalid");
    setTimeout(function () {
      gridItems[i].classList.add("invalid");
    }, 10);
  }
}

function newRow(keyPressed) {
  count = 0;
  word = "";
  if (keyPressed !== "ENTER") addLetter(keyPressed); //makes error adding enter to word
  canRemove = 0;
}

function addLetter(inputLetter) {
  if (count < WORD_LENGTH && inputLetter !== "ENTER") {
    word += inputLetter;
    filledCells++;
    count++;
    canRemove++;
    gridItems[filledCells - 1].textContent = inputLetter;
  } else {
    word = word.substring(0, word.length - 1) + inputLetter;
    gridItems[filledCells - 1].textContent = inputLetter;
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

function setLoading(isLoading) {
  animationBar.classList.toggle("show", isLoading);
  isLoading = isLoading;
}
