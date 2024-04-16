const gameConfig = {
    playTime: 10, 
    startTime: 4, 
    endTime: 4, 
    canClick: false,
    hackTitle: "Wciśnij bloki w dobrej kolejności",
    hackInfo: "",
}

const app = Vue.createApp({
    data(){
        return{
            ...gameConfig,
            timeInterval: null,
            hackTimerInterval: null,
            progressInterval: null,
            offsetTimeout: null,
            movingInterval: null,
            hours: 0,
            minutes: 0,
            midDay: "",
            hackTimeStart: 0,
            hackMinutes: 0,
            hackSeconds: 0,
            showHackTimer: false,
            showHackBox: false,
            gameType: "start",
            gameResult: false,
            width: 1000,
            numbersArr: [],
            numberToClick: 1,
            randomColors: ["#0384FF", "#FE0298", "#FFC601", "#1FC900", "#E66500", "#005DE6", "#6D22F4"]
        }
    },
    computed: {
        getProgressWidth(){
            return this.width / 1000 * 100;
        }
    },
    methods: {
        // Timers
        timeCounter(){
            let time = new Date();

            this.hours = time.getHours() < 12 ? time.getHours() : time.getHours() - 12;
            this.minutes = String(time.getMinutes()).padStart(2, "0");
            this.midDay = time.getHours() < 12 ? "AM" : "PM";
        },
        hackTimerStart(){
            this.hackTimeStart = new Date();

            this.hackTimerCounter();

            clearInterval(this.hackTimerCounter);
            hackTimerInterval = setInterval(this.hackTimerCounter, 1000);
        },
        hackTimerCounter(){
            let now = new Date();
            let timeDiff = new Date();

            timeDiff.setTime(now - this.hackTimeStart);

            this.hackMinutes = String(timeDiff.getMinutes()).padStart(2, "0");
            this.hackSeconds = String(timeDiff.getSeconds()).padStart(2, "0");
        },
        // Game Functions
        startGame(){
            if(this.showHackBox) return;

            this.numberToClick = 1;
            this.numbersArr = [];
            this.canClick = false;

            this.gameType = "start";
            this.hackTimerStart();
            this.initGame();
        },
        initGame(){
            this.hackInfo = "Przygotuj się";
            this.numbersArr = [];
            this.numberToClick = 1;

            this.showHackBox = true;
            this.showHackTimer = true;

            switch(this.gameType){
                case "start": {
                    this.updateProgress(this.startTime, this.gameType);
                    break;
                }
                case "inProgress": {
                    this.updateProgress(this.playTime, this.gameType);

                    this.gameStarted = true;
                    this.createNumbers();
                    break;
                }
                case "end": {
                    this.updateProgress(this.endTime, this.gameType);

                    this.gameStarted = false;
                    this.hackInfo = this.gameResult ? "Hack Udany" : "Hack Nieudany";
                    break;
                }
            }
        },
        gameWin(){
            this.gameType = "end";
            this.gameResult = true;
            this.initGame();
        },
        gameLose(){
            this.gameType = "end";
            this.gameResult = false;
            this.initGame();
        },
        createNumbers(){
            for(let i = 1; i <= 6; i++){
                this.numbersArr.push({
                    number: i,
                    good: false,
                    color: this.randomColors[Math.floor(Math.random() * this.randomColors.length)],
                    x: this.randomInt(15, 635),
                    y: this.randomInt(15, 435),
                    velocityX: [0.25, 0.5, 0.75, 1.25, 1.5][Math.floor(Math.random() * 5)],
                    velocityY: [0.25, 0.5, 0.75, 1.25, 1.5][Math.floor(Math.random() * 5)],
                    directionX: Math.floor > 0.5 ? 1 : -1,
                    directionY: Math.floor > 0.5 ? 1 : -1,
                });
            }

            setTimeout(() => {
                this.canClick = true;
            }, 4000)

            this.movingNumbers();
            this.randomOffset();
        },
        randomOffset(){
            for(let i = 0; i < this.numbersArr.length; i++){;
                let randomVelocityX = [0.25, 0.5, 0.75, 1.25, 1.5][Math.floor(Math.random() * 5)];
                let randomVelocityY = [0.25, 0.5, 0.75, 1.25, 1.5][Math.floor(Math.random() * 5)];
                let randomDirectionX = Math.floor > 0.5 ? 1 : -1;
                let randomDirectionY = Math.floor > 0.5 ? 1 : -1;

                this.numbersArr[i].velocityX = randomVelocityX;
                this.numbersArr[i].velocityY = randomVelocityY;
                this.numbersArr[i].directionX = randomDirectionX;
                this.numbersArr[i].directionY = randomDirectionY;
            }

            this.offsetTimeout = setTimeout(this.randomOffset, 3500);
        },
        movingNumbers(){
            this.movingInterval = setInterval(() => {
                for(let i = 0; i < this.numbersArr.length; i++){
                    this.numbersArr[i].x += this.numbersArr[i].velocityX * this.numbersArr[i].directionX;
                    this.numbersArr[i].y += this.numbersArr[i].velocityY * this.numbersArr[i].directionY;

                    if(this.numbersArr[i].x <= 0 || this.numbersArr[i].x >= 652) this.numbersArr[i].directionX *= -1;
                    if(this.numbersArr[i].y <= 0 || this.numbersArr[i].y >= 452) this.numbersArr[i].directionY *= -1;

                    if(this.numbersArr[i].x <= 0) this.numbersArr[i].x = 0;
                    if(this.numbersArr[i].x >= 625) this.numbersArr[i].x = 625;
                    if(this.numbersArr[i].y <= 0) this.numbersArr[i].y = 0;
                    if(this.numbersArr[i].y >= 452) this.numbersArr[i].y = 452;
                }
            }, 10)
        },
        randomInt(min, max){
            return Math.floor(Math.random() * (max - min)) + min;
        },
        updateProgress(time, type){
            this.width = 1000;

            clearInterval(this.progressInterval);
            this.progressInterval = setInterval(() => {
                this.updateProgressWidth(type)
            }, time);
        },
        updateProgressWidth(type){
            if(this.width > 0){
                this.width--;
            }else{
                if(type === "start"){
                    this.gameType = "inProgress";

                    this.initGame();
                    return;
                }
                else if(type === "inProgress"){
                    this.gameLose();
                    return;
                }
                if(this.gameType === "end"){
                    clearInterval(this.progressInterval);
                    clearInterval(this.hackTimerInterval);
                    clearInterval(this.movingInterval);
                    clearTimeout(this.offsetTimeout);
                    this.showHackBox = false;
                    this.showHackTimer = false;
                }
            }
        },
        onClick(i){
            if(this.canClick){
                if(this.numberToClick === this.numbersArr[i - 1].number){
                    this.numbersArr[i - 1].good = true;
    
                    if(this.numberToClick === 6){
                        this.gameWin();
                        return;
                    }
    
                    this.numberToClick += 1;
                }else{
                    this.gameLose();
                }
            }
        },
    },
    mounted(){
        this.timeInterval = setInterval(this.timeCounter, 1000);

        this.timeCounter();
    },
    beforeUnmount(){
        clearInterval(timeInterval);
    },
}).mount("#app")