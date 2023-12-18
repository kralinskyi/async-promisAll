import axios from 'axios';

export default async function getWeather(arr) {
  const url = 'http://api.weatherapi.com/v1/current.json?';
  const API_KEY = '3e63f0b8839d44b6905122958231712';

  const responses = arr.map(async city => {
    const params = new URLSearchParams({
      key: API_KEY,
      q: city,
      lang: 'uk',
    });

    return await axios.get(url, { params });
  });

  const dataSuccess = await Promise.allSettled(responses);
  const allCitiesWeather = dataSuccess
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value.data);

  return allCitiesWeather;
}
