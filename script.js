// ========================================
// PRODUCT SETTINGS — EDIT PRODUCTS HERE
// ========================================
const products = [
  {
    name: "Glitter Set",
    category: "Glitter Set",
    description: "Ultra-fine cosmetic glitter with a soft pearl finish.",
    price: "2700 MKD",
    image: "image1.JPG"
  },
  {
    name: "Glitter per piece",
    category: "Glitter",
    description: "Mirror chrome pigment for a liquid-metal effect.",
    price: "450 MKD",
    image: "image2.JPG"
  },
  {
    name: "Glitter per piece",
    category: "Glitter",
    description: "Lightweight gel with suspended micro-glitter.",
    price: "450 MKD",
    image: "image3.JPG"
  },
  {
    name: "Glitter per piece",
    category: "Glitter",
    description: "Weightless pearl dust for a luminous veil.",
    price: "450 MKD",
    image: "image4.JPG"
  },
  {
    name: "Glitter per piece",
    category: "Glitter",
    description: "Five-piece set of graduated flake sizes.",
    price: "450 MKD",
    image: "image5.JPG"
  }
];

// ========================================
// GALLERY IMAGES — EDIT IMAGES HERE
// ========================================
const galleryImages = [
  "image6.JPG",
  "image7.JPG",
  "image8.JPG",
  "image9.JPG"
];

// ========================================
// HERO & VIDEO — EDIT PATHS HERE
// ========================================
const heroImage = "images/hero.jpg";
const videoSource = "videos/glitter-video.mp4";

// ========================================
// APP LOGIC
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initNavigation();
  initFeaturedProducts();
  initAllProducts();
  initGallery();
  initVideo();
  initModal();
  initLightbox();
  initParticles();
  initScrollHeader();
});

function initHero() {
  const bg = document.getElementById('hero-bg');
  if (bg) {
    bg.style.backgroundImage = `url('${heroImage}')`;
  }
}

function initVideo() {
  const source = document.getElementById('video-source');
  const video = document.getElementById('promo-video');
  if (source) source.src = videoSource;
  if (video) video.load();
}

function initNavigation() {
  const links = document.querySelectorAll('[data-nav]');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      showPage(target);
      if (mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Hash support
  const hash = window.location.hash.replace('#', '');
  if (hash && ['home', 'products', 'about', 'contact'].includes(hash)) {
    showPage(hash);
  }
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) page.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('data-nav') === id);
  });

  history.replaceState(null, '', '#' + id);
}

function createProductCard(product, index) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.index = index;
  card.innerHTML = `
    <div class="product-card-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.opacity='0.3'">
    </div>
    <p class="product-card-category">${product.category}</p>
    <h3 class="product-card-name">${product.name}</h3>
    <p class="product-card-desc">${product.description}</p>
    <p class="product-card-price">${product.price}</p>
  `;
  card.addEventListener('click', () => openModal(product));
  return card;
}

function initFeaturedProducts() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  // First 5 products as featured
  products.slice(0, 5).forEach((p, i) => {
    grid.appendChild(createProductCard(p, i));
  });
}

function initAllProducts() {
  const grid = document.getElementById('all-products-grid');
  const countEl = document.getElementById('products-count');
  const filtersEl = document.getElementById('category-filters');
  const searchInput = document.getElementById('product-search');
  if (!grid) return;

  const categories = ['All', ...new Set(products.map(p => p.category))];
  let activeCategory = 'All';
  let searchTerm = '';

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeCategory = cat;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
    filtersEl.appendChild(btn);
  });

  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderProducts();
  });

  function renderProducts() {
    grid.innerHTML = '';
    const filtered = products.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });

    countEl.textContent = `${filtered.length} piece${filtered.length !== 1 ? 's' : ''} across ${new Set(products.map(p => p.category)).size} categories.`;

    filtered.forEach((p, i) => {
      grid.appendChild(createProductCard(p, products.indexOf(p)));
    });
  }

  renderProducts();
}

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  galleryImages.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${src}" alt="Gallery image ${i + 1}" loading="lazy" onerror="this.parentElement.style.display='none'">`;
    item.addEventListener('click', () => openLightbox(src));
    grid.appendChild(item);
  });
}

function initModal() {
  const overlay = document.getElementById('product-modal');
  const closeBtn = document.getElementById('modal-close');
  const qtyInput = document.getElementById('quantity');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  qtyMinus.addEventListener('click', () => {
    const v = parseInt(qtyInput.value, 10) || 1;
    if (v > 1) qtyInput.value = v - 1;
  });
  qtyPlus.addEventListener('click', () => {
    const v = parseInt(qtyInput.value, 10) || 1;
    if (v < 99) qtyInput.value = v + 1;
  });
}

function openModal(product) {
  document.getElementById('modal-img').src = product.image;
  document.getElementById('modal-img').alt = product.name;
  document.getElementById('modal-category').textContent = product.category;
  document.getElementById('modal-name').textContent = product.name;
  document.getElementById('modal-desc').textContent = product.description;
  document.getElementById('modal-price').textContent = product.price;
  document.getElementById('quantity').value = 1;
  document.getElementById('product-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('product-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });
}

function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function initScrollHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* Subtle particle effect for hero (matches reference sparkle feel) */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h, animationId;

  function resize() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(60, Math.floor((w * h) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.15
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });
    animationId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}
