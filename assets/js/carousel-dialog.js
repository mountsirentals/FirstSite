// Centralized carousel logic for multiple carousels
function setupCarousel(trackId) {
  const track = document.getElementById(trackId);
  const dotsContainer = track.nextElementSibling;
  const dots = dotsContainer.querySelectorAll('.dot');
  const slides = track.querySelectorAll('.carousel-slide img');
  let index = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent navigation to top
      index = i;
      updateCarousel();
    });
  });

  // Dialog logic for image preview with navigation
  slides.forEach((img, i) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent navigation to top when opening dialog
      showDialogImage(Array.from(slides), i);
      // Prevent scroll to top when opening dialog
      const scrollY = window.scrollY;
      imageDialog.showModal();
      window.scrollTo({ top: scrollY });
    });
  });

  updateCarousel();
}

// Dialog logic (shared)
const imageDialog = document.getElementById('imageDialog');
const dialogImg = document.getElementById('dialogImg');
const dialogDots = document.getElementById('dialogDots');
let currentDialogImages = [];
let currentDialogIndex = 0;

function renderDialogDots(images, activeIdx) {
  dialogDots.innerHTML = '';
  images.forEach((img, i) => {
    const dot = document.createElement('span');
    dot.style.cssText = `
      display:inline-block;
      width:12px;
      height:12px;
      border-radius:50%;
      background:${i === activeIdx ? '#fff' : '#888'};
      cursor:pointer;
      border:2px solid #fff;
      box-sizing:border-box;
    `;
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      showDialogImage(images, i);
    });
    dialogDots.appendChild(dot);
  });
}

function showDialogImage(images, idx) {
  currentDialogImages = images;
  currentDialogIndex = idx;
  dialogImg.src = images[idx].src;
  dialogImg.alt = images[idx].alt;
  renderDialogDots(images, idx);
}

// Close dialog when clicking outside image
imageDialog.addEventListener('click', (e) => {
  if (e.target === imageDialog) imageDialog.close();
});

// Keyboard navigation for dialog
imageDialog.addEventListener('keydown', (e) => {
  if (!imageDialog.open) return;
  if (e.key === 'ArrowLeft') {
    if (currentDialogImages.length > 0) {
      let prev = (currentDialogIndex - 1 + currentDialogImages.length) % currentDialogImages.length;
      showDialogImage(currentDialogImages, prev);
    }
  }
  if (e.key === 'ArrowRight') {
    if (currentDialogImages.length > 0) {
      let next = (currentDialogIndex + 1) % currentDialogImages.length;
      showDialogImage(currentDialogImages, next);
    }
  }
  if (e.key === 'Escape') {
    imageDialog.close();
  }
});

// Setup both carousels after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setupCarousel('carouselTrack');
  setupCarousel('carouselTrack1');
});
