const apiKey='592c72e8e39159933cbebc58d0947536';

document.querySelectorAll('.options button').forEach(btn => { 
  btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
  });
});


const resultBtn = document.querySelector('.result-btn');
resultBtn.addEventListener('click', async () => {  // async 함수로 변경
  const selectedElements = document.querySelectorAll('.selected');
  const keywordIds = Array.from(selectedElements).map(el => el.id);

  if (keywordIds.length === 0) {
    alert('키워드를 선택하세요!');
    return;
  }

  const query = keywordIds.join(' ');
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${encodeURIComponent(query)}&page=1&include_adult=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);

    const data = await response.json();
    
    if (data.results.length === 0) {
      alert('검색 결과가 없습니다.');
      return;
    }

    // 결과 처리 — 일단 콘솔에 출력
    console.log('검색 결과 영화 목록:');
    data.results.forEach(movie => {
      console.log(`${movie.title} (${movie.release_date ? movie.release_date.substring(0,4) : 'N/A'})`);
    });

   const resultDiv = document.querySelector('#result');
   resultDiv.innerHTML = data.results.map(m => `<p>${m.title} (${m.release_date?.substring(0,4) || 'N/A'})</p>`).join('');

  } catch (error) {
    console.error(error);
    alert('영화 검색 중 오류가 발생했습니다.');
  }
});
