const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const shuffle = (arr) => {
    return arr.map((a) => ({value: a, random: Math.random()})).sort((a, b) => a.random - b.random).map((a) => a.value);
}

function drawTheoryNumbers(){
    natural.num = randomInt(0, 100);
    natural.bad = drawBadTheoryNumbers("naturalne");

    rational.num = mark[randomInt(0, mark.length)] + Math.random() > 0.5 ? `${randomInt(0, 15)}/${randomInt(1, 15)}` : `${randomInt(0, 15)}`;
    rational.bad = drawBadTheoryNumbers("wymierne");

    integer.num = mark[randomInt(0, mark.length)] + Math.random() > 0.5 ? `√${Math.pow(randomInt(0, 12), 2)}` : randomInt(0,100);
    integer.bad = drawBadTheoryNumbers("calkowite");
    
    questions["math"].teoria(natural, rational, integer, false);
}

function drawBadTheoryNumbers(type){
    let arr = [];
    let rndNum = Math.random();

    if(type === "naturalne"){
        for(let i = 0; i < 3; i++){       
            if(rndNum < 0.33){
                arr[i] = `${randomInt(0, 10)}/${randomInt(1, 10)}`
            }else if(rndNum >= 0.33 && rndNum < 0.66){
                arr[i] = `-${randomInt(0, 100)}`
            }else if(rndNum >= 0.66){
                let random = randomInt(0, 100);
                let sqrt = Math.sqrt(random).toString();

                if(sqrt.length <= 1){
                    while(sqrt.length <= 1){
                        random = randomInt(0, 100);
                        sqrt = Math.sqrt(random).toString();
                    }
                }else arr[i] = `√${random}`;
            };
        }
    }
    else if(type === "wymierne"){
        for(let i = 0; i < 3; i++){         
            if(rndNum < 0.33){
                arr[i] = Math.random() < 0.5 ? `√` + randomInt(1, 15) : `∛` + randomInt(1, 15);
            }
            else if(rndNum >= 0.33 && rndNum < 0.66){
                arr[i] = Math.random() < 0.5 ? `∜${randomInt(1, 15)}` : `${randomInt(1, 15)}π`;
            }
            else if(rndNum >= 0.66){
                let n = "";
                let nums = "12334567890";
    
                for(let i = 0; i < randomInt(3, 12); i++){
                    if(i === 1){
                        n += ".";
                    }else{
                        n += nums[nums.charAt(Math.floor(Math.random() * nums.length))];
                    }
                }

                arr[i] = n;
            }
        }
    }
    else if(type === "calkowite"){
        for(let i = 0; i < 3; i++){            
            if(rndNum < 0.25){
                arr[i] = `${mark[randomInt(0, mark.length)]}${randomInt(0, 15)}/${randomInt(1, 15)}`;
            }
            else if(rndNum >= 0.25 && rndNum < 0.5){
                arr[i] = Math.random() < 0.5 ? `√` + randomInt(1, 15) : `∛` + randomInt(1, 15);
            }
            else if(rndNum >= 0.5 && rndNum < 0.75){
                arr[i] = Math.random() < 0.5 ? `∜${randomInt(1, 15)}` : `${randomInt(1, 15)}π`;
            }
            else if(rndNum >= 0.75){
                let n = "";
                let nums = "12334567890";
            
                for(let i = 0; i < randomInt(3, 12); i++){
                    if(i === 1){
                        n += ".";
                    }else{
                        n += nums[nums.charAt(Math.floor(Math.random() * nums.length))];
                    }
                }
            
                arr[i] = n;
            }
        }
    }

    return arr;
}

function drawFactorial(){
    let good = 1;

    factorial.num[0] = randomInt(2, 8);

    if(factorial.num[0] === 2) factorial.num[1] = "dwójki";
    if(factorial.num[0] === 3) factorial.num[1] = "trójki";
    if(factorial.num[0] === 4) factorial.num[1] = "czwórki";
    if(factorial.num[0] === 5) factorial.num[1] = "piątki";
    if(factorial.num[0] === 6) factorial.num[1] = "szóstki";
    if(factorial.num[0] === 7) factorial.num[1] = "siódemki";
    if(factorial.num[0] === 8) factorial.num[1] = "ósemki";
    
    for(let i = 1; i <= factorial.num[0]; i++){
        good *= i;
    }

    factorial.answer = good;

    factorial.bad[0] = Math.pow(factorial.num[0], 2);
    factorial.bad[1] = Math.random() < 0.5 ? good + factorial.num[0] : good - factorial.num[0];
    factorial.bad[2] = factorial.num[0];

    questions["math"].bezwzgledna(factorial)
}

function shape(sh){
    if(sh === "trapez") return areasOfQuadrangles["trapeze"];
    if(sh === "kolo") return areasOfQuadrangles["circle"];
    if(sh === "kwadrat") return areasOfQuadrangles["square"];
    if(sh === "prostokat") return areasOfQuadrangles["rectangle"];
    if(sh === "rownoleglobok") return areasOfQuadrangles["parallelogram"];
    if(sh === "romb") return areasOfQuadrangles["rhombus"];
    if(sh === "trojkat") return areasOfQuadrangles["triangle"];
    if(sh === "ostroslup") return areasOfQuadrangles["pyramid"];
}

function drawShapeNumbers(sh){
    if(sh === "triangle"){
        shape("trojkat").values[0] = randomInt(3, 14);
        shape("trojkat").values[1] = randomInt(2, 10);
    }
    if(sh === "trapeze"){
        shape("trapez").values[0] = randomInt(4, 14);
        shape("trapez").values[1] = randomInt(2, 10);
        shape("trapez").values[2] = randomInt(2, 8);
    }
    if(sh === "circle"){
        shape("kolo").radius = randomInt(5, 25);
    }
    if(sh === "square"){
        shape("kwadrat").side = randomInt(5, 30);
    }
    if(sh === "rectangle"){
        shape("prostokat").values[0] = randomInt(2, 8);
        shape("prostokat").values[1] = randomInt(5, 15);
    }
    if(sh === "rhombus"){
        shape("romb").values[0] = randomInt(2, 10);
        shape("romb").values[1] = randomInt(4, 16);
    }
    if(sh === "parallelogram"){
        shape("rownoleglobok").values[0] = randomInt(2, 8);
        shape("rownoleglobok").values[1] = randomInt(5, 15);
    }
    if(sh === "pyramid"){
        shape("ostroslup").values[0] = randomInt(2, 8);
        shape("ostroslup").values[1] = randomInt(5, 15);
    }
}

function calculateShapeAreas(sh){
    drawShapeNumbers(sh);

    if(sh === "triangle"){
        shape("trojkat").answer = shape("trojkat").values[0] * shape("trojkat").values[1] / 2;
    }
    if(sh === "trapeze"){
        shape("trapez").answer = ((shape("trapez").values[0] + shape("trapez").values[1]) * shape("trapez").values[2]) / 2;
    }
    if(sh === "circle"){
        shape("kolo").answer = `${Math.pow(shape("kolo").radius, 2)}π`; 
    }
    if(sh === "square"){
        shape("kwadrat").answer = Math.pow(shape("kwadrat").side, 2); 
    }
    if(sh === "rectangle"){
        shape("prostokat").answer = shape("prostokat").values[0] * shape("prostokat").values[1];
    }
    if(sh === "rhombus"){
        shape("romb").answer = shape("romb").values[0] * shape("romb").values[1] / 2;
    }
    if(sh === "parallelogram"){
        shape("rownoleglobok").answer = shape("rownoleglobok").values[0] * shape("rownoleglobok").values[1];
    }
    if(sh === "pyramid"){
        shape("ostroslup").answer = Math.pow(shape("ostroslup").values[0], 2) * shape("ostroslup").values[1] / 3;
    }

    drawBadShapeAreas(sh);
    questions["math"].pola(areasOfQuadrangles);
}

function drawBadShapeAreas(sh){
    let a = areasOfQuadrangles[sh]
    let rnd = Math.random() > 0.5 ? 1 : 0;

    if(sh === "circle"){
        a.bad[0] = `${a.radius * 2}π`;
        a.bad[1] = `${a.radius * randomInt(3, 5)}π`;
        a.bad[2] = `${Math.pow(shape("kolo").radius, 2)}π`;
    }
    if(sh === "triangle"){
        a.bad[0] = a.values[1] === 4 ? a.values[0] * 2 + a.values[1] : a.values[0] * 2;
        a.bad[1] = rnd ? Math.floor(a.answer / randomInt(2, 6)) : a.answer + Math.floor(a.answer / 2);
        a.bad[2] = a.values[0] * randomInt(2, 6) + a.values[1] - 2;
    }
    if(sh === "rectangle" || sh === "parallelogram"){
        a.bad[0] = a.values[0] !== a.values[1] ? a.values[0] + a.values[1] : a.values[0] + a.values[1] + (a.values[0] * randomInt(1, 4));
        a.bad[1] = a.values[0] !== a.values[1] ? Math.pow(a.values[0], 2) : Math.pow(a.values[0], 2) * 2
        a.bad[2] = a.values[0] * 2 + a.values[1] * 2;
    }
    if(sh === "square"){
        a.bad[0] = Math.pow(a.side, randomInt(1, 4));
        a.bad[1] = rnd ? (a.answer + a.side) : (a.answer - a.side);
        a.bad[2] = rnd ? a.side * 4 : a.answer / 2;
    }
    if(sh === "rhombus"){
        a.bad[0] = a.values[0] * a.values[1];
        a.bad[1] = a.answer + a.values[1];
        a.bad[2] = a.answer - a.values[1];
    }
    if(sh === "trapeze"){
        a.bad[0] = a.values[1] * a.values[2];
        a.bad[1] = Math.floor(a.values[1] * a.values[2] / 2);
        a.bad[2] = a.values[0] + a.values[1];
    }
    if(sh === "pyramid"){
        a.bad[0] = a.values[0] * a.values[1];
        a.bad[1] = a.values[0] * a.values[1] / 2;
        a.bad[2] = a.answer * 2;
    }
}

function drawAddNumbers(type){
    if(type === "pow"){
        let a1 = randomInt(1, 6);
        let a2 = randomInt(1, 6);
        let p1 = randomInt(1, 6);
        let p2 = randomInt(2, 4);

        addition[type].values[0][0] = a1;
        addition[type].values[0][1] = a2;
        addition[type].values[1][0] = p1;
        addition[type].values[1][1] = p2;

        addition[type].answer = Math.pow(a1, p1) + Math.pow(a2, p2);

        addition[type].bad[0] = p1 !== p2 ? p1 * p2 + a1 * a2 : p1 * (p2 * a1) + a2;
        addition[type].bad[1] = (Math.pow(p1, p2) + a1) * a2;
        addition[type].bad[2] = addition[type].answer + a1 * randomInt(1, 3);
    }
    else if(type === "multi"){
        let a1 = randomInt(1, 9);
        let a2 = randomInt(1, 9);
        let a3 = randomInt(1, 9);

        addition[type].values[0] = a1;
        addition[type].values[1] = a2;
        addition[type].values[2] = a3;

        addition[type].answer = operators[0] === "+" ? a1 + a2 * a3 : a1 * a2 + a3;      

        addition[type].bad[0] = (a1 + a2) * a3;
        addition[type].bad[1] = addition[type].answer + a1;
        addition[type].bad[2] = randomInt(addition[type].answer + a1, addition[type].answer + a1 * 2);
    }
    else if(type === "normal"){
        let a = randomInt(1, 6).toString();
        let a1 = randomInt(1, 5);
        let a2 = randomInt(1, 5);
        let x = Math.random() > 0.5 ? [Number(a.concat(a1)), Number(a.concat(a2))] : [Number(a.concat(a1).concat(a1)), Number(a.concat(a2).concat(a2))];

        addition[type].values = [...x];
        
        addition[type].answer = x[0] + x[1];
        
        addition[type].bad[0] = addition[type].answer + 11;
        addition[type].bad[1] = addition[type].answer > 11 ? addition[type].answer - 11 : addition[type].answer + 22;
        addition[type].bad[2] = addition[type].answer + 33;
    }

    questions["math"].dodawanie(addition);
}

function drawFractionNumbers(){
    let a1 = randomInt(1, 9);
    let a2 = randomInt(1, 9);

    let rndOp = Math.floor() > 0.5 ? 1 : 0;
    fractions.operator = rndOp ? "+" : "*";

    fractions.values[0][0] = randomInt(1, a1);
    fractions.values[0][1] = randomInt(1, a2);
    fractions.values[1][0] = a1;
    fractions.values[1][1] = a2;

    let calculateFractions = new Fractions(fractions.values[0][0], fractions.values[0][1], a1, a2);

    let a3 = rndOp ? calculateFractions.addition : calculateFractions.multiply;

    fractions.answer = `${a3[0]}/${a3[1]}`;

    fractions.bad[0] = rndOp ? `${fractions.values[0][0] + fractions.values[0][1]}/${fractions.values[1][0] + fractions.values[1][1]}` : `${a3[0] + 1}/${a3[1]}`;
    fractions.bad[1] = `${fractions.values[0][0] + fractions.values[0][1]}/${Math.max(fractions.values[1][0], fractions.values[1][1])}`;
    fractions.bad[2] = `${fractions.values[0][0] + fractions.values[0][1]}/${fractions.values[1][0] + fractions.values[1][1]}`;

    questions["math"].ulamki(fractions);
}

class Fractions {
    constructor(a1, a2, b1, b2){
        this.a1 = a1;
        this.a2 = a2;
        this.b1 = b1;
        this.b2 = b2;
    }

    get addition(){
        let a = this.a1 * this.b1 + this.a2 * this.b2;
        let b = this.b1 * this.b2;
        return [a, b] 
    }

    get multiply(){
        let a = this.a1 * this.a2;
        let b = this.b1 * this.b2;
        return [a, b] 
    }
}

function drawPowerNumbers(type){
    let rndOp = Math.floor() > 0.5 ? 1 : 0;
    let a1, a2, p1, p2;
    power["addPow"].operator = rndOp ? "+" : "-";

    if(type === "addPow"){
        if(rndOp){
            a1 = randomInt(2, 4);
            a2 = randomInt(2, 4);
            p1 = randomInt(1, 4);
            p2 = randomInt(1, p1);

            power[type].values[0][0] = a1;
            power[type].values[0][1] = a2;
            power[type].values[1][0] = p1;
            power[type].values[1][1] = p2;
    
            power[type].answer = Math.pow(a1, p1) + Math.pow(a2, p2); 

            power[type].bad[0] = a1 * a2 + p1 * p2;
            power[type].bad[1] = a1 + a2 + p1 + p2;
            power[type].bad[2] = power[type].answer + randomInt(10, 15);
        }else{
            a1 = randomInt(2, 4);
            a2 = randomInt(2, a1);
            p1 = randomInt(2, a1);
            p2 = randomInt(2, a2);

            power[type].values[0][0] = a1;
            power[type].values[0][1] = a2;
            power[type].values[1][0] = p1;
            power[type].values[1][1] = p2;
    
            power[type].answer = Math.pow(a1, p1) - Math.pow(a2, p2); 

            power[type].bad[0] = a1 * a2 - p1 * p2;
            power[type].bad[1] = Math.abs((a1 + a2) - (p1 + p2));
            power[type].bad[2] = Math.abs(power[type].answer - randomInt(10, 15));
        }       
    }
    else if(type === "pow"){
        a1 = randomInt(2, 6);
        p1 = randomInt(2, 6);

        power[type].values[0] = a1;
        power[type].values[1] = p1;

        power[type].answer = Math.pow(a1, p1);

        power[type].bad[0] = power[type].answer + p1;
        power[type].bad[1] = power[type].answer * randomInt(2, 3);
        power[type].bad[2] = power[type].answer + 10
    }

    questions["math"].potegi(power);
}

function drawLogNumbers(){
    let randomLog = logNumbers[randomInt(0, logNumbers.length)];
    let bad1 = randomInt(3, 8)

    log.num = randomLog;
    log.answer = Math.log2(randomLog);

    log.bad[0] = log.answer === bad1 ? bad1 + 1 : bad1;
    log.bad[1] = log.answer * 2;
    log.bad[2] = Math.log2(randomLog) + randomInt(1, 3);

    questions["math"].logarytmy(log);
}

function drawSqrtNumbers(){
    let randomSqrt = sqrtNumbers[randomInt(0, sqrtNumbers.length)];

    sqrt.num = randomSqrt;
    sqrt.answer = Math.sqrt(randomSqrt);

    sqrt.bad[0] = randomInt(2, 26);
    sqrt.bad[1] = sqrt.answer + randomInt(1, 3);
    sqrt.bad[2] = sqrt.answer + randomInt(1, 3);

    questions["math"].pierwiastki(sqrt);
}

function drawPercentNumbers(){
    let randomPercent = randomInt(1, 9) * 10;
    let randomValue = randomInt(1, 50) * 10;

    percent.prcNum = randomPercent;
    percent.num = randomValue;
    percent.answer = randomValue * (randomPercent / 100);
    console.log()
    percent.bad[0] = randomValue / 10;
    percent.bad[1] = randomValue - Number(percent.answer.toString()[percent.answer.toString().length - 1]);
    percent.bad[2] = randomPercent * 2;

    questions["math"].pierwiastki(percent);
}

function checkRepeatability(arr){
    for(let i = 0; i < arr.length; i++){
        if(typeof arr[i] == "number"){
            for(let j = 1; j <= 3; j++){
                if(i === j) continue;

                if(arr[i] === arr[j]){
                    while(arr[i] === arr[j]){
                        if(arr[i].toString().length < 3){
                            arr[i] += randomInt(1, 10);
                        }else{
                            arr[i] += randomInt(50, 100);
                        }
                    }
                }
            }
        }else continue;
    }

    return arr;
}
