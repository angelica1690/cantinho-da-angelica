(() => {
  const menuButton = document.querySelector("[data-menu-button]");
  const siteNav = document.querySelector("[data-site-nav]");

  function closeMenu() {
    if (!menuButton || !siteNav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".sr-only").textContent = "Abrir menu";
    siteNav.classList.remove("is-open");
  }

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", () => {
      const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(willOpen));
      menuButton.querySelector(".sr-only").textContent = willOpen ? "Fechar menu" : "Abrir menu";
      siteNav.classList.toggle("is-open", willOpen);
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        closeMenu();
        menuButton.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const projects = [...document.querySelectorAll("[data-status]")];
  const emptyState = document.querySelector("[data-empty-state]");

  function filterProjects(filter) {
    let visibleProjects = 0;

    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });

    projects.forEach((project) => {
      const shouldShow = filter === "todos" || project.dataset.status === filter;
      project.hidden = !shouldShow;
      if (shouldShow) visibleProjects += 1;
    });

    if (emptyState) {
      emptyState.style.display = visibleProjects ? "none" : "block";
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => filterProjects(button.dataset.filter));
  });

  const pixCode = document.querySelector("[data-pix-code]");
  const pixCopyButton = document.querySelector("[data-pix-copy]");
  const pixStatus = document.querySelector("[data-pix-status]");

  if (pixCode && pixCopyButton && pixStatus) {
    pixCopyButton.addEventListener("click", async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(pixCode.value);
        } else {
          pixCode.focus();
          pixCode.select();
          if (!document.execCommand("copy")) throw new Error("Cópia não permitida");
        }
        pixStatus.textContent = "Código Pix copiado. Confira os dados no seu banco antes de confirmar.";
      } catch {
        pixCode.focus();
        pixCode.select();
        pixStatus.textContent = "Não foi possível copiar automaticamente. Copie o código selecionado acima.";
      }
    });
  }

  const lightbox = document.querySelector("[data-image-lightbox]");
  const galleryButtons = [...document.querySelectorAll("[data-gallery-src]")];

  if (lightbox && galleryButtons.length) {
    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    let returnFocusTo = null;

    function closeLightbox() {
      lightbox.close();
    }

    galleryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        returnFocusTo = button;
        lightboxImage.src = button.dataset.gallerySrc;
        lightboxImage.alt = button.dataset.galleryAlt;
        lightboxCaption.textContent = button.dataset.galleryCaption;
        lightbox.showModal();
      });
    });

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("close", () => {
      lightboxImage.src = "";
      if (returnFocusTo) returnFocusTo.focus();
    });
  }
})();
