const collections = document.querySelectorAll(".box");

collections.forEach((collection, index) => {
  collection.addEventListener('click', function() {
    location.href = `${index}_collection.html`;
  })
})

