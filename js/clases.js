class User {
    #name;
    #surname;
    #address;
    #city;
    #postalCode;
    #email;
    #username;
    #password;
    #favorite;
    #watched;
    #pending;

    /* Constructor de la clase User */

    constructor(name, surname, address, city, postalCode, email, username, password, favorite, watched, pending){
        this._name = name;
        this._surname = surname;
        this._address = address;
        this._city = city;
        this._postalCode = postalCode;
        this._email = email;
        this._username = username;
        this._password = password;
        this._favorite = favorite;
        this._watched = watched;
        this._pending = pending;
    }

    /* Getters y Setters */ 

    //Getters

    get name(){
        return this._name;
    }

    get surname(){
        return this._surname;
    }

    get address(){
        return this._address;
    }

    get city(){
        return this._city;
    }

    get postalCode(){
        return this._postalCode;
    }

    get email(){
        return this._email;
    }

    get username(){
        return this._username;
    }

    get password(){
        return this._password;
    }

    get favorite(){
        return this._favorite;
    }

    get watched(){
        return this._watched;
    }

    get pending(){
        return this._pending;
    }

    //Setters

    set name(value){
        this._name = value;
    }

    set surname(value){
        this._surname = value;
    }

    set address(value){
        this._address = value;
    }

    set city(value){
        this._city = value;
    }

    set postalCode(value){
        this._postalCode = value;
    }

    set email(value){
        this._email = value;
    }

    set username(value){
        this._username = value;
    }

    set password(value){
        this._password = value;
    }

    set favorite(value){
        this._favorite = value;
    }

    set watched(value){
        this._watched = value;
    }

    set pending(value){
        this._pending = value;
    }


    /* Añadir las funciones que consideréis necesarias*/

    /* Uso métodos clase para no perder sus funciones, ya que no se pueden subir a local storage */

    //Confirmar si el usuario está registrado
    static isRegistered(input) {
        const users = JSON.parse(localStorage.getItem("users"));//Parseamos la información que exista de usuarios
        return users.some(user => user._username === input); //devuelve true si el usuario está registrado en local storage
    }

    //Para obtener el index de un usuario dentro del array general y gestionar información den el local storage
    static getIndex(activeUser) {
        const users = JSON.parse(localStorage.getItem("users"));
        const userIndex = users.findIndex(user => user._username === activeUser._username);
        return userIndex;
    }

    //Verificar si la contraseña coincide con la contraseña almacenada para el usuario
    static verifyPassword(inputUsername, inputPassword) {
        const users = JSON.parse(localStorage.getItem("users"));
        let userIndex = users.findIndex(user => user._username === inputUsername); //Buscamos el índice del usuario en el array de usuarios parseado y lo guardamos en una variable, para poder acceder al objeto usuario y verificar la contraseña
        let currentUser = users[userIndex];
        return currentUser._password === inputPassword; //devuelve true si la contraseña es igual a la del usuario
    }
 
    //Verificar si la contraseña es válida
    static isPasswordValid(input){
        
        /*Hago un array de letras, otro para números y otro para caracteres especiales, para hacer las comprobaciones de la contraseña. Quería usar el método .charCodeAt()
        pero ya que no se puede usar un for loop, de esta forma es más fácil*/
        const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "m", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        const specialChar = ["!", "#", "$", "%", "&", "*", "+", ",", "-", "."];

        /* Guardo el mensaje para usarlo en diferentes escenarios */
        const incorrectPassword = 'La contraseña no es válida. Por favor, asegúrate de que tu contraseña tenga como mínimo 8 caracteres y que incluya letras, números, y al menos un caracter especial (! # $ % & * + , - .)';
        
        /* Por defecto consideramos que la contraseña es correcta, antes de evaluarla */
        let isPasswordValid = true;

        if (input.length >= 8) { //Primero confirmamos que tenga el mínimo de caracteres requeridos
            if (!letters.some(letter => input.includes(letter))) { //Comprobamos si alguno de los elementos del array letters existe en la contraseña
                alert(incorrectPassword);
                isPasswordValid = false; //si no lo contiene, cambiamos el valor de la variable a falso
            } else if(!numbers.some(number => input.includes(number))) { //Comprobamos si alguno de los elementos del array numbers existe en la contraseña
                alert(incorrectPassword);
                isPasswordValid = false;
            } else if(!specialChar.some(specialChar => input.includes(specialChar))) { //Comprobamos si alguno de los elementos del array specialChar existe en la contraseña
                alert(incorrectPassword);
                isPasswordValid = false;
            } else {
                isPasswordValid = true;
            }
        } else {
            alert(incorrectPassword); // Si la contraseña tiene menos de 8 caracteres, es incorrecta
            isPasswordValid = false;
        }

        return isPasswordValid; //Si ha pasado todos los filtros, el método devuelve true, si no se cumple con alguno de los filtros, devuelve false
    }

    //Verificar si el correo es válido, funciona muy parecido al anterior, con las excepciones comentadas
    static isEmailValid(input) {
        const domains = ["uoc.edu", "gmail.com", "hotmail.com", "yahoo.com", "live.com", "gmail.es", "hotmail.es", "yahoo.es", "live.es"]
        const incorrectMailTxt = 'Formato de correo inválido. Por favor, ingresa un correo electrónico válido de la UOC.';
        let isEmailValid = true;
        
        if (input.length > 0) { //me aseguro de que el campo no esté vacío antes de evaluarlo
            if (!input.includes("@") || !input.includes(".")) {
                alert(incorrectMailTxt); // Si el campo no incluye un @ o un punto, consideramos el correo como inválido
                isEmailValid = false;
            } 

            domains.forEach(domain => { //array incluido en config.js
            let existingDomain = input.includes(domain); //Si el dominio se incluye en el campo email, esta variable tiene valor true
            if (existingDomain && input.indexOf("@") > input.indexOf(domain)) {
                alert(incorrectMailTxt); // Si el @ no va antes del dominio, consideramos el correo como inválido
                isEmailValid = false;
            }
        });
        } 

        return isEmailValid;
    }
}

class FilmList {
    #films;

    /* Constructor de la clase FilmList */

        constructor(){
        this._films = [];
    }

    //Getters y setter

        get films(){
            return this._films;
    }

        set films(value){
            this._films = value;
    }

    /* Añadir las funciones que consideréis necesarias*/

    //Agregar película a la lista
    static addToList(list, movie) {
        return list.push(movie);
    }

    //Eliminar película de la lista
    static removeFromList(list, movie) {
        const movieIndex = list.indexOf(movie._id);
        return list.splice(movieIndex, 1);
    }

    //Confirmar si una película está dentor de la lista
    static isInList(list, movie) {
        return list.some(element => element._id === movie._id)
    }
}

class Film {
    #id;
    #original_language;
    #original_title;
    #overview;
    #popularity;
    #poster_path;
    #release_date;
    #title;
    #vote_average;
    #vote_count;
    #genre_ids;

    /* Constructor de la clase Film */

    constructor(id, original_language, original_title, overview, popularity, poster_path, release_date, title, vote_average, vote_count, genre_ids) {
        this._id = id;
        this._original_language = original_language;
        this._original_title = original_title;        
        this._overview = overview;
        this._popularity = popularity;
        this._poster_path = poster_path;
        this._release_date = release_date;
        this._title = title;
        this._vote_average = vote_average;
        this._vote_count = vote_count;
        this._genre_ids = genre_ids;
    }

    /* Getters y Setters */

    //Getters

    get id(){
        return this._id;
    }

    get original_language(){
        return this._original_language;
    }

    get original_title(){
        return this._original_title;
    }

    get overview(){
        return this._overview;
    }

    get popularity(){
        return this._popularity;
    }

    get poster_path(){
        return this._poster_path;
    }

    get release_date(){
        return this._release_date;
    }

    get title(){
        return this._title;
    }

    get vote_average(){
        return this._vote_average;
    }

    get vote_count(){
        return this._vote_count;
    }

    get genre_ids(){
        return this._genre_ids;
    }

    //Setters

    set id(value){
        this._id = value;
    }

    set original_language(value){
        this._original_language = value;
    }

    set original_title(value){
        this._original_title = value;
    }

    set overview(value){
        this._overview = value;
    }

    set popularity(value){
        this._popularity = value;
    }

    set poster_path(value){
        this._poster_path = value;
    }

    set release_date(value){
        this._release_date = value;
    }

    set title(value){
        this._title = value;
    }

    set vote_average(value){
        this._vote_average = value;
    }

    set vote_count(value){
        this._vote_count = value;
    }

    set genre_ids(value){
        this._genre_ids = value;
    }

    /* Añadir las funciones que consideréis necesarias*/   
}
