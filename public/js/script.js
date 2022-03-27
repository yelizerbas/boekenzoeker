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

// Fout meldingen
// Account
const formAccount = document.querySelector('#formaccount');

if (formAccount) {
    formAccount.addEventListener('submit', (event) => {
        const accountName = document.querySelector('#formaccount #username');
        const accountPass = document.querySelector('#formaccount #password');
        const errorMessageName = document.querySelector('.messagename');
        const errorMessagePass = document.querySelector('.messagepassword');

        if (accountName.value.length != 0 && isEmail(accountEmail.value) && accountPass.value.length != 0 && accountPass.value != 0) {
            console.log('Het werkt denk ik');
        } else {
            event.preventDefault();

            if (accountName.value.length != 0) {
                console.log('Er is een gebruikersnaam ingevuld.');
                errorMessageName.classList.remove('errormessage');
                accountName.classList.remove('error');
            } else {
                console.log('Er is geen gebruikersnaam ingevuld.');
                accountName.classList.add('error');
                errorMessageName.classList.add('errormessage');
                errorMessageName.innerHTML = 'Er is geen gebruikersnaam ingevuld.';
            }

            if (accountPass.value.length != 0) {
                console.log('Het wachtwoord is goed');
                accountPass.classList.remove('error');
                accountConfirmPass.classList.remove('error');
                errorMessagePass.classList.remove('errormessage');
            } else {
                console.log('Het wachtwoord mag niet leeg zijn');
                errorMessagePass.classList.add('errormessage');
                errorMessagePass.innerHTML = 'Er is geen wachtwoord ingevuld.';
                accountPass.classList.add('error');
                accountConfirmPass.classList.add('error');
            }
        }
    });
}