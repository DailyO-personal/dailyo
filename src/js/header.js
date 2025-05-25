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
