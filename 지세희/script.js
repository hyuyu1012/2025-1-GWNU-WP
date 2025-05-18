const slider = document.querySelector('.slides');
let index = 0;

function showNextSlide() {
  index = (index + 1) % 3;
  slider.style.transform = `translateX(-${index * 100}%)`;
}

setInterval(showNextSlide, 4000);