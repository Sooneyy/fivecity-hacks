const hackBox = document.querySelector(".hack-box");
const hackFunction = document.querySelector(".hack-fn");
const hackFunction2 = document.querySelector(".hack-fn2");
const hackTitleBox = document.querySelector(".hack-title");
const hackTitle = document.getElementById("hack-title-text");
const hackTitleHint = document.getElementById("hack-title-hint");
const hackInfoBox = document.querySelector(".hack-info");
const hackInfo = document.getElementById("hack-info-text");
const startButton = document.querySelector(".start-hack");
const buttons = document.querySelector(".play-buttons");
const progressBarBox = document.querySelector(".hack-progress");
const progressBarFn = document.getElementById("progress-bar-fn");
const hackOptions = document.querySelector(".hack-options");
const input = document.getElementById("input");
const switchMode = document.querySelector(".switch-mode");

var progressBarInterval;
var playTime = 60;
var randomChar = true;
var antiSolverMode = false;
var newRiddles;
var characters =
  "AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlMmNnOoÓóPpQqRrSsŚśTtUuWwXxYyZzŹźŻź1234567890";
var emojis = [
  "🍋",
  "🍊",
  "🥭",
  "🍐",
  "🍍",
  "🥥",
  "🍈",
  "🐒",
  "🐌",
  "🐘",
  "🐆",
  "🦐",
]; // Nie wiem jakie są więc daje też od siebie jakieś
var randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
var randomNumber = random(5, 15);
// Kilka od siebie dałem bo nie wiem jakie są
var elements = [
  {
    name: "Hel",
    symbol: "He",
    pos: "2",
  },
  {
    name: "Siarka",
    symbol: "S",
    pos: "16",
  },
  {
    name: "Węgiel",
    symbol: "C",
    pos: "6",
  },
  {
    name: "Ksenon",
    symbol: "Xe",
    pos: "54",
  },
  {
    name: "Fosfor",
    symbol: "P",
    pos: "15",
  },
  {
    name: "Wapń",
    symbol: "Ca",
    pos: "20",
  },
  {
    name: "Żelazo",
    symbol: "Fe",
    pos: "8",
  },
];
var randomElement = elements[Math.floor(Math.random() * elements.length)];
var riddles = [
  {
    text: "Twoje hasło jest zbyt słabe",
    value: "weak",
  },
  {
    text: "Twoje hasło jest zbyt gorące",
    value: "hot",
  },
  {
    text: "Twoje hasło musi zawierać rok przestępny oddzielony od hasła",
    value: "leapyear",
  },
  {
    text: "Cyfry w twoim haśle muszą sumować się do " + randomNumber,
    value: "addition",
  },
  {
    text: "Twoje hasło musi zawierać cyfrę rzymską",
    value: "romeletter",
  },
  {
    text: "Twoje hasło musi zawierać conajmniej jedną literę z akcentem diaktrycznym",
    value: "diactric",
  },
  {
    text: "Twoje hasło musi zawierać emotkę: " + randomEmoji,
    value: "emoji",
  },
  {
    text: "Twoje hasło musi zawierać cyfrę",
    value: "digit",
  },
  {
    text: "Twoje hasło musi zawierać znak specjalny",
    value: "special",
  },
  {
    text: "Twoje hasło musi zawierać conajmniej 6 znaków",
    value: "length",
  },
  {
    text:
      "Twoje hasło musi zawierać symbol oraz miejsce atomu z układu okresowego " +
      randomElement.name +
      " | Przykład: (He2)",
    value: "element",
  },
  {
    text: "Twoje hasło musi zawierać wielką literę",
    value: "uppercase",
  },
  {
    text: "Twoje hasło musi zawierać miesiąc",
    value: "month",
  },
];

function hack() {
  hackInfoBox.style.display = "none";
  hackFunction.style.display = "none";
  hackFunction2.style.display = "none";
  progressBarBox.style.display = "none";
  hackTitleBox.style.display = "none";
  switchMode.style.display = "none";
}

function startHack() {
  hackOptions.style.display = "none";
  buttons.style.display = "none";
  hackTitle.innerHTML = "Wpisz Hasło";
  hackTitleHint.innerHTML =
    "Emotki mogą być rozwiązaniem! (ze strony getemoji)";
  input.value = "";
  randomChar = true;
  createGame();
  input.addEventListener("keyup", (e) => {
    onKeyup(e);
    refreshRandomChar();
  });
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
  switchMode.style.display = "none";
  progressBarBox.style.display = "block";
  progressBar("end", 9);
}

function gameOver() {
  hackFunction.style.display = "none";
  hackFunction2.style.display = "none";
  hackTitleBox.style.display = "none";
  progressBarBox.style.display = "block";
  hackInfoBox.style.display = "";
  switchMode.style.display = "none";
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
        switchMode.style.display = "";
        progressBar("game", playTime);
        return;
      }
      if (w === "game") {
        gameOver();
        return;
      }
      if (w === "end") {
        hackFunction.style.display = "none";
        hackFunction2.style.display = "none";
        hackTitleBox.style.display = "none";
        hackOptions.style.display = "";
        buttons.style.display = "";
        switchMode.style.display = "none";
        progressBarBox.style.display = "none";
        hackInfoBox.style.display = "none";
      }
    }
  }

  clearInterval(progressBarInterval);
  progressBarInterval = setInterval(updateProgress, t);
}

function createGame() {
  hackFunction.innerHTML = "";

  let shuffle = shuffleArray(riddles);
  newRiddles = shuffle.slice(0, 6);

  for (let i = 0; i < newRiddles.length; i++) {
    const el = document.createElement("div");
    el.classList.add("riddle");
    el.setAttribute("id", i);
    el.dataset.value = newRiddles[i].value;

    el.textContent = randomCharacters(newRiddles[i].text);
    hackFunction.appendChild(el);
  }
}

function randomCharacters(text) {
  return text
    .split("")
    .map((char) => {
      if (Math.random() < 0.25 && characters.includes(char)) {
        return (char =
          characters[Math.floor(Math.random() * characters.length)]);
      }
      return char;
    })
    .join("");
}

function check() {
  const elements = document.querySelectorAll(".riddle");
  const arrayEl = Array.from(elements);

  if (arrayEl.every((e) => e.classList.contains("good"))) {
    gameWin();
  } else {
    gameOver();
  }
}

function refreshRandomChar() {
  const elements = document.querySelectorAll(".riddle");

  elements.forEach((el, index) => {
    const originalText = newRiddles[index].text;
    const newText = randomCharacters(originalText);

    if (randomChar) {
      el.textContent = newText;
    } else {
      el.textContent = originalText;
    }
  });
}

function onKeyup(evt) {
  const elements = document.querySelectorAll(".riddle");
  const inputNumbers = [];

  elements.forEach((el, index) => {
    switch (el.dataset.value) {
      case "leapyear": {
        let afterSpace = evt.target.value.split(" ");
        if (afterSpace.length > 1) {
          let year = parseInt(afterSpace[1].match(/\d+/));

          if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            el.classList.add("good");
          } else {
            el.classList.remove("good");
          }
        }

        break;
      }

      case "addition": {
        let sum = 0;

        for (let i = 0; i < evt.target.value.length; i++) {
          if (!isNaN(evt.target.value[i]))
            inputNumbers.push(parseInt(evt.target.value[i]));
        }

        inputNumbers.forEach((num) => {
          if (isNaN(num)) {
            return;
          } else {
            sum += num;
          }
        });

        if (sum === randomNumber) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }
      case "weak": {
        let muscle = /[💪🏼💪🏻💪💪🏽💪🏾💪🏿]/
        if (muscle.test(evt.target.value)) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }
      case "romeletter": {
        let romeLetters = /[IVXLCDM]/;

        if (romeLetters.test(evt.target.value)) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }
      case "diactric": {
        let diactricLetter = /[ĄĆĘÓŚŹŻŁŃ]+/i;

        if (diactricLetter.test(evt.target.value)) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }
      case "emoji": {
        if (evt.target.value.includes(randomEmoji)) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }
      case "length": {
        if (evt.target.value.length >= 6) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }
      case "digit": {
        let digit = /\d/;

        if (digit.test(evt.target.value)) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }

      case "special": {
        let specialCharacter = /[!@#$%^&*()_+}{|:"<>?~]/;

        if (specialCharacter.test(evt.target.value)) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }
      case "hot": {
        if (
          !evt.target.value.includes("🔥") &&
          evt.target.value.includes("🧊")
        ) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }
      case "uppercase": {
        let uppercase = /[A-ZĄĆĘÓŚŹŻŁŃ]/;

        if (uppercase.test(evt.target.value)) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }

      case "element": {
        if (
          evt.target.value.includes(randomElement.symbol) &&
          evt.target.value.includes(randomElement.pos)
        ) {
          el.classList.add("good");
        } else {
          el.classList.remove("good");
        }

        break;
      }

      case "month":
        {
          let monthNames =
            /(styczeń|luty|marzec|kwiecień|maj|czerwiec|luty|sierpień|wrzesień|październik|listopad|grudzień)/i;
          if (monthNames.test(evt.target.value)) {
            el.classList.add("good");
          } else {
            el.classList.remove("good");
          }
        }

        break;
    }
  });
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function shuffleArray(array) {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

function switchCharMode() {
  if (randomChar) {
    randomChar = false;
  } else {
    randomChar = true;
  }

  refreshRandomChar();
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

  $(".enter").on("click", function () {
    check();
  });

  $("#input").on("input", function (e) {
    let inputValue = $(this).val();

    if (inputValue.length > 20) {
      inputValue = inputValue.slice(0, 24);
      $(this).val(inputValue);
    }
  });

  $(document).on("keyup", function (e) {
    if (e.which === 13) check();
  });
});
