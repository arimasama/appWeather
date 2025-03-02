const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

function obtenerHoraLocal(dt, sunrise) {
    // Convertimos la marca de tiempo a UTC
    let utcDate = new Date(dt * 1000);

    // Estimamos la diferencia horaria usando la salida del sol
    let sunriseDate = new Date(sunrise * 1000);
    let diferenciaHoraria = sunriseDate.getHours() - 6; // Ajuste estándar

    // Ajustamos la fecha con la diferencia horaria estimada
    utcDate.setHours(utcDate.getHours() + diferenciaHoraria);

    // Formateamos la hora correctamente
    return utcDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}


search.addEventListener('click', () => {

    const APIKey = 'fbbb507638fa4604ccf96fc8f57b2fca';
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=es&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {
        if (json.cod === '404') {
            container.style.height = '400px';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            error404.style.display = 'block';
            error404.classList.add('fadeIn');
            return;
        }

        error404.style.display = 'none';
        error404.classList.remove('fadeIn');

        const image = document.querySelector('.weather-box img');
        const temperature = document.querySelector('.weather-box .temperature');
        const description = document.querySelector('.weather-box .description');
        const humidity = document.querySelector('.weather-details .humidity span');
        const wind = document.querySelector('.weather-details .wind span');
        const timeElement = document.querySelector('.weather-box .timeZone');

        switch (json.weather[0].main) {
            case 'Clear': image.src = 'images/clear.png'; break;
            case 'Rain': image.src = 'images/rain.png'; break;
            case 'Snow': image.src = 'images/snow.png'; break;
            case 'Clouds': image.src = 'images/cloud.png'; break;
            case 'Haze': image.src = 'images/mist.png'; break;
            default: image.src = '';
        }

        // Calcular la hora local usando dt y sunrise
        const formattedTime = obtenerHoraLocal(json.dt, json.sys.sunrise);

        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML = `${json.weather[0].description}`;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
        timeElement.innerHTML = `Hora: ${formattedTime}`;

        weatherBox.style.display = '';
        weatherDetails.style.display = '';
        weatherBox.classList.add('fadeIn');
        weatherDetails.classList.add('fadeIn');
        container.style.height = '550px';
    });
});