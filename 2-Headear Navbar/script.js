const container = document.querySelector(".container");
const heading = document.querySelector(".heading");
const closeNav = document.querySelector(".close");
const items = document.querySelectorAll(".item");

// fungsi Sidebar
function showSideBar(e) {
  if (e.target.classList.toggle(".close")) {
    heading.style.flexDirection = "column";
    e.target.innerText = "arrow_forward_ios";
    container.style.width = "75px";
  } else {
    heading.style.flexDirection = "row";
    e.target.innerText = "arrow_back_ios";
    container.style.width = "100%";
  }
}

// Fungsi mengilangkan keterangan Icon
function closeItems() {
  items.forEach((e) => {
    const parentE = e.parentElement;
    if (!e.classList.toggle("inline")) {
      e.style.display = "inline";
      parentE.style.width = "95%";
      parentE.style.borderRadius = "1em";
    } else {
      e.style.display = "none";
      parentE.style.width = "55px";
      parentE.style.borderRadius = ".2em";
      console.log(parentE);
    }
  });
}

closeNav.addEventListener("click", (e) => {
  // Untuk menutup / buka sideBarnya
  showSideBar(e);
  // Untuk hanya Icon item yang tampil
  closeItems();
});
