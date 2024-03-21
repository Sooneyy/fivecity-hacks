const heistsList = document.querySelector(".heists-list");

export const hacksList = [
    {
        heist: 'Vangelico',
        name: 'Przełączanie zasilania',
        link: './vangelico_switch'
    },
    {
        heist: 'Vangelico',
        name: 'Wyłączanie zasilania',
        link: './vangelico_power'
    },
    {
        heist: 'Vangelico',
        name: 'Włamywanie do drzwi',
        link: './vangelico_doors'
    },
    {
        heist: 'Vangelico',
        name: 'Włamywanie do sejfu',
        link: './vangelico_safe'
    },
    {
        heist: 'Willa',
        name: 'Wyłączanie zabezpieczenia',
        link: './willa_serv'
    },
    {
        heist: 'Willa',
        name: 'Otwieranie drzwi do winiarni',
        link: './willa_winedoors'
    },
    {
        heist: 'Willa',
        name: 'Włamywanie do małego sejfu',
        link: './willa_minisafe'
    },
    {
        heist: 'Willa',
        name: 'Włamywanie do głównego sejfu',
        link: './willa_safe'
    },
    {
        heist: 'Fleeca',
        name: 'Wyłączanie zabezpieczeń',
        link: './fleeca_box'
    },
    {
        heist: 'Fleeca',
        name: 'Otwieranie drzwi do sejfu',
        link: './fleeca_doors1'
    },
    {
        heist: 'Fleeca',
        name: 'Otwieranie głównych drzwi sejfu',
        link: './fleeca_panel'
    },
    {
        heist: 'Fleeca',
        name: 'Otwieranie drugich drzwi do sejfu',
        link: './fleeca_doors2'
    },
    {
        heist: 'Car Dealer',
        name: 'Zdejmowanie nadajnika',
        link: './cardealer_gps'
    },
    {
        heist: 'SGOC',
        name: 'Wyłączanie kamer',
        link: './sgoc_cameras'
    },
    {
        heist: 'SGOC',
        name: 'Wyłaczanie PC',
        link: './sgoc_pc'
    },
    {
        heist: 'SGOC',
        name: 'Wyłączanie prądu',
        link: './sgoc_box'
    },
]

window.onload = () => {
    document.querySelector(".boosting-container").style.display = "none";
}

export function createList(array){
    clearList();

    for(let i = 0; i < array.length; i++) {
        const heist = document.createElement("div");
        const heistName = document.createElement("div");
        const hackName = document.createElement("div");
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

    const appear = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                entry.target.classList.add("appear");
            }else{
                entry.target.classList.remove("appear");
            }
        })
    })
    
    const items = document.querySelectorAll(".heist");
    
    items.forEach((item) => {
        appear.observe(item);
    })
}
createList(hacksList);

function clearList(){
    heistsList.querySelectorAll(".heist").forEach((item) => item.remove());
}

document.querySelector(".search > input[type='text']").addEventListener("focus", () => {
    document.querySelector(".search").classList.add("focus");
})

document.querySelector(".search > input[type='text']").addEventListener("blur", () => {
    document.querySelector(".search").classList.remove("focus");
})

const boostingList = [
    {
        name: "Znajdowanie danego przedziału po wybranych znakach",
        link: "./boosting_chars"
    },
]

for(let x = 0; x < boostingList.length; x++){
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");
    const bt = document.createElement("button");

    el1.classList.add("boosting");
    document.querySelector(".boosting-list").appendChild(el1);

    el2.textContent = boostingList[x].name;
    el1.appendChild(el2);

    bt.textContent = "Wybierz";
    bt.dataset.link = boostingList[x].link;
    el1.appendChild(bt);
}

const button = document.querySelectorAll(".boosting > button");

button.forEach((button) => {
    const link = button.dataset.link;

    button.addEventListener("click", () => {
        window.open(link, "_self");
    })
})