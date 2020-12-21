var app = new Vue(
  {
    el: "#root",
    data: {
      apiId: "12d47eadb7bade3dfdef75db545e889f",
      searchInput: "",
      films:[],
      series:[],
      allVideos:[],
      genres:[],
      selected:"all",
      stars: []
      // data CHANGE PAGE
      // sources:"",
      // change: 1,
    },
    mounted: function() {
      this.getGenreList();
      this.starRating();
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
            language: "it-IT",
            // page: this.change
          }
        }).then(
          (response) => {
            this.series = response.data.results;
            this.series.forEach(
              (element,index) => {
                element.vote_average = Math.ceil(element.vote_average/2);
                this.getTvActors(element, index);
              }
            );
          });
      },
      roundVote: function() {
        this.allVideos = this.films.concat(this.series);
        this.allVideos.sort(function (a,b) {
          return b.vote_average - a.vote_average;
        });
        // this.cardGenre();
      },
      getFilmActors: function(element, index) {
        axios.get("https://api.themoviedb.org/3/movie/" + element.id + "/credits", {
          params: {
            api_key: this.apiId,
            language: "it-IT",
          }
        }).then(
          (response) => {
            var cast = response.data.cast;
            var casts = [];
            for (var i = 0; i < 5; i++) {
              if (cast[i]) {
                casts.push(cast[i]);
              }
            }
            element = {
              ...element,
              casts
            };
            this.films[index] = element;
            this.roundVote();
          }
        );
      },
      getTvActors: function(element, index) {
        axios.get("https://api.themoviedb.org/3/tv/" + element.id + "/credits", {
          params: {
            api_key: this.apiId,
            language: "it-IT",
          }
        }).then(
          (response) => {
            var cast = response.data.cast;
            var casts = [];
            for (var i = 0; i < 5; i++) {
              if(cast[i])
              casts.push(cast[i]);
            }
            element = {
              ...element,
              casts
            };
            this.series[index] = element;
            this.roundVote();
          }
        );
      },
      getGenreList: function() {
        var genres = [];
        axios.get("https://api.themoviedb.org/3/genre/tv/list", {
          params: {
            api_key: this.apiId,
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
              }
            }).then(
              (response) => {
                response.data.genres.forEach(
                  (element, index) => {
                    if(!genres.includes(element.id)) {
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
      starRating: function() {
        for (var i = 0; i < 5; i++) {
          this.stars.push(i);
        }
      },
      cardGenre: function() {

      }
    },

    // CHANGE PAGE
    // changePage: function() {
    //   this.ajaxCall();
    // },
    // prevPage: function() {
    //   this.change--;
    //   this.ajaxCall();
    // },
    // nextPage: function() {
    //   this.change++;
    //   this.ajaxCall();
    // },
  }
);
