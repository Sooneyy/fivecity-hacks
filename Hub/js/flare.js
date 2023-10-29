const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const flareCount = randomInteger(2, 5);
const minSpeed = 0.2;
const maxSpeed = 0.6; 

// src - fivecity.net
class Flare {
    xPos = 0;
    yPos = 0;
    xSpeed = 0;
    ySpeed = 0;
    size = 0;
    canvas;

    constructor(canvas){
        this.canvas = canvas;
        this.xPos = Math.floor(Math.random() * canvas.sizeX);
        this.yPos = Math.floor(Math.random() * canvas.sizeY);
        this.xSpeed = randomInteger(minSpeed, maxSpeed);
        this.ySpeed = randomInteger(minSpeed, maxSpeed);
        this.size = canvas.sizeX / 3;
    }

    update(number){
        this.xPos += this.xSpeed * number / 20;
        this.yPos += this.ySpeed * number / 20;

        if(this.xPos > this.canvas.sizeX){
            this.xSpeed *= -1;
            this.xPos = this.canvas.sizeX;
        }

        if(this.xPos < 0){
            this.xSpeed *= -1;
            this.xPos = 0;
        }

        if(this.yPos > this.canvas.sizeY){
            this.ySpeed *= -1;
            this.yPos = this.canvas.sizeY;
        }

        if(this.yPos < 0){
            this.ySpeed *= -1;
            this.yPos = 0;
        }

        this.draw();
    }

    draw(){
        const radialGradient = this.canvas.context.createRadialGradient(this.xPos, this.yPos, 0, this.xPos, this.yPos, this.size);
        radialGradient.addColorStop(0, "#24275A45");
        radialGradient.addColorStop(1, "transparent");

        this.canvas.context.fillStyle = radialGradient;
        this.canvas.context.arc(this.xPos, this.yPos, this.size, 0, 360);
        this.canvas.context.fill();
    }
}

class Display {
    sizeX = 0;
    sizeY = 0;
    canvasDisplay;
    context;
    flares = [];

    constructor(canvasElement){
        this.canvasDisplay = canvasElement;
        this.context = this.canvasDisplay.getContext("2d");
        this.refreshSize();

        for(let i = 0; i < flareCount; i++){
            this.flares.push(new Flare(this));
        }
        
        new ResizeObserver(() => {
            this.refreshSize();
        }).observe(canvasElement);
    }

    refreshSize(){
        this.sizeX = this.canvasDisplay.clientWidth;
        this.sizeY = this.canvasDisplay.clientHeight;
        this.context.canvas.width = this.sizeX;
        this.context.canvas.height = this.sizeY;
    }

    update(number){
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.beginPath();
        this.context.closePath();

        for(const flare of this.flares){
            flare.update(number);
        }
    }
}

const canvas = document.getElementById("canvas");
const flare = new Display(canvas);

let then = new Date().getTime();

let update = () => {
    let now = new Date().getTime();
    flare.update(now - then);
    then = now;

    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
