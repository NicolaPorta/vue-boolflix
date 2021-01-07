var app = new Vue(
  {
    el: "#root",
    data: {
      apiId: "12d47eadb7bade3dfdef75db545e889f",
      searchInput: "",
      films: [],
      series: [],
      allVideos: [],
      genres: [],
      selected: "all",
      mostPopular: []
    },
    mounted: function() {
      axios.get("https://api.themoviedb.org/3/discover/movie", {
        params: {
          api_key: this.apiId,
          language: "it-IT",
        }
      }).then(
        (response) => {
            this.mostPopular = response.data.results;
        });
      this.getGenreList();
    },
    methods: {
      searchVideo: function() {
        if (this.searchInput !== "") {
          this.ajaxFilmCall();
        }
      },
      ajaxFilmCall: function() {
        axios.get("https://api.themoviedb.org/3/search/movie", {
          params: {
            api_key: this.apiId,
            query: this.searchInput,
            language: "it-IT",
            // page: this.change
          }
        }).then(
          (response) => {
            this.films = response.data.results;
            this.films.forEach(
              (element,index) => {
                element.vote_average = Math.ceil(element.vote_average/2);
                this.getFilmActors(element, index);
                this.stampGenre(element);
              }
            );
            this.ajaxCallSeries();
          }
        );
      },
      ajaxCallSeries: function() {
        axios.get("https://api.themoviedb.org/3/search/tv", {
          params: {
            api_key: this.apiId,
            query: this.searchInput,
            language: "it-IT"
          }
        }).then(
          (response) => {
            this.series = response.data.results;
            this.series.forEach(
              (element,index) => {
                element.vote_average = Math.ceil(element.vote_average/2);
                this.getTvActors(element, index);
                this.stampGenre(element);
              }
            );
          });
      },
      // Movie Cast
      getFilmActors: function(element, index) {
        axios.get("https://api.themoviedb.org/3/movie/" + element.id + "/credits", {
          params: {
            api_key: this.apiId,
            language: "it-IT",
          }
        }).then(
          (response) => {
            this.stampCast(this.films, response, element, index);
          }
        );
      },
      // TV Cast
      getTvActors: function(element, index) {
        axios.get("https://api.themoviedb.org/3/tv/" + element.id + "/credits", {
          params: {
            api_key: this.apiId,
            language: "it-IT",
          }
        }).then(
          (response) => {
            this.stampCast(this.series, response, element, index);
          }
        );
      },
      // server call for genre list complete
      getGenreList: function() {
        var genres = [];
        axios.get("https://api.themoviedb.org/3/genre/tv/list", {
          params: {
            api_key: this.apiId,
            language: "it-IT"
          }
        }).then(
          (response) => {
            this.genres = response.data.genres;
            this.genres.forEach((element) => {
              genres.push(element.id);
            });

            axios.get("https://api.themoviedb.org/3/genre/movie/list", {
              params: {
                api_key: this.apiId,
                language: "it-IT"
              }
            }).then(
              (response) => {
                response.data.genres.forEach(
                  (element, index) => {
                    if(!genres.includes(element.id)) {
                      element.name = element.name + ' (Film)';
                      this.genres.push(element);
                    }
                  }
                );
                this.genres.sort(function (a,b) {
                  if (a.name > b.name) {
                    return 1;
                  } else if (a.name < b.name) {
                    return -1;
                  } else return 0;
                });
              }
            );
          }
        );
      },
      // genre in card
      stampGenre: function(element) {
        element.genre_ids.forEach(
          (genre, index) => {
            var i = 0;
            while(genre != this.genres[i].id) {
              i++;
            }
            element.genre_ids[index] = this.genres[i].name;
          }
        );
      },
      // Cast in card
      stampCast: function(array, response, element, index) {
        var cast = response.data.cast;
        var casts = [];
        for (var i = 0; i < 5; i++) {
          if(cast[i]) casts.push(cast[i]);
        }
        element = {
          ...element,
          casts
        };
        array[index] = element;
        this.createAllVIdeos();
      },
      createAllVIdeos: function() {
        this.allVideos = this.films.concat(this.series);
        this.allVideos.sort(function (a,b) {
          return b.popularity - a.popularity;
        });
      },
      flags: function(element) {
        switch(element.original_language) {
          case 'en':
            return "img/en-flag.png";
            break;
          case 'it':
            return "img/it-flag.png";
            break;
          case 'fr':
            return "img/fr-flag.png";
            break;
          default:
            return 0;
        }
      }
    }
  }
);
