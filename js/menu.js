/*Este script actualiza el usuario y su número de favoritos cada vez que se carga la página*/
//Recuperamos el usuario activo
let activeUser = JSON.parse(localStorage.getItem("activeUser"));

//FUNCIONAMIENTO DINÁMICO DEL NÚMERO DE PELÍCULAS QUE SE ENCUENTRAN EN UNA LISTA (ESQUINA SUPERIOR DERECHA)
function updateCounters() {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  document.querySelectorAll(".favoritesCount").forEach((element) => {
    element.textContent = `${activeUser._favorite.length}`;
  });

  document.querySelectorAll(".watchedCount").forEach((element) => {
    element.textContent = `${activeUser._watched.length}`;
  });

  document.querySelectorAll(".pendingCount").forEach((element) => {
    element.textContent = `${activeUser._pending.length}`;
  });
}

updateCounters();

//FUNCIONAMIENTO DINÁMICO DEL NOMBRE DE USUARIO EN LA ESQUINA SUPERIOR DERECHA
document.querySelectorAll(".menuButton").forEach((element) => {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  element.textContent = `${activeUser._username}`;
});

//FUNCIONAMIENTO DEL BOTÓN LOGOUT
document.getElementById("logoutButton").addEventListener("click", () => {
  //Borramos la información en usuario activo para reutilizarlo en el siguiente login
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser = null;
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
  //Dirigimos al usuario a la página de login
  window.location.href = "../html/index.html";
});