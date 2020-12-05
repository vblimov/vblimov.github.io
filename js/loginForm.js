const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignUp = document.querySelector('.login-signUp');
const loginForget = document.querySelector('.login-forget');

const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editElemContainer = document.querySelector('.edit-container');
const editButton = document.querySelector('.edit-button');

const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const editPostsCount = document.querySelector('.edit-postsCount');
const userAvatarElem = document.querySelector('.user-avatar');



const setUsers = {
  user: null,
  initUser(handler){
    auth.onAuthStateChanged(user => {
      if(user){
        this.user = user;
        console.log(this.user.uid)
        showAllPosts(this.user.uid);
      } else {
        this.user = null;
      }
      if(handler) {
        handler();
      }
    })
  },
  logIn(email, password, handler) {
    auth.signInWithEmailAndPassword(email, password)
        .catch((err) => {
          alert(err.message)
        })

  },
  logOut() {
    auth.signOut();
    clearFields();
    toggleAuthDom();
  },
  signUp(email, password, handler) {
    
    auth
        .createUserWithEmailAndPassword(email, password)
        .then((data) => {
          this.editUser(email.substring(0, email.indexOf('@')), null, handler)})
        .catch((err) => {
          alert(err.message)
        });
  },
  editUser(displayName, photoURL, postsCount, handler){
    
    const user = auth.currentUser;
    
    if(displayName){
      if(photoURL){
        user.updateProfile({
          displayName,
          photoURL
        }).then(handler)
      } else {
        user.updateProfile({
          displayName
        }).then(handler)
      }
    }
    if(postsCount)
    {
      database.ref('users/'+user.uid).update({
        postsOnPage: postsCount
      })
        showAllPosts(user.uid);
    }

  },
  sendForget(email){
    if(email){
    auth.sendPasswordResetEmail(email)
        .then(() => {
          alert('Письмо отправлено')})
    } else
    {
      alert('Введите email')
    }
  }
};

const emailValidator = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const clearFields = () => {
  loginForm.reset();
}

const loginFormInit = () => {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);
  });

  loginSignUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = emailInput.value;
    if(emailValidator(email)){
      setUsers.signUp(email, passwordInput.value, toggleAuthDom);
    } else {
      alert('Неправильно введён email');
      clearFields();
    }
  });

  exitElem.addEventListener('click', (event) =>{
    event.preventDefault();
    setUsers.logOut();
  });

  editElem.addEventListener('click', event =>{
    event.preventDefault();
    editElemContainer.classList.toggle('visible');
    editUsername.value = setUsers.user.displayName;
    editPhotoURL.value = setUsers.user.photoURL;
    database.ref('users/'+auth.currentUser.uid).once('value', snapshot => {
      editPostsCount.value = snapshot.val().postsOnPage;
      
    })
  });
  editElemContainer.addEventListener('submit', event =>{

    event.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, editPostsCount.value < 0 ? 1 : editPostsCount.value, toggleAuthDom);
    editElemContainer.classList.remove('visible');
  });
  
  loginForget.addEventListener('click', event => {
    event.preventDefault();
    setUsers.sendForget(emailInput.value);
  })
  
  setUsers.initUser(toggleAuthDom);
}

document.addEventListener('DOMContentLoaded', ()=> {
  loginFormInit();
})




