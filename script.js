const apiKey = '592c72e8e39159933cbebc58d0947536';
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

  // *** 추가된 부분 시작 ***
  // 윈도우 크기 변경 시 Swiper 강제 업데이트 (개발자 도구 여닫을 때 등)
  window.addEventListener('resize', () => {
    // 이미지가 완전히 로드되지 않아 크기가 제대로 계산되지 않을 수 있으므로
    // 일정 시간 지연 후 업데이트를 시도하는 것도 방법입니다.
    // 하지만 대부분의 경우 바로 update()와 resize()로 충분합니다.
    bannerSwiper.update();
    //bannerSwiper.resize();
  });
  // *** 추가된 부분 끝 ***

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
    movies.slice(0, 20).forEach(movie => {
      const movieDiv = document.createElement('div');
      movieDiv.className = 'movie';
      movieDiv.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}"
        class="poster"
        alt="${movie.title}"
        data-id="${movie.id}" />`;
      container.appendChild(movieDiv);
    });
  })
  .catch(err => console.log(err));

fetch(url2)
  .then(response => response.json())
  .then(data => {
    const movies = data.results;
    const container = document.getElementById('movieContainer2');
    movies.slice(0, 20).forEach(movie => {
      const movieDiv = document.createElement('div');
      movieDiv.className = 'movie';
      movieDiv.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}"
        class="poster"
        alt="${movie.title}"
        data-id="${movie.id}" />`;
      container.appendChild(movieDiv);
    });
  })
  .catch(err => console.log(err));


// 브라우저 크기 변경 시 다시 계산
window.addEventListener('resize', updateTransform);


// 모달 관련 요소 가져오기
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close-button');
const modalHeaderBackground = document.querySelector('.modal-header-background');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalReleaseYear = document.getElementById('modal-release-year');
const modalAgeRating = document.getElementById('modal-age-rating');
const modalRuntime = document.getElementById('modal-runtime');
const modalVoteAverage = document.getElementById('modal-vote-average');
const modalOverview = document.getElementById('modal-overview');
const modalCastList = document.getElementById('modal-cast-list');
const modalPlayButton = document.querySelector('.modal-play-button');


// 모달 닫기 이벤트 리스너
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
  modalCastList.innerHTML = ''; // 모달 닫을 때 출연진 목록 초기화
});

// 모달 외부 클릭 시 닫기 (스크롤바 클릭 시에도 닫히는 문제 방지)
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    modalCastList.innerHTML = ''; // 모달 닫을 때 출연진 목록 초기화
  }
});


// 영화 정보 가져오기 및 모달 표시
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("poster")) {
    const movieId = e.target.dataset.id;
    if (movieId) {
      try {
        // 모든 API 호출을 Promise.all을 사용하여 병렬로 시작합니다.
        const [
          movieResponse,
          creditsResponse,
          releaseDatesResponse,
          videosResponse
        ] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=ko-KR`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=ko-KR`)
        ]);

        // 모든 응답을 JSON으로 파싱합니다.
        const [
          movie,
          credits,
          releaseDatesData,
          videosData
        ] = await Promise.all([
          movieResponse.json(),
          creditsResponse.json(),
          releaseDatesResponse.json(),
          videosResponse.json()
        ]);

        const cast = credits.cast.slice(0, 5); // 주요 출연진 5명만 가져오기

        // 관람 등급 정보 가져오기
        let ageRating = '정보 없음';
        const krRelease = releaseDatesData.results.find(r => r.iso_3166_1 === 'KR');
        if (krRelease && krRelease.release_dates.length > 0) {
          // 가장 최신 개봉일의 등급 사용
          const latestRating = krRelease.release_dates
            .filter(date => date.certification)
            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))[0];
          if (latestRating) {
            ageRating = `${latestRating.certification}세 이용가`;
          }
        }

        // 트레일러 URL 가져오기
        const trailer = videosData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

        // 모달에 영화 정보 채우기
        modalHeaderBackground.style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`;
        modalPoster.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        modalTitle.textContent = movie.title;
        modalReleaseYear.textContent = movie.release_date ? movie.release_date.substring(0, 4) : '개봉일 정보 없음';
        modalAgeRating.textContent = ageRating; // 관람 등급
        modalRuntime.textContent = movie.runtime ? `${movie.runtime}분` : '상영 시간 정보 없음';
        modalVoteAverage.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
        modalOverview.textContent = movie.overview || '줄거리 정보가 없습니다.';

        // 출연진 목록 채우기
        modalCastList.innerHTML = ''; // 기존 출연진 초기화
        if (cast.length > 0) {
          cast.forEach(actor => {
            const span = document.createElement('span');
            span.className = 'cast-item';
            span.textContent = actor.name;
            modalCastList.appendChild(span);
          });
        } else {
          modalCastList.textContent = '출연진 정보 없음';
        }

        // 재생 버튼 링크 설정
        if (trailer) {
          modalPlayButton.onclick = () => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
        } else {
          modalPlayButton.onclick = null; // 링크 제거
          modalPlayButton.disabled = true; // 버튼 비활성화
          modalPlayButton.textContent = '예고편 없음';
        }


        // 모달 표시
        modal.style.display = 'flex'; // flex로 변경하여 가운데 정렬 활용

      } catch (error) {
        console.error('영화 상세 정보를 가져오는 중 오류 발생:', error);
        // 에러 발생 시 모달 닫기 또는 에러 메시지 표시
        modal.style.display = 'none';
      }
    }
  }
});