import { createList, hacksList } from "./hub.js";

const input = document.querySelector(".search-input");
const dropdownHeader = document.querySelector(".dropdown-header");
const dropdownMenu = document.querySelector(".dropdown-menu");

dropdownHeader.addEventListener("click", () => {
    dropdownMenu.classList.toggle("open");
    dropdownHeader.classList.toggle("open");
});

const heistFilters = ["Vangelico", "Fleeca", "Car Dealer", "SGOC", "Pacyfik", "Szachownica", "Wszystkie"];

for(let i = 0; i < heistFilters.length; i++) {
    const heistOption = document.createElement("div");

    heistOption.textContent = heistFilters[i];
    heistOption.className = "filter";
    dropdownMenu.appendChild(heistOption);
}

const filters = document.querySelectorAll(".filter");
const selectedFilter = document.querySelector(".filter-name");

var selectedHeist = hacksList;

const heists = document.querySelector(".heists");
const loader = document.querySelector(".loader");

function debounce(func, delay){
    let timerId;

    return function(){
        clearInterval(timerId);
        return timerId = setTimeout(() => {
            func();
        }, delay);
    }
}

function filterByDropdown(){
    loader.style.display = 'block';
    heists.style.display = 'none';

    setTimeout(() => {
        let filter = selectedFilter.textContent.toLowerCase();

        selectedHeist = hacksList;
        
        if(filter !== "heist"){
            selectedHeist = selectedHeist.filter((hack) => filter === hack.heist.toLowerCase());
            createList(selectedHeist);
        }else{
            selectedHeist = hacksList;
            createList(selectedHeist);
        }

        heists.style.display = '';
        loader.style.display = 'none';
    }, 250)
}

function filterByInput(){
    loader.style.display = 'block';
    heists.style.display = 'none';

    setTimeout(() => {
        let listArr = selectedHeist;

        if(input.value.trim().length > 0){
            listArr = listArr.filter((hack) => 
                hack.desc.toLowerCase().includes(input.value.trim().toLowerCase()) || 
                hack.heist.toLowerCase().includes(input.value.trim().toLowerCase())
            );
        }

        createList(listArr);

        heists.style.display = '';
        loader.style.display = 'none';
    }, 250)
}

const inputDebounce = debounce(filterByInput, 300);
const dropdownDebounce = debounce(filterByDropdown, 300);

window.addEventListener("input", inputDebounce);

filters.forEach((item) => {
    item.addEventListener("click", () => {
        dropdownDebounce();
        selectedFilter.textContent = item.textContent === "Wszystkie" ? "Heist" : item.textContent;
        dropdownHeader.classList.remove("open");
        dropdownMenu.classList.remove("open");
    })
})


