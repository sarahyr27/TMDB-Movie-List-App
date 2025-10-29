/*Este fichero contiene funciones auxiliares que se utilizan en varios scripts.*/

//CONSTRUIR UNA TARJETA DE PELÍCULA
function createMovieCard(movie) {
  //Creo un div para cada uno de los resultados
  const div = document.createElement("div");
  div.classList.add("movie-card"); //Le agrego la clase.movie-card

  //Una vez creado el div, le agrego la imagen de la misma forma que lo hice con el div
  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`; //Para el valor de la dirección de la img, apunto al método correspondiente dentro del elemento
  img.alt = movie.title; //Lo mismo que lo anterior, pero para el texto alternativo con propósitos de accesibilidad
  div.appendChild(img); //Esta vez agrego la imagen dentro del div, no del contenedor principal para todas las películas

  //Creo este div para contenedor del título y la fecha y que estén todos centrados
  const nestedDiv = document.createElement("div");

  //Creamos un título con el nombre de la película
  const h4 = document.createElement("h4"); //Creamos el elemento de h4
  const a = document.createElement("a"); // Creamos un elemento de enlace que servirá para acceder a detalles de la película
  a.textContent = `${movie.title}`; //En el enlace veremos el nombre de la película
  a.href = "../html/detalle.html"; //El link llevará a la página detalle
  a.classList.add("movie-title-link");
  h4.appendChild(a);
  div.appendChild(h4); //Lo incluimos debajo de la imagen

  //Covertir los datos de la fecha del objeto a lo que queremos
  const date = new Date(movie.release_date); //Convertimos el contenido del string a un objeto tipo Date
  const day = date.getDate(); //Guardamos el día del mes en una constante
  const month = date.toLocaleString("es-ES", { month: "short" }); //Guardamos el mes utilizando este método, que devuelve un string sensible al idioma que le aplique
  const year = date.getFullYear(); //Guardamos el año en una constante

  //Por último, creo el texto que de nos pide, con la fecha de la película
  const p = document.createElement("p"); //Creamos el elemento de párrafo
  p.textContent = `${day} ${month} ${year}`; //Utilizamos las variables que creamos con el objeto Date
  div.appendChild(p); //Lo incluimos debajo de la imagen

  nestedDiv.appendChild(h4);
  nestedDiv.appendChild(p);
  div.appendChild(nestedDiv);

  //Funcionamiento al clicar en el título de una película para ir a detalles
  a.addEventListener("click", () => {
    let clickedMovieID = movie.id;
    localStorage.setItem("movieIDLS", JSON.stringify(clickedMovieID));
  });

  return div;
}

//GENERAR MENÚ DE LISTAS
function createListMenu(movie) {
  //Lista de elementos para generar los li
  const listItems = [
    { id: "addFavorite", icon: "fa-heart", text: "Favoritos" },
    { id: "addWatched", icon: "fa-eye", text: "Vista" },
    { id: "addPending", icon: "fa-clock", text: "Pendiente" },
  ];

  const ul = document.createElement("ul");
  ul.classList.add("list-menu", "indice-list", "indice-list-hidden");

  listItems.forEach((element) => {
    //Creamos cada elemento, il, botón e icono
    const li = document.createElement("li");
    const listButton = document.createElement("button");

    //Les agrego sus id y clases correspondientes
    listButton.id = element.id;

    //Los anexo unos dentro de otros
    listButton.innerHTML = `<i class="fa-solid ${element.icon}"></i> ${element.text}`; //Aquí lo hago de esta forma para que el icono aparezca a la izq del texto
    li.appendChild(listButton);
    ul.appendChild(li);

    //Compruebo si los botones están incluidos en alguna de las listas, si lo están, se le asigna la clase .active.list para que aparezca en color azul
    switch (listButton.id) {
      case "addFavorite":
        if (FilmList.isInList(activeUser._favorite, movie)) {
          listButton.classList.add("active-list");
        }
        break;

      case "addWatched":
        if (FilmList.isInList(activeUser._watched, movie)) {
          listButton.classList.add("active-list");
        }
        break;

      case "addPending":
        if (FilmList.isInList(activeUser._pending, movie)) {
          listButton.classList.add("active-list");
        }
        break;
    }

    //COMPORTAMIENTO DE LOS BOTONES - para agregar o quitar película a una lista

    listButton.addEventListener("click", () => {
      //Adaptamos el comportamiento del click según el id del botón presionado
      switch (listButton.id) {
        case "addFavorite":
          if (FilmList.isInList(activeUser._favorite, movie)) {
            FilmList.removeFromList(activeUser._favorite, movie);
            listButton.classList.remove("active-list");
          } else {
            FilmList.addToList(activeUser._favorite, movie);
            listButton.classList.add("active-list");
          }

          break;

        case "addWatched":
          if (FilmList.isInList(activeUser._watched, movie)) {
            FilmList.removeFromList(activeUser._watched, movie);
            listButton.classList.remove("active-list");
          } else if (FilmList.isInList(activeUser._pending, movie)) {
            alert(
              'Deberás eliminar esta película de la lista "Pendientes" para agregarla a "Vistas".'
            );
          } else {
            FilmList.addToList(activeUser._watched, movie);
            listButton.classList.add("active-list");
          }

          break;

        case "addPending":
          if (FilmList.isInList(activeUser._pending, movie)) {
            FilmList.removeFromList(activeUser._pending, movie);
            listButton.classList.remove("active-list");
          } else if (FilmList.isInList(activeUser._watched, movie)) {
            alert(
              'Deberás eliminar esta película de la lista "Vistas" para agregarla a "Pendientes".'
            );
          } else {
            FilmList.addToList(activeUser._pending, movie);
            listButton.classList.add("active-list");
          }

          break;
      }

      //Guardar en local storage
      localStorage.setItem("activeUser", JSON.stringify(activeUser));
      const users = JSON.parse(localStorage.getItem("users"));
      users[User.getIndex(activeUser)] = activeUser;
      localStorage.setItem("users", JSON.stringify(users));

      updateCounters(); //Llamo a la función y así cuando se agrega o elimina una película de alguna de las listas, se actualizan los contadores en la parte superior
    });
  });

  return ul;
}

//GENERAR EL BOTÓN DE LA ESQUINA SUPERIOR FICHAS DE PELÍCULAS
function createMenuButton(ul, content) {
  const button = document.createElement("button");
  button.classList.add("movie-list-button");
  button.textContent = `${content}`;

  //Funcionamiento del botón
  let clicked = false;

  if (ul) {
    // Para cuando use el botón en conjunto con una lista, activaré esta parte solo si paso la lista como argumento
    //Si hago click en el botón, la lista aparece y el botón desaparece
    button.addEventListener("click", () => {
      ul.classList.toggle("indice-list-hidden");
      button.classList.toggle("movie-list-button-hidden");
      clicked = true;
    });

    //Cuando el cursor ya no está sobre el área equivalente a la imagen de la carátula de la película, la lista y el botón vuelven a su estado original
    ul.addEventListener("mouseleave", () => {
      if (clicked) {
        ul.classList.toggle("indice-list-hidden");
        button.classList.toggle("movie-list-button-hidden");
        clicked = false;
      }
    });
  }

  return button;
}

//ELIMINAR MOVIE ID DE LS
function clearMovieIDLS() {
  let movieIDLS = JSON.parse(localStorage.getItem("movieIDLS"));
  movieIDLS = null;
  localStorage.setItem("movieIDLS", JSON.stringify(movieIDLS));
}

//Otros
const roundToTwo = (num) => Math.round(num * 100) / 100; //Para obtener solo dos decimales de una cifra con más decimales

//Para convertir almacenar los géneros en nombres de una película de la API, obtenida desde su ID (se utiliza en details.js)
function obtainGenreName(movie) {
  const movieGenres = movie.genres.map((element) => {
    return element.name;
  });
  return movieGenres;
}
