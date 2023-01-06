import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  const { value } = event.target;

  listEl.innerHTML = '';
  countryInfoEl.innerHTML = '';

  if (!value.trim()) {
    return;
  }

  fetchCountries(value.trim())
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length === 1) {
        countryInfoRender(data);
        return;
      }

      renderCountries(data);
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountries(countries) {
  const countryRender = countries
    .map(({ flags, name }) => {
      return `<li>
        <img
          src=${flags.svg}
          alt="flag"
          width="70"
          height="50"
        />
        ${name.common}
      </li>`;
    })
    .join('');

  listEl.innerHTML = countryRender;
}

function countryInfoRender(country) {
  const countryInfo = country
    .map(({ flags, name, capital, population, languages }) => {
      return `<ul>
        <li>
          <h1>
            <img
              class="icon"
              src=${flags.svg}
              alt="flag"
              width="50"
              height="30"
            />
            ${name.common}
          </h1>
        </li>
        <li>
          <h4>Capital:</h4>
          ${capital}
        </li>
        <li>
          <h4>Papulation:</h4>
          ${population}
        </li>
        <li>
          <h4>Languages:</h4>
          ${Object.values(languages)}
        </li>
      </ul>`;
    })
    .join('');
  countryInfoEl.innerHTML = countryInfo;
}
