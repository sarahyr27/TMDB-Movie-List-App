/*Este script permite cargar la información desde la API y mostrarla en la página.*/
/*Tened en cuenta que también debe de gestionar la paginación y el filtro de géneros.*/

/*Mis datos de la API*/
const apiKey = "ea0fc3f279b8fa24c217e95d68476ae1";

/*Declaración de variables y constantes*/
let page = 1; //Para cambiar de página
selectedGenres = []; //Para la gestión de los filtros de género
const prevButton = document.getElementById("prevButton"); //Hago referencia al botón de anterior
const nextButton = document.getElementById("nextButton"); //Hago referencia al botón de siguiente
const container = document.getElementById("filmsContainer"); //Hago referencia al div donde quiero que aparezcan las películas
const genreListContainer = document.getElementById("genreList"); //Hago referencia a la lista donde haré los li para cada genero
const searchButton = document.getElementById("searchButton"); //Hago referencia al botón para aplicar los filtros

//Escribo las direcciones como una función para que se pueda actualizar al ejecutarse cada vez que se actualiza la página
//Para obtener las películas paginadas
const MoviesPageURL = () =>
  `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&page=${page}`;

//Para obtener las películas filtradas por género
const MoviesByGenreURL = () =>
  `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&with_genres=${selectedGenres.join(
    ","
  )}&page=${page}`;



//--------------------------------------------LLAMADA A LA API------------------------------------------------------------------
async function loadAPI() {
  let url;
  //Defino qué url voy a usar dependiendo de si el botón de filtro ha sido activado y de si hay filtros activados
  if (selectedGenres.length > 0 && searchButton.classList.contains("active")) {
    url = MoviesByGenreURL();
  } else {
    url = MoviesPageURL();
  }

  let response = await fetch(url); //Obtengo datos de la API de TMDB
  let data = await response.json();
  console.log(data); //Reflejo los datos en la consola para poderlos ver e ir trabajando

  container.innerHTML = ""; //Vaciamos el contenedor antes de sobreescribirlo, para los cambios de página o aplicacion de filtros de género

  //---------------------------GENERACIÓN DE LA TARJETA DE CADA PELÍCULA---------------

  //En el objeto data que obtenemos de la API, apunto al key de results, que es donde están los datos de las películas de la página. Itero a través de cada una de ellas con un loop
  data.results.forEach((element) => {

    const movie = new Film( //Generamos una instancia del objeto Film para usarlo más adelante
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
      element.genre_ids
    );

    let div = createMovieCard(movie);
    let ul = createListMenu(movie);
    let button = createMenuButton(ul, "+")

    container.appendChild(div); //Agrego cada tarjeta al HTML, dentro del div contenedor
    div.appendChild(button); //Agrego cada botón dentro de la tarjeta de la película
    div.appendChild(ul); //Agrego cada menú de listas dentro de la tarjeta de la película

  });

  //---------------------------- Cargar información para los botones de pag. siguiente y pag. anterior ---------------------------------
  if (page == 1) { //Si estamos en la primera página, desactivamos el botón para ir a la página anterior
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (page == data.total_pages) { //Si estamos en la última página, desactivamos el botón para ir a la página siguiente
    //Por si la base de datos disminuye o aumenta, no se ve afectado el programa
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }

  //Muestra la información del número de página en el pie de página
  document.getElementById("pagina-info").textContent = `Página ${page} de ${data.total_pages}`;
}

//Llamamos a la función de la API
loadAPI();

//Borramos el movie ID del local storage si hubiera algún dato guardado, para poder volver a usar la variable
clearMovieIDLS();

//---------------------------- COMPORTAMIENTO DE LOS BOTONES DE LA PÁGINA -----------------------------------

//FUNCIONAMIENTO BOTONES SIGUIENTE Y ANTERIOR (PÁGINAS) 2/2
nextButton.addEventListener("click", () => {//Botón siguiente
  page += 1;
  console.log(page);
  loadAPI();
  window.scrollTo({ top: 0, behavior: "smooth" }); //Para volver a la parte superior de la página
});

prevButton.addEventListener("click", () => {//Botón anterior
  page -= 1;
  console.log(page);
  loadAPI();
  window.scrollTo({ top: 0, behavior: "smooth" }); //Para volver a la parte superior de la página
});

//BOTÓN DE FILTROS DE GÉNERO
/* Manejamos la url con la que trabajaremos para mostrar las pelis desde aquí, determinando que el botón de filtro esté siempre activo siempre que haya
al menos un género seleccionado. También confirmamos que no tenga ya la clase active para no agregarla nuevamente. Si no hay ningún genero seleccionado
el botón de filtro se desactiva y pasamos a usar la url general de películas sin filtros de género*/
searchButton.addEventListener("click", () => {
  if (selectedGenres.length > 0 && !searchButton.classList.add("active")) {
    searchButton.classList.add("active");
  } else {
    searchButton.classList.remove("active");
  }
  page = 1;
  loadAPI();
});

//FUNCIONAMIENTO DEL FILTRO DE GÉNEROS
window.onload = function () { //Cuando la página indice carga, este script ejecuta la siguiente función, que carga los botones de géneros
  genres.forEach((element) => {
    const li = document.createElement("li"); //Creo un list item para cada uno de los elementos del array
    const button = document.createElement("button"); //Y dentro creo un botón
    button.classList.add("list-item"); //Le agrego la clase.list-item
    button.textContent = `${element.name}`; //El contenido del botón es el valor del método name del elemento
    genreListContainer.appendChild(li); //Agrego los list item al ul
    li.appendChild(button); //Y el botón a su respectivo list item

    //Creo este listener para activar o desactivar el efecto del botón de filtro de géneros
    button.addEventListener("click", () => {
      button.classList.toggle("active"); //Enciendo o apago su estado "activo" cada vez que se hace click para que se pueda ver visualmente si se está tomando en cuenta el género

      if (button.classList.contains("active")) {
        //Si el botón está activo agregamos el código de género del array genres
        selectedGenres.push(element.id);
        console.log(selectedGenres);
      } else {
        //Si el botón NO está activo eliminamos el código de género del array genres
        const genreIndex = selectedGenres.indexOf(element.id);
        selectedGenres.splice(genreIndex, 1);
        console.log(selectedGenres);
      }
    });
  });
};
