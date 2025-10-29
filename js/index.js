/*Este script debe de gestionar el login de los usuarios.*/

window.onload = function () { //Creo el array de usuarios de esta manera para que no se vuelva a generar vacío cada vez que se entra en la página
    if (localStorage.getItem("hasCodeRunBefore") === null) {
        let users = [];
        localStorage.setItem("users", JSON.stringify(users));
        let activeUser; //Creo una variable para saber qué usuario está logueado
        localStorage.setItem("activeUser", JSON.stringify(activeUser));
        let movieIDLS; //Creo una variable para almacenar el ID de una palícula y acceder a sus detalles
        localStorage.setItem("movieIDLS", JSON.stringify(movieIDLS));
        localStorage.setItem("hasCodeRunBefore", true);
    }
}

//Función para gestionar la información ingresada por el usuario para iniciar sesión
function checkLoginUser(formUsername, formPassword){

    const users = JSON.parse(localStorage.getItem("users")); //Parseamos la información que exista de usuarios

    if (User.isRegistered(formUsername)) { //Si el usuario está registrado, verificamos la contraseña
        if (User.verifyPassword(formUsername, formPassword)) {
            let userIndex = users.findIndex(user => user._username === formUsername);
            activeUser = users[userIndex]; 
            localStorage.setItem("activeUser", JSON.stringify(activeUser)); //Guardo el usuario activo en local storage
            return window.location.href = '../html/indice.html'; //Si la contraseña es OK, accedemos a la aplicación
        } else {
            return alert(`Contraseña incorrecta. Por favor, introduce la contraseña nuevamente.`); //Si la contraseña no es OK, avisamos al usuario
        }
    } else {
        return alert(`Este usuario no está registrado. Por favor, haz click en "Nuevo usuario" y regístrate.`); //Si el usuario no existe, damos instrucciones para que se registre
    }
}

// Llamamos a la función checkloginUser cuando el usuario haga click en el botón "Aceptar"
document.getElementById('loginButton').addEventListener('click', () =>{
    const formUsername = document.getElementById('username').value;
    const formPassword = document.getElementById('password').value;
    checkLoginUser(formUsername, formPassword);
})


// Función del botón de "Nuevo Usuario"
document.getElementById('registration').addEventListener('click', () => {
    window.location.href = '../html/registro.html';

})