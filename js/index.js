document.addEventListener('DOMContentLoaded', () => {
    let today = new Date();
    let fromMidnight = (today.getHours() * 3600000) + (today.getMinutes() * 60000) + (today.getSeconds() * 1000) + today.getMilliseconds()
    let timestapToday = today.getTime()

    const dayWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    const navDay = Array.from(document.querySelectorAll('.page-nav__day'))
    const numDay = Array.from(document.querySelectorAll('.page-nav__day-number'))

    numDay.forEach((elem, i) => {
        const day = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
        elem.innerHTML = `${day.getDate()}`
        elem.previousElementSibling.innerHTML = dayWeek[day.getDay()]
        if (elem.previousElementSibling.textContent === 'Сб' || elem.previousElementSibling.textContent === 'Вс') {
            elem.classList.add('page-nav__day_weekend')
            elem.previousElementSibling.classList.add('page-nav__day_weekend')
        }
    })


    postData('https://jscp-diplom.netoserver.ru/', "event=update")
        .then((data) => {
            const request = {};
            request.seances = data.seances.result;
            request.films = data.films.result;
            request.halls = data.halls.result.filter((hall) => hall.hall_open == 1);
            sessionStorage.setItem('ans', JSON.stringify(request))
            const main = document.querySelector('main')
            request.films.forEach(films => {
                let seancesText = '';request.halls.forEach((hall) => {
                    const seances = request.seances.filter((seance) => ((seance.seance_hallid === hall.hall_id) && (seance.seance_filmid === films.film_id)));

                    if (seances.length > 0) {
                        seancesText += `
                     <div class="movie-seances__hall">
                     <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
                     <ul class="movie-seances__list">`;
                        seances.forEach((seance) => {
                            seancesText += `<li class="movie-seances__time-block">
                        <a class="movie-seances__time" href="hall.html"
                        data-film-name="${films.film_name}"
                        data-film-id="${films.film_id}"
                        data-hall-id="${hall.hall_id}"
                        data-hall-name="${hall.hall_name}"
                        data-price-vip="${hall.hall_price_vip}"
                        data-price-standart="${hall.hall_price_standart}"
                        data-seance-id="${seance.seance_id}" 
                        data-seance-start="${seance.seance_start}"
                        data-seance-time="${seance.seance_time}">${seance.seance_time}</a></li>`;
                        });
                        seancesText += `
                     </ul>
                   </div>`;
                    }
                });

                if (seancesText) {
                    main.innerHTML += `
            <section class="movie">
              <div class="movie__info">
                <div class="movie__poster">
                  <img class="movie__poster-image" alt="${films.film_name} постер." src="${films.film_poster}">
                </div>
                <div class="movie__description">
                  <h2 class="movie__title">${films.film_name}</h2>
                  <p class="movie__synopsis">${films.film_description}</p>
                  <p class="movie__data">
                    <span class="movie__data-duration">${films.film_duration} мин.</span>
                    <span class="movie__data-origin">${films.film_origin}</span>
                  </p>
                </div>
              </div>
              ${seancesText}
            </section>
              `
                }

                const movieSeances = document.querySelectorAll(".movie-seances__time");
                navDay.forEach((elem, index) => {

                    let timeUTCms = +today + (index * 86400000) - fromMidnight
                    elem.dataset.dayTimeStamp = Math.round(timeUTCms / 1000)
                    elem.onclick = (event) => {
                        navDay.forEach((item) => item.classList.remove("page-nav__day_chosen"));
                        if (elem.parentElement.querySelector('.page-nav__day') !== null) {
                            elem.classList.add("page-nav__day_chosen");
                        }
                        const timeStampDay = getTimeStampDay(event);
                        updateSeances(timeStampDay);

                    };
                });
                let updateSeances = (timeStampDay) => {
                    movieSeances.forEach((movieSeance) => {
                        const timeStampSeanceDay = Number(movieSeance.dataset.seanceStart) * 60;
                        const timeStampSeance = timeStampDay + timeStampSeanceDay;
                        const timeStampNow = timestapToday / 1000
                        movieSeance.dataset.seanceTimeStamp = timeStampSeance;
                        movieSeance.classList.toggle("acceptin-button-disabled", timeStampSeance - timeStampNow <= 0);
                    });
                }

                const getTimeStampDay = (event) => {
                    let timeStampDay = Number(event.target.dataset.dayTimeStamp);
                    if (isNaN(timeStampDay)) {
                        timeStampDay = Number(event.target.closest(".page-nav__day").dataset.dayTimeStamp);
                    }
                    return timeStampDay;
                }
                navDay[0].click()


                movieSeances.forEach((movieSeance) => {
                    movieSeance.addEventListener('click', event => {
                        let selectSeance = JSON.stringify(event.target.dataset)
                        sessionStorage.setItem('selectSeance', selectSeance)

                    })
                })

            })
        })
})




