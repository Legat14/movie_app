'use strict'

console.log(`1. Вёрстка +10\n
   - на странице есть несколько карточек фильмов и строка поиска. На каждой карточке фильма есть постер и название фильма. Так же показана дополнительная информация о фильме +5\n
   - в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5\n
2. При загрузке приложения на странице отображаются карточки фильмов с полученными от API данными +10\n
3. Если в поле поиска ввести слово и отправить поисковый запрос, на странице отобразятся карточки фильмов, в названиях которых есть это слово +10\n
4. Поиск +30\n
   - при открытии приложения курсор находится в поле ввода +5\n
   - есть placeholder +5\n
   - автозаполнение поля ввода отключено (нет выпадающего списка с предыдущими запросами) +5\n
   - поисковый запрос можно отправить нажатием клавиши Enter +5\n
   - после отправки поискового запроса и отображения результатов поиска, поисковый запрос продолжает отображаться в поле ввода +5\n
   - есть крестик при клике по которому поисковый запрос из поля ввода удаляется и отображается placeholder +5\n
   - неплохое оформление, дополнительный функционал: дополнительная информация (бюджет фильма, дата премьеры и т. д.), визуализатор рейтинга, информация о фильме, если щелкнуть на карточку, кнопка возврата наверх +10\n
Итого: 70 / 60`);

const movieList = document.querySelector('.movie-list');

// ***** Create a movie Card

function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  const moviePoster = document.createElement('img');
  const movieInfo = document.createElement('div');
  const movieInfoUl = document.createElement('ul');
  const movieInfoUlLiTitle = document.createElement('li');
  const movieInfoUlLiTagline = document.createElement('li');
  const movieInfoUlLiGenres = document.createElement('li');
  const movieInfoUlLiRelease = document.createElement('li');
  const movieInfoUlLiBudget = document.createElement('li');
  const movieRatingDiv = document.createElement('div');
  const movieRatingCounter = document.createElement('div');
  const movieVouteCount = document.createElement('p');
  const movieRating = document.createElement('p');
  const movieRatingMeter = document.createElement('div');
  const movieRatingMeterFill = document.createElement('div');
  const movieRatingMeterEmpty = document.createElement('div');

  movieCard.classList.add('movie-card');
  movieCard.dataset.id = movie.id;
  moviePoster.classList.add('movie-card-img');
  movieInfo.classList.add('movie-info');
  movieRatingDiv.classList.add('rating-div');
  movieRatingCounter.classList.add('rating-counter');
  movieRating.classList.add('rating');
  movieRatingMeter.classList.add('rating-meter');
  movieRatingMeterFill.classList.add('rating-meter-fill');
  movieRatingMeterEmpty.classList.add('rating-meter-empty');

  if (movie.poster_path !== null) {
    moviePoster.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
  } else {
    moviePoster.src = './assets/img/no_image.jpg';
  }
  moviePoster.alt = `${movie.title}`;
  movieList.append(movieCard);
  movieCard.append(moviePoster);
  movieCard.append(movieInfo);
  movieInfo.append(movieInfoUl);

  movieInfoUlLiTitle.innerHTML = `<span class="info-name">Title:</span> ${movie.title}`;
  movieInfoUl.append(movieInfoUlLiTitle);

  let tagline;
  if (movie.tagline === '') {
    tagline = 'No tagline';
  } else {
    tagline = movie.tagline;
  }
  movieInfoUlLiTagline.innerHTML = `<span class="info-name">Tagline:</span> ${tagline}`;
  movieInfoUl.append(movieInfoUlLiTagline);

  const genresArray = movie.genres.map(function (element) {
    return element.name;
  });
  let genresString;
  if (genresArray.length === 0) {
    genresString = 'No info';
  } else {
    genresString = genresArray.join(', ');
  }

  movieInfoUlLiGenres.innerHTML = `<span class="info-name">Genre:</span> ${genresString}`;
  movieInfoUl.append(movieInfoUlLiGenres);

  let release;
  if (movie.release_date === '') {
    release = 'No info';
  } else {
    release = movie.release_date;
  }
  movieInfoUlLiRelease.innerHTML = `<span class="info-name">Premiere:</span> ${release}`;
  movieInfoUl.append(movieInfoUlLiRelease);

  let budget;
  if (movie.budget === 0) {
    budget = 'No info';
  } else budget = (movie.budget).toString().split('').reverse().join('').replaceAll('000', '000.').split('').reverse().join('') + '&nbsp;$';

  movieInfoUlLiBudget.innerHTML = `<span class="info-name">Budget:</span> ${budget}`;
  movieInfoUl.append(movieInfoUlLiBudget);

  movieInfo.append(movieRatingDiv);
  movieRatingDiv.append(movieRatingCounter);
  movieRating.innerHTML = `${(movie.vote_average).toFixed(1)}`;
  movieRatingCounter.append(movieRating);
  movieVouteCount.innerHTML = `<span class="info-name">Vote:</span> ${movie.vote_count} people`;
  movieRatingCounter.append(movieVouteCount);
  movieRatingDiv.append(movieRatingMeter);
  movieRatingMeter.append(movieRatingMeterFill);
  movieRatingMeter.append(movieRatingMeterEmpty);

  const ratingMeterFillValue = movie.vote_average * 10;
  movieRatingMeterFill.style.width = `${ratingMeterFillValue}%`;

  if (movie.vote_average > 8) {
    movieRating.classList.add('rating-green');
    movieRatingMeterFill.style.backgroundColor = '#1d5c00';
  } else if (movie.vote_average > 5) {
    movieRating.classList.add('rating-yellow');
    movieRatingMeterFill.style.backgroundColor = '#887a00';
  } else if (movie.vote_average > 2) {
    movieRating.classList.add('rating-red');
    movieRatingMeterFill.style.backgroundColor = '#ff796f';
  }

  movieCard.addEventListener('click', showDescription);

  toggleNothingFound('hide');
}

// ***** Fill start page *****

const popular20Url = 'https://api.themoviedb.org/3/movie/popular?api_key=ec5c816ec7667b2692d050119dbe045d&language=en-US&page=1'; // Двадцать популярных фильмов

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  await data.results.map((movie) => {
    getFullMovieInfoById(movie)
  });
}

async function getFullMovieInfoById(movie) {
  const movieIdRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=ec5c816ec7667b2692d050119dbe045d&language=en-US`);
  const movieFullData = await movieIdRes.json();
  createMovieCard(movieFullData);
}

getMovies(popular20Url);

// ***** Clear page *****

function clearPage() {
  movieList.innerHTML = '';
  toggleNothingFound('show');
}

// ***** Search *****

const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');

function getQuery() {
  return searchInput.value;
}

const searchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=ec5c816ec7667b2692d050119dbe045d&language=en-US&query=Matrix&page=1&include_adult=truth'; // Поисковый запрос. Заменить <<Search>> на текст поиска

searchButton.addEventListener('click', () => {
  clearPage();
  const query = getQuery();
  getMovies(`https://api.themoviedb.org/3/search/movie?api_key=ec5c816ec7667b2692d050119dbe045d&language=en-US&query=${query}&page=1&include_adult=truth`);
  focusSearch();
});

document.addEventListener('keydown', () => {
  if (event.key === 'Enter') {
    clearPage();
    const query = getQuery();
    getMovies(`https://api.themoviedb.org/3/search/movie?api_key=ec5c816ec7667b2692d050119dbe045d&language=en-US&query=${query}&page=1&include_adult=truth`);
    focusSearch();
  }
});

// ***** Focus on search *****

function focusSearch() {
  searchInput.focus();
}

focusSearch();

// ***** Clear search *****

const clearButton = document.querySelector('.clear-button');

function clearSearch() {
  searchInput.value = '';
}

clearButton.addEventListener('click', () => {
  clearSearch();
  focusSearch();
});

// ***** Description window *****

const descriptionWindow = document.querySelector('.description-window');
const descriptionWindowImg = document.querySelector('.description-window-img');
const descriptionTitle = document.querySelector('.description-title');
const description = document.querySelector('.description');
const closeButton = document.querySelector('.close-button');
const darkBg = document.querySelector('.dark-bg');

function toggleDescriptionWindow() {
  descriptionWindow.hidden = !descriptionWindow.hidden;
}

async function getFullMovieDescriptionById(id) {
  const movieIdRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=ec5c816ec7667b2692d050119dbe045d&language=en-US`);
  const movieFullData = await movieIdRes.json();
  fillDescriptionImg(movieFullData);
  fillDescriptionTitle(movieFullData);
  fillDescription(movieFullData);
}

function fillDescriptionImg(movie) {
  if (movie.poster_path !== null) {
    descriptionWindowImg.src = `https://image.tmdb.org/t/p/w400${movie.poster_path}`;
  } else {
    descriptionWindowImg.src = './assets/img/no_image.jpg';
  }
}

function fillDescriptionTitle(movie) {
  descriptionTitle.innerHTML = movie.title;
}

function fillDescription(movie) {
  if (movie.overview !== '') {
    description.innerHTML = movie.overview;
  } else description.innerHTML = 'No description';
}

function toggleDescriptionAnimation(command) {
  if (command === 'show') {
    descriptionWindow.classList.add('description-window-animation-in');
    setTimeout(() => {
      descriptionWindow.classList.remove('description-window-animation-in');
    }, 300);
  } else {
    descriptionWindow.classList.add('description-window-animation-out');
    setTimeout(() => {
      descriptionWindow.classList.remove('description-window-animation-out');
    }, 200);
  }
}

function toggleDarkBg(command) {
  if (command === 'show') {
    darkBg.hidden = false;
  } else {
    darkBg.hidden = true;
  }
}

function showDescription() {
  getFullMovieDescriptionById(event.currentTarget.dataset.id);
  toggleDescriptionWindow();
  toggleDarkBg('show');
  toggleDescriptionAnimation('show');
}

closeButton.addEventListener('click', () => {
  toggleDescriptionAnimation('hide');
  setTimeout(() => {
    toggleDescriptionWindow();
    toggleDarkBg('hide');
  }, 180);
});

// ***** Hide clear button *****

function toggleClearButton(command) {
  if (command === 'hide') {
    clearButton.classList.remove('clear-button-animation-in');
    clearButton.classList.add('clear-button-animation-out');
    setTimeout(() => {
      clearButton.hidden = true;
    }, 380);
  } else {
    clearButton.classList.remove('clear-button-animation-out');
    clearButton.hidden = false;
    clearButton.classList.add('clear-button-animation-in');
  }
}

searchInput.addEventListener('input', () => {
  if (searchInput.value !== '') {
    toggleClearButton('show');
  } else {
    toggleClearButton('hide');
  }
});

clearButton.addEventListener('click', () => {
  toggleClearButton('hide');
});

// ***** Show Nothing found image *****

const nothingFoundDiv = document.querySelector('.nothing-found');

function toggleNothingFound(command) {
  if (command === 'show') {
    nothingFoundDiv.hidden = false;
  } else {
    nothingFoundDiv.hidden = true;
  }
}

// ***** Go up button *****

const goUpButton = document.querySelector('.go-up-button');

function toggleGoUpButton(command) {
  if (command === 'show') {
    goUpButton.hidden = false;
    if (!goUpButton.classList.contains('go-up-button-animation-in')) {
      goUpButton.classList.add('go-up-button-animation-in');
    }
  } else {
    if (goUpButton.classList.contains('go-up-button-animation-in')) {
      goUpButton.classList.remove('go-up-button-animation-in');
      goUpButton.classList.add('go-up-button-animation-out');
      setTimeout(() => {
        goUpButton.classList.remove('go-up-button-animation-out');
        goUpButton.hidden = true;
      }, 380);
    }
  }
}

window.addEventListener('scroll', () => {
  if (pageYOffset > 300) {
    toggleGoUpButton('show');
  } else if (pageYOffset < 200) {
    toggleGoUpButton('hide');
  }
});

goUpButton.addEventListener('click', () => {
  window.scrollTo(0, 0);
});