// script.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) 사용자 답 저장
  const answers = {};

  // 2) 답변값 → 0~3 인덱스 맵핑
  const moodMap      = { '달달한 감성': 0, '미친 반전': 1, '웃음폭탄': 2, '울컥 감동': 3 };
  const characterMap = { '냉혈한 천재': 0, '귀여운 바보': 1, '강한 여성': 2, '츤데레 히어로': 3 };
  const endingMap    = { '해피엔딩': 0, '오픈엔딩': 1, '배드엔딩': 2, '뇌절급 반전': 3 };

  // 3) 64개 영화 리스트
  const movies = [
  "에놀라 홈즈",
  "La La Land",
  "사랑에 대한 모든 것",
  "The Prestige",
  "내가 사랑했던 모든 남자들에게",
  "500일의 썸머",
  "Her",
  "이터널 선샤인",
  "앤 위드 앤 이 (Anne with an E)",
  "Lady Bird",
  "결혼 이야기",
  "Gone Girl",
  "The Adam Project",
  "Scott Pilgrim vs. The World",
  "The Umbrella Academy",
  "Stranger Things",
  "Knives Out",
  "The Devil All the Time",
  "아이리시맨",
  "올드보이",
  "Murder Mystery",
  "Glass Onion",
  "Fractured",
  "Shutter Island",
  "Gunpowder Milkshake",
  "I Care a Lot",
  "더 파워 오브 더 도그",
  "Red Notice",
  "The Gray Man",
  "Triple Frontier",
  "Project Power",
  "The Big Bang Theory",
  "Space Force",
  "플랫폼",
  "Don't Look Up",
  "The Kissing Booth",
  "Crazy Ex-Girlfriend",
  "BoJack Horseman",
  "Big Mouth",
  "Emily in Paris",
  "Derry Girls",
  "GLOW",
  "Russian Doll",
  "Brooklyn Nine-Nine",
  "Santa Clarita Diet",
  "The End of the F***ing World",
  "The Umbrella Academy",
  "뷰티풀 마인드",
  "The Midnight Sky",
  "The Theory of Everything",
  "Inception",
  "Finding Ohana",
  "The Fundamentals of Caring",
  "The Boy in the Striped Pajamas",
  "The Platform",
  "Roma",
  "Beasts of No Nation",
  "The Queen's Gambit",
  "Fatherhood",
  "Tick, Tick... Boom!",
  "Ma Rainey's Black Bottom",
  "Black Mirror: Bandersnatch"
  ].map((title,i) => ({
    title,
    // 플레이스홀더 포스터: 제목이 이미지에 표시됩니다
    poster: `images/movie${i+1}.jpg`,
    // 간단한 설명 예시
    desc: `${title} — 당신의 취향을 반영한 추천작 입니다.`
  }));

  // 4) 각 버튼에 클릭 리스너 붙이기
  document.querySelectorAll('.question .options button').forEach(btn => {
    btn.addEventListener('click', () => {
      const qDiv = btn.closest('.question');
      const qKey = qDiv.dataset.question;   // "mood" / "character" / "ending"

      // 선택 표시
      qDiv.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // 답 저장
      answers[qKey] = btn.innerText;
    });
  });

  // 5) 결과 보기
  document.querySelector('.result-btn').addEventListener('click', () => {
    if (!answers.mood || !answers.character || !answers.ending) {
      alert('모든 질문에 답해주세요!');
      return;
    }

    // 조합 인덱스 계산 (mood*16 + character*4 + ending)
    const idx = moodMap[answers.mood] * 16
              + characterMap[answers.character] * 4
              + endingMap[answers.ending];

    const movie = movies[idx];

     // ─── 여기부터 디버깅 코드 ───
  console.log('▶ answers =', answers);
  console.log('▶ poster URL =', movie.poster);
  const imgEl = document.getElementById('result-poster');
  imgEl.onerror = () => console.error('⚠️ 이미지 로드 실패 URL:', imgEl.src);
  // ─── 디버깅 끝 ───

    // 화면 렌더링
    document.getElementById('result-title').innerText       = movie.title;
    document.getElementById('result-description').innerText = movie.desc;
    document.getElementById('result-poster').src            = movie.poster;
    document.getElementById('result-box').classList.remove('hidden');
  });
});