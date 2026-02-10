/* Neural Morphosis — UI helpers */
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);

  function fmtDate(iso){
    if(!iso) return "";
    // Keep ISO date visible (label aesthetic). You can localize later.
    return iso;
  }

  function syncFooterSafe(){
    const footer = document.querySelector(".footer");
    if(!footer) return;
    // Measure actual rendered footer height (can vary with font rendering / zoom)
    const rect = footer.getBoundingClientRect();
    const h = Math.ceil(rect.height + 6); // + safety pixels
    document.documentElement.style.setProperty("--footer-h", h + "px");
    // Also compute a safe padding so fixed footer never overlays content
    const cs = getComputedStyle(footer);
    const bottomPx = parseFloat(cs.bottom) || 0;
    const safe = Math.ceil(h + bottomPx + 16); // extra breathing room
    document.documentElement.style.setProperty("--footer-safe", safe + "px");
  }

  function setBrand(){
    const data = window.NMData?.get?.();
    if(!data) return;
    const h1 = $("header.brand h1");
    if(h1) h1.textContent = data.brand.title || "NEURAL MORPHOSIS";

    const sub = $("header.brand .subline");
    const tag = $("header.brand .tagline");
    // For index page: .subline and .tagline exist; for subpages .subline is section title.
    // We'll only update when they have data attributes.
    if(sub && sub.dataset.bind === "brand.subtitle") sub.textContent = data.brand.subtitle || "";
    if(tag && tag.dataset.bind === "brand.tagline") tag.textContent = data.brand.tagline || "";
  }

  function setNavLinks(){
    const data = window.NMData?.get?.();
    if(!data) return;
    const map = {
      youtube: data.links.youtube,
      instagram: data.links.instagram,
      tiktok: data.links.tiktok
    };
    Object.entries(map).forEach(([key, href]) => {
      const a = document.querySelector(`[data-link="${key}"]`);
      if(a && href) a.setAttribute("href", href);
    });
  }

  function renderFeatured(){
    const host = document.getElementById("featured");
    if(!host) return;
    const data = window.NMData.get();

    const rel = data.releases.find(r => r.id === data.featured.releaseId) || data.releases[0];
    const vid = data.videos.find(v => v.id === data.featured.videoId) || data.videos[0];

    function card(type, item){
      if(!item) return "";
      const img = type==="release" ? item.cover : item.thumb;
      const link = item.youtube && item.youtube !== "#" ? item.youtube : (type==="release" ? "./releases.html" : "./video.html");
      const title = item.title || (type==="release" ? "Featured Release" : "Featured Video");
      const date = fmtDate(item.date);

      return `
      <article class="feat-card" data-type="${type}">
        <a class="feat-inner" href="${link}" ${link.startsWith("http")?'target="_blank" rel="noopener noreferrer"':''}>
          <img class="feat-img" src="${img}" alt="${title}" loading="lazy"/>
          <div class="feat-meta">
            <div class="feat-kicker">${type === "release" ? "FEATURED RELEASE" : "FEATURED VIDEO"}</div>
            <div class="feat-title">${title}</div>
            <div class="feat-date">${date}</div>
          </div>
        </a>
      </article>`;
    }

    host.innerHTML = `
      <div class="feat-grid">
        ${card("release", rel)}
        ${card("video", vid)}
      </div>
    `;
  }

  function pageIcon(slug){
    const icons = {
      releases: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 7.5A4.5 4.5 0 0 1 10.5 3h7.2A3.3 3.3 0 0 1 21 6.3v11.4A3.3 3.3 0 0 1 17.7 21H10.5A4.5 4.5 0 0 1 6 16.5v-9Z" stroke="currentColor" stroke-width="1.4"/><path d="M6 16.5A3 3 0 0 0 9 19.5h8.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
      video: `<svg viewBox="0 0 24 24" fill="none"><path d="M4.8 7.2A2.4 2.4 0 0 1 7.2 4.8h9.6A2.4 2.4 0 0 1 19.2 7.2v9.6a2.4 2.4 0 0 1-2.4 2.4H7.2a2.4 2.4 0 0 1-2.4-2.4V7.2Z" stroke="currentColor" stroke-width="1.4"/><path d="M10.2 9.1v5.8l5.6-2.9-5.6-2.9Z" fill="currentColor"/></svg>`,
      about: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9Z" stroke="currentColor" stroke-width="1.4"/><path d="M12 11v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M12 8.2h.01" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`,
      merch: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 7.5 5 10v10h14V10l-2-2.5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M7 7.5a5 5 0 0 0 10 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M9 12h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
      support: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.4-9.2-9.1C1.3 8.5 3.2 5.7 6 5.2c1.7-.3 3.4.4 4.4 1.8 1-1.4 2.7-2.1 4.4-1.8 2.8.5 4.7 3.3 3.2 6.7C19 16.6 12 21 12 21Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`
    };
    return icons[slug] || icons.about;
  }

  function renderPageLinks(currentSlug){
    const host = document.getElementById("pageLinks");
    if(!host) return;
    const data = window.NMData?.get?.();
    if(!data || !Array.isArray(data.pages)) return;
    const visible = data.pages.filter(p => p && p.visible).sort((a,b)=> (a.order??999)-(b.order??999));
    host.innerHTML = visible.map(p => {
      const slug = p.slug;
      const href = p.href || `./${slug}.html`;
      const label = p.title || slug;
      const isCurrent = currentSlug && slug === currentSlug;
      return `<a class="link link-page" href="${href}" aria-label="${label}" data-goatcounter-click="nav-page-${slug}" ${isCurrent ? 'aria-current="page"' : ''}><span class="icon" aria-hidden="true">${pageIcon(slug)}</span><span class="label">${label}</span></a>`;
    }).join("");
  }

  
  // Keep fixed footer from overlapping content on any OS/zoom.
  // We measure the actual footer height and feed it into CSS variables.
  function bindFooterSync(){
    syncFooterSafe();
    window.addEventListener("resize", syncFooterSafe, { passive: true });
    window.addEventListener("orientationchange", syncFooterSafe, { passive: true });
    // Fonts can affect height after load
    window.addEventListener("load", () => { setTimeout(syncFooterSafe, 0); setTimeout(syncFooterSafe, 250); });
  }
  bindFooterSync();

window.NMUI = { setBrand, setNavLinks, renderFeatured, renderPageLinks, fmtDate, syncFooterSafe };
})();
