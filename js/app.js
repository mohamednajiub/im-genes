/* eslint-env jquery */

const form = $('#search-form'),
    searchField = $('#search-keyword'),
    responseContainer = $('#response-container'),
    imagesContainer = $('#images'),
    articlesContainer = $('#articles');
let searchedForText;


form.on('submit', function (e) {
    e.preventDefault();
    responseContainer.html('');
    searchedForText = searchField.val();
    unsplashRequest();
    nytRequest();
});

function unsplashRequest() {
    // set usplash API "image request"
    $.ajax({
        url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
        headers: {
            Authorization: 'Client-ID 7210b5c5405f766b2f0298ae731709557a8a7275688387c5162150342d228255'
        }
    }).done(addImage).fail(function (err) {
        console.log(err, 'image');
    });
}
// set NYT API "article request"
function nytRequest() {
    $.ajax({
        url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=2673bdbbdee9493ba01ac2e41ed8d941`,

    }).done(addArticles).fail(function (err) {
        console.log(err, 'article');
    });
}
function addImage(data) {
    let htmlContent;
    if (data && data.results) {
        const images = data.results;
        htmlContent = images.map(image => `<figure>
            <img src="${image.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${image.user.name}</figcaption>
        </figure>`).join('');
    } else {
        htmlContent = '<div class="error-no-image">No images available</div>';
    }
    imagesContainer.html(htmlContent);
}

// search for an Article in NYT which not using Request header
function addArticles(data) {
    let htmlContent;
    // convert response from json to html object
    if (data && data.response && data.response.docs && data.response.docs.length > 1) {
        const articles = data.response.docs;
        // if more than on articule has been returned maps over each article and then returns a list item that contains the article's
        htmlContent = '<ul>' + articles.map(article => `
            <li class='article'>
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
            </li>`).join('') + '</ul>';
    } else {
        htmlContent = '<div class="error-no-articles">No articles available</div>';
    }
    articlesContainer.html(htmlContent);
}
