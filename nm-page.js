/* NM — simple renderer for About / Merch / Support pages */
(function(){
  const $ = (s,r=document)=>r.querySelector(s);

  function esc(s){
    return String(s??"")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");
  }

  function toParas(text){
    const chunks = esc(text).split(/
\s*
/).map(t=>t.strip? t.strip(): t).map(t=>String(t).trim()).filter(Boolean);
    return chunks.map(p=>`<p>${p.replace(/
/g,"<br>")}</p>`).join("");
  }

  function renderSupportButtons(data){
    const host = document.getElementById("supportButtons");
    if(!host) return;
    const s = data.support || {};
    const buttons = [
      ["Ko-fi", s.kofi],
      ["BuyMeACoffee", s.buymeacoffee],
      ["Patreon", s.patreon],
      ["PayPal", s.paypal]
    ].filter(([,href]) => href && href !== "#");
    if(!buttons.length){ host.innerHTML = ""; return; }
    host.innerHTML = buttons.map(([label,href]) =>
      `<a class="link link-page" href="${href}" target="_blank" rel="noopener noreferrer"><span class="label">${label}</span></a>`
    ).join("");
  }

  async function boot(slug){
    await window.NMData.load();
    window.NMUI.setBrand();
    window.NMUI.setNavLinks();
    window.NMUI.renderPageLinks(slug);

    const data = window.NMData.get();
    const content = (data.pagesContent && data.pagesContent[slug]) || { title: slug, body: "" };

    const h = $("#pageTitle");
    const b = $("#pageBody");
    if(h) h.textContent = content.title || slug;
    if(b) b.innerHTML = toParas(content.body || "");

    if(slug === "support") renderSupportButtons(data);
  }

  window.NMPage = { boot };
})();
