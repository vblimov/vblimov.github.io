const firebaseConfig = {
    apiKey: "AIzaSyBbOC_FVkhrgkFrlKrY9fC6GvZzKysdHrE",
    authDomain: "webvvsu.firebaseapp.com",
    databaseURL: "https://webvvsu.firebaseio.com",
    projectId: "webvvsu",
    storageBucket: "webvvsu.appspot.com",
    messagingSenderId: "332182904853",
    appId: "1:332182904853:web:a078196e7ce5733540ae1c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');
// отслеживаем клик по кнопке меню и запускаем функцию
menuToggle.addEventListener('click', function (event) {
    // отменяем стандартное поведение ссылки
    event.preventDefault();
    // вешаем класс на меню, когда кликнули по кнопке меню
    menu.classList.toggle('visible');
})

const  DEFAULT_PHOTO = userAvatarElem.src;

const toggleAuthDom = () => {
    
    const user = setUsers.user;
    if(user) {
        loginElem.style.display = 'none';
        userElem.style.display = '';
        userNameElem.textContent = user.displayName;
        userAvatarElem.src = user.photoURL || DEFAULT_PHOTO;
        
        
        newPostButton.classList.add('visible');
    } else {
        loginElem.style.display = '';
        userElem.style.display = 'none';
        
        
        newPostButton.classList.remove('visible');
        addPostForm.classList.remove('visible');
        postsWrapper.classList.add('visible');
    }
    

}