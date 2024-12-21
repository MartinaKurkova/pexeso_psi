const hamMenu = document.querySelector(".menu__hamburger");
const menu = document.querySelector(".menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active"); // Animace hamburger menu
  menu.classList.toggle("menu--hidden");
  menu.classList.toggle("menu--visible");
});
