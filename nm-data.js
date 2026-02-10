/* Neural Morphosis — data layer (static site, no backend)
   GitHub Pages workflow:
   - Public site reads ./site-data.json
   - Local admin uses localStorage override + Export JSON
   - To publish changes: replace site-data.json in your repo
*/
(function(){
  const OVERRIDE_KEY = "NM_SITE_OVERRIDE_V1";
  let current = null;

  const defaults = {
  "brand": {
    "title": "NEURAL MORPHOSIS",
    "subtitle": "Gothic rock / darkwave project",
    "tagline": "Synthetic soul. Heavy heart."
  },
  "pages": [
    {
      "slug": "releases",
      "title": "Releases",
      "href": "./releases.html",
      "visible": true,
      "order": 10
    },
    {
      "slug": "video",
      "title": "Video",
      "href": "./video.html",
      "visible": true,
      "order": 20
    },
    {
      "slug": "about",
      "title": "About",
      "href": "./about.html",
      "visible": false,
      "order": 30
    },
    {
      "slug": "merch",
      "title": "Merch",
      "href": "./merch.html",
      "visible": false,
      "order": 40
    },
    {
      "slug": "support",
      "title": "Support",
      "href": "./support.html",
      "visible": false,
      "order": 50
    }
  ],
  "links": {
    "youtube": "https://www.youtube.com/@NEURALMORPHOSIS",
    "instagram": "https://www.instagram.com/neuralmorphosis/",
    "tiktok": "https://www.tiktok.com/@neuralmorphosis"
  },
  "support": {
    "kofi": "#",
    "buymeacoffee": "#",
    "patreon": "#",
    "paypal": "#"
  },
  "pagesContent": {
    "about": {
      "title": "About",
      "body": "NEURAL MORPHOSIS is a dark music project focused on atmospheric gothic rock and related dark sound.\n\nMelancholic, heavy, or minimal — always restrained, slow, and immersive.\n\nSynthetic soul. Heavy heart."
    },
    "merch": {
      "title": "Merch",
      "body": "Merch page is coming soon.\n\nAdd store links in Admin when ready."
    },
    "support": {
      "title": "Support",
      "body": "If you want to support the project, choose a platform below.\n\nThank you for keeping the signal alive."
    }
  },
  "featured": {
    "releaseId": "rel-01",
    "videoId": "vid-01"
  },
  "releases": [
    {
      "id": "rel-01",
      "title": "Release Title 01",
      "date": "2026-02-02",
      "cover": "./covers/cover_01.png",
      "youtube": "#",
      "spotify": "#",
      "bandcamp": "#"
    },
    {
      "id": "rel-02",
      "title": "Release Title 02",
      "date": "2026-02-07",
      "cover": "./covers/cover_02.png",
      "youtube": "#",
      "spotify": "#",
      "bandcamp": "#"
    },
    {
      "id": "rel-03",
      "title": "Release Title 03",
      "date": "2026-02-14",
      "cover": "./covers/cover_03.png",
      "youtube": "#",
      "spotify": "#",
      "bandcamp": "#"
    },
    {
      "id": "rel-04",
      "title": "Release Title 04",
      "date": "2026-02-21",
      "cover": "./covers/cover_04.png",
      "youtube": "#",
      "spotify": "#",
      "bandcamp": "#"
    },
    {
      "id": "rel-05",
      "title": "Release Title 05",
      "date": "2026-02-28",
      "cover": "./covers/cover_05.png",
      "youtube": "#",
      "spotify": "#",
      "bandcamp": "#"
    },
    {
      "id": "rel-06",
      "title": "Release Title 06",
      "date": "2026-03-07",
      "cover": "./covers/cover_06.png",
      "youtube": "#",
      "spotify": "#",
      "bandcamp": "#"
    }
  ],
  "videos": [
    {
      "id": "vid-01",
      "title": "Video Title 01",
      "date": "2026-02-02",
      "thumb": "./thumbs/thumb_01.png",
      "youtube": "#"
    },
    {
      "id": "vid-02",
      "title": "Video Title 02",
      "date": "2026-02-07",
      "thumb": "./thumbs/thumb_02.png",
      "youtube": "#"
    },
    {
      "id": "vid-03",
      "title": "Video Title 03",
      "date": "2026-02-14",
      "thumb": "./thumbs/thumb_03.png",
      "youtube": "#"
    },
    {
      "id": "vid-04",
      "title": "Video Title 04",
      "date": "2026-02-21",
      "thumb": "./thumbs/thumb_04.png",
      "youtube": "#"
    },
    {
      "id": "vid-05",
      "title": "Video Title 05",
      "date": "2026-02-28",
      "thumb": "./thumbs/thumb_05.png",
      "youtube": "#"
    },
    {
      "id": "vid-06",
      "title": "Video Title 06",
      "date": "2026-03-07",
      "thumb": "./thumbs/thumb_06.png",
      "youtube": "#"
    }
  ]
};

  function safeParse(str){
    try { return JSON.parse(str); } catch(_) { return null; }
  }

  function deepMerge(base, patch){
    if (patch == null || typeof patch !== "object") return base;
    const out = Array.isArray(base) ? base.slice() : { ...base };
    for (const k of Object.keys(patch)){
      const pv = patch[k];
      const bv = base ? base[k] : undefined;
      if (Array.isArray(pv)) out[k] = pv;
      else if (pv && typeof pv === "object") out[k] = deepMerge(bv && typeof bv === "object" ? bv : {}, pv);
      else out[k] = pv;
    }
    return out;
  }

  function get(){
    if(current) return current;
    const ov = safeParse(localStorage.getItem(OVERRIDE_KEY) || "");
    current = ov ? deepMerge(defaults, ov) : defaults;
    return current;
  }

  function setOverride(data){
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(data));
    current = deepMerge(defaults, data);
  }

  function resetOverride(){
    localStorage.removeItem(OVERRIDE_KEY);
    current = null;
  }

  async function load(){
    let base = defaults;
    const isHttp = (location.protocol === "http:" || location.protocol === "https:");
    if(isHttp){
      try{
        const res = await fetch("./site-data.json", { cache: "no-store" });
        if(res.ok){
          const json = await res.json();
          base = deepMerge(defaults, json);
        }
      }catch(_){}
    }
    const ov = safeParse(localStorage.getItem(OVERRIDE_KEY) || "");
    current = ov ? deepMerge(base, ov) : base;
    return current;
  }

  function exportJSON(){
    return JSON.stringify(get(), null, 2);
  }

  function importJSON(jsonStr){
    const parsed = safeParse(jsonStr);
    if(!parsed) throw new Error("Invalid JSON");
    setOverride(deepMerge(defaults, parsed));
    return get();
  }

  window.NMData = { defaults, load, get, setOverride, resetOverride, exportJSON, importJSON };
})();
