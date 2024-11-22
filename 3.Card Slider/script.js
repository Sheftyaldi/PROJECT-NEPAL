const swiper = new Swiper(".swiper", {
  // Optional parameters
  loop: true,
  spaceBetween: 30,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerview: 1,
    },
    768: {
      slidesPerview: 2,
    },
    1028: {
      slidesPerview: 3,
    },
  },
});
