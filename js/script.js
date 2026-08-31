/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenuButton = document.getElementById("mobileMenuButton");

const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("open");

    const icon = mobileMenuButton.querySelector("i");

    if (mobileMenu.classList.contains("open")) {
      icon.classList.remove("bi-list");

      icon.classList.add("bi-x");
    } else {
      icon.classList.remove("bi-x");

      icon.classList.add("bi-list");
    }
  });

  /* Close mobile menu after clicking */

  const mobileLinks = mobileMenu.querySelectorAll("a");

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");

      const icon = mobileMenuButton.querySelector("i");

      icon.classList.remove("bi-x");

      icon.classList.add("bi-list");
    });
  });
}

/* =========================================================
   CURRENT YEAR
========================================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* =========================================================
   SIMPLE SCROLL ANIMATION
========================================================= */

const animatedElements = document.querySelectorAll(
  ".category-card, .product-card, .why-card",
);

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";

        entry.target.style.transform = "translateY(0)";

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  },
);

animatedElements.forEach(function (element) {
  element.style.opacity = "0";

  element.style.transform = "translateY(20px)";

  element.style.transition = "opacity 0.6s ease, transform 0.6s ease";

  observer.observe(element);
});
