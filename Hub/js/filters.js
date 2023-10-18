import { createList, hacksList } from "./hub.js";

const input = document.querySelector(".search > input[type='text']");
const dropdownHeader = document.querySelector(".dropdown-header");
const dropdownArrow = document.querySelector(".dropdown-header > svg");
const dropdownMenu = document.querySelector(".dropdown-menu");

dropdownHeader.addEventListener("click", dropdownEffect);

input.addEventListener("keyup", searchFilter);

function dropdownEffect(){
    dropdownHeader.classList.toggle("open");
    dropdownArrow.classList.toggle("open");
    dropdownMenu.classList.toggle("closed");
    dropdownMenu.classList.toggle("opened");
}

const heistFilters = [
    {
        text: "Vangelico",
        date: new Date("2023-07-23T19:00:00"),
        latest: 0
    },
    {
        text: "Willa",
        date: new Date("2023-09-09T19:00:00"),
        latest: 1
    },
    {
        text: "Wszystkie",
        latest: 0
    }
]

for(let i = 0; i < heistFilters.length; i++) {
    const heistOption = document.createElement("div");

    heistOption.innerHTML = heistFilters[i].text;
    heistOption.className = "heist-option";
    dropdownMenu.appendChild(heistOption);


    if(heistFilters[i].latest){
        let ago = heistFilters[i].date;
        let diff = new Date();
        diff.setTime(new Date() - ago)

        document.querySelector(".last-heist > b").textContent = heistFilters[i].text;
        document.querySelector("#timestamp").textContent =  `${diff.getMonth().toString().padStart(2, '0')}m ${diff.getDate().toString().padStart(2, '0')}d ${diff.getHours().toString().padStart(2, '0')}h ${diff.getMinutes().toString().padStart(2, '0')}min ${diff.getSeconds().toString().padStart(2, '0')}s temu`;
    }
}

const filterOptions = document.querySelectorAll(".heist-option");
const filterOption = document.querySelector(".filter-heist-name");

filterOptions.forEach((item) => {
    item.addEventListener("click", () => {
        filterOption.textContent = item.textContent === "Wszystkie" ? "Heist" : item.textContent;
        dropdownFilter()
        dropdownEffect();
    })
})

var selectedHeist = hacksList;

function dropdownFilter(){
    selectedHeist = hacksList;
    let filter = filterOption.textContent.toLowerCase();
    
    if(filter !== "heist"){
        selectedHeist = selectedHeist.filter((hack) => filter === hack.heist.toLowerCase());
        createList(selectedHeist);
    }else{
        selectedHeist = hacksList;
        createList(selectedHeist);
    }
}

function searchFilter(){
    let listArr = selectedHeist;

    if(input.value.trim().length > 0){
        listArr = listArr.filter((hack) => 
            hack.name.toLowerCase().includes(input.value.trim().toLowerCase()) || 
            hack.minigame.toLowerCase().includes(input.value.trim().toLowerCase()) || 
            hack.heist.toLowerCase().includes(input.value.trim().toLowerCase())
        );
    }

    createList(listArr);
}



