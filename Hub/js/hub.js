const heistsList = document.querySelector(".heists-list");

export const hacksList = [
    {
        heist: 'Vangelico',
        name: 'Przełączanie zasilania',
        minigame: "Zapamiętywanie ilości kwadratów",
        link: './vangelico_switch'
    },
    {
        heist: 'Vangelico',
        name: 'Wyłączanie zasilania',
        minigame: "Maze game",
        link: './vangelico_power'
    },
    {
        heist: 'Vangelico',
        name: 'Włamywanie do drzwi',
        minigame: "Szachownica (cyfry)",
        link: './vangelico_doors'
    },
    {
        heist: 'Vangelico',
        name: 'Włamywanie do sejfu',
        minigame: "Lights out",
        link: './vangelico_safe'
    },
    {
        heist: 'Willa',
        name: 'Wyłączanie zabezpieczenia',
        minigame: "Szachownica (pionki)",
        link: './willa_serv'
    },
    {
        heist: 'Willa',
        name: 'Otwieranie drzwi do winiarni',
        minigame: "Zapamiętywanie miejsca kwadratów",
        link: './willa_winedoors'
    },
    {
        heist: 'Willa',
        name: 'Włamywanie do małego sejfu',
        minigame: "Password game",
        link: './willa_minisafe'
    },
    {
        heist: 'Willa',
        name: 'Włamywanie do głównego sejfu',
        minigame: "Rozplątywanie liny",
        link: './willa_safe'
    },
]

export function createList(array){
    clearList();

    for(let i = 0; i < array.length; i++) {
        const heist = document.createElement("div");
        const heistName = document.createElement("div");
        const hackName = document.createElement("div");
        const minigameName = document.createElement("div");
        const linkButton = document.createElement("button");
        const favouriteButton = document.createElement("button");
    
        heist.classList.add("heist");
        heistsList.appendChild(heist);
    
        heistName.innerHTML = `Heist: <b>${array[i].heist}</b>`;
        heistName.classList.add("heist-name");
        heist.appendChild(heistName);
    
        hackName.innerHTML = `Hack: <b>${array[i].name}</b>`;
        hackName.classList.add("hack-name");
        heist.appendChild(hackName);
    
        minigameName.innerHTML = `Minigame: <b>${array[i].minigame}</b>`;
        minigameName.classList.add("minigame-name");
        heist.appendChild(minigameName);
    
        linkButton.textContent = "Przejdź";
        linkButton.dataset.link = array[i].link;
        heist.appendChild(linkButton);

        linkButton.textContent = "Przejdź";
        linkButton.dataset.link = array[i].link;
        heist.appendChild(linkButton);
    }

    const button = document.querySelectorAll(".heist > button");

    button.forEach((button) => {
        const link = button.dataset.link;

        button.addEventListener("click", () => {
            window.open(link, "_self");
        })
    })
}
createList(hacksList);

function clearList(){
    heistsList.querySelectorAll(".heist").forEach((item) => item.remove());
}

const copyToClipboard = () => {
    document.getElementById("copied").style.display = "block";

    setTimeout(() => {
        document.getElementById("copied").style.display = "none";
    }, 500);

    navigator.clipboard.writeText("sooney");
}

document.getElementById("discord").addEventListener("click", copyToClipboard)

document.querySelector(".search > input[type='text']").addEventListener("focus", () => {
    document.querySelector(".search").classList.add("focus");
})

document.querySelector(".search > input[type='text']").addEventListener("blur", () => {
    document.querySelector(".search").classList.remove("focus");
})