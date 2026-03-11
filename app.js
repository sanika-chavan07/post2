
const cl = console.log;
const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('title')
const bodyControl = document.getElementById('body')
const userIdControl = document.getElementById('userId')
const spinner = document.getElementById('spinner')
const addPostBtn = document.getElementById('addPostBtn')
const updatePostBtn = document.getElementById('updatePostBtn')
const postContainer = document.getElementById('postContainer')

// create >> GET
// get from DB >> GET
// remove >> DELETE
// update >> PUT/PATCH

const BASE_URL = `https://jsonplaceholder.typicode.com/`

const POSTS_URL = `${BASE_URL}/posts`;


let postsArr = []


function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}
const createPostCards = (arr) => {
    let result = '';
    for (let i = arr.length - 1; i >= 0; i--) {
        result += `<div class="col-md-4 mb-4" id="${arr[i].id}">
                <div class="card h-100">
                    <div class="card-header">
                        <h3 title="${arr[i].title}">
                            ${arr[i].title}
                        </h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">
                            ${arr[i].body}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button 
                        onclick="onEdit(this)"
                        class="btn btn-sm btn-outline-primary">Edit</button>
                        <button 
                        onclick="onRemove(this)"
                        class="btn btn-sm btn-danger">Remove</button>
                    </div>
                </div>
            </div>`

    };

    postContainer.innerHTML = result;

}


fetchBlogs()



function fetchBlogs() {
    // xmlHttpRequest >> constructor function
    spinner.classList.remove('d-none')
    
    let xhr = new XMLHttpRequest()


    
    xhr.open("GET", POSTS_URL, true)



    

    xhr.send()

    
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 299) {
            postsArr = JSON.parse(xhr.response)
 
           createPostCards(postsArr)
            spinner.classList.add('d-none')
        } else {
            cl(`Something went wrong !!!`)
        }
    }


   

}


function onPostSubmit(eve) {
    eve.preventDefault();
   

    let POST_OBJ = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    cl(POST_OBJ)

    
    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest()

    xhr.open("POST", POSTS_URL, true)

    xhr.send(JSON.stringify(POST_OBJ))

    xhr.onload = function () {
        
        if (xhr.status >= 200 && xhr.status <= 299) {
            postForm.reset()
            let res = JSON.parse(xhr.response)



            let col = document.createElement('div')
            col.className = 'col-md-4 mb-4'
            col.id = res.id
            col.innerHTML = `
                <div class="card h-100">
                    <div class="card-header">
                        <h3 data-toggle="tooltip" title="Title">
                            ${POST_OBJ.title}
                        </h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">
                            ${POST_OBJ.body}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button 
                        onclick="onEdit(this)"
                        class="btn btn-sm btn-primary">Edit</button>
                        <button 
                        onclick="onRemove(this)"
                        class="btn btn-sm btn-danger">Remove</button>
                    </div>
                </div>`

            postContainer.prepend(col)
            spinner.classList.add('d-none')
            snackbar(`The new post with id ${res.id} is added successfully !!!`, 'success')
        } else {
            snackbar(`Something went wrong`, 'error')
            spinner.classList.add('d-none')
        }

    }
}

function onEdit(ele) {
    let EDIT_ID = ele.closest('.col-md-4').id
    localStorage.setItem('EDIT_ID', EDIT_ID)
    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`
    spinner.classList.remove('d-none')


    let xhr = new XMLHttpRequest();

    xhr.open('GET', EDIT_URL, true)

    xhr.send(null)

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            let postObj = JSON.parse(xhr.response)

            
            titleControl.value = postObj.title;
            bodyControl.value = postObj.body;
            userIdControl.value = postObj.userId;
            updatePostBtn.classList.remove('d-none')
            addPostBtn.classList.add('d-none')
            spinner.classList.add('d-none')
            snackbar(`The post with id ${EDIT_ID} is patched successfully !!!`, 'success')

        } else {
            spinner.classList.add('d-none')
        }
    }

}






function onPostUpdate() {


    let UPDATE_ID = localStorage.getItem('EDIT_ID')
    localStorage.removeItem('EDIT_ID')


    

    let UPDATE_OBJ = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value,
        id: UPDATE_ID
    }
    cl(UPDATE_OBJ)
    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`



    // API CALL
    // Spinner Show
    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest();


    xhr.open('PATCH', UPDATE_URL, true)


    xhr.send(JSON.stringify(UPDATE_OBJ))

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            cl(res)
            postForm.reset();
            let col = document.getElementById(UPDATE_ID)
            let h3 = col.querySelector('.card-header h3')
            let p = col.querySelector('.card-body p')
            h3.innerText = UPDATE_OBJ.title;
            p.innerText = UPDATE_OBJ.body;
            updatePostBtn.classList.add('d-none')
            addPostBtn.classList.remove('d-none')
            // Spinner Hide

            spinner.classList.add('d-none')
            snackbar(`The post with id ${UPDATE_ID} is updated successfully !!!`, 'success')

        } else {
            cl(err)

            // Spinner Hide
            spinner.classList.add('d-none')
        }
    }


}

function onRemove(ele) {
    Swal.fire({
        title: "Are you sure, you want to remove this Post?",
        showCancelButton: true,
        confirmButtonText: "Remove",
    }).then((result) => {
        cl(result)
        if (result.isConfirmed) {
          
            let REMOVE_ID = ele.closest('.col-md-4').id
            let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`

            // Spinner Show
            spinner.classList.remove('d-none')
            // API CALL 4 METHODS OR STEPS
            let xhr = new XMLHttpRequest()

            xhr.open("DELETE", REMOVE_URL, true)

            xhr.send()

            xhr.onload = function(){
                if(xhr.status >= 200 && xhr.status<= 299){
                    // OBJ is removed from DB
                    ele.closest('.col-md-4').remove()
                    snackbar(`The Post with id ${REMOVE_ID}, is removed successfully !!!`, 'success')
                    // Spinner Hide
                    spinner.classList.add('d-none')
                }else{
                    snackbar(`Something went wrong !!!`, 'error')
                    // Spinner Hide
                    spinner.classList.add('d-none')
                }
            }
        }
    });

}


postForm.addEventListener('submit', onPostSubmit)
updatePostBtn.addEventListener('click', onPostUpdate)

















