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