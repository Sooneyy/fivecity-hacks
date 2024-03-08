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
const hackOptions = document.querySelector(".hack-options");
const timer = document.querySelector(".timer");

var progressBarInterval, timerInterval;
var playTime = 15;
var resetStatus = 1000;
var height = 9;
var width = 9;
var charsTypeText = "Alfabetyczne";
var charsType = "alphabetic";
var chars = "abcdefghijklmnopqrstuwxyz";
var startPos = 31;
var goodChars = [];
var randomChars = [];
var charsToFind;

function hack() {
  hackInfoBox.style.display = "none";
  hackFunction.style.display = "none";
  progressBarBox.style.display = "none";
  document.getElementById("chars-type").textContent = charsTypeText;
}

function startHack() {
  charsToFind = [];
  goodChars = [];
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
  selectGoodChars();
  charsToFind = Object.keys(goodChars);
  document.querySelector(".hack-select-squares").innerHTML = "";
  for (let i = 0; i < charsToFind.length; i++) {
    const el = document.createElement("div");

    el.textContent = goodChars[charsToFind[i]];
    el.classList.add("search-el");
    document.querySelector(".hack-select-squares").appendChild(el);
  }
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById(startPos + i);

    el.classList.add("select");
  }
  buttons.style.display = "none";
  hackOptions.style.display = "none";
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
          refreshArray(randomChars);
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
        hackOptions.style.display = "";
        timer.style.display = "none";
        document.getElementById("close").removeEventListener("click", gameOver);
      }
    }
  }

  clearInterval(progressBarInterval);
  progressBarInterval = setInterval(updateProgress, t);
}

function setCharsType(){
  switch(charsType){
    case "alphabetic":{
      chars = "abcdefghijklmnopqrstuwxyz";

      break;
    }
    case "numeric":{
      chars = "0123456789";

      break;
    }
    case "alphanumeric":{
      chars = "abcdefghijklmnopqrstuwxyz0123456789";

      break;
    }
    case "greek":{
      chars = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";

      break;
    }
    case "runes":{
      chars = "ᚠᚥᚧᚨᚩᚬᚭᚻᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟᛤ";

      break;
    }
    case "symbols":{
      chars = "☎☚☛☜☞☟☠☢☣☮☯♨♩♪♫♬Ψ♆✂✄෧✆✉✦✧✿❀";

      break;
    }
  }
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
    let text = generateChar();

    randomChars[i] = text;
  }
}

function deleteBoard() {
  [...document.querySelectorAll(".el")].forEach((el) => el.remove());
}

function renderArray() {
  hackFunction.innerHTML = "";

  for (let i = 0; i < randomChars.length; i++) {
    const el = document.createElement("div");

    el.dataset.x = (i % height) + 1;
    el.dataset.y = Math.floor(i / width) + 1;

    el.textContent = randomChars[i];
    el.setAttribute("id", i + 1);
    el.classList.add("el");
    hackFunction.appendChild(el);
  }
}

function selectGoodChars() {
  const elCount = height * width;
  let randomPosition = Math.floor(Math.random() * (elCount + 1));
  for (let i = 0; i < 4; i++) {
    while (randomPosition + i > elCount) {
      randomPosition -= elCount;
    }
    goodChars[randomPosition + i] = randomChars[randomPosition + i - 1];
  }
}

function generateChar() {
  let n = "";

  for (let i = 0; i < 2; i++) {
    n += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return n;
}

function check() {
  let selectedChars = [];
  const selectedElements = document.querySelectorAll(".select");
  let good = 0;

  selectedElements.forEach((el) =>
    selectedChars.push(el.textContent)
  );

  for (let i = 0; i < 4; i++) {
    if (selectedChars[i] == goodChars[charsToFind[i]]) {
      good++;
    }
  }

  if(good === 4){
    gameWin();
    return;
  }

  gameOver();
}

document.addEventListener("keydown", keyEvents);
document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") check();
});

document.querySelector(".dropdown-header").addEventListener("click", function() {
  this.classList.toggle("open");
  document.querySelector(".dropdown-menu").classList.toggle("open");
})

document.querySelectorAll(".option").forEach((el) => {
  el.addEventListener("click", function(){
    document.getElementById("chars-type").textContent = this.textContent;
  
    charsType = this.dataset.type;
    setCharsType();

    document.querySelector(".dropdown-header").classList.toggle("open");
    document.querySelector(".dropdown-menu").classList.toggle("open");
  })
})
