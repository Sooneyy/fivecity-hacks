const hackBox = document.querySelector(".hack-box");
const hackFunction = document.querySelector(".hack-fn");
const hackTitleBox = document.querySelector(".hack-title");
const hackTitle = document.getElementById("hack-title-text");
const hackInfoBox = document.querySelector(".hack-info");
const hackInfo = document.getElementById("hack-info-text");
const startButton = document.querySelector(".start-hack");
const buttons = document.querySelector(".play-buttons");
const progressBarBox = document.querySelector(".hack-progress");
const progressBarFn = document.getElementById("progress-bar-fn");
const modal = document.getElementById("modal");
const timer = document.querySelector(".timer");

var progressBarInterval, timerInterval;
var playTime = 15;
var resetStatus = 1000;
var height = 9;
var width = 9;
var chars = "1234567890";
var startPos = 31;
var goodNumbers = [];
var randomNumbers = [];
var numbersToFind;

function hack() {
  hackInfoBox.style.display = "none";
  hackFunction.style.display = "none";
  progressBarBox.style.display = "none";
}

function startHack() {
  numbersToFind = [];
  goodNumbers = [];
  startPos = 31;
  resetStatus = 1000;
  let start = new Date();
  let updateTime = () => {
    timer.style.display = "block";
    let now = new Date();
    let diff = new Date();

    diff.setTime(now - start);
    timer.textContent =
      diff.getMinutes().toString().padStart("2", 0) +
      ":" +
      diff.getSeconds().toString().padStart("2", 0);
  };
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTime, 1000);
  generateArray();
  renderArray();
  selectGoodNumbers();
  numbersToFind = Object.keys(goodNumbers);
  document.querySelector(".hack-select-squares").innerHTML = "";
  for (let i = 0; i < numbersToFind.length; i++) {
    const el = document.createElement("div");

    el.textContent = goodNumbers[numbersToFind[i]];
    el.classList.add("search-el");
    document.querySelector(".hack-select-squares").appendChild(el);
  }
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById(startPos + i);

    el.classList.add("select");
  }
  buttons.style.display = "none";
  hackTitleBox.style.display = "none";
  hackInfoBox.style.display = "";
  hackInfo.textContent = "Przygotuj się...";
  progressBarBox.style.display = "block";
  progressBar("start", 9);
}

function gameWin() {
  hackTitleBox.style.display = "none";
  hackFunction.style.display = "none";
  hackInfoBox.style.display = "";
  hackInfo.textContent = "Hack udany";
  progressBarBox.style.display = "block";
  progressBar("end", 9);
}

function gameOver() {
  hackFunction.style.display = "none";
  hackTitleBox.style.display = "none";
  progressBarBox.style.display = "block";
  hackInfoBox.style.display = "";
  hackInfo.textContent = "Hack nieudany";
  progressBar("end", 9);
}

function progressBar(w, t) {
  let width = 1000;
  function updateProgress() {
    if (width > 0) {
      if (w === "start" || w === "end") width -= 3;
      else width--;
      progressBarFn.style.width = (width * 100) / 1000 + "%";
      if (w === "game") {
        resetStatus--;

        if (resetStatus % 100 === 1) {
          refreshArray(randomNumbers);
        }
      }
    } else {
      if (w === "start") {
        hackTitleBox.style.display = "";
        hackFunction.style.display = "";
        hackTitle.textContent = "Znajdź odpowiedni ciąg znaków";
        hackInfoBox.style.display = "none";
        progressBar("game", playTime);
        return;
      }
      if (w === "game") {
        gameOver();
        return;
      }
      if (w === "end") {
        hackFunction.style.display = "none";
        hackTitleBox.style.display = "none";
        buttons.style.display = "";
        progressBarBox.style.display = "none";
        hackInfoBox.style.display = "none";
        timer.style.display = "none";
        document.getElementById("close").removeEventListener("click", gameOver);
      }
    }
  }

  clearInterval(progressBarInterval);
  progressBarInterval = setInterval(updateProgress, t);
}

function keyEvents(e) {
  let key = e.key;
  let validKeys = [
    "w",
    "a",
    "s",
    "d",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ];
  const selectElements = document.querySelectorAll(".select");

  if (validKeys.includes(key)) {
    selectElements.forEach((el) => el.classList.remove("select"));

    switch (key) {
      case "w":
      case "ArrowUp": {
        startPos -= 9;
        if (startPos < 1) startPos += 81;

        for (let i = 0; i < 4; i++) {
          let newPos = startPos + i;
          if (newPos > 81) newPos -= 81;
          const elem = document.getElementById(newPos);

          elem.classList.add("select");
        }

        break;
      }
      case "a":
      case "ArrowLeft": {
        startPos--;
        if (startPos < 1) startPos = 81;

        for (let i = 0; i < 4; i++) {
          let newPos = startPos + i;
          if (newPos > 81) newPos -= 81;
          const elem = document.getElementById(newPos);

          elem.classList.add("select");
        }

        break;
      }
      case "s":
      case "ArrowDown": {
        startPos += 9;
        if (startPos > 81) startPos -= 81;
        
        for (let i = 0; i < 4; i++) {
          let newPos = startPos + i;
          while (newPos > 81) newPos -= 81;
          const elem = document.getElementById(newPos);

          elem.classList.add("select");
        }

        break;
      }
      case "d":
      case "ArrowRight": {
        startPos++;
        if (startPos > 81) startPos -= 81;

        for (let i = 0; i < 4; i++) {
          let newPos = startPos + i;
          while (newPos > 81) newPos -= 81;

          const elem = document.getElementById(newPos);

          elem.classList.add("select");
        }

        break;
      }
    }
  }
}

function refreshArray(array) {
  let firstPos = array[0];

  for (let i = 0; i < array.length; i++) {
    array[i] = array[i + 1];
  }

  array[array.length - 1] = firstPos;

  deleteBoard();
  renderArray();
  
  for (let i = 0; i < 4; i++) {
    let newPos = startPos + i;
    while (newPos > 81) newPos -= 81;
    const elem = document.getElementById(newPos);

    elem.classList.add("select");
  }
}

function generateArray() {
  for (let i = 0; i < height * width; i++) {
    let text = generateNumber();

    randomNumbers[i] = text;
  }
}

function deleteBoard() {
  [...document.querySelectorAll(".el")].forEach((el) => el.remove());
}

function renderArray() {
  hackFunction.innerHTML = "";

  for (let i = 0; i < randomNumbers.length; i++) {
    const el = document.createElement("div");

    el.dataset.x = (i % height) + 1;
    el.dataset.y = Math.floor(i / width) + 1;

    el.textContent = randomNumbers[i];
    el.setAttribute("id", i + 1);
    el.classList.add("el");
    hackFunction.appendChild(el);
  }
}

function selectGoodNumbers() {
  const elCount = height * width;
  let randomPosition = Math.floor(Math.random() * (elCount + 1));
  for (let i = 0; i < 4; i++) {
    while (randomPosition + i > elCount) {
      randomPosition -= elCount;
    }
    goodNumbers[randomPosition + i] = randomNumbers[randomPosition + i - 1];
  }
}

function generateNumber() {
  let n = "";

  for (let i = 0; i < 2; i++) {
    n += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return n;
}

function check() {
  let selectedNumbers = [];
  const selectedElements = document.querySelectorAll(".select");

  selectedElements.forEach((el) =>
    selectedNumbers.push(Number(el.textContent))
  );

  for (let i = 0; i < 4; i++) {
    if (selectedNumbers[i] == goodNumbers[numbersToFind[i]]) {
      gameWin();
      return;
    }
  }
  gameOver();
}

document.addEventListener("keydown", keyEvents);
document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") check();
});
