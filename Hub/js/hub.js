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
]

for (let i = 0; i < heistsList.length; i++) {

    const $heist = $("<div>");
    const $hsName = $("<div>");
    const $hsItems = $("<div>");

    if (i >= 4) {
        $hacksSection.css({
            "justify-content": "flex-start",
            "overflow-x": "auto"
        });

        $hacksSection.on("wheel", function (e) {
            horizontalScroll(e);
        });
    }

    $heist.addClass("heist");
    $hacksSection.append($heist);

    if(heistsList[i].isNew){
        $hsName.text(`new: [ ${heistsList[i].heist} ]`);
        $hsName.addClass("new");
    }else{
        $hsName.text(`[ ${heistsList[i].heist} ]`);
    }
    $hsName.addClass("heist-title");
    $heist.append($hsName);

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
    }
}

function horizontalScroll(x) {
    hacksSection.scrollLeft += (x.deltaY);
}

function copyCode() {
    var $temp = $("<input>");
    $("body").append($temp);

    $temp.val("sooney").select();

    document.execCommand("copy");
    $temp.remove();
}

$(document).ready(function () {

    $("#discord").on("click", function () {
        $("#copy").show();

        setTimeout(() => {
            $("#copy").hide();
        }, 500)

        copyCode();
    })
})
