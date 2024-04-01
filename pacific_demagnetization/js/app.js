const hackBox = document.querySelector('.hack-box');
const hackFunction = document.querySelector('.hack-fn');
const hackTitleBox = document.querySelector('.hack-title');
const hackTitle = document.getElementById('hack-title-text');
const hackInfoBox = document.querySelector('.hack-info');
const hackInfo = document.getElementById('hack-info-text');
const buttons = document.querySelector('.play-buttons');
const progressBarBox = document.querySelector('.hack-progress')
const progressBarFn = document.getElementById('progress-bar-fn');
const timer = document.querySelector('.timer');

var progressBarInterval, timerInterval;
var playTime = 9;
var height = 3;
var width = 5;
var chars = "abcdefghijklmnopqrstuwxyz";
var currentIndex = 0;
var good = 0;

function hack() {
    hackInfoBox.style.display = 'none';
    hackBox.style.display = 'none';
    hackFunction.style.display = 'none';
    progressBarBox.style.display = 'none';
}

function startHack() {
    good = 0;
    currentIndex = 0;
    let start = new Date();
    let updateTime = () => {
        timer.style.display = "block";
        let now = new Date();
        let diff = new Date();
    
        diff.setTime(now - start);
        timer.textContent = diff.getMinutes().toString().padStart("2", 0) + ":" + diff.getSeconds().toString().padStart("2", 0);
    }
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTime, 1000);
    createLetters();
    window.removeEventListener("keypress", checkLetter);
    window.addEventListener("keypress", checkLetter);
    hackTitle.innerHTML = 'Wpisz odpowiedni ciąg znaków';
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackBox.style.display = '';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Przygotuj się...';
    progressBarBox.style.display = 'block';
    progressBar('start', 12);
}

function gameWin() {
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack udany';
    progressBarBox.style.display = 'block';
    progressBar('end', 12);
}

function gameOver() {
    hackFunction.style.display = 'none';
    hackTitleBox.style.display = 'none';
    progressBarBox.style.display = 'block';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack nieudany'
    gameStarted = false;
    progressBar('end', 12);
}

function progressBar(w, t) {
    let width = 1000;
    function updateProgress() {
        if (width > 0) {
            if (w === 'start' || w === 'end' || w === 'game') width -= 3;
            progressBarFn.style.width = (width * 100) / 1000 + '%';
        } else {
            if (w === 'start') {
                gameStarted = true;
                hackTitleBox.style.display = '';
                hackInfoBox.style.display = 'none';
                hackFunction.style.display = '';
                progressBar('game', playTime);
                return;
            }
            if (w === 'game') {
                gameOver();
                return;
            }
            if (w === 'end') {
                hackFunction.style.display = 'none';
                hackTitleBox.style.display = 'none';
                progressBarBox.style.display = 'none';
                hackInfoBox.style.display = 'none';
                hackBox.style.display = 'none';
                clearInterval(progressBarInterval);
            }
        }
    }

    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(updateProgress, t)
}

function createLetters(){
    hackFunction.innerHTML = '';

    for(let i = 0; i < height * width; i++){
        let randomLetter = chars.charAt(Math.floor(Math.random() * chars.length));

        const el = document.createElement('div');

        el.classList.add("box-letter");
        el.textContent = randomLetter;
        el.setAttribute("id", i);

        hackFunction.appendChild(el);
    }

    document.getElementsByClassName("box-letter")[0].classList.add("current");
}

function checkLetter(e){
    const elements = document.getElementsByClassName("box-letter");

    let pressedKey = e.key;

    if(gameStarted){
        if(pressedKey.toLowerCase() == elements[currentIndex].textContent && good < 14){
            elements[currentIndex].classList.add("good");
            elements[currentIndex].classList.remove("current");
    
            currentIndex++;
            good++;
            
            elements[currentIndex].classList.add("current");
            return;
        }else if(pressedKey == elements[currentIndex].textContent && good === 14){
            gameWin();
        }else{
            gameOver();
        }
    }
}

setInterval(function() {
    let time = new Date();
    let hours = time.getHours() <= 12 ? time.getHours() : time.getHours() - 12;
    let midDay = time.getHours() <= 12 ? "AM" : "PM";
  
    document.querySelector(".current-time").textContent = `${midDay} ${hours}:${time.getMinutes().toString().padStart("2", 0)}`;
}, 1000)