const hackBox = document.querySelector('.hack-box');
const hackFunction = document.querySelector('.hack-fn');
const hackTitleBox = document.querySelector('.hack-title');
const hackTitle = document.getElementById('hack-title-text');
const hackInfoBox = document.querySelector('.hack-info');
const hackInfo = document.getElementById('hack-info-text');
const startButton = document.querySelector('.start-hack');
const buttons = document.querySelector('.play-buttons');
const progressBarBox = document.querySelector('.hack-progress')
const progressBarFn = document.getElementById('progress-bar-fn');
const hackOptions = document.querySelector('.hack-options');
const modal = document.getElementById('modal');

var progressBarInterval;
var playTime = 7;
var height = 6;
var width = 6;
var number = 0;
var antiSolverMode = false;
var isOver = false;
var wrong = 0;
var lastPosition, bestRoute, goodPositions;

function hack() {
    hackInfoBox.style.display = 'none';
    hackFunction.style.display = 'none';
    progressBarBox.style.display = 'none';
}

function startHack() {
    isOver = false;
    lastPosition = 0;
    wrong = 0;
    hackOptions.style.display = 'none';
    buttons.style.display = 'none';
    createGrid();
    hackTitle.innerHTML = 'Dotrzyj z lewego górnego rogu, do prawego dolnego';
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Przygotuj się...';
    progressBarBox.style.display = 'block';
    progressBar('start', 9);
}

function gameWin() {
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack udany';
    progressBarBox.style.display = 'block';
    progressBar('end', 9);
}

function gameOver() {
    hackFunction.style.display = 'none';
    hackTitleBox.style.display = 'none';
    progressBarBox.style.display = 'block';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack nieudany'
    progressBar('end', 9);
}

function progressBar(w, t) {
    let width = 1000;
    function updateProgress() {
        if (width > 0) {
            if (w === 'start' || w === 'end' || w === 'game') width -= 3;
            else width--;
            progressBarFn.style.width = (width * 100) / 1000 + '%';
        } else {
            if (w === 'start') {
                hackTitleBox.style.display = '';
                hackInfoBox.style.display = 'none';
                hackFunction.style.display = '';
                const squares = document.querySelectorAll('.square');
                setTimeout(() => {
                    squares.forEach((sqr) => {
                        if (!sqr.classList.contains('hidden') && !isOver) {
                            sqr.classList.add('hidden');
                        } else return;
                    })
                }, (playTime * 1000) / 2)
                progressBar('displaypath', playTime);
                return;
            }
            if(w === 'displaypath'){
                isOver = true;
                document.querySelectorAll('.breathing').forEach((b) => b.classList.remove('breathing'));
                document.querySelectorAll('.square').forEach((s) => s.classList.remove('hidden'));
                let squares = document.querySelectorAll('.square');
                goodPositions.push(35);
                goodPositions.forEach(pos => {
                    squares[pos].classList.add('right-path');
                });
                progressBar('game', 9)
            }
            if (w === 'game') {
                gameOver();
                return;
            }
            if (w === 'end') {
                hackFunction.style.display = 'none';
                hackTitleBox.style.display = 'none';
                hackOptions.style.display = '';
                buttons.style.display = '';
                progressBarBox.style.display = 'none';
                hackInfoBox.style.display = 'none';
            }
        }
    }

    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(updateProgress, t)
}

function createGrid() {
    hackFunction.innerHTML = '';

    let breathingPosition = 1;
    bestRoute = generateRoute(breathingPosition);
    goodPositions = Object.keys(bestRoute);
    console.log(bestRoute)

    for (let i = 0; i < 36; i++) {
        const el = document.createElement('div');
        el.classList.add('square')

        el.dataset.pos = i.toString();

        let text;
        switch (i) {
            case 0: {
                text = 'START'
                break;
            }
            case 35: {
                text = 'EXIT';
                break;
            }
            case breathingPosition:
            case (breathingPosition * 6): {
                el.classList.add('breathing');
                text = random(1, 4);
                break;
            }
            default: {
                text = random(1, 5);
            }
        }
        if (goodPositions.includes(i.toString())) {
            text = bestRoute[i];
        }

        el.textContent = text;
        hackFunction.appendChild(el)

        el.onclick = function () {
            const pos = parseInt(this.dataset.pos);
            number = parseInt(this.textContent);

            if (pos === 0) return;

            if (isOver) return;

            if (lastPosition === 0) {
                const breathingEls = document.querySelectorAll('.breathing');
                const squares = document.querySelectorAll('.square');

                squares.forEach((sqr) => {
                    sqr.classList.add('hidden');
                })

                breathingEls.forEach((el) => {
                    el.classList.remove('breathing');
                })

                if (pos === breathingPosition || pos === breathingPosition * 6) {
                    lastPosition = pos;
                    this.classList.add('good');
                } else {
                    this.classList.add('bad');
                    wrong++;
                }
            } else {
                let jump = parseInt(document.querySelectorAll('.square')[lastPosition].textContent, 10);
                let maxV = maxVertical(lastPosition);
                let maxH = maxHorizontal(lastPosition);

                if (jump <= maxH && pos === lastPosition + jump) {
                    lastPosition = pos;
                    this.classList.add('good');
                } else if (jump <= maxV && pos === lastPosition + (jump * 6)) {
                    lastPosition = pos;
                    this.classList.add('good');
                } else {
                    wrong++;
                    this.classList.add('bad');
                }
            }

            if (wrong === 3) {
                isOver = true;
                document.querySelectorAll('.breathing').forEach((b) => b.classList.remove('breathing'));
                document.querySelectorAll('.square').forEach((s) => s.classList.remove('hidden'));
                let squares = document.querySelectorAll('.square');
                goodPositions.push(35);
                goodPositions.forEach(pos => {
                    squares[pos].classList.add('right-path');
                });
                progressBar('game', 9)
            }

            if (lastPosition === 35 && document.querySelectorAll('.square')[lastPosition].classList.contains('good')) {
                gameWin();
            }
        }
    }
}

function maxVertical(pos) {
    return Math.floor((35 - pos) / 6);
}

function maxHorizontal(pos) {
    let max = (pos + 1) % 6;
    if (max > 0) return 6 - max;
    else return 0;
}

function generateNextPosition(pos) {
    let maxV = maxVertical(pos);
    let maxH = maxHorizontal(pos);

    if (maxV === 0) {
        let newPosition = random(random(1, maxH), maxH);
        return [newPosition, pos + newPosition];
    }
    if (maxH === 0) {
        let newPosition = random(random(1, maxV), maxV);
        return [newPosition, pos + (newPosition * 6)];
    }
    if (random(1, 1000) % 2 === 0) {
        let newPosition = random(random(1, maxH), maxH);
        return [newPosition, pos + newPosition];
    } else {
        let newPosition = random(random(1, maxV), maxV);
        return [newPosition, pos + (newPosition * 6)];
    }
}

function generateRoute(startPos) {
    let route = [];
    if (random(1, 1000) % 2 === 0) {
        startPos *= 6;
    }
    while (startPos < 35) {
        let newPos = generateNextPosition(startPos);
        route[startPos] = newPos[0];
        startPos = newPos[1];
    }

    return route;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

statisticsButton.addEventListener('click', () => {
    statisticsButton.classList.toggle('opened');
    statisticsButtonArrow.classList.toggle('open');
    statisticsMenu.classList.toggle('collapsed');
})

function howToPlay() {
    modal.classList.remove('modal-hidden');
    modal.classList.add('modal-revealed');
}

function closeModal() {
    modal.classList.remove('modal-revealed');
    modal.classList.add('modal-hidden');
}

$(document).ready(function () {

    $("#game-mode").on("change", function () {
        $(this).prop("checked") ? $("#mode").text("Włączony") : $("#mode").text("Wyłączony");
        $(this).prop("checked") ? antiSolverMode = true : antiSolverMode = false;
    })
    
    $(".start-hack").on("click", function() {
        let randomOperator = Math.random() < 0.5 ? "" : "-";

        if(antiSolverMode){
            $(".hack-box").css({
                "transform": `rotate(${randomOperator}${random(1,5)}deg) translate(${randomOperator}${random(80, 105)}px, ${randomOperator}${random(30,45)}px)`,
            });
        }else {
            $(".hack-box").css({
                "transform": `rotate(0deg) translate(0, 0)`,
            });
        }
    })
})
