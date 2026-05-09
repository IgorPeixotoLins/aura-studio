const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const form = document.getElementById("inquiry-form");
const feedback = document.getElementById("form-feedback");

const setHeaderState = () => {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -60px 0px"
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", active);
      });
    });
  },
  {
    threshold: 0.4
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const validations = {
  nome: (value) => (value.trim().length >= 3 ? "" : "Informe seu nome completo."),
  email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? "" : "Digite um e-mail valido."),
  tipo: (value) => (value.trim().length >= 3 ? "" : "Descreva o tipo de projeto."),
  mensagem: (value) => (value.trim().length >= 20 ? "" : "Adicione pelo menos 20 caracteres com contexto do projeto.")
};

const setFieldError = (field, message) => {
  const container = field.closest(".field");
  if (!container) return;
  const errorText = container.querySelector(".error-text");
  if (!errorText) return;
  errorText.textContent = message;
};

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let hasError = false;

    Object.entries(validations).forEach(([name, validate]) => {
      const field = form.elements[name];
      if (!field) return;
      const error = validate(field.value);
      setFieldError(field, error);
      if (error) hasError = true;
    });

    if (hasError) {
      feedback.textContent = "Revise os campos destacados para continuar.";
      feedback.style.color = "#ffb4ab";
      return;
    }

    const nome = form.elements.nome.value.trim();
    const email = form.elements.email.value.trim();
    const tipo = form.elements.tipo.value.trim();
    const mensagem = form.elements.mensagem.value.trim();

    const whatsappMessage = encodeURIComponent(
      `Olá, Studio Aura. Meu nome é ${nome}.` +
        `\nE-mail: ${email}` +
        `\nTipo de projeto: ${tipo}` +
        `\nContexto: ${mensagem}`
    );

    feedback.textContent = "Inquiry validada. Redirecionando para o WhatsApp...";
    feedback.style.color = "#d5af76";

    window.setTimeout(() => {
      window.open(`https://wa.me/5511912345678?text=${whatsappMessage}`, "_blank", "noopener");
      form.reset();
      form.querySelectorAll(".error-text").forEach((el) => {
        el.textContent = "";
      });
      feedback.textContent = "Pronto. Sua mensagem foi preparada no WhatsApp.";
    }, 650);
  });
}
