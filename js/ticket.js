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


    let date = new Date(Number(selectSeance.seanceTimeStamp * 1000));
    let dateStr = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
    let textQR =`
  Фильм: ${selectSeance.filmName}
  Зал: ${selectSeance.hallName}
  Ряд/Место ${place}
  Дата: ${dateStr}
  Начало сеанса: ${selectSeance.seanceTime}
 `;

    let qrcode = QRCreator(textQR, { image: "SVG"	});
    document.querySelector(".ticket__info-qr").append(qrcode.result);
});  