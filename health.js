document.addEventListener("DOMContentLoaded", () => {
  console.log("Welcome to Curely Healthcare!");

  // =========================
  // MOBILE NAVIGATION
  // =========================

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");

    const closeMenu = () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle("active");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
    };

    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !menuToggle.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  // =========================
  // DARK MODE
  // =========================

  const themeToggle = document.getElementById("theme-toggle");

  const updateThemeButton = () => {
    if (!themeToggle) return;

    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark ? "☀️" : "🌙";

    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
  };

  try {
    const savedTheme = localStorage.getItem("curely-theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  } catch (error) {
    console.warn("Theme preference could not be loaded.", error);
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";

      try {
        localStorage.setItem("curely-theme", theme);
      } catch (error) {
        console.warn("Theme preference could not be saved.", error);
      }

      updateThemeButton();
    });
  }

  // =========================
  // SCROLL REVEAL
  // =========================

  const hiddenElements = document.querySelectorAll(".hidden");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    hiddenElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    hiddenElements.forEach((element) => {
      element.classList.add("show");
    });
  }

  // =========================
  // ANIMATED STATISTICS
  // =========================

  const counters = document.querySelectorAll(".counter");
  const statsSection = document.querySelector(".stats");

  const animateCounter = (counter) => {
    if (counter.dataset.animated === "true") return;

    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target) || target < 0) return;

    counter.dataset.animated = "true";

    const duration = 1500;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      counter.textContent = Math.floor(target * easedProgress).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if (statsSection && counters.length > 0) {
    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              counters.forEach(animateCounter);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 },
      );

      statsObserver.observe(statsSection);
    } else {
      counters.forEach(animateCounter);
    }
  }

  // =========================
  // APPOINTMENT FORM
  // =========================

  const form = document.getElementById("appointment-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      alert(
        "Thank you for your interest in Curely!\n\n" +
          "This is a demo form, so your appointment has not been booked.\n\n" +
          "Please contact the clinic directly to arrange an appointment.",
      );

      form.reset();
    });
  }

  // =========================
  // AUTOMATIC FOOTER YEAR
  // =========================

  const footerYear = document.querySelector("[data-current-year]");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});
