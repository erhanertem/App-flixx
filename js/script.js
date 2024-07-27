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
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores atque molestiae error debitis provident
					dolore hic odit, impedit sint, voluptatum consectetur assumenda expedita perferendis obcaecati veritatis
					voluptatibus. Voluptatum repellat suscipit, quae molestiae cupiditate modi libero dolorem commodi
					obcaecati! Ratione quia corporis recusandae delectus perspiciatis consequatur ipsam. Cumque omnis ad
					recusandae.
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
	const { results } = await fetchAPIData('movie/popular');

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
	// CREATE PROJECT ROUTER BASED ON BROWSER URL CHANGES
	switch (global.currentPage) {
		case '/':
		case '/index.html':
			displayPopularMovies();
			break;
		case '/shows.html':
			displayPopularShows();
			break;
		case '/movie-details.html':
			displayMovieDetails();
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
