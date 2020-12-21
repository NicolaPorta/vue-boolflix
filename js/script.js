var app = new Vue(
  {
    el: "#root",
    data: {
      apiId: "12d47eadb7bade3dfdef75db545e889f",
      searchInput: "",
      films:[],
      series:[],
      allVideos:[]
      // data CHANGE PAGE
      // sources:"",
      // change: 1,
    },
    methods: {
      searchVideo: function() {
        if (this.searchInput !== "") {
          this.ajaxCall();
        }
      },
      ajaxCall: function() {
        axios.get("https://api.themoviedb.org/3/search/movie", {
          params: {
            api_key: this.apiId,
            query: this.searchInput,
            language: "it-IT",
            // page: this.change
          }
        }).then(
          (response) => {
            // this.sources = response.data;
            this.films= response.data.results;
          }
        );
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
            this.allVideos = this.films.concat(this.series);
            this.roundVote();
            this.allVideos.sort(function (a,b) {
              return b.vote_average - a.vote_average;
            });
          }
        );
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
      roundVote: function() {
        this.allVideos.forEach(
          (element) => {
            element.vote_average = Math.ceil(element.vote_average / 2);
          }
        );
      }
    }
  }
);
