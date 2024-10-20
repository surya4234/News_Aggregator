// script.js
const apiKey = '3f7796cc8a364806bcc563861adfdfc7';

// Function to fetch news based on category
// Function to fetch news based on category
function fetchNews(category) {
  let url;

  // API Endpoints for different categories
  if (category === 'home') {
    url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}";
  } else if (category === 'world') {
    url = 'https://newsapi.org/v2/top-headlines?category=general&language=en&apiKey=${apiKey}';
  } else if (category === 'sports') {
    url = 'https://newsdata.io/api/1/news?category=sports&apikey=pub_54906cdcf45b344eeaa1c72111418121bbf6c&language=en';
  } else if (category === 'technology') {
    url = `https://newsdata.io/api/1/news?apikey=pub_54906cdcf45b344eeaa1c72111418121bbf6c&q=Technology `;
  } else if (category === 'entertainment') {
    url = `https://newsdata.io/api/1/news?apikey=pub_54906cdcf45b344eeaa1c72111418121bbf6c&q=entertaiment `;
  }

  // Fetching the news
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.articles) {
        // For NewsAPI.org response structure
        displayNews(data.articles);
      } else if (data.results) {
        // For NewsData.io response structure
        displayNews(data.results);
      } else {
        console.log('No articles found.');
      }
    })
    .catch(error => console.log('Error:', error));
}

// Function to display the fetched news
function displayNews(articles) {
  const newsSection = document.getElementById('news-section');
  newsSection.innerHTML = '';  // Clear previous news

  articles.forEach(article => {
    let articleDiv = document.createElement('div');
    articleDiv.className = 'article';

    articleDiv.innerHTML = `
      <h2>${article.title}</h2>
      <img src="${article.urlToImage || 'default-image.jpg'}" alt="news image">
      <p>${article.description}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;
    
    newsSection.appendChild(articleDiv);
  });
}

// Fetch home news on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchNews('home');
});