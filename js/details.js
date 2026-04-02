/*Este script carga la información de la película seleccionada y la muestra en la página de detalles.*/
const apiKey = "ea0fc3f279b8fa24c217e95d68476ae1";

function getMovieDetails() {
  let movieIDLS = JSON.parse(localStorage.getItem("movieIDLS")); //Obtenermos los datos de la API filtrando solo por ID de película
  fetch(
    `https://api.themoviedb.org/3/movie/${movieIDLS}?api_key=${apiKey}&language=es-ES`
  )
    .then((response) => response.json())
    .then((element) => {
      const movie = new Film( //Generamos una instancia del objeto Film para usarlo en la generación de datos
        element.id,
        element.original_language,
        element.original_title,
        element.overview,
        element.popularity,
        element.poster_path,
        element.release_date,
        element.title,
        element.vote_average,
        element.vote_count,
        element.genre_ids //Importante destacar que con el enlace utilizado, la información de géneros está incluida en un array de objetos, de nombre genres, portanto este valor del objeto quedará como undefined
      );

      //Usamos los datos obtenidos de la API y de la película en concreto para generar la información dinámicamente
      const releaseDate = new Date(movie.release_date);
      document.getElementById("film-image").src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
      document.getElementById("filmTitle").textContent = `${movie.original_title}.${movie.title} (${releaseDate.getFullYear()})`;
      //Con el uso de String() convertimos todo lo que está dentor de los paréntesis en un string, y con el uso del método .padStart() hacemos que, si es strinf tiene menos de dos caracteres, rellenamos al principio con un 0 (en forma de string y no de número)
      const day = String(releaseDate.getDate()).padStart(2, "0");
      const month = String(releaseDate.getMonth() + 1).padStart(2, "0");
      const year = releaseDate.getFullYear();
      const genresNames = obtainGenreName(element); //Función definida en auxs.js
      document.getElementById("filmData").textContent = `${day}/${month}/${year} - ${genresNames.join(", ")}`; //El método .join devuelvo un string concatenando todos los elementos dentro de array, generando entre ellos el text entre paréntesis
      document.getElementById("score").textContent = `${roundToTwo(movie.vote_average)}`;
      let ul = createListMenu(movie);
      ul.classList.remove("indice-list-hidden", "indice-list"); //Removemos estas clases ya que solo las usamos en indice.html
      const container = document.getElementById("detalle-list-container");
      container.appendChild(ul);
      document.getElementById("overview").textContent = `${movie.overview}`;
    });
}

//Esto resetea el valor del ID de la película si hacemos click en el botón inferior para volver a la lista de películas
document.getElementById("backButton").addEventListener("click", () => {
  window.location.href = "../html/indice.html";
  clearMovieIDLS();
});

getMovieDetails();
