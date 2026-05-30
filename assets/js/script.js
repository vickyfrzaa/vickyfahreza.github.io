document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".top-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const typedElements = document.querySelectorAll(".typed");
  const sections = document.querySelectorAll("main[id], section[id]");
  const portfolioTagOptions = {
    fullstack: {
      label: "Fullstack",
      selector: ".filter-fullstack"
    },
    backend: {
      label: "Backend & API",
      selector: ".filter-backend"
    },
    frontend: {
      label: "Frontend",
      selector: ".filter-frontend"
    },
    leadership: {
      label: "Leadership",
      selector: ".filter-leadership"
    },
    integration: {
      label: "Integration",
      selector: ".filter-integration"
    },
    database: {
      label: "Database",
      selector: ".filter-database"
    }
  };
  const revealSelectors = [
    ".hero-content > *",
    ".hero-cv-wrap",
    ".social-rail",
    ".scroll-btn",
    ".section-heading > *",
    ".about-profile-card",
    ".about-pill",
    ".about-content h3",
    ".about-content p",
    ".info-card",
    ".skills-pill",
    ".core-skills h4",
    ".skill-item",
    ".resume-tab",
    ".resume-panel-heading > *",
    ".resume-item",
    ".service-item",
    ".portfolio-filters",
    ".portfolio-item",
    ".portfolio-bottom",
    ".portfolio-detail-slider",
    ".portfolio-content > *",
    ".portfolio-info-card",
    ".portfolio-share-card",
    ".portfolio-tags-card",
    ".detail-hero > .container > *",
    ".service-card",
    ".contact-card",
    ".service-overview",
    ".service-image-showcase",
    ".feature-box",
    ".workflow-section",
    ".testimonial-section",
    ".tech-details",
    ".contact-section .info-item",
    ".contact-section .php-email-form",
    ".footer .footer-about",
    ".footer .footer-links",
    ".footer .footer-contact"
  ];

  const revealItems = document.querySelectorAll(revealSelectors.join(","));

  revealItems.forEach(function (item, index) {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 8, 7) * 110}ms`);
  });

  function updateNavbarState() {
    if (!navbar) {
      return;
    }

    const heroPage = document.querySelector(".hero-page");

    if (!heroPage) {
      return;
    }

    navbar.classList.toggle("nav-scrolled", window.scrollY > heroPage.offsetHeight - 90);
  }

  function setActiveLink(targetId) {
    navLinks.forEach(function (item) {
      const isActive = item.getAttribute("href") === `#${targetId}`;
      item.classList.toggle("active", isActive);

      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");
      const isSamePageAnchor = href && href.startsWith("#");
      const target = isSamePageAnchor ? document.querySelector(href) : null;

      if (target) {
        event.preventDefault();
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetTop = target.id === "intro"
          ? 0
          : target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

        window.scrollTo({
          top: Math.max(targetTop, 0),
          behavior: "smooth"
        });

        history.pushState(null, "", href);
        setActiveLink(href.replace("#", ""));
      }

      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      }
    });
  });

  if (document.querySelector(".hero-page")) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.18
    }
  );

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });

  document.querySelectorAll(".purecounter").forEach(function (counter) {
    const start = Number(counter.dataset.purecounterStart || 0);
    const end = Number(counter.dataset.purecounterEnd || 0);
    const duration = Number(counter.dataset.purecounterDuration || 1) * 1000;
    const prefix = counter.dataset.purecounterPrefix || "";
    const suffix = counter.dataset.purecounterSuffix || "";

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return;
    }

    function formatCounterValue(value) {
      return `${prefix}${Math.round(value).toLocaleString("id-ID")}${suffix}`;
    }

    counter.textContent = formatCounterValue(start);

    function runCounter() {
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const value = start + (end - start) * easedProgress;

        counter.textContent = formatCounterValue(value);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = formatCounterValue(end);
        }
      }

      requestAnimationFrame(updateCounter);
    }

    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter();
            counterObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.35
      }
    );

    counterObserver.observe(counter);
  });

  document.querySelectorAll("[data-portfolio-tags]").forEach(function (tagCard) {
    const tagWrap = tagCard.querySelector(".tags");
    const keys = tagCard.dataset.portfolioTags
      .split(",")
      .map(function (tag) {
        return tag.trim().toLowerCase();
      })
      .filter(function (tag) {
        return portfolioTagOptions[tag];
      });

    if (!tagWrap || !keys.length) {
      return;
    }

    const indexPath = window.location.pathname.includes("/portofolio/")
      ? "../index.html"
      : "index.html";

    tagWrap.innerHTML = "";
    keys.forEach(function (key) {
      const tag = portfolioTagOptions[key];
      const link = document.createElement("a");

      link.href = `${indexPath}?filter=${key}#portfolio`;
      link.textContent = tag.label;
      tagWrap.appendChild(link);
    });
  });

  document.querySelectorAll(".isotope-layout").forEach(function (layout) {
    const filters = layout.querySelectorAll(".portfolio-filters li");
    const items = layout.querySelectorAll(".portfolio-item");
    let filterTimer;
    const filterMap = {
      all: "*",
      fullstack: portfolioTagOptions.fullstack.selector,
      frontend: portfolioTagOptions.frontend.selector,
      backend: portfolioTagOptions.backend.selector,
      database: portfolioTagOptions.database.selector,
      leadership: portfolioTagOptions.leadership.selector,
      integration: portfolioTagOptions.integration.selector
    };

    function getPortfolioFilterFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const queryFilter = params.get("filter");

      if (queryFilter) {
        return queryFilter.toLowerCase();
      }

      const hashValue = window.location.hash.split("?")[1];
      if (hashValue) {
        const hashFilter = new URLSearchParams(hashValue).get("filter");

        if (hashFilter) {
          return hashFilter.toLowerCase();
        }
      }

      const storedFilter = sessionStorage.getItem("portfolioFilter");
      if (storedFilter) {
        sessionStorage.removeItem("portfolioFilter");
        return storedFilter.toLowerCase();
      }

      return "";
    }

    function filterPortfolio(selector) {
      const visibleItems = Array.from(items).filter(function (item) {
        return selector === "*" || item.matches(selector);
      });

      window.clearTimeout(filterTimer);
      items.forEach(function (item) {
        item.classList.add("portfolio-filtering");
      });

      filterTimer = window.setTimeout(function () {
        items.forEach(function (item) {
          item.classList.add("portfolio-hidden");
          item.classList.remove("portfolio-filtering");
        });

        visibleItems.forEach(function (item, index) {
          item.classList.remove("portfolio-hidden");
          item.classList.add("portfolio-filtering");
          item.style.setProperty("--reveal-delay", "0ms");

          window.setTimeout(function () {
            item.classList.remove("portfolio-filtering");
          }, 90 + index * 130);
        });
      }, 260);
    }

    filters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        const selector = filter.dataset.filter || "*";

        filters.forEach(function (item) {
          item.classList.remove("filter-active");
        });
        filter.classList.add("filter-active");
        filterPortfolio(selector);
      });
    });

    const urlFilter = getPortfolioFilterFromUrl();
    if (urlFilter && filterMap[urlFilter]) {
      const selector = filterMap[urlFilter];
      const activeFilter = layout.querySelector(`[data-filter="${selector}"]`);

      if (activeFilter) {
        filters.forEach(function (item) {
          item.classList.remove("filter-active");
        });
        activeFilter.classList.add("filter-active");
      }

      window.setTimeout(function () {
        filterPortfolio(selector);

        const portfolioSection = document.querySelector("#portfolio");
        if (portfolioSection) {
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetTop = portfolioSection.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

          window.scrollTo({
            top: Math.max(targetTop, 0),
            behavior: "smooth"
          });
          setActiveLink("portfolio");
        }
      }, 350);
    }
  });

  document.querySelectorAll(".portfolio-tags-card a[href*='filter=']").forEach(function (tagLink) {
    tagLink.addEventListener("click", function () {
      const href = tagLink.getAttribute("href");
      const filterMatch = href && href.match(/[?&]filter=([^#&]+)/);

      if (filterMatch) {
        sessionStorage.setItem("portfolioFilter", decodeURIComponent(filterMatch[1]));
      }
    });
  });

  document.querySelectorAll("[data-contact-form]").forEach(function (form) {
    const loadingMessage = form.querySelector(".loading");
    const errorMessage = form.querySelector(".error-message");
    const sentMessage = form.querySelector(".sent-message");

    function setFormStatus(type, message) {
      [loadingMessage, errorMessage, sentMessage].forEach(function (item) {
        if (item) {
          item.style.display = "none";
        }
      });

      const target = type === "error" ? errorMessage : type === "sent" ? sentMessage : loadingMessage;

      if (target) {
        if (message) {
          target.textContent = message;
        }
        target.style.display = "block";
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const name = formData.get("name")?.trim();
      const email = formData.get("email")?.trim();
      const subject = formData.get("subject")?.trim();
      const message = formData.get("message")?.trim();

      if (!name || !email || !subject || !message) {
        setFormStatus("error", "Please complete all fields before sending your message.");
        return;
      }

      setFormStatus("loading");

      const emailSubject = encodeURIComponent(subject);
      const emailBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      window.setTimeout(function () {
        window.location.href = `mailto:vickyfahreza23@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        setFormStatus("sent");
      }, 350);
    });
  });


  const portfolioLinks = document.querySelectorAll(".portfolio-link");
  if (portfolioLinks.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "portfolio-lightbox";
    lightbox.innerHTML = '<button type="button" aria-label="Close preview">&times;</button><img alt="" />';
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector("button");

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightboxImage.removeAttribute("src");
      document.body.style.overflow = "";
    }

    portfolioLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        lightboxImage.src = link.getAttribute("href");
        lightboxImage.alt = link.closest(".portfolio-card")?.querySelector("img")?.alt || "Portfolio preview";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  document.querySelectorAll(".portfolio-detail-slider").forEach(function (slider) {
    const slides = slider.querySelectorAll(".portfolio-detail-slide");
    const previousButton = slider.querySelector(".portfolio-slider-btn.prev");
    const nextButton = slider.querySelector(".portfolio-slider-btn.next");
    const dotsWrap = slider.querySelector(".portfolio-slider-dots");
    let activeIndex = 0;
    let autoTimer;

    if (!slides.length || !dotsWrap) {
      return;
    }

    slides.forEach(function (_, index) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show portfolio image ${index + 1}`);
      dotsWrap.appendChild(dot);
      dot.addEventListener("click", function () {
        showSlide(index);
        restartAuto();
      });
    });

    const dots = dotsWrap.querySelectorAll("button");

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    function nextSlide() {
      showSlide(activeIndex + 1);
    }

    function restartAuto() {
      window.clearInterval(autoTimer);
      autoTimer = window.setInterval(nextSlide, 4200);
    }

    previousButton?.addEventListener("click", function () {
      showSlide(activeIndex - 1);
      restartAuto();
    });

    nextButton?.addEventListener("click", function () {
      nextSlide();
      restartAuto();
    });

    showSlide(0);
    restartAuto();
  });

  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState, { passive: true });
  window.addEventListener("resize", updateNavbarState);

  typedElements.forEach(function (element) {
    const items = element.dataset.typedItems
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);

    if (!items.length) {
      return;
    }

    let itemIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    function typeText() {
      const currentItem = items[itemIndex];
      const nextText = isDeleting
        ? currentItem.slice(0, letterIndex - 1)
        : currentItem.slice(0, letterIndex + 1);

      element.textContent = nextText;
      letterIndex = nextText.length;

      let delay = isDeleting ? 55 : 95;

      if (!isDeleting && nextText === currentItem) {
        delay = 1500;
        isDeleting = true;
      } else if (isDeleting && nextText === "") {
        isDeleting = false;
        itemIndex = (itemIndex + 1) % items.length;
        delay = 350;
      }

      window.setTimeout(typeText, delay);
    }

    typeText();
  });
});
