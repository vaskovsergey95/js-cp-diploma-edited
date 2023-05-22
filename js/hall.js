let selectSeance = JSON.parse(sessionStorage.getItem('selectSeance'));
let request = JSON.parse(sessionStorage.getItem('ans'));
const button = document.querySelector('.acceptin-button')

document.addEventListener('DOMContentLoaded', () => {
    let hallConfig = "";
    request.halls.forEach(elem => {
        if (elem.hall_id === selectSeance.hallId) {
            hallConfig += elem.hall_config
        }
    })

    postData('https://jscp-diplom.netoserver.ru/', `event=get_hallConfig&timestamp=${selectSeance.seanceTimeStamp}&hallId=${selectSeance.hallId}&seanceId=${selectSeance.seanceId}`)
        .then((data) => {
            if (data === null) {
                document.querySelector('.conf-step__wrapper').innerHTML = hallConfig
            } else {
                document.querySelector('.conf-step__wrapper').innerHTML = data
            }

            document.querySelector('.price-standart').innerHTML = `${selectSeance.priceStandart}`;
            document.querySelector('.price-vip').innerHTML = `${selectSeance.priceVip}`;
            document.querySelector('.buying__info-title').innerHTML = `${selectSeance.filmName}`;
            document.querySelector('.buying__info-hall').innerHTML = `${selectSeance.hallName}`;;
            document.querySelector('.buying__info-start').innerHTML = `Начало сеанса: ${selectSeance.seanceTime}`

            const chair = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair'));
            let selectedChair = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));

            if (selectedChair.length) {
                button.removeAttribute("disabled");
            } else {
                button.setAttribute("disabled", 'true');
            }
            chair.forEach((elem) => {
                elem.onclick = (event) => {
                    if (event.target.classList.contains('conf-step__chair_taken')) {
                        return
                    }
                    event.target.classList.toggle('conf-step__chair_selected');
                    selectedChair = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));
                    if (selectedChair.length) {
                        button.removeAttribute("disabled");
                    } else {
                        button.setAttribute("disabled", 'true');
                    }
                }
            })
        })


    button.addEventListener('click', event => {
        event.preventDefault()
        let chosenPlace = Array();
        const rows = Array.from(document.getElementsByClassName("conf-step__row"));
        for (let elem of rows) {
            const places = Array.from(elem.getElementsByClassName("conf-step__chair"));
            for (let item of places) {
                if (item.classList.contains("conf-step__chair_selected")) {
                    item.classList.replace('conf-step__chair_selected', 'conf-step__chair_taken')
                    const chosenType = item.classList.contains("conf-step__chair_vip") ? 'vip' : 'standart'
                    chosenPlace.push({
                        'row': (rows.findIndex(row => row === elem)) + 1,
                        'place': (places.findIndex(place => place === item)) + 1,
                        'type': chosenType,
                    })
                }
            }
        }
        const newConf = document.querySelector('.conf-step__wrapper').innerHTML;
        selectSeance.hallConfig = newConf;
        selectSeance.salesPlaces = chosenPlace;
        sessionStorage.setItem('selectSeance', JSON.stringify(selectSeance));
        const link = document.createElement('a');
        link.href = "payment.html";
        link.click();
    })
})

