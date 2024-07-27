import { API_URL, API_KEY, API_READ_ACCESS_TOKEN } from '../pass.js';

const global = { currentPage: window.location.pathname };

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
	console.log(data);
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
	console.log(results[0]);
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
	console.log(data);

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
		if (href === global.currentPage) {
			link.classList.toggle('active');
		}
	});
}

function init() {
	// CREATE PROJECT ROUTER BASED ON BROWSER URL CHANGES
	switch (global.currentPage) {
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
			console.log('SEARCH');
			// searchPage();
			break;
		default:
			notFoundPage();
	}

	// HIGHLIGHT THE ACTIVE NAVIGATION LINK
	highlightActiveLink();
}

async function displaySliderMovies() {
	const { results } = await fetchAPIData('movie/now_playing');
	console.log(results);

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
