const postsWrapper = document.querySelector('.posts');
const newPostButton = document.querySelector('.button-new-post');
const addPostForm = document.querySelector('.add-post');
const editPostForm = document.querySelector('.edit-post');
const nextPageButton = document.querySelector('.next-page-button');
const prevPageButton = document.querySelector('.prev-page-button');
const adminEmail = 'vblimov@gmail.com'
let editablePostID;
let showedPosts = 0;
let postsCount = 999999;
const showAllPosts = (userID, isPrev) => {
    let postsHTML = '';
    let posts = [];
    let counter = 0;
    database.ref('post').orderByChild('id').once('value', snapshot => {
        (snapshot || []).forEach(item=>{
                posts.push(`
              <section class="post">
                <div class="post-body">
                  <h2 class="post-title">${item.val().title}</h2>
                  <p class="post-text" >${item.val().text}</p>
                  <div class="tags">
                    ${(item.val().tags || []).map(tag=>`<a href="#" class="tag">#${tag}</a>`)}
                  </div>
                </div>
                <div class="post-footer">
                  <div class="post-buttons">
                    <button class="post-button post-button-likes">
                <svg width="19" height="20" class="icon icon-like">
                  <use xlink:href="img/icons.svg#like"></use>
                </svg>
                <span class="post-button likes-counter">${item.val().like}</span>
              </button>
                    <button class="post-button post-button-comments">
                <svg width="21" height="21" class="icon icon-comment">
                  <use xlink:href="img/icons.svg#comment"></use>
                </svg>
              <span class="comments-counter">${item.val().comments}</span>
            </button>
                    <button class="post-button post-button-save">
                <svg width="19" height="19" class="icon icon-save">
                  <use xlink:href="img/icons.svg#save"></use>
                </svg>
            </button>
                    <button class="post-button post-button-share">
                <svg width="17" height="19" class="icon icon-share">
                  <use xlink:href="img/icons.svg#share"></use>
                </svg>
            </button>
                    ${setUsers.user? item.val().author.email === (setUsers.user.email || null) || setUsers.user.email === adminEmail?
                    `<button class="post-button post-button-delete" value="${item.val().id}" onclick="deletePost(value)">
                  <svg width="17" height="19" class="icon icon-delete">
                    <use xlink:href="img/icons.svg#delete"></use>
                  </svg>
                </button>`: `` :``}
                    ${setUsers.user? item.val().author.email === (setUsers.user.email || null) || setUsers.user.email === adminEmail?
                    `<button class="post-button post-button-edit" value="${item.val().id}" onclick="editPost(value)">
                  <svg width="17" height="19" class="icon icon-edit">
                    <use xlink:href="img/icons.svg#edit"></use>
                  </svg>
                </button>`: `` :``}
                  </div>
                  <div class="post-author">
                    <div class="author-about">
                      <a href="#" class="author-username">${item.val().author.displayName}</a>
                      <span class="post-time">${item.val().date}</span>
                    </div>
                  <a href="#" class="author-link"><img src=${item.val().author.photo || "img/avatar.jpeg"} alt="avatar" class="author-avatar"></a>
                </div>
                </div>
              </section>`);
    })}).then(()=> {
        if(userID) {
            database.ref('users/'+userID).once('value', snapshot => {
                postsCount = snapshot.val().postsOnPage;
                if(parseInt(isPrev) === 0 || parseInt(isPrev) === 1){
                    if(parseInt(isPrev) === 1 && showedPosts < posts.length-parseInt(postsCount)-1) {
                        showedPosts = parseInt(showedPosts)+parseInt(postsCount);
                        //nextPage
                    } else if (parseInt(isPrev) === 0 && showedPosts !== 0) {
                        showedPosts=parseInt(showedPosts)-parseInt(postsCount);
                        //prevPage
                    } else {
                        return;
                    }
                }
                counter = 0;
                posts.reverse().forEach(post => {
                    if(counter >= showedPosts && counter < parseInt(showedPosts)+parseInt(postsCount)){
                        postsHTML+=post;
                    }
                    
                    counter++;
                })
                postsWrapper.innerHTML = postsHTML;
                postsHTML = '';
                addPostForm.classList.remove('visible');
                editPostForm.classList.remove('visible');
                postsWrapper.classList.add('visible');
            })
        } else {
            posts.reverse().forEach(post => {
                    postsHTML+=post;
            })
            postsWrapper.innerHTML = postsHTML;
            postsHTML = '';
            addPostForm.classList.remove('visible');
            editPostForm.classList.remove('visible');
            postsWrapper.classList.add('visible');
        }
        
    })
}
const showAddPosts = () => {
    addPostForm.classList.add('visible');
    postsWrapper.classList.remove('visible');
    editPostForm.classList.remove('visible');
    editPostForm.reset();
}
const showEditPosts = (title, text, tags, postID) => {
    editPostForm.classList.add('visible');
    editPostForm.elements.namedItem('edit-post-title').value = title;
    editPostForm.elements.namedItem('edit-post-text').value = text;
    editPostForm.elements.namedItem('edit-post-tags').value = tags;
    editablePostID = postID;
    postsWrapper.classList.remove('visible');
}
const postHandlerInit = () => {
    showAllPosts();
    nextPageButton.addEventListener('click', event => {
        event.preventDefault();
        showAllPosts(auth.currentUser.uid, 1)
    })
    prevPageButton.addEventListener('click', event => {
        event.preventDefault();
        showAllPosts(auth.currentUser.uid, parseInt(0))
    })
    newPostButton.addEventListener('click', event => {
        event.preventDefault();
        showAddPosts();
    })
    
    addPostForm.addEventListener('submit', event => {
        event.preventDefault();
        const formElements = addPostForm.elements;
        //TODO вернуть нормальные значениея
        if(formElements.namedItem('post-title').value.length < 0){
            alert('Слишком короткий заголовок');
            return;
        }
        if(formElements.namedItem('post-text').value.length < 0){
            alert('Слишком короткий пост');
            return;
        }
        const postID = 'postID'+(+new Date()).toString(16)
        database.ref('post/'+postID).set({
            id: postID,
            title: formElements.namedItem('post-title').value,
            text: formElements.namedItem('post-text').value,
            tags: formElements.namedItem('post-tags').value.split(',').map(item=>item.trim()),
            author: {
                displayName: setUsers.user.displayName,
                photo: setUsers.user.photoURL,
                email: setUsers.user.email
            },
            date: new Date().toLocaleString(),
            like: 0,
            comments: 0,
        })
        showAllPosts(auth.currentUser.uid);
        
        addPostForm.reset();
    })
    
    editPostForm.addEventListener('submit', event => {
        event.preventDefault();
        const formElements = editPostForm.elements;
        //TODO вернуть нормальные значениея
        if(formElements.namedItem('edit-post-title').value.length < 0){
            alert('Слишком короткий заголовок');
            return;
        }
        if(formElements.namedItem('edit-post-text').value.length < 0){
            alert('Слишком короткий пост');
            return;
        }
        
        database.ref('post/'+editablePostID).update({
            id: editablePostID,
            title: formElements.namedItem('edit-post-title').value,
            text: formElements.namedItem('edit-post-text').value,
            tags: formElements.namedItem('edit-post-tags').value.split(',').map(item=>item.trim()),
            author: {
                displayName: setUsers.user.displayName,
                photo: setUsers.user.photoURL,
                email: setUsers.user.email
            },
            date: new Date().toLocaleString(),
            like: 0,
            comments: 0,
        })
        showAllPosts(auth.currentUser.uid);
        
        editPostForm.reset();
    })
}

const deletePost = (postID) => {
    database.ref('post')
        .once('value', snap => {
            snap.forEach(item => {
                if(item.val().id === postID){
                    database.ref('post').child(item.key).remove()
                        .then(()=>{
                            showAllPosts(auth.currentUser.uid)
                            return true;
                        })
                }
            })
        })
    
}

const editPost = (postID) => {
    database.ref('post')
        .once('value', snap => {
            snap.forEach(item => {
                if(item.val().id === postID){
                    showEditPosts(item.val().title, item.val().text, item.val().tags, postID)
                }
            })
        })
}

document.addEventListener('DOMContentLoaded', ()=> {
    postHandlerInit();
})


/*database.ref('post').orderByChild('id').once('value', snapshot => {
        (snapshot || []).forEach(item=>{
            
            posts.push(`
              <section class="post">
                <div class="post-body">
                  <h2 class="post-title">${item.val().title}</h2>
                  <p class="post-text" >${item.val().text}</p>
                  <div class="tags">
                    ${(item.val().tags || []).map(tag=>`<a href="#" class="tag">#${tag}</a>`)}
                  </div>
                </div>
                <div class="post-footer">
                  <div class="post-buttons">
                    <button class="post-button post-button-likes">
                <svg width="19" height="20" class="icon icon-like">
                  <use xlink:href="img/icons.svg#like"></use>
                </svg>
                <span class="post-button likes-counter">${item.val().like}</span>
              </button>
                    <button class="post-button post-button-comments">
                <svg width="21" height="21" class="icon icon-comment">
                  <use xlink:href="img/icons.svg#comment"></use>
                </svg>
              <span class="comments-counter">${item.val().comments}</span>
            </button>
                    <button class="post-button post-button-save">
                <svg width="19" height="19" class="icon icon-save">
                  <use xlink:href="img/icons.svg#save"></use>
                </svg>
            </button>
                    <button class="post-button post-button-share">
                <svg width="17" height="19" class="icon icon-share">
                  <use xlink:href="img/icons.svg#share"></use>
                </svg>
            </button>
                    ${setUsers.user? item.val().author.email === (setUsers.user.email || null) || setUsers.user.email === adminEmail?
                          `<button class="post-button post-button-delete" value="${item.val().id}" onclick="deletePost(value)">
                  <svg width="17" height="19" class="icon icon-delete">
                    <use xlink:href="img/icons.svg#delete"></use>
                  </svg>
                </button>`: `` :``}
                    ${setUsers.user? item.val().author.email === (setUsers.user.email || null) || setUsers.user.email === adminEmail?
                `<button class="post-button post-button-edit" value="${item.val().id}" onclick="editPost(value)">
                  <svg width="17" height="19" class="icon icon-edit">
                    <use xlink:href="img/icons.svg#edit"></use>
                  </svg>
                </button>`: `` :``}
                  </div>
                  <div class="post-author">
                    <div class="author-about">
                      <a href="#" class="author-username">${item.val().author.displayName}</a>
                      <span class="post-time">${item.val().date}</span>
                    </div>
                  <a href="#" class="author-link"><img src=${item.val().author.photo || "img/avatar.jpeg"} alt="avatar" class="author-avatar"></a>
                </div>
                </div>
              </section>`);
            counter++;
        })
    }).then(()=> {
        posts.reverse().forEach(post => {postsHTML+=post;})
        postsHTML+=`<div class="post-buttons">
                        <button class="page-buttons prev-page-button">\<</button>
                        <button class="page-buttons next-page-button">\></button>
                  </div>`;
        postsWrapper.innerHTML = postsHTML;
        postsHTML = '';
        addPostForm.classList.remove('visible');
        editPostForm.classList.remove('visible');
        postsWrapper.classList.add('visible');
    })*/