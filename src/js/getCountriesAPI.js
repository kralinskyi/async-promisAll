import axios from 'axios';
import { Notify } from 'notiflix';

export default async function getCountries(arr) {
  const url = `https://restcountries.com/v3.1/name/`;

  const promises = arr.map(async country => {
    return await axios.get(`${url}${country}`);
  });

  const data = await Promise.allSettled(promises);

  // Перший map - щоб не змінити оригінальний масив data, щоб була можливість відфільтрувати також rejected і відмалювати
  const allFullfieldCountries = data
    .map(el => el)
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value.data[0]);

  // Відмальовуєм можливі некоректні запити
  data
    .map(el => el)
    .filter(({ status }) => status === 'rejected')
    .map(({ reason }) =>
      Notify.failure(
        `Fetching ${reason.config.url} failed. Reason - ${reason.message}`
      )
    );

  return allFullfieldCountries;
}
