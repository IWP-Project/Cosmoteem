const userName = document.querySelector('#userName');
const userPassWord = document.querySelector('#passWord');
const loginForm = document.querySelector('#login-form');
const userList = document.querySelector('#users');
const msg = document.querySelector('.msg');

loginForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();

    //If fields are left empty: error
    if (userName.value === '' || userPassWord.value === '') {
        msg.classList.add('errorLogin');
        msg.innerText = 'Please Enter A VALID input in ALL The Fields!';
        setTimeout(() => msg.remove(), 3000);
    } else {
        //Store the inputs to Process
        const userCheck = document.createElement('li');
        //Appending Inputs to an Element IN corresponding HTML.
        userCheck.appendChild(document.createTextNode(`${userName.value}:${userPassWord.value}`));
        userList.appendChild(userCheck);
        //Clearing Input Field
        userName.value = '';
        userPassWord.value = '';
    }

}