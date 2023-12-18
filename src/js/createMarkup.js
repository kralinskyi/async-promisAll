export default function createMarkUp(arr) {
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
            <p class="card-temp">${temp_c}&deg; C</p>
          </li>`;
      }
    )
    .join('');
}
