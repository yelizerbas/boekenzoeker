// Of email correct is of niet
// De function isEmail heb ik van https://codepen.io/FlorinPop17/pen/OJJKQeK
function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

// Signup
const formSignup = document.querySelector('#formsignup');
const errorMessageName = document.querySelector('.messagename');
const errorMessageEmail = document.querySelector('.messageemail');
const errorMessagePass = document.querySelector('.messagepassword');

if (formSignup) {
    formSignup.addEventListener('submit', (event) => {
        const signupName = document.querySelector('#name');
        const signupEmail = document.querySelector('#email');
        const signupPass = document.querySelector('#password');
        const signupConfirmPass = document.querySelector('#confirm_password');

        if (signupName.value.length != 0 && isEmail(signupEmail.value) && signupPass.value.length != 0 && signupPass.value == signupConfirmPass.value) {
            console.log('Het werkt denk ik');
        } else {
            event.preventDefault();

            if (signupName.value.length != 0) {
                console.log('Er is een naam ingevuld.');
                errorMessageName.classList.remove('errormessage');
                signupName.classList.remove('error');
            } else {
                console.log('Er is geen naam ingevuld.');
                signupName.classList.add('error');
                errorMessageName.classList.add('errormessage');
                errorMessageName.innerHTML = 'Er is geen naam ingevuld.';
            }

            // De else if en esle heb ik van https://codepen.io/FlorinPop17/pen/OJJKQeK
            if (signupEmail.value.length == 0) {
                console.log('Er is geen email ingeuld.');
                signupEmail.classList.add('error');
                errorMessageEmail.classList.add('errormessage');
                errorMessageEmail.innerHTML = 'Er is geen emailadres ingevuld.';
            } else if (!isEmail(signupEmail.value)) {
                console.log('Dit is geen geldig emailadres.');
                signupEmail.classList.add('error');
                errorMessageEmail.classList.add('errormessage');
                errorMessageEmail.innerHTML = 'Er is geen geldig emailadres ingevuld.';
            } else {
                console.log('Het emailadres is goed.');
                errorMessageEmail.classList.remove('errormessage');
                signupEmail.classList.remove('error');
            }

            if (signupPass.value.length != 0) {
                if (signupPass.value == signupConfirmPass.value) {
                    console.log('je wachwoord is hetzelfde');
                    errorMessagePass.classList.remove('errormessage');
                    signupPass.classList.remove('error');
                    signupConfirmPass.classList.remove('error');
                } else {
                    console.log('je wachtwoord is niet gelijk');
                    signupPass.classList.add('error');
                    signupConfirmPass.classList.add('error');
                    errorMessagePass.classList.add('errormessage');
                }
            } else {
                console.log('wachtwoord mag niet leeg zijn');
                errorMessagePass.classList.add('errormessage');
                errorMessagePass.innerHTML = 'Er is geen wachtwoord ingevuld.';
                signupPass.classList.add('error');
                signupConfirmPass.classList.add('error');
            }
        }
    });
}

// Login
const formLogin = document.querySelector('#formlogin');
const loginEmail = document.querySelector('#emaillogin');
const loginPass = document.querySelector('#passwordlogin');

if (formLogin) {
    formLogin.addEventListener('submit', (event) => {
        if (isEmail(loginEmail.value) && loginPass.value.length != 0) {
            console.log('Volgensmij werkt het!!!');
        } else {
            event.preventDefault();

            // De else if en esle heb ik van https://codepen.io/FlorinPop17/pen/OJJKQeK
            if (loginEmail.value.length == 0) {
                console.log('Er is geen email ingeuld.');
                loginEmail.classList.add('error');
                errorMessageEmail.classList.add('errormessage');
                errorMessageEmail.innerHTML = 'Er is geen emailadres ingevuld.';
            } else if (!isEmail(loginEmail.value)) {
                console.log('Dit is geen geldig emailadres.');
                loginEmail.classList.add('error');
                errorMessageEmail.classList.add('errormessage');
                errorMessageEmail.innerHTML = 'Er is geen geldig emailadres ingevuld.';
            } else {
                console.log('Het emailadres is goed.');
                errorMessageEmail.classList.remove('errormessage');
                loginEmail.classList.remove('error');
            }

            if (loginPass.value.length != 0) {
                console.log('Het wachtwoord is ingevuld');
                loginPass.classList.remove('error');
                errorMessagePass.classList.remove('errormessage');
            } else if (loginPass.value.length == 0) {
                console.log('Wachtwoord mag niet leeg zijn');
                errorMessagePass.classList.add('errormessage');
                errorMessagePass.innerHTML = 'Er is geen wachtwoord ingevuld.';
                loginPass.classList.add('error');
            } else {
                console.log('Wachtwoord is niet correct');
                errorMessagePass.classList.add('errormessage');
                loginPass.classList.add('error');
            }
        }
    });
}

// API inladen
const apiUrl = 'https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=Rao7HzLIKiqlUtqMI0I0WS1sOGfmDfjO';
 
// De getrandomInt functie heb ik van https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Defining async function
async function getApi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    const data = await response.json();
    console.log(data);
    if (response) {
        const bookTip = document.querySelector('header p span:first-of-type');
        const titleBook = data.results.lists[17].books[getRandomInt(10)].title;
        bookTip.innerHTML = titleBook;
        
        console.log(data.results.lists[17].books[getRandomInt(10)].title);
    }
}
// Calling that async function
getApi(apiUrl);
