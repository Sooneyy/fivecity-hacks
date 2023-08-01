const hacksSection = document.querySelector('.cards-list');

const heistsList = [
    {
        heist: 'Vangelico',
        colorNum: '60' // Numer hue
    },
]

const hacksList = [
    {
        name: 'Przełączanie zasilania',
        heist: 'Vangelico',
        link: './vangelico_switch'
    },
    {
        name: 'Wyłączanie zasilania',
        heist: 'Vangelico',
        link: './vangelico_power'
    },
    {
        name: 'Włamywanie do drzwi',
        heist: 'Vangelico',
        link: './vangelico_doors'
    },
    {
        name: 'Włamywanie do sejfu - fixed',
        heist: 'Vangelico',
        link: './vangelico_safe'
    },
]

for (let i = 0; i < heistsList.length; i++) {

    const card = document.createElement('div');
    const cTitle = document.createElement('div');
    const hsName = document.createElement('span');

    if (i >= 4) {
        hacksSection.style.justifyContent = 'flex-start';
        hacksSection.style.overflowX = 'auto';
        hacksSection.addEventListener('wheel', (e) => horizontalScroll(e));
    }

    card.classList.add('card');
    hacksSection.appendChild(card);

    cTitle.textContent = 'Heist ';
    hsName.textContent = heistsList[i].heist;
    hsName.classList.add('heist-name');
    hsName.style.color = `hsl(${heistsList[i].colorNum}, 100%, 35%)`;
    hsName.style.filter = `drop-shadow(0 0 8px hsl(${heistsList[i].colorNum}, 100%, 35%))`
    cTitle.appendChild(hsName);
    cTitle.classList.add('card-title');
    card.appendChild(cTitle);

    for (let j = 0; j < hacksList.length; j++) {

        if (hacksList[j].heist !== heistsList[i].heist) continue;

        const cItems = document.createElement('div');
        const button = document.createElement('button');
        const hcName = document.createElement('span');
        const link = document.createElement('a');

        cItems.classList.add('card-items');
        card.appendChild(cItems);

        cItems.appendChild(button);

        hcName.textContent = hacksList[j].name;
        hcName.classList.add('hack-name');
        hcName.style.color = `hsl(${heistsList[i].colorNum}, 100%, 35%)`;
        button.appendChild(hcName);

        link.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m11 15l3-3l-3-3"/></g></svg>`;
        link.title = 'Przejdź do hacku - ' + hacksList[j].name;
        link.setAttribute('href', hacksList[j].link);
        link.style.borderColor = `hsl(${heistsList[i].colorNum}, 100%, 60%)`;
        link.style.color = `hsl(${heistsList[i].colorNum}, 100%, 60%)`;
        button.appendChild(link);
    }
}

function horizontalScroll(x) {
    hacksSection.scrollLeft += (x.deltaY);
}

