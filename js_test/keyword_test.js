const apiKey='592c72e8e39159933cbebc58d0947536';
const keyword = "revenge";

const keywordNames = [
  "Horror Atmosphere",       // 공포 분위기
  "Comedy",                  // 코미디
  "Romance / Love",          // 로맨스 / 사랑
  "Drama",                   // 드라마
  "Mystery",                 // 미스터리
  "Action",                  // 액션
  "Thriller",                // 스릴러
  "Zombie",                  // 좀비
  "Vampire",                 // 뱀파이어
  "Ghost",                   // 유령
  "Supernatural Phenomena", // 초자연적 현상
  "Haunted House",           // 귀신 들린 집
  "Love Triangle",           // 삼각관계
  "Romantic Comedy",         // 로맨틱 코미디
  "Coming of Age",           // 성장 이야기
  "Friendship",              // 우정
  "First Love",              // 첫사랑
  "World War II",           // 제2차 세계대전
  "World War I",            // 제1차 세계대전
  "Historical Drama",        // 역사드라마
  "Based on a True Story",   // 실화 기반
  "Superhero",               // 슈퍼히어로
  "Martial Arts",            // 무술
  "Assassin",                // 암살자
  "Chase",                   // 추격전
  "Revenge"                  // 복수
];

keywordNames.forEach(keyword => {
  const url = `https://api.themoviedb.org/3/search/keyword?api_key=${apiKey}&query=${keyword}`;
  fetch(url)
  .then(res => res.json())
  .then(data => {
    const exactMatch = data.results.filter(k => k.name.toLowerCase() === keyword.toLowerCase());
    console.log(exactMatch); 
  });
});


