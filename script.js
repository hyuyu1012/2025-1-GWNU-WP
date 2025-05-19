const apiKey='592c72e8e39159933cbebc58d0947536';
console.log(apiKey)
document.addEventListener('DOMContentLoaded', function() {
  // 배너 스와이퍼 초기화
  const bannerSwiper = new Swiper('.banner-swiper', {
    direction: 'horizontal',
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    
    // 네비게이션 화살표
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    
    // 페이지네이션 (하단 점)
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  });
});

const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`;
const url2 = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&language=ko-KR&page=1`;

const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const carousel = document.querySelector('.carousel');
const slide = document.querySelector('.carousel > *'); // 첫 슬라이드
let index = 0;

function updateTransform() {
  const slideWidth = slide.offsetWidth;
  carousel.style.transform = `translate3d(-${slideWidth * index}px, 0, 0)`;
}

/* api 처리 */
fetch(url)
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
  .catch(err => console.log(err));
  
fetch(url2)
.then(response => response.json())
.then(data => {
    const movies = data.results;
    const container = document.getElementById('movieContainer2');
    movies.slice(0,20).forEach(movie => {
      const movieDiv = document.createElement ('div');
      movieDiv.className = 'movie';
      movieDiv.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" /> `;
      container.appendChild(movieDiv);
    });
  })
  .catch(err => console.log(err));


// 브라우저 크기 변경 시 다시 계산
window.addEventListener('resize', updateTransform);