const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/*==============================
      TOAST HELPER
==============================*/
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message){

  if(!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);

}

/*==============================
      NAV — scroll shrink + active link
==============================*/
const nav = document.getElementById("nav");
const sections = document.querySelectorAll("main section[id], .hero[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

  if(nav){
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }

  let current = "";

  sections.forEach(section => {

    const top = section.offsetTop - 160;

    if(window.scrollY >= top){
      current = section.getAttribute("id");
    }

  });

  navLinks.forEach(link => {

    link.classList.remove("active");

    if(link.getAttribute("href") === "#" + current){
      link.classList.add("active");
    }

  });

});

/*==============================
      MOBILE MENU
==============================*/
const menuToggle = document.getElementById("menuToggle");
const navLinksList = document.getElementById("navLinks");

if(menuToggle && navLinksList){

  menuToggle.addEventListener("click", () => {

    const isOpen = navLinksList.classList.toggle("active");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));

  });

  document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {
      navLinksList.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });

  });

  document.addEventListener("keydown", (e) => {

    if(e.key === "Escape" && navLinksList.classList.contains("active")){
      navLinksList.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }

  });

}

/*==============================
      PROGRESS BAR
==============================*/
const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {

  if(!progressBar) return;

  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = percent + "%";

});

/*==============================
      REVEAL ON SCROLL
==============================*/
const revealElements = document.querySelectorAll(".reveal");

if(prefersReducedMotion){

  revealElements.forEach(el => el.classList.add("in-view"));

} else {

  const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }

    });

  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

}

/*==============================
      TYPED "WORLDS" LINE
==============================*/
const typedEl = document.getElementById("typedWorlds");
const worlds = ["hospitality", "gaming", "aviation", "coffee", "automotive"];

function typeWorlds(){

  if(!typedEl) return;

  if(prefersReducedMotion){
    typedEl.textContent = worlds.join(" \u00B7 ");
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick(){

    const current = worlds[wordIndex];

    if(!deleting){

      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);

      if(charIndex === current.length){
        deleting = true;
        setTimeout(tick, 1300);
        return;
      }

    } else {

      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);

      if(charIndex === 0){
        deleting = false;
        wordIndex = (wordIndex + 1) % worlds.length;
      }

    }

    setTimeout(tick, deleting ? 45 : 90);

  }

  tick();

}

typeWorlds();

/*==============================
      BACK TO TOP
==============================*/
const backToTop = document.getElementById("backToTop");

if(backToTop){

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 600);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

}

/*==============================
      CONTACT FORM
      Submits to Formspree (https://formspree.io).
      Replace YOUR_FORM_ID in index.html's form
      action attribute with your real Formspree
      form ID before this will actually deliver mail.
==============================*/
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if(contactForm){

  contactForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if(!name || !email || !message){
      formMsg.textContent = "Please fill in every field.";
      return;
    }

    const submitBtn = contactForm.querySelector(".form-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending\u2026";
    formMsg.textContent = "";

    try{

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      });

      if(response.ok){

        formMsg.textContent = "Thanks — your message is on its way. I'll get back to you soon.";
        showToast("Message sent!");
        contactForm.reset();

      } else {

        formMsg.textContent = "Something went wrong — please email me directly instead.";
        showToast("Couldn't send — try email instead");

      }

    } catch(err){

      formMsg.textContent = "Something went wrong — please email me directly instead.";
      showToast("Couldn't send — try email instead");

    } finally {

      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";

    }

  });

}
