const container = document.querySelector(".container");
const gridItems = document.querySelectorAll(".cell");

let filledCells = 0;
let word = "";
let count = 0;

addEventListener("keyup", function add(e) {
  let keyPressed = e.key;

  if (isLetter(keyPressed)) {
    displayLetter(keyPressed);
  }
  switch (keyPressed) {
    case "Enter":
      //validate word from API

      if (word.length === 5) {
        count = 0;
        displayLetter(keyPressed);
        word = "";
      }

      break;
    case "Backspace":
      removeLastLetter();
      break;
    default:
      break;
  }
  console.log(`keyPressed:${keyPressed}`);
  console.log(`filledCells:${filledCells}`);
  console.log(`word:${word}`);
  console.log(`count:${count}`);
});

function displayLetter(inputLetter) {
  if (count < 5 && inputLetter !== "Enter" && filledCells <= 30) {
    gridItems[filledCells].textContent = inputLetter;
    filledCells++;
    count++;
    word += inputLetter;
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function removeLastLetter() {
  gridItems[filledCells - 1].textContent = "";
  filledCells--;
  count--;
  word = word.slice(0, -1);
}
