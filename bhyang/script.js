const root = document.documentElement;
const header = document.querySelector(".site-header");
const toggle = document.querySelector(".theme-toggle");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const storedTheme = localStorage.getItem("theme");
if (storedTheme === "light" || storedTheme === "dark") {
  root.dataset.theme = storedTheme;
}

const updateToggleState = () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  toggle.setAttribute("aria-pressed", String(dark));
};

toggle.addEventListener("click", () => {
  const currentlyDark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const nextTheme = currentlyDark ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  updateToggleState();
});

const setHeaderState = () => {
  header.dataset.elevated = String(window.scrollY > 16);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-28% 0px -55% 0px",
    threshold: [0.1, 0.3, 0.6],
  }
);

sections.forEach((section) => sectionObserver.observe(section));
window.addEventListener("scroll", setHeaderState, { passive: true });
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateToggleState);

setHeaderState();
updateToggleState();
