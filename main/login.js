const userName = document.querySelector('#username');
const userPassWord = document.querySelector('#password');
const loginForm = document.querySelector('#login-form');
const userList = document.querySelector('#users');
const msg = document.querySelector('.msg');

loginForm.addEventListener('submit',onSubmit);

function onSubmit(e){
    e.preventDefault();

    if(userName.value === '' || userPassWord.value === ''){
        alert('Please enter valid Username and Password');
    } else {
        const userli = document.createElement('li');
    }
}
