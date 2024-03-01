var mark = ["", "-"];
var operators = ["+", "*"]
var natural = { num: 0, bad: [] },
    rational = { num: 0, bad: [] },
    integer = { num: 0, bad: [] };
    factorial = { num: [], bad: [], answer: 0 };
var areasOfQuadrangles = {
    "circle": { radius: 0, answer: 0, bad: [] },
    "square": { side: 0, answer: 0, bad: [] },
    "rectangle": { values: [], answer: 0, bad: [] },
    "triangle": { values: [], answer: 0, bad: [] },
    "trapeze": { values: [], answer: 0, bad: [] },
    "rhombus": { values: [], answer: 0, bad: [] },
    "parallelogram": { values: [], answer: 0, bad: [] },
    "pyramid": { values: [], answer: 0, bad: [] },
}
var addition = {
    "pow": { values: [[], []], answer: 0, bad: [], operators: operators},
    "multi": { values: [], answer: 0, bad: [], operators: operators },
    "normal": { values: [], answer: 0, bad: [] },
}
var absolute = () => {
    return randomInt(1, 9);
};
var fractions = { values: [[], []], answer: "", bad: [[], [], []], operator: "" };
var power = {
    "pow": { values: [], answer: 0, bad: [] },
    "addPow": { values: [[], []], answer: 0, bad: [], operator: ""}
}
var logNumbers = [2, 4, 8, 16, 64, 128, 256];
var log = { num: 0, answer: 0, bad: [] };
var sqrtNumbers = [49, 64, 81, 121, 144, 196, 225, 625];
var sqrt = { num: 0, answer: 0, bad: []};
var percent = { prcNum: 0, num: 0, answer: 0, bad: [] };

const questions = {
    "teoria": (na, ra, int, isRev) => { 
        return [
            {
                question: "Jaka jest suma kątów wewnętrznych w trójkącie",
                answer: 180,
                badAnswers: [270, 360, 90, 120, 160, 240, 315]
            },
            {
                question: `Która z ${isRev ? "powyższych" : "poniższych"} liczb jest liczbą naturalną`,
                answer: na.num,
                badAnswers: na.bad
            },
            {
                question: `Która z ${isRev ? "powyższych" : "poniższych"} liczb jest liczbą wymierną`,
                answer: ra.num,
                badAnswers: ra.bad
            },
            {
                question: `Która z ${isRev ? "powyższych" : "poniższych"} liczb jest liczbą całkowitą`,
                answer: int.num,
                badAnswers: int.bad
            },
            {
                question: "Jak inaczej zapisywana jest jedynka trygonometryczna?",
                answer: "sin<span class='power-small'>2</span> a + cos<span class='power-small'>2</span> a",
                badAnswers: ["sin<span class='power-small'>2</span> a * cos<span class='power-small'>2</span> a", "sina + cosa", "sin<span class='power-small'>2</span> a * sin<span class='power-small'>2</span> a"]
            }
        ]
    },
    "silnia": (fac) => {
        return [
            {
                question: `Ile wynosi silnia ${fac.num[0]}! (silnia ${fac.num[1]})`,
                answer: fac.answer,
                badAnswers: fac.bad
            }
        ]
    },
    "pola": (aos) => {
        return [
            {
                question: `Jakie jest pole trapezu o podstawach ${aos["trapeze"].values[0]} ${aos["trapeze"].values[1]} i wysokości ${aos["trapeze"].values[2]}?`,
                shape: "trapeze",
                answer: aos["trapeze"].answer,
                badAnswers: aos["trapeze"].bad
            },
            {
                question: `Jakie jest pole trójkąta o podstawie ${aos["triangle"].values[0]} i wysokości ${aos["triangle"].values[1]}?`,
                shape: "triangle",
                answer: aos["triangle"].answer,
                badAnswers: aos["triangle"].bad
            },
            {
                question: `Jakie jest pole prostokąta o długości ${aos["rectangle"].values[0]} i szerokości ${aos["rectangle"].values[1]}?`,
                shape: "rectangle",
                answer: aos["rectangle"].answer,
                badAnswers: aos["rectangle"].bad
            },
            {
                question: `Jakie jest pole rombu o przekątnych ${aos["rhombus"].values[0]} i ${aos["rhombus"].values[1]}?`,
                shape: "rhombus",
                answer: aos["rhombus"].answer,
                badAnswers: aos["rhombus"].bad
            },
            {
                question: `Jakie jest pole kwadratu o boku ${aos["square"].side}?`,
                shape: "square",
                answer: aos["square"].answer,
                badAnswers: aos["square"].bad
            },
            {
                question: `Jakie jest pole równoległogoku o podstawie ${aos["parallelogram"].values[0]} i wysokości ${aos["parallelogram"].values[1]}?`,
                shape: "parallelogram",
                answer: aos["parallelogram"].answer,
                badAnswers: aos["parallelogram"].bad
            },
            {
                question: `Jakie jest pole koła o promieniu ${aos["circle"].radius}?`,
                shape: "circle",
                answer: aos["circle"].answer,
                badAnswers: aos["circle"].bad
            },
            {
                question: `Jaka jest objętość ostrosłupa, którego podstawą jest kwadrat o boku ${aos["pyramid"].values[0]} i wysokości ${aos["pyramid"].values[1]}?`,
                shape: "pyramid",
                answer: aos["pyramid"].answer,
                badAnswers: aos["pyramid"].bad
            }
        ]
    },
    "dodawanie": (add) => {
        return [
            {
                question: `Jaka jest wartość wyrażenia ${add["pow"].values[0][0]}^${add["pow"].values[0][1]} + ${add["pow"].values[1][0]} ${add["pow"].operators[1]} ${add["pow"].values[1][1]}`,
                type: "pow",
                answer: add["pow"].answer,
                badAnswers: add["pow"].bad
            },
            {
                question: `Jaka jest wartość wyrażenia ${add["multi"].values[0]} ${add["multi"].operators[0]} ${add["multi"].values[1]} ${add["multi"].operators[1]} ${add["multi"].values[2]}`,
                type: "multi",
                answer: add["multi"].answer,
                badAnswers: add["multi"].bad
            },
            {
                question: `Ile wynosi ${add["normal"].values[0]} + ${add["normal"].values[1]}`,
                type: "normal",
                answer: add["normal"].answer,
                badAnswers: add["normal"].bad
            },
            {
                question: `Jaka jest suma ${add["normal"].values[0]} i ${add["normal"].values[1]}`,
                type: "normal",
                answer: add["normal"].answer,
                badAnswers: add["normal"].bad
                }
        ]
    },
    "bezwzgledna": (abs) => {
        return [
            {
                question: `Ile wynosi wartość bezwzględna liczby -${abs}`,
                answer: abs,
                badAnswers: [`-${abs}`, 0, 1]
            }
        ]
    },
    "ulamki": (f) => {
        return [
            {
                question: `Ile wynosi ${f.values[0][0]}/${f.values[1][0]} ${f.operator} ${f.values[0][1]}/${f.values[1][1]}`,
                answer: f.answer,
                badAnswers: f.bad
            }
        ]
    },
    "potegi": (pow) => {
        return [
            {
                question: `Ile wynosi ${pow["addPow"].values[0][0]}<span class='power'>${pow["addPow"].values[0][1]}</span> ${pow["addPow"].operator} ${pow["addPow"].values[1][0]}<span class='power'>${pow["addPow"].values[1][1]}</span>`,
                type: "addPow",
                answer: pow["addPow"].answer,
                badAnswers: pow["addPow"].bad
            },
            {
                question: `Ile wynosi ${pow["pow"].values[0]}<span class='power'>${pow["pow"].values[1]}</span>`,
                type: "pow",
                answer: pow["pow"].answer,
                badAnswers: pow["pow"].bad
            },
            {
                question: `Ile wynosi ${pow["pow"].values[0]} do potęgi ${pow["pow"].values[1]}`,
                type: "pow",
                answer: pow["pow"].answer,
                badAnswers: pow["pow"].bad
            }
        ]
    },
    "logarytmy": (lg) => {
        return [
            {
                question: `Ile wynosi log<span class='log'>2</span>(${lg.num})?`,
                answer: lg.answer,
                badAnswers: lg.bad
            }
        ]
    },
    "pierwiastki": (sqr) => {
        return [
            {
                question: `Ile wynosi pierwiastek kwadratowy z ${sqr.num}`,
                answer: sqr.answer,
                badAnswers: sqr.bad
            },
            {
                question: `Ile wynosi √${sqr.num}`,
                answer: sqr.answer,
                badAnswers: sqr.bad
            }
        ]
    },
    "procenty": (prc) => {
        return [
            {
                question: `Jakie jest ${prc.prcNum}% z ${prc.num}`,
                answer: prc.answer,
                badAnswers: prc.bad
            }
        ]
    }
}
