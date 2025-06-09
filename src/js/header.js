const menuItems = [
  { name: "Home", link: "#" },
  { name: "Weather", link: "#" },
  { name: "Recipes", link: "#" },
  { name: "News", link: "#" },
];

const navLinks = document.getElementById("nav-links");

menuItems.forEach((item) => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.textContent = item.name;
  a.href = item.link;
  li.appendChild(a);
  navLinks.appendChild(li);
  a.classList.add("nav-item");
});

const toggleBtn = document.getElementById("menu-toggle");
toggleBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
const themeBtn = document.getElementById("theme-toggle");
const themeIcon = themeBtn.querySelector("i");

// Tema durumu yerel depodan alınır
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeIcon.classList.replace("fa-moon", "fa-sun");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  const isLight = document.body.classList.contains("light-mode");

  
  if (isLight) {
    themeIcon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "light");
  } else {
    themeIcon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "dark");
  }
});
