const hackBox = document.querySelector(".hack-box");
const hackFunction = document.querySelector(".hack-fn");
const hackFunction2 = document.querySelector(".hack-fn2");
const hackTitleBox = document.querySelector(".hack-title");
const hackTitle = document.getElementById("hack-title-text");
const hackInfoBox = document.querySelector(".hack-info");
const hackInfo = document.getElementById("hack-info-text");
const startButton = document.querySelector(".start-hack");
const buttons = document.querySelector(".play-buttons");
const progressBarBox = document.querySelector(".hack-progress");
const progressBarFn = document.getElementById("progress-bar-fn");
const hackOptions = document.querySelector(".hack-options");
const colorButtons = document.querySelectorAll(".hack-fn2 > div > .el-button");

var progressBarInterval;
var playTime = 50;
var width = 4;
var height = 2;
var currentSquare = 0;
var elementsToShow = 2;
var selectedColor = 0;
var squaresShowInterval = true;
var colors = ["pink", "blue", "green", "yellow"];
var antiSolverMode = false;

function hack() {
  hackInfoBox.style.display = "none";
  hackFunction.style.display = "none";
  hackFunction2.style.display = "none";
  progressBarBox.style.display = "none";
  hackTitleBox.style.display = "none";
}

function startHack() {
  selectedColor = 0;
  currentSquare = 0;
  elementsToShow = 2;
  squaresShowInterval = true;
  colorButtons.forEach((button) => button.removeEventListener("click", buttonClick));
  colorButtons.forEach((button) => button.addEventListener("click", buttonClick));
  hackOptions.style.display = "none";
  buttons.style.display = "none";
  hackTitleBox.style.display = "none";
  hackFunction.style.display = "none";
  hackFunction2.style.display = "none";
  hackInfoBox.style.display = "";
  hackInfo.textContent = "Przygotuj się...";
  progressBarBox.style.display = "block";
  progressBar("start", 9);
}

function gameWin() {
  hackTitleBox.style.display = "none";
  hackFunction.style.display = "none";
  hackFunction2.style.display = "none";
  hackInfoBox.style.display = "";
  hackInfo.textContent = "Hack udany";
  progressBarBox.style.display = "block";
  progressBar("end", 9);
}

function gameOver() {
  hackFunction.style.display = "none";
  hackFunction2.style.display = "none";
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
    } else {
      if (w === "start") {
        hackTitleBox.style.display = "";
        hackInfoBox.style.display = "none";
        hackFunction.style.display = "";
        hackFunction2.style.display = "";
        createSquares();
        document.getElementById("close").addEventListener("click", gameOver);
        progressBar("game", playTime);
        return;
      }
      if (w === "game") {
        hackFunction.style.display = "none";
        hackFunction2.style.display = "none";
        hackTitleBox.style.display = "none";
        progressBarBox.style.display = "block";
        hackInfoBox.style.display = "";
        gameOver();
        return;
      }
      if (w === "end") {
        hackFunction.style.display = "none";
        hackFunction2.style.display = "none";
        hackTitleBox.style.display = "none";
        hackOptions.style.display = "";
        buttons.style.display = "";
        progressBarBox.style.display = "none";
        hackInfoBox.style.display = "none";
        document.getElementById("close").removeEventListener("click", gameOver);
      }
    }
  }

  clearInterval(progressBarInterval);
  progressBarInterval = setInterval(updateProgress, t);
}

function createSquares() {
  hackFunction.innerHTML = "";

  for (let i = 0; i < width * height; i++) {
    let random = Math.floor(Math.random() * colors.length);
    let randomColor = colors[random];
    const el = document.createElement("div");

    el.classList.add("el-button", "hidden");
    el.setAttribute("id", randomColor);
    hackFunction.appendChild(el);
  }
  squareShow();
}

function buttonClick() {
  const squares = document.querySelectorAll(".hack-fn > .el-button");
  let color;

  if (!squaresShowInterval) {
    squares[currentSquare].innerHTML = "";

    const el1 = document.createElement("div");
    selectedColor = this.id;

    if (selectedColor === "col1") color = "pink";
    if (selectedColor === "col2") color = "blue";
    if (selectedColor === "col3") color = "green";
    if (selectedColor === "col4") color = "yellow";

    el1.textContent = this.textContent;
    squares[currentSquare].classList.add(color);
    squares[currentSquare].classList.remove("hidden");
    squares[currentSquare].appendChild(el1);

    if (squares[currentSquare].id === color) {
      if (currentSquare < 8) {
        if (!squares[currentSquare].classList.contains("good")) {
          squares[currentSquare].classList.add("good");
          currentSquare++;
        } else {
          currentSquare++;
          return;
        }
        if (currentSquare === elementsToShow - 1 && currentSquare !== 8) {
          squareShow();
        }
      }
    } else {
      gameOver();
      return;
    }

    const elsArr = Array.from(squares);

    if (elsArr.every((el) => el.classList.contains("good"))) {
      gameWin();
      return;
    }
  } else return;
}

function squareShow() {
  currentSquare = 0;
  squaresShowInterval = true;

  for (let i = 0; i < elementsToShow; i++) {
    if (i === 8) break;

    const squares = document.querySelectorAll(".hack-fn > .el-button");
    squares[i].classList.remove(squares[i].id);
    squares[i].classList.add("hidden");

    setTimeout(() => {
      squares[i].classList.add(squares[i].id);
      squares[i].innerHTML = `<div>${
        squares[i].id === "pink"
          ? "1"
          : squares[i].id === "blue"
          ? "2"
          : squares[i].id === "green"
          ? "3"
          : squares[i].id === "yellow"
          ? "4"
          : ""
      }</div>`;
      squares[i].classList.remove("hidden");

      setTimeout(() => {
        squares[i].classList.remove(squares[i].id);
        squares[i].classList.add("hidden");

        if (i === elementsToShow - 1) {
          squaresShowInterval = false;
          elementsToShow++;
        }
      }, 500);
    }, 1000 + 750 * i);
  }
}

$(document).ready(function () {
  $("#game-mode").on("change", function () {
    $(this).prop("checked")
      ? $("#mode").text("Włączony")
      : $("#mode").text("Wyłączony");
    $(this).prop("checked")
      ? (antiSolverMode = true)
      : (antiSolverMode = false);
  });

  $(".start-hack").on("click", function () {
    let randomOperator = Math.random() < 0.5 ? "" : "-";

    if (antiSolverMode) {
      $(".hack-box").css({
        transform: `rotate(${randomOperator}${random(
          1,
          5
        )}deg) translate(${randomOperator}${random(
          80,
          105
        )}px, ${randomOperator}${random(30, 45)}px)`,
      });
    } else {
      $(".hack-box").css({
        transform: `rotate(0deg) translate(0, 0)`,
      });
    }
  });
});
