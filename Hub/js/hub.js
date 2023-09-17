const $hacksSection = $(".heists-list");

const heistsList = [
    {
        heist: 'Vangelico',
        isNew: 0,
    },
    {
        heist: 'Willa',
        isNew: 1,
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
        name: 'Włamywanie do sejfu',
        heist: 'Vangelico',
        link: './vangelico_safe'
    },
    {
        name: 'Wyłączanie zabezpieczenia',
        heist: 'Willa',
        link: './willa_serv'
    },
    {
        name: 'Otwieranie drzwi do winiarni',
        heist: 'Willa',
        link: './willa_winedoors'
    },
    {
        name: 'Włamywanie do małego sejfu',
        heist: 'Willa',
    },
    {
        name: 'Włamywanie do głównego sejfu',
        heist: 'Willa',
        link: './willa_safe'
    },
]

for (let i = 0; i < heistsList.length; i++) {

    const $heist = $("<div>");
    const $hsNameSec = $("<div>");
    const $hsName = $("<p>");
    const $hsItems = $("<div>");

    $heist.addClass("heist");
    $hacksSection.append($heist);

    if(heistsList[i].isNew){
        $hsNameSec.addClass("new");
    }

    $hsNameSec.addClass("heist-title");
    $heist.append($hsNameSec);

    $hsName.text(`${heistsList[i].heist}`);
    $hsNameSec.append($hsName);

    $hsItems.addClass("heist-items");
    $heist.append($hsItems);

    for (let j = 0; j < hacksList.length; j++) {

        if (hacksList[j].heist !== heistsList[i].heist) continue;

        const $link = $("<a>")
        const $button = $("<button>");
        const $hcCat = $("<div>");
        const $hcName = $("<div>");

        $link.attr("href", hacksList[j].link);
        $hsItems.append($link)

        $link.append($button);

        $hcCat.text(hacksList[j].heist);
        $hcCat.addClass("heist-name");
        $button.append($hcCat);

        $hcName.text(hacksList[j].name);
        $hcName.addClass("hack-name");
        $button.append($hcName);

        if(j === 6){
            $link.attr("id", "in-progress");
            $hsItems.append($link);
        }
    }
}

function copyCode(){
    let $temp = $("<input>");
    $("body").append($temp);

    $temp.val("sooney").select();
    document.execCommand("copy");

    $temp.remove();
}

$("#discord").on("click", function(){
    $("#copied").animate({
        opacity: "1",
    }, 300);

    setTimeout(() => {
        $("#copied").animate({
            opacity: "0",
        }, 300);
    }, 1000);

    copyCode();
})

$("#in-progress").on("click", function(){
    $(".modal-container").css({
        display: "block"
    });

    $(".modal-container").animate({
        opacity: "1"
    }, 300)
})
$("#close").on("click", function(){
    $(".modal-container").animate({
        opacity: "0"
    }, 300)

    setTimeout(() => {
        $(".modal-container").css({
            display: "none"
        });
    }, 300)
})
