const apiKey='592c72e8e39159933cbebc58d0947536';

// keyword button 
document.querySelectorAll('.options button').forEach(btn => { 
  btn.addEventListener('click', () => {
    // 먼저 모든 버튼에서 selected 제거
    document.querySelectorAll('.options button').forEach(b => b.classList.remove('selected'));
    
    // 현재 클릭한 버튼에만 selected 추가
    btn.classList.add('selected');
  });
});

const resultBtn = document.querySelector('.result-btn');
resultBtn.addEventListener('click', async () => {  
  const selectedElements = document.querySelectorAll('.selected');
  const keywordIds = Array.from(selectedElements).map(el => el.id);

  if (keywordIds.length === 0) {
    alert('키워드를 선택하세요!');
    return;
  }

const query = keywordIds.join(',');
const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ko-KR&with_keywords=${query}&page=1&include_adult=false`;

try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
  
  const data = await response.json();
  
  if (data.results.length === 0) {
    alert('검색 결과가 없습니다.');
    return;
  }

  const resultDiv = document.querySelector('#result');
  resultDiv.innerHTML = data.results.map(m => {
    const title = m.title;
    const year = m.release_date?.substring(0, 4) || 'N/A';
    const poster = m.poster_path 
      ? `<img src="https://image.tmdb.org/t/p/w200${m.poster_path}" alt="${title} 포스터">`
      : `<div style="width:200px;height:300px;background:#ccc;display:flex;align-items:center;justify-content:center;">No Image</div>`;
    
    return `
      <div style="margin-bottom:20px;">
        ${poster}
      </div>
    `;
  }).join('');

} catch (error) {
  console.error(error);
  alert('영화 검색 중 오류가 발생했습니다.');
}

});
