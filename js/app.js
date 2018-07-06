const form = document.querySelector('#search-form');
const searchField = document.querySelector('#search-keyword');
let searchedForText;
const responseContainer = document.querySelector('#response-container');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;
    imagesRequest();
    articleRequest();
});
// set usplash API "image request"
function imagesRequest() {
    const unsplashRequest = new XMLHttpRequest();
    unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
    unsplashRequest.onload = addImage;
    unsplashRequest.onerror = function (err) {
        console.log(err);
    }
    unsplashRequest.setRequestHeader('Authorization', 'Client-ID 7210b5c5405f766b2f0298ae731709557a8a7275688387c5162150342d228255');
    unsplashRequest.send();
}

function addImage() {
    let htmlContent = '';
    const data = JSON.parse(this.responseText);
    if (data && data.results) {
        htmlContent = data.results.map(img => `<figure>
            <img src="${img.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${img.user.name}</figcaption>
        </figure>`).join('');
    } else {
        htmlContent = '<div class="error-no-image">No images available</div>';
    }
    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
}

// set NYT API "article request"
function articleRequest() {
    const articleRequest = new XMLHttpRequest();
    articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=2673bdbbdee9493ba01ac2e41ed8d941`);
    
    articleRequest.onload = addArticles;
    articleRequest.onerror = function (err) {
        console.log(err);
    };
    articleRequest.send();
}
// search for an Article in NYT which not using Request header
function addArticles() {
    let htmlContent = '';
    // convert response from json to html object
    const data = JSON.parse(this.responseText);
    if (data && data.response && data.response.docs && data.response.docs.length > 1) {
        // if more than on articule has been returned maps over each article and then returns a list item that contains the article's
        htmlContent = '<ul>' + data.response.docs.map(article => `
            <li class='article'>
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
            </li>`).join('') + '</ul>';
    } else {
        htmlContent = '<div class="error-no-articles">No articles available</div>';
    }
    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
}