const container = document.querySelector(".container");
const heading = document.querySelector(".heading");
const closeNav = document.querySelector(".close");
const items = document.querySelectorAll(".item");
const menu = document.querySelector(".menu");
const listProfil = document.querySelector(".list-profil");
const listMenu = document.querySelector(".list-menu");

menu.addEventListener("click", () => {
  listProfil.classList.toggle("tutup");
  listMenu.classList.toggle("tutup");
});
