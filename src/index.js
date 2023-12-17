import axios from 'axios';
import { Notify } from 'notiflix';

const form = document.querySelector('.js-form');
const addCountryBtn = document.querySelector('.js-add-country');
const countriesContainer = document.querySelector('.js-form-btns-container');
const list = document.querySelector('.js-answers-from-form');
const url = `https://restcountries.com/v3.1/name/`;

addCountryBtn.addEventListener('click', handleAddCountryBtn);
form.addEventListener('submit', handleFormSubmit);

function handleAddCountryBtn() {
  const markup =
    '<input type="text" placeholder="enter country" class="inputs"  name="country"></input>';
  countriesContainer.insertAdjacentHTML('beforeend', markup);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const countries = formData
    .getAll('country')
    .filter(el => el)
    .map(el => el.trim());

  getCountries(countries)
    .then(async response => {
      const capitals = response.map(({ capital }) => capital[0]);
      const weatherService = await getWeather(capitals);
      markup =
        '<input type="text" placeholder="enter country" class="inputs" name="country"></input>';
      list.innerHTML = '';
      countriesContainer.innerHTML = markup;
      list.insertAdjacentHTML('beforeend', createMarkUp(weatherService));
      console.log(weatherService);
    })
    .catch(e => console.log(e))
    .finally(() => form.reset());
}

async function getCountries(arr) {
  const resps = arr.map(async country => {
    return await axios.get(`${url}${country}`);
  });

  const data = await Promise.allSettled(resps);
  const countryObj = data
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value.data[0]);
  return countryObj;
}

async function getCapital(arr) {
  try {
    const responses = arr.map(async country => {
      await axios.get(`${url}${country}`);
    });
    const resolveProm = (await Promise.allSettled(responses)).filter(
      ({ status }) => status === 'fulfilled'
    );

    const rejectedProm = (await Promise.allSettled(responses)).filter(
      ({ status }) => status === 'rejected'
    );

    console.log(resolveProm);
    console.log(rejectedProm);
  } catch (error) {
    console.log(error);
  }
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
  const countryObjs = data
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value.data);

  return countryObjs;
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
     <div>
      <h2>${country}</h2>
      <h3>${name}</h3>
    </div>
      <img src="${icon}" alt="${text}">
      <p>${text}</p>
      <p>${temp_c}</p>
    </li>`;
      }
    )
    .join('');
}
