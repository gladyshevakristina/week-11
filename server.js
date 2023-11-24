const express = require('express');
const axios = require('axios');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/search', (req, res) => { 
    res.render('search', { movieDetails:'' } );
});

app.post('/search', (req, res) => { 
    let userMovieTitle = req.body.movieTitle;

    let movieUrl = `https://api.themoviedb.org/3/search/movie?query=star+wars&api_key=20ad6a2c1f2137bb81394c43e1365f13{userMovieTitle}`;
    let genresUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=20ad6a2c1f2137bb81394c43e1365f13&language=en';

    let endpoints = [movieUrl, genresUrl];

    axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
    .then(axios.spread((movie, genres) => {
        const[movieRaw] = movie.data.results;
        let movieGenreIDs = movieRaw.genre_ids;
        let movieGenres = genres.data.genres;

        let movieGenresArray = [];

        for(let i = 0; i < movieGenreIDs.lenght; i++) { // i++ - i = i + 1
        for(let j = 0; j < movieGenres.lenght; j++) { 
            if(movieGenreIDs[i] === movieGenres [j].id) { 
                movieGenresArray.push(movieGenres[j].name);
            }
        }
    }

    let genresToDisplay = '';
    movieGenresArray.forEach(genre => { 
        genresToDisplay = genresToDisplay+ `${genre}, `;

    });

    genresToDisplay = genresToDisplay.slice(0, -2) + '.';



        let movieData = { 
            title: movieRaw.title,
            year: new Date(movieRaw.release_date).getFullYear(),
            overview: movieRaw.overview,
            genres: genresToDisplay,
            posterUrl: ''
        };

        res.render('search', {movieDetails: movieData});

    }));

});

app.listen(process.env.PORT || 3000, () => { 
    console.log('Server is running.')
});