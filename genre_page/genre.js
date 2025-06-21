const apiKey='592c72e8e39159933cbebc58d0947536';
const imageBase = 'https://image.tmdb.org/t/p/w500';

    document.getElementById("genre").addEventListener("change", async function () {
      //combobox value 가져오기
      const genreId = this.value;
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=ko-KR&page=1`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(response);
      console.log(data);

      const movieList = document.getElementById("movies");
      movieList.innerHTML = "";
      
      for (const movie of data.results.slice(0, 20)) {
        const poster = movie.poster_path ? imageBase + movie.poster_path : '';
        const title = movie.title;
        const rating = movie.vote_average;
        const overview = movie.overview


        //.movie
        const div = document.createElement("div");
        div.classList.add("movie");
        div.innerHTML = `
          ${poster ? `<img src="${poster}" alt="${title} 포스터">` : ''}
          
          <div class="info">
          <h3>${title}</h3>
          <div class="rating"> <span class="rating">★ ${rating.toFixed(1)}</span></div>
          <div class="overview">${overview}</div>
          </div>
          `
        ;
        movieList.appendChild(div);
      }
    });