let selectSeance = JSON.parse(sessionStorage.getItem('selectSeance'));
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.ticket__title').innerHTML = `${selectSeance.filmName}`;
    document.querySelector('.ticket__hall').innerHTML = `${selectSeance.hallName.slice(3)}`;
    document.querySelector('.ticket__start').innerHTML = `${selectSeance.seanceTime}`;

    let place = [];
    for (let elem of selectSeance.salesPlaces) {
        place.push(' ' + elem.row + '/' + elem.place)
    }
    document.querySelector('.ticket__chairs').innerHTML = `${place}`

    let cost = [];

    for (let elem of selectSeance.salesPlaces) {
        let standart = [];
        let vip = [];
        if (elem.type === 'vip') {
            vip = selectSeance.priceVip
        }
        if (elem.type === 'standart') {
            standart = selectSeance.priceStandart
        }
        cost.push(Number(standart) + Number(vip))
    }
    let res = cost.reduce((sum, elem) => {
        return sum + elem;
    }, 0);

    document.querySelector('.ticket__cost').innerHTML = `${res}`

console.log(selectSeance)



    postData('https://jscp-diplom.netoserver.ru/', `event=sale_add&timestamp=${selectSeance.seanceTimeStamp}&hallId=${selectSeance.hallId}&seanceId=${selectSeance.seanceId}&hallConfiguration=${selectSeance.hallConfig}`)
        .then(() => {

        })
})

