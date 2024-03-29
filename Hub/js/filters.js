import { createList, hacksList } from "./hub.js";

const input = document.querySelector(".search-input");
const dropdownHeader = document.querySelector(".dropdown-header");
const dropdownMenu = document.querySelector(".dropdown-menu");

dropdownHeader.addEventListener("click", () => {
    dropdownMenu.classList.toggle("open");
    dropdownHeader.classList.toggle("open");
});

window.addEventListener("keyup", filterByInput);

const heistFilters = ["Vangelico", "Willa", "Fleeca", "Car Dealer", "SGOC", "Wszystkie"];

for(let i = 0; i < heistFilters.length; i++) {
    const heistOption = document.createElement("div");

    heistOption.textContent = heistFilters[i];
    heistOption.className = "filter";
    dropdownMenu.appendChild(heistOption);
}

const filters = document.querySelectorAll(".filter");
const selectedFilter = document.querySelector(".filter-name");

filters.forEach((item) => {
    item.addEventListener("click", () => {
        selectedFilter.textContent = item.textContent === "Wszystkie" ? "Heist" : item.textContent;
        dropdownHeader.classList.remove("open");
        dropdownMenu.classList.remove("open");
        filterByDropdown();
    })
})

var selectedHeist = hacksList;

function filterByDropdown(){
    let filter = selectedFilter.textContent.toLowerCase();

    selectedHeist = hacksList;
    
    if(filter !== "heist"){
        selectedHeist = selectedHeist.filter((hack) => filter === hack.heist.toLowerCase());
        createList(selectedHeist);
    }else{
        selectedHeist = hacksList;
        createList(selectedHeist);
    }
}

function filterByInput(){
    let listArr = selectedHeist;

    if(input.value.trim().length > 0){
        listArr = listArr.filter((hack) => 
            hack.desc.toLowerCase().includes(input.value.trim().toLowerCase()) || 
            hack.heist.toLowerCase().includes(input.value.trim().toLowerCase())
        );
    }

    createList(listArr);
}

//asdasdasjdbasugdasdvas


