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
async function displayPopularShows() {
	const { results } = await fetchAPIData('movie/popular');
	console.log(results[0]);

	results.forEach((show) => {
		// Mock the show card
		const showEl = document.createElement('div');
		showEl.classList.add('card');
		showEl.innerHTML = ` 
			<a href="tv-details.html?id=${show.id}">
            <img src=${
					show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 'images/no-image.jpg'
				} class="card-img-top" alt=${show.title} />
			</a>
			<div class="card-body">
				<h5 class="card-title">${show.title}</h5>
				<p class="card-text">
					<small class="text-muted">Aired on ${show.release_date}</small>
				</p>
			</div>
      `;

		// Append show elements to the container
		document.querySelector('#popular-shows').appendChild(showEl);
	});
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
	// CREATE PROJECT ROUTER
	switch (global.currentPage) {
		case '/':
		case '/index.html':
			displayPopularMovies();
			// homePage();
			break;
		case '/shows.html':
			displayPopularShows();
			// showsPage();
			break;
		case '/movie-details.html':
			console.log('MOVIE DETAILS');
			// moveDetailsPage();
			break;
		case '/tv-details.html':
			console.log('TV DETAILS');
			// tvDetailsPage();
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
// Once DOM loads, initialize
document.addEventListener('DOMContentLoaded', init);
