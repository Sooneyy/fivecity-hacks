const heists = document.querySelector(".heists");

export const hacksList = [
    {
        heist: 'Vangelico',
        desc: 'Przełączanie zasilania',
        link: './vangelico_switch',
    },
    {
        heist: 'Vangelico',
        desc: 'Wyłączanie zasilania',
        link: './vangelico_power',
    },
    {
        heist: 'Vangelico',
        desc: 'Włamywanie do drzwi',
        link: './vangelico_doors',
    },
    {
        heist: 'Vangelico',
        desc: 'Włamywanie do sejfu',
        link: './vangelico_safe',
    },
    {
        heist: 'Willa',
        desc: 'Wyłączanie zabezpieczenia',
        link: './willa_serv',
    },
    {
        heist: 'Willa',
        desc: 'Otwieranie drzwi do winiarni',
        link: './willa_winedoors',
    },
    {
        heist: 'Willa',
        desc: 'Włamywanie do małego sejfu',
        link: './willa_minisafe',
    },
    {
        heist: 'Willa',
        desc: 'Włamywanie do głównego sejfu',
        link: './willa_safe',
    },
    {
        heist: 'Fleeca',
        desc: 'Wyłączanie zabezpieczeń',
        link: './fleeca_box',
    },
    {
        heist: 'Fleeca',
        desc: 'Otwieranie drzwi do sejfu',
        link: './fleeca_doors1',
    },
    {
        heist: 'Fleeca',
        desc: 'Otwieranie głównych drzwi sejfu',
        link: './fleeca_panel',
    },
    {
        heist: 'Fleeca',
        desc: 'Otwieranie drugich drzwi do sejfu',
        link: './fleeca_doors2',
    },
    {
        heist: 'Car Dealer',
        desc: 'Zdejmowanie nadajnika',
        link: './cardealer_gps',
    },
    {
        heist: 'SGOC',
        desc: 'Wyłączanie kamer',
        link: './sgoc_cameras',
    },
    {
        heist: 'SGOC',
        desc: 'Wyłaczanie PC',
        link: './sgoc_pc',
    },
    {
        heist: 'SGOC',
        desc: 'Wyłączanie prądu',
        link: './sgoc_box',
    },
]

export function createList(array){
    heists.innerHTML = "";

    for(let i = 0; i < array.length; i++) {
        const heist = document.createElement("div");
        const heistName = document.createElement("p");
        const hackDesc = document.createElement("p");
        const linkButton = document.createElement("button");
    
        heist.classList.add("heist-wrapper");
        heists.appendChild(heist);
    
        heistName.innerHTML = `Heist: <b>${array[i].heist}</b>`;
        heistName.classList.add("name");
        heist.appendChild(heistName);
    
        hackDesc.textContent = `${array[i].desc}`;
        hackDesc.classList.add("desc");
        heist.appendChild(hackDesc);
    
        linkButton.innerHTML = `Przejdź 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="m14.707 5.636l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l3.95-3.95H4a1 1 0 1 1 0-2h13.243l-3.95-3.95a1 1 0 1 1 1.414-1.414"/>
                </g>
            </svg>`;
        linkButton.dataset.link = array[i].link;
        heist.appendChild(linkButton);
    }

    const button = document.querySelectorAll(".heist-wrapper > button");

    button.forEach((button) => {
        const link = button.dataset.link;

        button.addEventListener("click", () => {
            window.open(link, "_self");
        })
    })
}

createList(hacksList);

