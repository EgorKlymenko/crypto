function toggleDescription(id) {
    var description = document.getElementById("description-" + id);
    description.classList.toggle("show");
}

function redirectToTablePage() {
    window.location.href = 'html/table.html';
}

function redirectToGraphPage() {
    window.location.href = 'html/index.html';
}

let slideIndex = 1;
showSlides(slideIndex);

setInterval(function() {
    plusSlides(1);
}, 5000);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'block';
}