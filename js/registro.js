/*Este script gestiona el registro de nuevos usuarios, incluyendo la validación de datos y el autocompletado de campos.
Permite al usuario seleccionar una ciudad y autocompletar el código postal, así como autocompletar el dominio del correo electrónico.*/

//------------COMPROBACIONES DEL FORMULARIO-----------

function isPostCodeValid() {
    let isPostCode = cities.some(city => city.postalCode.slice(0, 2) == document.getElementById('postalCode').value.slice(0, 2)); //Busco si dentro del array de ciudades hay algún objeto cuyas dos primeras cifras sean iguales a las dos primeras cifras del código postal ingresado por el usuario
    let isPostCodeValid;
    if (document.getElementById('postalCode').value.length > 1) { //Me aseguro que no esté vacío
        if (isPostCode && document.getElementById('postalCode').value.length < 6) { //Si obtenemos que la condición anterior se cumple en el array, y que el CP tiene menos de 6 dígitos, buscaré el objeto del array cuyo código postal tenga los dos primeros dígitos que el código postal ingresado por el usuario
        let cityObj = cities.find(city => city.postalCode.slice(0, 2) == document.getElementById('postalCode').value.slice(0, 2));
        document.getElementById('city').value = cityObj.name; // cambio la ciudad en base a lo obtenido anteriormente
        return isPostCodeValid = true;
    } else {
        alert('El código postal introducido no es válido. Por favor, introduce un código postal correcto'); //Si el código postal es de más de 6 dígitos o no está en el array de ciudades, le aviso al usuario
        return isPostCodeValid = false;
    }
    }  
}

/*Comprobar si el usuario ya existe cuando ya no esté escribiendo en el campo de usuario*/
document.getElementById('username').addEventListener('blur', () => {
    if (User.isRegistered(document.getElementById('username').value)) {
        alert('El usuario ya existe. Por favor, ingresa un usuario diferente o haz click en "Volver al Login" para iniciar sesión'); //Avisa si se ha ingresado un usuario que ya existe
    }
})

/*Rellenar el código postal automáticamente al elegir la ciudad*/
document.getElementById('city').addEventListener('change', () => {
    let cityObj = cities.find(city => city.name == document.getElementById('city').value);
    document.getElementById('postalCode').value = cityObj.postalCode;
})

/*Si se indica el código postal antes que la ciudad, se comprueba que existe una población con ese código*/
document.getElementById('postalCode').addEventListener('keyup', isPostCodeValid)

/*Autorrellenar el correo con @uoc.edu una vez llegados al @. Cada vez que se deja de presionar una tecla, compruebo si el campo de texto incluye un @, si no es el caso
agregamos a nuestra string el dominio deseado, siempre y cuando no se haya agregado ya*/
document.getElementById('email').addEventListener('keyup', () => { 
    if (document.getElementById('email').value.includes("@") && !document.getElementById('email').value.includes("uoc.edu")) { 
        document.getElementById('email').value += "uoc.edu"
    }
})

/*Comprobar que el correo tiene el formato correcto cuando el usuario haya dejado de escribir*/
document.getElementById('email').addEventListener('blur', () => User.isEmailValid(document.getElementById('email').value))

/* Comprobar que la contraseña tiene mínimo 8 caracteres, letras, números, y al menos un caracter especial */
document.getElementById('password').addEventListener('change', () => User.isPasswordValid(document.getElementById('password').value))

//---------REGISTRO DE LOS DATOS DEL FORMULARIO--------

/*Event listener para registrar los datos del formulario y hacer un objeto usar dentro de nuestro array de usuarios*/

document.getElementById('registerForm').addEventListener('submit', (event) => {
    event.preventDefault(); //Para evitar que la página se recargue al enviar la información

    //Obtener los valores actuales del formulario y guardarlos en variables
    const formName = document.getElementById('name').value;
    const formSurname = document.getElementById('surname').value;
    const formAddress = document.getElementById('address').value;
    const formCity = document.getElementById('city').value;
    const formPostalCode = document.getElementById('postalCode').value;
    const formEmail = document.getElementById('email').value;
    const formUsername = document.getElementById('username').value;
    const formPassword = document.getElementById('password').value;
    const favorite = [];
    const watched = [];
    const pending = [];

    if (User.isRegistered(document.getElementById('username').value)) { //Antes de enviar la información comprobamos si el usuario ya existe, en ese caso no enviamos
        alert('El usuario ya existe. Por favor, ingresa un usuario diferente o haz click en "Volver al Login" para iniciar sesión');
    } else if (!User.isRegistered(document.getElementById('username').value) && isPostCodeValid() && User.isEmailValid(document.getElementById('email').value) && User.isPasswordValid(document.getElementById('password').value)) { //Si el usuario no existe, y además los campos de código postal, email y contraseña son válidos
        const newUser = new User(formName, formSurname, formAddress, formCity, formPostalCode, formEmail, formUsername, formPassword, favorite, watched, pending); // Con los valores de la variables del contenido del formulario, creamos un nuevo objeto user con el constructor
        let users = JSON.parse(localStorage.getItem("users"));
        users.push(newUser); // Lo guardamos en el array de usuarios
        localStorage.setItem("users", JSON.stringify(users)); //Guardamos el array en el local storage
        window.location.href = '../html/index.html'//Enviamos al usuario a la página de loguearse
    }
})

/* Función del botón "Volver a Login" */
document.getElementById('returnToLoginButton').addEventListener('click', () => window.location.href = '../html/index.html')
