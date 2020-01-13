const apiKey = "6a7e14ab";

const fetchData = async searchTerm => {
    const response = await axios.get("https://www.omdbapi.com", {
        params: {
            apikey: apiKey,
            s: searchTerm
        }
    });
    if (response.data.Error) {
        return [];
    }
    return response.data.Search;
};

createAutoComplete({
    root: document.querySelector("#left-autocomplete"),
    renderOption: movie => {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
                <img src="${imgSrc}"/>
                ${movie.Title} (${movie.Year})
            `;
    },
    typeOfData: "a movie",
    onOptionSelect: movie => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, "#left-summary");
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get("https://www.omdbapi.com/", {
            params: {
                apikey: apiKey,
                s: searchTerm
            }
        });
        if (response.data.Error) {
            return [];
        }

        return response.data.Search;
    }
});

createAutoComplete({
    root: document.querySelector("#right-autocomplete"),
    renderOption: movie => {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
                <img src="${imgSrc}"/>
                ${movie.Title} (${movie.Year})
            `;
    },
    typeOfData: "a movie",
    onOptionSelect: movie => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, "#right-summary");
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: apiKey,
                s: searchTerm
            }
        });
        if (response.data.Error) {
            return [];
        }

        return response.data.Search;
    }
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summary) => {
    const response = await axios.get("http://www.omdbapi.com", {
        params: {
            apikey: apiKey,
            i: movie.imdbID
        }
    });
    document.querySelector(`${summary}`).innerHTML = movieTemplate(
        response.data
    );
    if (summary === "#left-summary") {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }
    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll(
        "#left-summary .notification"
    );

    const rightSideStats = document.querySelectorAll(
        "#right-summary .notification"
    );

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
            rightStat.classList.remove("is-warning");
            rightStat.classList.add("is-primary");
        } else {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
            leftStat.classList.remove("is-warning");
            leftStat.classList.add("is-primary");
        }
    });
};

const movieTemplate = movieDetails => {
    const dollars = parseInt(
        movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
    );
    const metaScore = parseInt(movieDetails.Metascore);
    const imdbScore = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));

    let count = 0;
    movieDetails.Awards.split(" ").forEach(word => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return;
        } else {
            count += value;
        }
    });

    return `
        <article class="media movie-summary">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value="${count}" class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value="${dollars}" class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value="${metaScore}" class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metacritic Rating</p>
        </article>
        <article data-value="${imdbScore}" class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value="${imdbVotes}" class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
