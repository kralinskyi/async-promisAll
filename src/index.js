import axios from 'axios';
import { Notify } from 'notiflix';

const form = document.querySelector('.js-form');
const addCountryBtn = document.querySelector('.js-add-country');
const countriesInputsContainer = document.querySelector('.js-inputs-container');
const list = document.querySelector('.js-answers-from-form');

const markup =
  '<input type="text" placeholder="enter country" class="inputs" name="country"></input>';

addCountryBtn.addEventListener('click', handleAddCountryBtn);
form.addEventListener('submit', handleFormSubmit);

//  варіант додавання інпутів до форми
function handleAddCountryBtn() {
  countriesInputsContainer.insertAdjacentHTML('beforeend', markup);
}

// Ощищення контейнера імпутів до базового стану
function clearInputsContainer() {
  countriesInputsContainer.innerHTML = markup;
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  //Збираємо всі значення з форми за атрибутом "name", фільтруємо порожні, видаляємо зайві пробіли
  const countries = formData
    .getAll('country')
    .filter(el => el)
    .map(el => el.trim());

  // Якщо масив значень пустий, return
  if (!countries.length) {
    Notify.warning('Enter at least one country pls');
    return;
  }

  getCountries(countries)
    .then(async response => {
      const capitals = response.map(({ capital }) => capital[0]);

      const weatherService = await getWeather(capitals);

      list.innerHTML = '';

      list.insertAdjacentHTML('beforeend', createMarkUp(weatherService));
    })
    .catch(e => console.log(e))
    .finally(() => {
      clearInputsContainer();
      form.reset();
    });
}

async function getCountries(arr) {
  const url = `https://restcountries.com/v3.1/name/`;

  const promises = arr.map(async country => {
    return await axios.get(`${url}${country}`);
  });

  const data = await Promise.allSettled(promises);

  const allFullfieldCountries = data
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value.data[0]);

  return allFullfieldCountries;
}

async function getWeather(arr) {
  const url = 'http://api.weatherapi.com/v1/current.json?';
  const API_KEY = '3e63f0b8839d44b6905122958231712';

  const resps = arr.map(async city => {
    const params = new URLSearchParams({
      key: API_KEY,
      q: city,
      lang: 'uk',
    });

    return await axios.get(url, { params });
  });

  const data = await Promise.allSettled(resps);
  const allCitiesWeather = data
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value.data);

  return allCitiesWeather;
}

function createMarkUp(arr) {
  return arr
    .map(
      ({
        current: {
          condition: { icon, text },
          temp_c,
        },
        location: { name, country },
      }) => {
        return ` <li class="card">
            <div class="card-info">
              <h2 class="card-country">${country}</h2>
              <h3 class="card-city">${name}</h3>
            </div>
            <img class="card-icon" src="${icon}" alt="${text}">
            <p class="card-text">${text}</p>
            <p class="card-temp">${temp_c}</p>
          </li>`;
      }
    )
    .join('');
}
