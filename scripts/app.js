const apiKey = "6a7e14ab";

const fetchData = async searchTerm => {
    const response = await axios.get("http://www.omdbapi.com", {
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

const autocomplete = document.querySelector(".autocomplete");

autocomplete.innerHTML = `
    <label><b>Search For a Movie.</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async event => {
    const movies = await fetchData(event.target.value);

    if (!movies.length) {
        dropdown.classList.remove("is-actve");
        return;
    }

    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let movie of movies) {
        const option = document.createElement("a");
        option.classList.add("dropdown-item");
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        option.innerHTML = `
        <img src="${imgSrc}"/>
        ${movie.Title}
        `;

        option.addEventListener("click", () => {
            dropdown.classList.remove("is-active");
            input.value = movie.Title;
            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    }
};

input.addEventListener("input", debounce(onInput, 500));

document.addEventListener("click", event => {
    if (!autocomplete.contains(event.target)) {
        dropdown.classList.remove("is-active");
    }
});

const onMovieSelect = async movie => {
    const response = await axios.get("http://www.omdbapi.com", {
        params: {
            apikey: apiKey,
            i: movie.imdbID
        }
    });
    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
};

const movieTemplate = movieDetails => {
    return `
        <article class="media">
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
    `;
};
