import { Notify } from 'notiflix';
import getCountries from './js/getCountriesAPI';
import getWeather from './js/getWeatherAPI';
import createMarkUp from './js/createMarkup';

const form = document.querySelector('.js-form');
const addCountryBtn = document.querySelector('.js-add-country');
const countriesInputsContainer = document.querySelector('.js-inputs-container');
const list = document.querySelector('.js-answers-from-form');

const markup =
  '<input type="text" placeholder="enter country" class="inputs" name="country"></input>';

addCountryBtn.addEventListener('click', handleAddCountryBtn);
form.addEventListener('submit', handleFormSubmit);

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

  //Виконуємо запити за масивом країн
  getCountries(countries)
    .then(async response => {
      //відбираємо масив столиць для запиту погоди
      const capitals = response.map(({ capital }) => capital[0]);
      //Забираємо погоду
      const weatherService = await getWeather(capitals);
      //Очищаємо попередні звідмальовані запити
      list.innerHTML = '';
      //Малюємо нову розмітку
      list.insertAdjacentHTML('beforeend', createMarkUp(weatherService));
    })
    .catch(e => console.log(e))
    .finally(() => {
      //Прибираємо лишні inputs Form.reset() на випадок залишити кнопки
      clearInputsContainer();
      // form.reset();
    });
}

//  варіант додавання інпутів до форми
function handleAddCountryBtn() {
  countriesInputsContainer.insertAdjacentHTML('beforeend', markup);
}

// Ощищення контейнера імпутів до базового стану
function clearInputsContainer() {
  countriesInputsContainer.innerHTML = markup;
}
