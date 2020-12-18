var app = new Vue(
  {
    el: "#root",
    data: {
      visibility: false,
      apiId: "12d47eadb7bade3dfdef75db545e889f",
      searchInput: "",
      films:[]
    },
    methods: {
      searchFilm: function() {
        this.films=[];
        if (this.searchInput !== "") {
          axios.get("https://api.themoviedb.org/3/search/movie", {
            params: {
              api_key: this.apiId,
              query: this.searchInput,
              linguages: "it-IT"
            }
          }).then(
            (response) => {
              this.films = response.data.results;
            }
          );
        }
      }
    }
  }
);
