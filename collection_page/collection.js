const collections = document.querySelectorAll(".box");

collections.forEach((collection, index) => {
  collection.addEventListener('click', function() {
    location.href = `${index}_collection.html`;
  })
})


/*
collections[0].addEventListener('click' , function() {
  alert(0);
})
collections[1].addEventListener('click' , function() {
  alert(1);
})
collections[2].addEventListener('click' , function() {
  alert(2);
})
collections[3].addEventListener('click' , function() {
  alert(3);
})
collections[4].addEventListener('click' , function() {
  alert(4);
})
collections[5].addEventListener('click' , function() {
  alert(5);
})
  */