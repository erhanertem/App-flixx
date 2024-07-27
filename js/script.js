import { API_URL, API_KEY, API_READ_ACCESS_TOKEN } from '../pass.js';

const globalState = {
	currentPage: window.location.pathname,
	search: {
		term: '',
		type: '',
		page: 1,
		totalPages: 1,
		totalResults: 0,
	},
};

async function displayPopularMovies() {
	const { results } = await fetchAPIData('movie/popular');
	results.forEach((movie) => {
		// Mock the movie card
		const movieEl = document.createElement('div');
		movieEl.classList.add('card');
		movieEl.innerHTML = ` 
			<a href="movie-details.html?id=${movie.id}">
            <img src=${
					movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'images/no-image.jpg'
				} class="card-img-top" alt=${movie.title} />
			</a>
			<div class="card-body">
				<h5 class="card-title">${movie.title}</h5>
				<p class="card-text">
					<small class="text-muted">Release: ${movie.release_date}</small>
				</p>
			</div>
      `;

		// Append movie elements to the container
		document.querySelector('#popular-movies').appendChild(movieEl);
	});
}

// Overlay the background image
function displayBackgroundImage(type, uri) {
	// CREATE THE BACKGROUND
	const overlay = document.createElement('div');
	overlay.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${uri})`;
	overlay.style.position = 'absolute';
	overlay.style.width = '100vw';
	overlay.style.height = '100vh';
	overlay.style.backgroundPosition = 'center';
	overlay.style.backgroundRepeat = 'no-repeat';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.zIndex = '-1';
	overlay.style.opacity = '0.1';

	// CHECK WHERE TO APPLY - TYPE
	if (type === 'movie') {
		document.querySelector('#movie-details').appendChild(overlay);
	} else {
		document.querySelector('#show-details').appendChild(overlay);
	}
}

// READ THE MOVIE FROM THE BROWSER PATH - SIMILAR TO WHAT WE SEE IN REACT APPS
async function displayMovieDetails() {
	const movieId = window.location.search.split('=')[1];

	const data = await fetchAPIData(`movie/${movieId}`);
	const {
		original_title,
		vote_average,
		release_date,
		homepage,
		budget,
		revenue,
		runtime,
		genres,
		production_companies,
		backdrop_path,
		poster_path,
		overview,
	} = data;
	const movieEl = document.querySelector('#movie-details');
	movieEl.innerHTML = ` 
      <div class="details-top">
			<div>
				<img src=${
					poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'images/no-image.jpg'
				} class="card-img-top" alt= ${original_title} />
			</div>
			<div>
				<h2>${original_title}</h2>
				<p>
					<i class="fas fa-star text-primary"></i>
					${vote_average.toFixed(0)} / 10
				</p>
				<p class="text-muted">Release Date: ${release_date}</p>
				<p>
					${overview}
				</p>
				<h5>Genres</h5>
				<ul class="list-group">
            ${genres
					.map((genre) => {
						return `<li>${genre.name}</li>`;
					})
					.join('')}
				</ul>
				<a href=${homepage} target="_blank" class="btn">Visit Movie Homepage</a>
			</div>
		</div>
		<div class="details-bottom">
			<h2>Movie Info</h2>
			<ul>
				<li><span class="text-secondary">Budget:</span> $${budget.toLocaleString('en-US')}</li>
				<li><span class="text-secondary">Revenue:</span> $${revenue.toLocaleString('en-US')}</li>
				<li><span class="text-secondary">Runtime:</span> ${runtime} minutes</li>
				<li><span class="text-secondary">Status:</span> ${release_date}</li>
			</ul>
			<h4>Production Companies</h4>
			<div class="list-group"> ${production_companies.map((company) => company.name).join(', ')}</div>
		</div>`;

	// Overlay the background image
	displayBackgroundImage('movie', backdrop_path);
}

async function displayPopularShows() {
	const { results } = await fetchAPIData('tv/popular');

	results.forEach((show) => {
		// Mock the show card
		const showEl = document.createElement('div');
		showEl.classList.add('card');
		showEl.innerHTML = ` 
			<a href="tv-details.html?id=${show.id}">
            <img src=${
					show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 'images/no-image.jpg'
				} class="card-img-top" alt=${show.name} />
			</a>
			<div class="card-body">
				<h5 class="card-title">${show.name}</h5>
				<p class="card-text">
					<small class="text-muted">First Aired on ${show.first_air_date}</small>
				</p>
			</div>
      `;

		// Append show elements to the container
		document.querySelector('#popular-shows').appendChild(showEl);
	});
}

// READ THE SHOW FROM THE BROWSER PATH - SIMILAR TO WHAT WE SEE IN REACT APPS
async function displayShowDetails() {
	const showId = window.location.search.split('=')[1];

	const data = await fetchAPIData(`tv/${showId}`);

	const {
		backdrop_path,
		original_name,
		poster_path,
		vote_average,
		first_air_date,
		overview,
		genres,
		homepage,
		production_companies,
		number_of_episodes,
		last_episode_to_air,
		status,
	} = data;

	const showEl = document.querySelector('#show-details');
	showEl.innerHTML = `
   <div class="details-top">
					<div>
						<img src=${
							poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'images/no-image.jpg'
						} class="card-img-top" alt=${original_name} />
					</div>
					<div>
						<h2>${original_name}</h2>
						<p>
							<i class="fas fa-star text-primary"></i>
							${vote_average.toFixed(0)} / 10
						</p>
						<p class="text-muted">Release Date: ${first_air_date}</p>
						<p>
							${overview}
						</p>
						<h5>Genres</h5>
						<ul class="list-group">
							${genres
								.map((genre) => {
									return `<li>${genre.name}</li>`;
								})
								.join('')}
						</ul>
						<a href=${homepage} target="_blank" class="btn">Visit Show Homepage</a>
					</div>
				</div>
				<div class="details-bottom">
					<h2>Show Info</h2>
					<ul>
						<li><span class="text-secondary">Number Of Episodes:</span> ${number_of_episodes}</li>
						<li><span class="text-secondary">Last Episode To Air:</span> ${last_episode_to_air.name}</li>
						<li><span class="text-secondary">Status:</span> ${status}</li>
					</ul>
					<h4>Production Companies</h4>
					<div class="list-group">${production_companies.map((company) => company.name).join(', ')}</div>
				</div>`;

	// Overlay the background image
	displayBackgroundImage('tv', backdrop_path);
}

// SPINNER
function showSpinner(state) {
	state
		? document.querySelector('.spinner').classList.add('show')
		: document.querySelector('.spinner').classList.remove('show');
}

// FETCH DATA FROM TMDB API
async function fetchAPIData(endpoint) {
	try {
		showSpinner(true);
		// GET RES FROM API
		const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
		// GUARD CLAUSE - IF NO RES FROM SERVER THROW ERR
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		// RETURN RESPONSE DATA IN JS READABLE FORMAT
		return await response.json();
	} catch (err) {
		console.error('Network error:', err);
	} finally {
		showSpinner(false);
	}
}

// HIGHLIGHT ACTIVE LINK
function highlightActiveLink() {
	const links = document.querySelectorAll('.nav-link');
	links.forEach((link) => {
		const href = link.getAttribute('href');
		if (href === globalState.currentPage) {
			link.classList.toggle('active');
		}
	});
}

// Seach Movies/shows
async function search() {
	// READ PARAMS FROM BROWSER URL
	const queryString = window.location.search.split('?')[1];
	const urlParams = new URLSearchParams(queryString);
	// WRITE THEM DOWN TO GLOBAL STATE TEMPORARILY
	globalState.search.type = urlParams.get('type');
	globalState.search.term = urlParams.get('search-term');

	// MAKE A SEARCH WITH THOESE PARAMS
	if (globalState.search.term !== '' && globalState.search.term !== null) {
		const { results, total_pages, page, total_results } = await searchAPIData();

		globalState.search.page = page;
		globalState.search.totalPages = total_pages;
		globalState.search.totalResults = total_results;

		// GUARD CLAUSE
		if (results.length === 0) {
			showAlert('No results found');
			return;
		}

		// DISPLAY THE REUSLTS IF SOMETHING IS RETURNED
		displaySearchResults(results);
		// CLEAR THE INPUT FIELD
		document.querySelector('#search-term').value = '';
		// RESET THE PARAMS STATES
	} else {
		showAlert('Please enter a search term');
	}
}

function displaySearchResults(results) {
	console.log(results);
	results.forEach((result) => {
		// Mock the item card
		const itemEl = document.createElement('div');
		itemEl.classList.add('card');
		itemEl.innerHTML = ` 
			<a href="${globalState.search.type}-details.html?id=${result.id}">
            <img src=${
					result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : 'images/no-image.jpg'
				} class="card-img-top" alt=${globalState.search.type === 'movie' ? result.title : result.name} />
			</a>
			<div class="card-body">
				<h5 class="card-title">${globalState.search.type === 'movie' ? result.title : result.name}</h5>
				<p class="card-text">
					<small class="text-muted">First Aired on ${
						globalState.search.type === 'movie' ? result.release_date : result.first_air_date
					}</small>
				</p>
			</div>
      `;

		document.querySelector('#search-results-heading').innerHTML = `<h2>${
			globalState.search.page !== globalState.search.totalPages
				? results.length * globalState.search.page
				: globalState.search.totalResults
		} of ${globalState.search.totalResults} Results for ${globalState.search.term}</h2>`;

		// Append show elements to the container
		document.querySelector('#search-results').append(itemEl);
	});

	displayPagination();
}

// CREATE AND DIPLAY PAGINATION
function displayPagination() {
	// RENDER ON UI
	const div = document.createElement('div');
	div.classList.add('pagination');
	const html = ` 
      <div class="pagination">
			<button class="btn btn-primary" id="prev">Prev</button>
			<button class="btn btn-primary" id="next">Next</button>
			<div class="page-counter">Page ${globalState.search.page} of ${globalState.search.totalPages}</div>
		</div>`;
	div.innerHTML = html;
	document.querySelector('#pagination').appendChild(div);

	// GUARD CLAUSE FOR ACTIVE PREV/NEXT BTNS
	// DISABLE PREV BTN IF ON 1ST PAGE
	if (globalState.search.page === 1) {
		document.querySelector('#prev').disabled = true;
	} else {
		document.querySelector('#prev').disabled = false;
	}
	// DISABLE NEXT BTN IF ON LAST PAGE
	if (globalState.search.page === globalState.search.totalPages) {
		document.querySelector('#next').disabled = true;
	} else {
		document.querySelector('#next').disabled = false;
	}

	// EVENT LISTENERS FOR PREV/NEXT BTNS
	document.querySelector('#prev').addEventListener('click', () => {
		globalState.search.page--;

		clearSearchContainers();
		search();
	});

	document.querySelector('#next').addEventListener('click', () => {
		globalState.search.page++;

		clearSearchContainers();
		search();
	});
}

function clearSearchContainers() {
	document.querySelector('#search-results').innerHTML = '';
	document.querySelector('#pagination').innerHTML = '';
	document.querySelector('#search-results-heading').innerHTML = '';
}

// FETCH DATA FROM TMDB API
async function searchAPIData() {
	try {
		showSpinner(true);
		// GET RES FROM API
		const response = await fetch(
			`${API_URL}search/${globalState.search.type}?api_key=${API_KEY}&language=en-US&query=${globalState.search.term}&page=${globalState.search.page}`
		);
		// GUARD CLAUSE - IF NO RES FROM SERVER THROW ERR
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		// RETURN RESPONSE DATA IN JS READABLE FORMAT
		return await response.json();
	} catch (err) {
		console.error('Network error:', err);
	} finally {
		showSpinner(false);
	}
}

// Alert Element
function showAlert(message, className = 'error') {
	const alertEl = document.createElement('div');
	alertEl.classList.add('alert', className);
	alertEl.style.position = 'relative';
	alertEl.textContent = message;
	document.querySelector('#alert').style.position = 'absolute';
	document.querySelector('#alert').append(alertEl);

	// Delay alert go away
	setTimeout(() => {
		alertEl.remove();
	}, 2000);
}

function init() {
	// CREATE PROJECT ROUTER BASED ON BROWSER URL CHANGES
	switch (globalState.currentPage) {
		case '/':
		case '/index.html':
			displaySliderMovies();
			displayPopularMovies();
			break;
		case '/shows.html':
			displayPopularShows();
			break;
		case '/movie-details.html':
			displayMovieDetails();
			break;
		case '/tv-details.html':
			displayShowDetails();
			break;
		case '/search.html':
			search();
			break;
		default:
			notFoundPage();
	}

	// HIGHLIGHT THE ACTIVE NAVIGATION LINK
	highlightActiveLink();
}

async function displaySliderMovies() {
	const { results } = await fetchAPIData('movie/now_playing');

	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide');
		div.innerHTML = `
			<a href="movie-details.html?id=${movie.id}"}>
				<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt=${movie.title} />
			</a>
			<h4 class="swiper-rating"><i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(0)} / 10</h4>
		`;
		// Append movie elements to the container - DOM
		document.querySelector('.swiper-wrapper').appendChild(div);
		// INITIALIZE SWIPER
		initSwiper();
	});
}

// SWIPER OBJECT SETUP
function initSwiper() {
	new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: { slidesPerView: 2 },
			700: { slidesPerView: 3 },
			1200: { slidesPerView: 4 },
		},
	});
}

// Once DOM loads, initialize
document.addEventListener('DOMContentLoaded', init);
