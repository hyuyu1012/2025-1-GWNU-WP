const apiKey='592c72e8e39159933cbebc58d0947536';
const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ko`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const genres = data.genres;
    genres.forEach(genre => {
      console.log(`${genre.id}: ${genre.name}`);
    });
  })
  .catch(error => {
    console.error('에러 발생:', error);
  });