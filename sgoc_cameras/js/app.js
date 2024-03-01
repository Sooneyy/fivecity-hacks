const hackBox = document.querySelector(".hack-box");
const hackFunction = document.querySelector(".hack-fn");
const hackTitleBox = document.querySelector(".hack-title");
const hackTitle = document.getElementById("hack-title-text");
const hackInfoBox = document.querySelector(".hack-info");
const hackInfo = document.getElementById("hack-info-text");
const questionEl = document.querySelector(".question");
const answerEls = document.querySelectorAll(".answer");
const answerButtons = document.querySelectorAll(".answer-box");
const progressBarBox = document.querySelector(".hack-progress");
const progressBarFn = document.getElementById("progress-bar-fn");
const progressTimer = document.querySelector(".progress-timer");
const timer = document.querySelector(".timer");

var progressBarInterval, timerInterval, progressTimerInterval;
var playTime = 0;
var questionTypes = Object.keys(questions);
var levelCount = 0;
var canAnswer = false;
var question;
var answers;
var reversed;

function hack() {
  hackBox.style.display = 'none';
  hackInfoBox.style.display = "none";
  hackTitleBox.style.display = "none";
  hackFunction.style.display = "none";
  progressBarBox.style.display = "none";
  progressTimer.style.display = "none";
  setTimeout(() => {
    document.getElementById("xd").style.display = "none";
  }, 5000)
}

function startHack() {
  levelCount = 0;
  canAnswer = true;
  hackTimer();
  progressTimer.style.display = "none";
  clearInterval(progressTimerInterval);
  hackBox.style.display = '';
  hackFunction.style.display = "none";
  hackTitleBox.style.display = "none";
  hackInfoBox.style.display = "";
  generateQuestion();
  reversed = Math.random() > 0.5 ? 1 : 0;
  reversed ? hackFunction.classList.add("reversed") : hackFunction.classList.remove("reversed");
  let op = ["+", "-"];
  hackBox.style.transform = `translateY(${op[Math.floor(Math.random() * op.length)]}${Math.floor(Math.random() * 20) + 7}px)`;
  hackBox.style.transform = `translateY(${op[Math.floor(Math.random() * op.length)]}${Math.floor(Math.random() * 10) + 5}px)`;
  hackBox.style.transform = `rotate(${op[Math.floor(Math.random() * op.length)]}${Math.floor(Math.random() * 10) + 5}deg)`;
  hackInfo.textContent = "Przygotuj się...";
  progressBarBox.style.display = "block";
  progressBar("start", 9);
}

function gameWin() {
  hackTitleBox.style.display = "none";
  hackFunction.style.display = "none";
  hackInfoBox.style.display = "";
  hackInfo.textContent = "Hack udany";
  progressTimer.style.display = "none";
  progressBarBox.style.display = "block";
  progressBar("end", 9);
}

function gameOver() {
  hackTitleBox.style.display = "none";
  hackFunction.style.display = "none";
  hackInfoBox.style.display = "";
  hackInfo.textContent = "Hack nieudany";
  progressTimer.style.display = "none";
  progressBarBox.style.display = "block";
  clearInterval(progressTimerInterval);
  progressBar("end", 9);
}

function progressBar(w, t) {
  let width = 1000;
  function updateProgress() {
    if (width > 0) {
      if (w === "start" || w === "end") width -= 3;
      else width--;
      progressBarFn.style.width = width * 100 / 1000 + "%";
    } else {
      if (w === "start") {
        hackTitleBox.style.display = "";
        hackFunction.style.display = "";
        hackTitle.textContent = "Odpowiedz na pytanie i kliknij odpowiednią odpowiedź";
        hackInfoBox.style.display = "none";
        progressTimer.style.display = "";
        playTime = randomInt(4, 8);
        progressTime(playTime);
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
        progressBarBox.style.display = "none";
        hackInfoBox.style.display = "none";
        timer.style.display = "none";
        hackBox.style.display = 'none';
        document.getElementById("close").removeEventListener("click", gameOver);
      }
    }
  }

  clearInterval(progressBarInterval);
  progressBarInterval = setInterval(updateProgress, t);
}

function progressTime(time){
  let startTime = new Date();
  startTime.setSeconds(startTime.getSeconds() + time);
  
  let updateTime = () => {
    let now = new Date();
    let timeDiff = new Date();

    timeDiff.setTime(startTime - now);

    if(timeDiff <= 0){
      gameOver();
    }

    progressTimer.textContent = 
      timeDiff.getMinutes().toString().padStart("2", 0) + ":" + 
      timeDiff.getSeconds().toString().padStart("2", 0) + ":" + 
      timeDiff.getMilliseconds().toString().padStart("3", 0);
  }

  progressTimerInterval = setInterval(updateTime, 1);
}

function hackTimer(){
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
}

function generateQuestion(){
  let randomType = questionTypes[randomInt(0, questionTypes.length)];
  operators = shuffle(operators);

  callFunc(randomType);

  answers = [...question.badAnswers];

  answers = answers.slice(0, 3);
  answers.push(question.answer);

  answers = shuffle(answers);
  answers = checkRepeatability(answers);

  questionEl.innerHTML = question.question;

  answerEls.forEach((el, i) => {
    el.innerHTML = answers[i];
  })

  answerButtons.forEach((el, i) => {
    el.onclick = function (){
      if(canAnswer) checkAnswer(answerEls[i].textContent);
      else return;
    };
  })

  answerButtons.forEach((el) => {
    el.classList.remove("good");
    el.classList.remove("bad");
    el.classList.remove("shown");
  })
}

function nextQuestion(){
  hackTitleBox.style.display = "none";
  hackFunction.style.display = "none";
  hackInfo.textContent = "Generowanie następnego pytania...";
  hackInfoBox.style.display = "";
  progressTimer.style.display = "none";
  clearInterval(progressTimerInterval);
  reversed = Math.random() > 0.5 ? 1 : 0;
  reversed ? hackFunction.classList.add("reversed") : hackFunction.classList.remove("reversed");
  generateQuestion();
  progressBar("start", 6);
}

function checkAnswer(answer){
  if(answer == question.answer){
    if(levelCount < 7){
      levelCount++;
      document.getElementById("level-count").textContent = levelCount;
      nextQuestion();
      return;
    }else{
      gameWin();
      return;
    }
  }

  answerButtons[answers.indexOf(question.answer)].classList.add('good');
  canAnswer = false;

  answerButtons.forEach((el, i) => {
    if(!el.classList.contains("good")) el.classList.add('bad');
    el.classList.add('shown');
  });

  clearInterval(progressTimerInterval);
  progressTime(4);
  progressBar("game", 3);
}

function callFunc(type){
  if(type === "teoria"){
    drawTheoryNumbers();
    question = questions[type](natural, rational, integer, reversed)[randomInt(0, questions[type](natural, rational, integer, reversed).length)];
  }
  if(type === "silnia") {
    drawFactorial();
    question = questions[type](factorial)[randomInt(0, questions[type](factorial).length)];
  };
  if(type === "pola") {
    let types = Object.keys(areasOfQuadrangles);

    for(let i = 0; i < types.length; i++){
      calculateShapeAreas(types[i]);
    }

    question = questions[type](areasOfQuadrangles)[randomInt(0, questions[type](areasOfQuadrangles).length)];
  }
  if(type === "dodawanie"){
    let types = Object.keys(addition);
    
    for(let i = 0; i < types.length; i++){
      drawAddNumbers(types[i]);
    }
    
    question = questions[type](addition)[randomInt(0, questions[type](addition).length)];
  } 
  if(type === "bezwzgledna") {
    let n = absolute();
    questions.bezwzgledna(n);
    question = questions[type](n)[randomInt(0, questions[type](n).length)];
  }
  if(type === "ulamki"){
    drawFractionNumbers();
    question = questions[type](fractions)[randomInt(0, questions[type](fractions).length)];
  } 
  if(type === "potegi"){
    let types = Object.keys(power);
    
    for(let i = 0; i < types.length; i++){
      drawPowerNumbers(types[i]);
    }

    question = questions[type](power)[randomInt(0, questions[type](power).length)];
  } 
  if(type === "logarytmy"){
    drawLogNumbers();
    question = questions[type](log)[randomInt(0, questions[type](log).length)];
  } 
  if(type === "pierwiastki"){
    drawSqrtNumbers();
    question = questions[type](sqrt)[randomInt(0, questions[type](sqrt).length)];
  } 
  if(type === "procenty"){
    drawPercentNumbers();
    question = questions[type](percent)[randomInt(0, questions[type](percent).length)];
  }
}

setInterval(function() {
  let time = new Date();
  let hours = time.getHours() <= 12 ? time.getHours() : time.getHours() - 12;
  let midDay = time.getHours() <= 12 ? "AM" : "PM";

  document.querySelector(".current-time").textContent = `${midDay} ${hours}:${time.getMinutes().toString().padStart("2", 0)}`;
}, 1000)




