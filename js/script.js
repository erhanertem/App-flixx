import { API_URL, API_KEY, API_READ_ACCESS_TOKEN } from '../pass.js';

const global = { currentPage: window.location.pathname };

async function displayPopularMovies() {
	const { results } = await fetchAPIData('movie/popular');
	console.log(results);

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

// FETCH DATA FROM TMDB API
async function fetchAPIData(endpoint) {
	try {
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
			console.log(displayPopularMovies());
			// homePage();
			break;
		case '/shows.html':
			console.log('SHOWS');
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
