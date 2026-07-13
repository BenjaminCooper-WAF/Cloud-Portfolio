"use strict";

const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (localStorage.getItem("portfolio-theme") === "light") {
  body.classList.add("light");

  if (themeToggle) {
    themeToggle.textContent = "☾";
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light");

    const lightThemeEnabled = body.classList.contains("light");

    themeToggle.textContent = lightThemeEnabled ? "☾" : "☀";

    localStorage.setItem(
      "portfolio-theme",
      lightThemeEnabled ? "light" : "dark"
    );
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}