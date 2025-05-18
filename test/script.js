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

  document.querySelector('.result-btn').addEventListener('click', () => {
  });
