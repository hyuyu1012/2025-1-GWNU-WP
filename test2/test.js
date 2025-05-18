const apiKey='592c72e8e39159933cbebc58d0947536';
const keywordId = '12377'
const url2 =`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_keywords=${keywordId}`
fetch(url2)
  .then(response => response.json())
  .then(data => {
    const movies = data.results;
    const container = document.getElementById('movieContainer');
    movies.slice(0,20).forEach(movie => {
      const movieDiv = document.createElement ('div');
      movieDiv.className = 'movie';
      movieDiv.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" /> `;
      container.appendChild(movieDiv);
    });
  })
  .catch(error => console.error('에러:', error));






