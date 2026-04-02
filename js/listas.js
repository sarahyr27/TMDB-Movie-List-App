/* Este script gestiona la visualización de las listas de películas del usuario.
Permite al usuario ver sus películas favoritas, vistas y pendientes, así como eliminarlas de la lista. */

const div = document.getElementById("filmListContainerListas");
const listSelector = document.getElementById("filmListSelector");
const apiKey = "ea0fc3f279b8fa24c217e95d68476ae1";

function showListMovies() {
  let activeUser = JSON.parse(localStorage.getItem("activeUser")); //Recuperamos los datos del usuario activo
  div.innerHTML = ""; //Vaciamos el contenedor de las fichas de películas en caso de que tenga información, para no sbreescribir
  let listName; //Variable que usaremos en un switch statement

  /* Este switch statement lo utilizamos para cambiar el valor de la variable listName, en base al valor que tenga el selector
  de lista en ese momento. Esto con la finalidad de saber sobre cuál de las listas vamos a actuar, tanto al generar las fichas de película como al
  eliminar alguna película de la lista*/
  switch (document.getElementById("filmListSelector").value) {
    case "favorite":
      listName = "_favorite";
      break;

    case "watched":
      listName = "_watched";
      break;

    case "pending":
      listName = "_pending";
      break;
  }

  activeUser[listName].forEach((element) => {
    fetch(
      /* Este enlace lo usamos para no tenemos que cargar toda la base de datos de todas las películas, tardaría demasiado en cargar, así que usamos esta versión
      para poder acceder a los datos de un objeto de película concreto a través de su ID*/
      `https://api.themoviedb.org/3/movie/${element._id}?api_key=${apiKey}&language=es-ES`
    )
      .then((response) => response.json()) //Aunque no es lo más idóneo, llamamos a la API con .then porque dentor de un forEach no se puede usar await
      .then((movie) => {
        //Creamos las fichas de película con nuestras funciones de auxs.js y la información del objeto obtenido de la API
        const movieCard = createMovieCard(movie);
        const deleteButton = createMenuButton(undefined, "x");
        movieCard.appendChild(deleteButton);
        div.appendChild(movieCard);

        //Funcionamiento del botón para eliminar una película de una lista
        deleteButton.addEventListener("click", () => {
          //Cargamos datos en active user y lo actualizamos en el array de usuarios para no perderla al cerrar sesión
          FilmList.removeFromList(activeUser[listName], element);
          localStorage.setItem("activeUser", JSON.stringify(activeUser));
          const users = JSON.parse(localStorage.getItem("users"));
          users[User.getIndex(activeUser)] = activeUser;
          localStorage.setItem("users", JSON.stringify(users));
          showListMovies(); //Volvemos a generar las fichas en base a la información nueva, sin incluir la que hemos eliminado
          updateCounters(); //Llamamos a la función para actualizar los contadores de cantidad de películas en cada lista dentro del menu
          alert("Se ha eliminado la película de la lista");
        });
      });
  });
}

showListMovies(); //Generamos la información al cargar la página

//Borramos el movie ID del local storage si hubiera algún dato guardado, para poder volver a usar la variable
clearMovieIDLS();

document.getElementById("filmListSelector").addEventListener("change", showListMovies); //Al cambiar la opción en el selector, llamamos a la función para generar la información de las fichas de las películas
document.getElementById("backButton").addEventListener("click", () => {window.location.href = "../html/indice.html";});
