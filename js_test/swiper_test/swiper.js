const mySwiper = new Swiper('.swiper-container', {
  // 옵션 
  direction : 'horizontal',
  loop: 'true',
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