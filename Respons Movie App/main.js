const searchForm = document.querySelector('form');
const movieContainer = document.querySelector('.movie-container');
const inputBox = document.querySelector('.inputBox');

let genresList = []; // To store genres fetched from the API

const fetchGenres = async () => {
    try {
        const myAPIKey = "af19e6a0fbf44162d2ba2f6076b872fa";
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${myAPIKey}&language=en-US`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch genres.");
        }

        const data = await response.json();
        genresList = data.genres; // Store genres
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
};

const getMovieInfo = async (movie) => {
    try {
        const myAPIKey = "af19e6a0fbf44162d2ba2f6076b872fa"; 
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${myAPIKey}&query=${movie}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch movie data.");
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            showMovieData(data.results[0]); // Pass the first movie in the results
        } else {
            showErrorMessage("No Movie Found!!");
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
};

const showMovieData = (movie) => {
    movieContainer.innerHTML = "";
    movieContainer.classList.remove('noBackground');

    const { title, vote_average, genre_ids, release_date, overview, poster_path } = movie;

    // Map genre IDs to genre names
    const genres = genre_ids.map(id => {
        const genre = genresList.find(g => g.id === id);
        return genre ? genre.name : "Unknown";
    }).join(", ");

    const movieElement = document.createElement("div");
    movieElement.classList.add('movie-info');
    movieElement.innerHTML = `
        <h2>${title}</h2>
        <p><strong>Rating: &#11088;</strong> ${vote_average}</p>
        <p><strong>Release Date: </strong>${release_date}</p>
        <p><strong>Genres: </strong>${genres}</p>
        <p><strong>Overview: </strong>${overview}</p>`;

    const moviePosterElement = document.createElement('div');
    moviePosterElement.classList.add('movie-poster');
    moviePosterElement.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title} Poster"/>`; 

    movieContainer.appendChild(moviePosterElement);
    movieContainer.appendChild(movieElement);
};

const showErrorMessage = (message) => {
    movieContainer.innerHTML = `<h2>${message}</h2>`;
    movieContainer.classList.add('noBackground');
};

const handleFormSubmission = (e) => {
    e.preventDefault(); 
    const movieName = inputBox.value.trim(); // Fix: Correct the property used to get the input value
    if (movieName !== '') {
        showErrorMessage("Fetching Movie Information...");
        getMovieInfo(movieName);
    } else {
        showErrorMessage("Enter a movie name to get movie information");
    }
};

searchForm.addEventListener('submit', handleFormSubmission);

// Fetch genres when the script loads
fetchGenres();







