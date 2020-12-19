var app = new Vue(
  {
    el: "#root",
    data: {
      apiId: "12d47eadb7bade3dfdef75db545e889f",
      searchInput: "",
      films:[],
      sources:"",
      change: 1,
      star:""
    },
    methods: {
      searchFilm: function() {
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
            page: this.change
          }
        }).then(
          (response) => {
            this.sources = response.data;
            this.films = response.data.results;
          }
        );
      },
      changePage: function() {
        this.ajaxCall();
      },
      prevPage: function() {
        this.change--;
        this.ajaxCall();
      },
      nextPage: function() {
        this.change++;
        this.ajaxCall();
      }
    }
  }
);
