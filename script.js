const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const progress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  navMenu.classList.toggle('open', !isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
});

navLinks.forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const sectionIds = ['home', 'about', 'education', 'skills', 'projects', 'experience', 'certifications', 'contact'];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
function updateOnScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  backToTop.classList.toggle('visible', window.scrollY > 500);
  let current = 'home';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 170) current = section.id;
  });
  navLinks.forEach(link => {
    const target = link.getAttribute('href').slice(1);
    link.classList.toggle('active', target === current || (current === 'certifications' && target === 'projects'));
  });
}
window.addEventListener('scroll', updateOnScroll, { passive: true });
window.addEventListener('resize', updateOnScroll);
updateOnScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
document.getElementById('year').textContent = new Date().getFullYear();

// Close the mobile menu with Escape for keyboard users.
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
});
