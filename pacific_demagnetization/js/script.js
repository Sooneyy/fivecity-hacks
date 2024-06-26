// Wartości czasowe są dzielone przez 3 -> np. endTime: 12 to 4 sekundy
const gameConfig = {
    playTime: 9, 
    startTime: 12, 
    endTime: 12, 
    gameStarted: false,
    hackTitle: "Wpisz odpowiedni ciąg znaków",
    hackInfo: "",
}

const app = Vue.createApp({
    data(){
        return{
            ...gameConfig,
            timeInterval: null,
            hackTimerInterval: null,
            progressInterval: null,
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
            chars: "abcdefghijklmnopqrstuwxyz",
            currentIndex: 0,
            lettersArr: [],
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

            this.gameType = "start";
            this.gameResult = false;
            this.hackTimerStart();
            this.initGame();
        },
        initGame(){
            this.hackInfo = "Przygotuj się";
            this.lettersArr = [];
            this.currentIndex = 0;

            this.showHackBox = true;
            this.showHackTimer = true;

            switch(this.gameType){
                case "start": {
                    this.updateProgress(this.startTime);

                    this.gameType = "inProgress";
                    break;
                }
                case "inProgress": {
                    this.updateProgress(this.playTime);

                    this.gameStarted = true;
                    this.createGame();

                    this.gameType = "end";
                    break;
                }
                case "end": {
                    this.updateProgress(this.endTime);

                    this.gameStarted = false;
                    this.hackInfo = this.gameResult ? "Hack Udany" : "Hack Nieudany";

                    this.gameType = "endGame";
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
        createGame(){
            for(let i = 0; i < 15; i++){
                let randomLetter = this.chars.charAt(Math.floor(Math.random() * this.chars.length));

                this.lettersArr.push({
                    letter: randomLetter,
                    good: false,
                });
            }
        },
        // Progress
        updateProgress(time){
            this.width = 1000;

            clearInterval(this.progressInterval);
            this.progressInterval = setInterval(this.updateProgressWidth, time);
        },
        updateProgressWidth(){
            if(this.width > 0){
                this.width -= 3;
            }else{
                if(this.gameType === "endGame"){
                    clearInterval(this.progressInterval);
                    clearInterval(this.hackTimerInterval);
                    console.log(this.gameType)
                    this.showHackBox = false;
                    this.showHackTimer = false;
                }else{
                    this.initGame();
                }
            }
        },
        // Event
        onKeypress(e){
            if(this.gameStarted){
                if(e.key.toLowerCase() === this.lettersArr[this.currentIndex].letter){
                    this.lettersArr[this.currentIndex].good = true;
                    this.currentIndex++;
                }else{
                    this.gameLose();
                    return;
                }

                if(this.lettersArr.every(el => el.good)){
                    this.gameWin();
                }
            }else return;
        }
    },
    mounted(){
        window.addEventListener('keypress', this.onKeypress);

        this.timeInterval = setInterval(this.timeCounter, 1000);

        this.timeCounter();

        let time;
        do{
            time = prompt("Wpisz ilość czasu na hacka (juz nie wiem ile tam jest albo 3s albo 4s)\nmin - 1\nmax - 8");
            
            this.playTime = Number(time) * 3;
        }while(!time || Number(time) < 1 || Number(time) > 8 || !/\d/.test(time))
    },
    beforeUnmount(){
        window.removeEventListener('keypress', this.onKeypress);
        clearInterval(timeInterval);
    },
}).mount("#app");