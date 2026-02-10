/* Neural Morphosis — grid renderer for Releases / Video (no-scroll, paging) */
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);

  function computePerPage(type){
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Base columns
    const cols = w >= 1180 ? 4 : w >= 920 ? 3 : w >= 640 ? 2 : 1;

    // Rows depend on height (no-scroll guarantee)
    let rows = 2;
    if(h < 740) rows = 1;
    if(h < 560) rows = 1;

    // Very small height: still keep 1 row, 1 col on phones
    const per = Math.max(1, cols * rows);
    // Video tends to be heavier visually → allow fewer on tiny screens
    if(type === "video" && h < 640) return Math.max(1, Math.min(per, cols * 1));
    return per;
  }

  function fmtDate(iso){
    return (window.NMUI?.fmtDate?.(iso)) || iso || "";
  }

  function renderPage(type){
    const data = window.NMData.get();
    const list = type === "release" ? data.releases : data.videos;

    const grid = $("#grid");
    const prevBtn = $("#prev");
    const nextBtn = $("#next");
    const pageInfo = $("#pageInfo");
    const dots = $("#dots");

    let page = 0;
    let perPage = computePerPage(type);

    function cardHTML(item){
      const img = type === "release" ? item.cover : item.thumb;
      const title = item.title || (type === "release" ? "Untitled release" : "Untitled video");
      const date = fmtDate(item.date);

      const links = [];
      if(type === "release"){
        if(item.youtube && item.youtube !== "#") links.push(`<a class="mini" href="${item.youtube}" target="_blank" rel="noopener noreferrer">YouTube</a>`);
        if(item.spotify && item.spotify !== "#") links.push(`<a class="mini" href="${item.spotify}" target="_blank" rel="noopener noreferrer">Spotify</a>`);
        if(item.bandcamp && item.bandcamp !== "#") links.push(`<a class="mini" href="${item.bandcamp}" target="_blank" rel="noopener noreferrer">Bandcamp</a>`);
      } else {
        if(item.youtube && item.youtube !== "#") links.push(`<a class="mini" href="${item.youtube}" target="_blank" rel="noopener noreferrer">Watch</a>`);
      }

      return `
      <article class="card">
        <div class="media">
          <img src="${img}" alt="${title}" loading="lazy"/>
        </div>
        <div class="meta">
          <div class="title">${title}</div>
          <div class="date">${date}</div>
          <div class="actions">${links.join("") || `<span class="hint">Add links in Admin</span>`}</div>
        </div>
      </article>`;
    }

    function renderDots(totalPages){
      dots.innerHTML = "";
      if(totalPages <= 1) return;
      for(let i=0;i<totalPages;i++){
        const b = document.createElement("button");
        b.className = "dot";
        b.type = "button";
        b.setAttribute("aria-label", `Go to page ${i+1}`);
        if(i===page) b.setAttribute("aria-current","true");
        b.addEventListener("click", () => { page = i; render(); });
        dots.appendChild(b);
      }
    }

    function render(){
      perPage = computePerPage(type);
      const totalPages = Math.max(1, Math.ceil(list.length / perPage));
      page = Math.min(page, totalPages - 1);

      const start = page * perPage;
      const items = list.slice(start, start + perPage);

      grid.style.setProperty("--cols", (window.innerWidth >= 1180 ? 4 : window.innerWidth >= 920 ? 3 : window.innerWidth >= 640 ? 2 : 1));
      grid.innerHTML = items.map(cardHTML).join("");

      prevBtn.disabled = page === 0;
      nextBtn.disabled = page === totalPages - 1;

      pageInfo.textContent = `Page ${page+1} / ${totalPages} — ${items.length} item(s)`;
      renderDots(totalPages);
    }

    prevBtn.addEventListener("click", () => { page = Math.max(0, page-1); render(); });
    nextBtn.addEventListener("click", () => { page = page+1; render(); });

    window.addEventListener("resize", render);
    window.addEventListener("keydown", (e) => {
      if(e.key === "ArrowLeft" && !prevBtn.disabled) prevBtn.click();
      if(e.key === "ArrowRight" && !nextBtn.disabled) nextBtn.click();
      if(e.key === "Home"){ page=0; render(); }
      if(e.key === "End"){ page = Math.max(0, Math.ceil(list.length/perPage)-1); render(); }
    });

    render();
  }

  window.NMGrid = { renderPage };
})();
