document.addEventListener('DOMContentLoaded', function () {
  // 헤더 스크롤 효과
  const header = document.querySelector('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // KOBIS API 키 (실제 사용시 본인의 API 키로 변경 필요)
  const API_KEY = '발급받은_API_키_입력';

  // KOBIS API를 호출하여 영화 목록 가져오기
  async function fetchMoviesFromKobis(options = {}) {
    const defaultParams = {
      key: API_KEY,
      itemPerPage: '15', // 페이지당 영화 수
      curPage: '1', // 현재 페이지
      movieTypeCd: '', // 영화 유형 (장편, 단편 등)
      nationCd: '', // 제작 국가
      genreAlt: '', // 장르
      releaseDts: '', // 개봉 시작일
      releaseDte: '', // 개봉 종료일
      listCount: '0',
    };

    // 기본 매개변수와 사용자 옵션 병합
    const params = { ...defaultParams, ...options };

    // URL 파라미터 구성
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        queryParams.append(key, params[key]);
      }
    });

    try {
      // CORS 이슈 회피를 위해 프록시 서버 사용 (실제 구현 시 서버 측에서 API 호출해야 함)
      // 또는 https://cors-anywhere.herokuapp.com/ 같은 CORS 프록시 활용 가능
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json`;

      const response = await fetch(
        `${proxyUrl}${apiUrl}?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`API 호출 오류: ${response.status}`);
      }

      const data = await response.json();
      return data.movieListResult.movieList;
    } catch (error) {
      console.error('영화 데이터 가져오기 실패:', error);

      // API 호출 실패 시 대체 데이터 (개발 테스트용)
      return generateFallbackMovies();
    }
  }

  // 대체 영화 데이터 생성 (API 호출 실패 시)
  function generateFallbackMovies() {
    return Array.from({ length: 15 }, (_, i) => ({
      movieNm: `영화 ${i + 1}`,
      movieCd: `2023${100000 + i}`,
      openDt: '20230101',
      repGenreNm: '액션',
      nations: [{ nationNm: '한국' }],
      directors: [{ peopleNm: '감독' }],
      actors: [{ peopleNm: '배우1' }, { peopleNm: '배우2' }],
      rating: (Math.random() * 2 + 7).toFixed(1),
    }));
  }

  // 영화 포스터 URL 생성 (KOBIS API는 포스터 URL을 제공하지 않으므로 대체 이미지 사용)
  function getMoviePosterUrl(movieCd, index) {
    // 실제로는 다른 API(예: TMDB)를 사용하여 포스터를 가져오는 것이 좋습니다
    // 현재는 예시 이미지로 대체
    const category = ['movie', 'action', 'romance'];
    const categoryType = category[Math.floor(index / 5) % 3];
    return `images/${categoryType}${(index % 4) + 1}.jpg`;
  }

  // 영화 카드 HTML 생성 함수
  function createMovieCard(movie, index) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    // KOBIS API에서는 평점을 제공하지 않으므로 임의 생성
    const fakeRating = (Math.random() * 2 + 7).toFixed(1);

    card.innerHTML = `
      <img src="${getMoviePosterUrl(movie.movieCd, index)}" alt="${
      movie.movieNm
    }" />
      <div class="movie-info">
        <h4>${movie.movieNm}</h4>
        <span class="rating">⭐ ${fakeRating}</span>
      </div>
    `;

    // 카드 클릭 이벤트 - 영화 상세 정보
    card.addEventListener('click', () => {
      showMovieDetails(movie);
    });

    return card;
  }

  // 영화 상세 정보 표시 함수
  function showMovieDetails(movie) {
    console.log('영화 상세 정보:', movie);
    alert(`
      제목: ${movie.movieNm}
      개봉일: ${movie.openDt || '정보 없음'}
      장르: ${movie.repGenreNm || '정보 없음'}
      국가: ${movie.nations?.map((n) => n.nationNm).join(', ') || '정보 없음'}
      감독: ${movie.directors?.map((d) => d.peopleNm).join(', ') || '정보 없음'}
    `);
    // 여기에 모달이나 상세 페이지로 이동하는 코드 구현
  }

  // 영화 섹션 설정
  async function setupMovieSection(sectionId, options = {}) {
    try {
      const section =
        document.querySelector(`#${sectionId}`) ||
        document.querySelector(
          `section.movie-row:nth-of-type(${parseInt(sectionId) + 1})`
        );

      if (!section) {
        console.error(`섹션을 찾을 수 없습니다: ${sectionId}`);
        return;
      }

      const slider = section.querySelector('.movie-slider');

      // 로딩 표시 추가
      slider.innerHTML =
        '<div class="loading">영화 목록을 불러오는 중...</div>';

      // API에서 영화 목록 가져오기
      const movies = await fetchMoviesFromKobis(options);

      // 로딩 표시 제거
      slider.innerHTML = '';

      // 영화 카드 추가
      movies.forEach((movie, index) => {
        slider.appendChild(createMovieCard(movie, index));
      });

      // 화살표 컨트롤 생성
      addSliderControls(section, slider);
    } catch (error) {
      console.error('영화 섹션 설정 오류:', error);
    }
  }

  // 화살표 컨트롤 추가 함수
  function addSliderControls(row, slider) {
    // 기존에 있는 컨트롤이 있다면 제거
    const existingControls = row.querySelector('.slider-controls');
    if (existingControls) {
      existingControls.remove();
    }

    const sliderControls = document.createElement('div');
    sliderControls.className = 'slider-controls';

    const leftArrow = document.createElement('button');
    leftArrow.className = 'slider-arrow arrow-left';
    leftArrow.innerHTML = '&lt;';
    leftArrow.addEventListener('click', () => {
      slider.scrollBy({ left: -600, behavior: 'smooth' });
    });

    const rightArrow = document.createElement('button');
    rightArrow.className = 'slider-arrow arrow-right';
    rightArrow.innerHTML = '&gt;';
    rightArrow.addEventListener('click', () => {
      slider.scrollBy({ left: 600, behavior: 'smooth' });
    });

    sliderControls.appendChild(leftArrow);
    sliderControls.appendChild(rightArrow);
    row.appendChild(sliderControls);

    // 화살표 표시 여부 관리
    const updateArrows = () => {
      if (slider.scrollLeft <= 10) {
        leftArrow.style.opacity = '0.3';
        leftArrow.style.pointerEvents = 'none';
      } else {
        leftArrow.style.opacity = '1';
        leftArrow.style.pointerEvents = 'auto';
      }

      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
        rightArrow.style.opacity = '0.3';
        rightArrow.style.pointerEvents = 'none';
      } else {
        rightArrow.style.opacity = '1';
        rightArrow.style.pointerEvents = 'auto';
      }
    };

    slider.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);

    // 초기 화살표 상태 설정
    setTimeout(updateArrows, 100);
  }

  // 메인 배너 영화 가져오기 및 설정
  async function setupMainBanner() {
    try {
      // 최신 영화 한 편 가져오기 (개봉일 순으로 정렬)
      const featuredMovies = await fetchMoviesFromKobis({
        itemPerPage: '1',
        orderBy: 'openDt',
      });

      const featuredMovie = featuredMovies[0] || {
        movieNm: '오펜하이머',
        movieCd: '20227890',
        openDt: '20230921',
        nations: [{ nationNm: '미국' }],
        directors: [{ peopleNm: '크리스토퍼 놀란' }],
        actors: [{ peopleNm: '킬리언 머피' }],
      };

      const bannerSection = document.querySelector('.hero-banner');

      bannerSection.style.backgroundImage = `
        linear-gradient(
          to right,
          rgba(19, 17, 26, 0.9) 0%,
          rgba(19, 17, 26, 0.7) 50%,
          rgba(19, 17, 26, 0.5) 100%
        ),
        url('images/hero-bg.jpg')
      `;

      // 국가 정보와 감독 정보 조합하여 설명 생성
      const nations =
        featuredMovie.nations?.map((n) => n.nationNm).join(', ') || '';
      const directors =
        featuredMovie.directors?.map((d) => d.peopleNm).join(', ') || '';
      const description = `${nations} | ${directors} 감독`;

      bannerSection.innerHTML = `
        <div class="banner-content">
          <h2>${featuredMovie.movieNm}</h2>
          <p class="tagline">${description}</p>
          <div class="banner-buttons">
            <button class="btn play-btn">▶ 예고편 보기</button>
            <button class="btn info-btn">상세 정보</button>
          </div>
        </div>
      `;

      // 버튼 이벤트 리스너 추가
      const playBtn = bannerSection.querySelector('.play-btn');
      const infoBtn = bannerSection.querySelector('.info-btn');

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          alert('예고편이 재생됩니다.');
        });
      }

      if (infoBtn) {
        infoBtn.addEventListener('click', () => {
          showMovieDetails(featuredMovie);
        });
      }
    } catch (error) {
      console.error('메인 배너 설정 오류:', error);
    }
  }

  // 검색 기능 구현
  function setupSearch() {
    const searchForm = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-bar input');

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
          try {
            // 검색어로 영화 검색
            const searchResults = await fetchMoviesFromKobis({
              movieNm: searchTerm,
            });

            if (searchResults.length > 0) {
              alert(
                `'${searchTerm}'에 대한 검색 결과: ${searchResults.length}개의 영화를 찾았습니다.`
              );
              console.log('검색 결과:', searchResults);
              // 여기에 검색 결과 페이지로 이동하는 로직 구현
            } else {
              alert(`'${searchTerm}'에 대한 검색 결과가 없습니다.`);
            }
          } catch (error) {
            console.error('검색 오류:', error);
            alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
          }
        }
      });
    }
  }

  // 모든 컨텐츠 로드
  async function loadAllContent() {
    try {
      // 메인 배너 설정
      await setupMainBanner();

      // 이달의 추천 영화 (최신순)
      const currentSection = document.querySelector(
        'section.movie-row:nth-of-type(1)'
      );
      if (currentSection) {
        currentSection.id = 'recommended-movies';
        await setupMovieSection('recommended-movies', {
          orderBy: 'openDt',
          itemPerPage: '15',
        });
      }

      // 이런 영화 어떠신가요? (평점순 - 실제로는 KOBIS API에서 평점을 제공하지 않음)
      const suggestedSection = document.querySelector(
        'section.movie-row:nth-of-type(2)'
      );
      if (suggestedSection) {
        suggestedSection.id = 'suggested-movies';
        await setupMovieSection('suggested-movies', {
          itemPerPage: '15',
          // 다른 기준으로 정렬할 수 있음 (실제 API에서 지원하는 경우)
        });
      }

      // 액션 영화 베스트
      const actionSection = document.querySelector(
        'section.movie-row:nth-of-type(3)'
      );
      if (actionSection) {
        actionSection.id = 'action-movies';
        await setupMovieSection('action-movies', {
          itemPerPage: '15',
          repGenreNm: '액션', // 장르로 필터링
        });
      }

      // 로맨스 영화 베스트
      const romanceSection = document.querySelector(
        'section.movie-row:nth-of-type(4)'
      );
      if (romanceSection) {
        romanceSection.id = 'romance-movies';
        await setupMovieSection('romance-movies', {
          itemPerPage: '15',
          repGenreNm: '멜로/로맨스', // 장르로 필터링
        });
      }

      // 검색 기능 설정
      setupSearch();
    } catch (error) {
      console.error('콘텐츠 로드 오류:', error);
    }
  }

  // CSS에 로딩 스타일 추가
  const style = document.createElement('style');
  style.textContent = `
    .loading {
      width: 100%;
      text-align: center;
      padding: 20px;
      color: #fff;
      font-size: 16px;
    }
    
    .movie-slider {
      min-height: 250px;
    }
  `;
  document.head.appendChild(style);

  // 페이지 로드 시 모든 콘텐츠 로드
  loadAllContent();
});
