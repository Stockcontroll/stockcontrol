/* @ds-bundle: {"format":3,"namespace":"GDCOGCDesignSystemRemix_c2a12d","components":[],"sourceHashes":{"deliverables/contentieux-restructuring/paginate.js":"aebc370b60bc","deliverables/formation-ia/deck-stage.js":"5a5fcdcddfd9","export/ref/tweaks-panel.jsx":"6591467622ed","slides/ClosingSlide.jsx":"216500d5b82f","slides/ContentSlide.jsx":"9942f96a8692","slides/QuoteSlide.jsx":"e6a040e19f4d","slides/SectionDividerSlide.jsx":"669ce2f886df","slides/StatBlockSlide.jsx":"e1d7ee244e14","slides/TOCSlide.jsx":"159b984c430c","slides/TitleSlide.jsx":"679daaddfcab","slides/TwoColumnSlide.jsx":"baef800a6427","slides/deck-stage.js":"ad1c016a6256","slides/sp-components.jsx":"d467d96c32bb","slides/sp-slides.jsx":"f1c67d97c911","step-plan/deck-stage.js":"ad1c016a6256","step-plan/sp-deck.jsx":"427ffebf026c","step-plan/sp-tables.jsx":"2e86f1a12ff3","ui_kits/word-document/AwardsPage.jsx":"5cdbc26890c2","ui_kits/word-document/BioPage.jsx":"140cae79f6dd","ui_kits/word-document/BodyPage.jsx":"739db2a3e9a5","ui_kits/word-document/ClosingPage.jsx":"8b73b5429656","ui_kits/word-document/CoverPage.jsx":"ea87c2798765","ui_kits/word-document/TransactionsPage.jsx":"0f544ebff5b3"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GDCOGCDesignSystemRemix_c2a12d = window.GDCOGCDesignSystemRemix_c2a12d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// deliverables/contentieux-restructuring/paginate.js
try { (() => {
/* Gibson Dunn — Contentieux & Restructuring : client-side paginator.
   Packs JSON content blocks into fixed Letter pages (816×1056) with running
   headers, wordmark footers and page numbers. Print-ready. */
(function () {
  "use strict";

  var SHORT = "Contentieux & Restructuring";
  var LOGO_B = "assets/gibson-dunn-wordmark-black.png";
  var LOGO_W = "assets/gibson-dunn-wordmark-white.png";
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function node(html) {
    var d = document.createElement("div");
    d.innerHTML = html;
    return d.firstElementChild;
  }
  var DATA = JSON.parse(document.getElementById("doc-data").textContent);
  var stack = document.getElementById("stack");
  var curSec = "";
  var page = null,
    body = null;
  var pages = [];
  function normalPage() {
    page = document.createElement("div");
    page.className = "gd-page";
    var rh = document.createElement("div");
    rh.className = "runhead";
    rh.innerHTML = '<span class="rh-l">' + esc(SHORT) + '</span><span class="rh-r">' + esc(curSec) + "</span>";
    body = document.createElement("div");
    body.className = "page-body";
    var ft = document.createElement("div");
    ft.className = "gd-footer";
    ft.innerHTML = '<img src="' + LOGO_B + '" alt="Gibson Dunn">' + '<span class="ft-right"><span class="ft-conf">Confidentiel — usage interne. Ne constitue pas un conseil juridique.</span>' + '<span class="pageno"></span></span>';
    page.appendChild(rh);
    page.appendChild(body);
    page.appendChild(ft);
    stack.appendChild(page);
    pages.push(page);
  }
  function ensure() {
    if (!body) normalPage();
  }
  function fits() {
    return body.scrollHeight <= body.clientHeight + 0.5;
  }
  function remaining() {
    ensure();
    return body.clientHeight - body.scrollHeight;
  }
  function add(el) {
    ensure();
    body.appendChild(el);
    if (!fits() && body.childElementCount > 1) {
      body.removeChild(el);
      normalPage();
      body.appendChild(el);
    }
  }
  function addGroup(els) {
    ensure();
    els.forEach(function (e) {
      body.appendChild(e);
    });
    if (fits()) return;
    els.forEach(function (e) {
      body.removeChild(e);
    });
    if (body.childElementCount > 0) {
      normalPage();
      els.forEach(function (e) {
        body.appendChild(e);
      });
      if (fits()) return;
      els.forEach(function (e) {
        body.removeChild(e);
      });
    }
    // group taller than a page: place individually, allowing splits across pages
    els.forEach(function (e) {
      add(e);
    });
  }
  function addSubhead(el) {
    ensure();
    if (remaining() < 150) normalPage();
    add(el);
  }

  /* ---------- renderers ---------- */
  function renderCap(spec, cont) {
    var h = '<div class="tcap"><div class="tc-kick">' + esc(spec.kick) + "</div>" + '<div class="tc-title">' + esc(spec.title) + (cont ? ' <span class="tc-cont">(suite)</span>' : "") + "</div>";
    if (spec.sub) h += '<div class="tc-sub">' + esc(spec.sub) + "</div>";
    h += "</div>";
    return node(h);
  }
  function newTable(spec) {
    var table = document.createElement("table");
    table.className = "gd-table";
    var cg = "<colgroup>";
    spec.head.forEach(function (c) {
      cg += '<col style="width:' + c.w + '">';
    });
    cg += "</colgroup>";
    var th = "<thead><tr>";
    spec.head.forEach(function (c) {
      th += "<th>" + esc(c.txt) + "</th>";
    });
    th += "</tr></thead>";
    table.innerHTML = cg + th + "<tbody></tbody>";
    return {
      table: table,
      tbody: table.querySelector("tbody")
    };
  }
  function renderRow(row) {
    var tr = document.createElement("tr");
    var html = "";
    row.forEach(function (cell) {
      if (typeof cell === "string") html += "<td>" + esc(cell) + "</td>";else html += '<td class="' + (cell.c || "") + '">' + esc(cell.t) + "</td>";
    });
    tr.innerHTML = html;
    return tr;
  }
  function addTable(spec) {
    ensure();
    if (remaining() < 160) normalPage();
    add(renderCap(spec, false));
    var nt = newTable(spec);
    add(nt.table);
    var tbody = nt.tbody;
    spec.rows.forEach(function (row) {
      var tr = renderRow(row);
      tbody.appendChild(tr);
      if (!fits()) {
        tbody.removeChild(tr);
        normalPage();
        body.appendChild(renderCap(spec, true));
        var nt2 = newTable(spec);
        body.appendChild(nt2.table);
        tbody = nt2.tbody;
        tbody.appendChild(tr);
      }
    });
  }
  function buildCover(b) {
    var p = document.createElement("div");
    p.className = "gd-page cover";
    var stats = b.stats.map(function (s) {
      return '<div class="cover-stat"><div class="num">' + esc(s.num) + '</div><div class="lbl">' + esc(s.lbl) + "</div></div>";
    }).join("");
    p.innerHTML = '<div class="cover-top"><img src="' + LOGO_W + '" alt="Gibson Dunn"><div class="cover-date">' + esc(b.date) + "</div></div>" + '<div class="cover-rule"></div>' + '<div class="cover-main"><div class="cover-kicker">' + esc(b.kicker) + "</div>" + '<div class="cover-title">' + b.title + "</div>" + '<div class="cover-sub">' + esc(b.sub) + "</div></div>" + '<div class="cover-stats">' + stats + "</div>" + '<div class="cover-foot"><div class="cf-l">' + b.foot + '</div><div class="cf-r">' + esc(b.footr) + "</div></div>";
    stack.appendChild(p);
    pages.push(p);
  }
  function buildFullDivider(b) {
    curSec = b.sec;
    var p = document.createElement("div");
    p.className = "gd-page divider-full";
    p.innerHTML = '<div class="dv-num">' + esc(b.num) + "</div>" + '<div class="dv-body"><div class="dv-kick">' + esc(b.kick) + "</div>" + '<div class="dv-title">' + b.title + "</div>" + '<div class="dv-sub">' + esc(b.sub) + "</div></div>" + '<div class="gd-footer"><img src="' + LOGO_W + '" alt="Gibson Dunn">' + '<span class="ft-right"><span class="pageno" style="color:#fff"></span></span></div>';
    body = null; // next block starts a fresh page
    stack.appendChild(p);
    pages.push(p);
  }

  /* ---------- main loop ---------- */
  var i = 0;
  while (i < DATA.length) {
    var b = DATA[i];
    switch (b.t) {
      case "cover":
        buildCover(b);
        i++;
        break;
      case "divider":
        if (b.full) {
          buildFullDivider(b);
          i++;
          break;
        }
        curSec = b.sec || b.title;
        var dv = '<div class="divider-inline"><div class="dv-kick">' + esc(b.kick || "") + "</div>" + '<div class="dv-title">' + b.title + "</div>" + (b.sub ? '<div class="dv-sub">' + esc(b.sub) + "</div>" : "") + "</div>";
        if (b.fresh && body && body.childElementCount > 0) normalPage();
        add(node(dv));
        i++;
        break;
      case "subhead":
        addSubhead(node('<div class="subhead"><span class="sh-title">' + esc(b.title) + '</span><span class="sh-rule"></span><span class="sh-count">' + esc(b.count) + "</span></div>"));
        i++;
        break;
      case "table":
        addTable(b);
        i++;
        break;
      case "stack":
        b.items.forEach(function (h) {
          add(node(h));
        });
        i++;
        break;
      case "atomic":
        if (b.group) {
          var g = [];
          var gid = b.group;
          while (i < DATA.length && DATA[i].t === "atomic" && DATA[i].group === gid) {
            g.push(node(DATA[i].html));
            i++;
          }
          addGroup(g);
        } else {
          add(node(b.html));
          i++;
        }
        break;
      default:
        i++;
    }
  }

  /* ---------- page numbers ---------- */
  var n = 0;
  pages.forEach(function (p) {
    var el = p.querySelector(".pageno");
    if (!p.classList.contains("cover")) n++;
    if (el) el.textContent = n < 10 ? "0" + n : "" + n;
  });
  var tc = document.getElementById("tt-count");
  if (tc) tc.textContent = pages.length + " pages";
  window.print && (document.getElementById("tt-print").onclick = function () {
    window.print();
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "deliverables/contentieux-restructuring/paginate.js", error: String((e && e.message) || e) }); }

// deliverables/formation-ia/deck-stage.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* ═══ THIS PROJECT USES DESIGN COMPONENTS (.dc.html) ═══
 * Reference this stage from your <x-dc> template as an import — NEVER as a
 * raw <deck-stage> tag plus a <script src> (that hides the whole deck until
 * the stream finishes):
 *
 *   <x-import component-from-global-scope="deck-stage" from="./deck-stage.js"
 *             width="1920" height="1080" hint-size="100%,100%">
 *     <section data-label="Title" style="...">…</section>
 *     <section data-label="Agenda" style="...">…</section>
 *   </x-import>
 *
 * Slides are inline-styled <section> siblings; do not add a stylesheet or a
 * deck-stage:not(:defined) rule. The plain-HTML "Usage" block in the comment
 * below does NOT apply to .dc.html templates.
 */
/* BEGIN USAGE */
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *      On touch devices, tapping the left/right half of the stage goes
 *      prev/next — taps on links, buttons and other interactive slide
 *      content are left alone.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *  (g) thumbnail rail — resizable left-hand column of per-slide thumbnails
 *      (static clones). Click to navigate; ↑/↓ with a thumbnail focused to
 *      step between slides; drag to reorder; right-click for
 *      Skip / Move up / Move down / Duplicate / Delete (Delete opens a
 *      Cancel/Delete confirm dialog). Drag the rail's right edge to resize;
 *      width persists to
 *      localStorage. Skipped slides carry `data-deck-skip`, are dimmed in
 *      the rail, omitted from prev/next navigation, and hidden at print.
 *      The rail is suppressed in presenting mode, in the host's Preview
 *      mode (ViewerMode='none'), on `noscale`, on narrow viewports
 *      (≤640px), and via the `no-rail` attribute. Rail mutations dispatch
 *      a `dc-op` CustomEvent on the element (see docs/dc-ops.md) and do
 *      NOT touch the DOM: the host applies the op and re-renders;
 *      structural rail input is locked until the host posts
 *      {__dc_op_ack: true, applied}.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <style>deck-stage:not(:defined){visibility:hidden}</style>
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *   <script src="deck-stage.js"></script>
 *
 * The :not(:defined) rule prevents a flash of the first slide at its
 * authored styles before this script runs and attaches the shadow root.
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 *
 * Speaker notes stay in sync because the component posts {slideIndexChanged: N}
 * to the parent — just include the #speaker-notes script tag if asked for notes.
 *
 * Authoring guidance:
 *   - Write slide bodies as static HTML inside <deck-stage>, with sizing via
 *     CSS custom properties in a <style> block rather than JS constants.
 *     Static slide markup is what lets the user click a heading in edit mode
 *     and retype it directly; a slide rendered through <script type="text/babel">,
 *     React, or a loop over a JS array has to round-trip every tweak through a
 *     chat message instead. Reach for script-generated slides only when the
 *     content genuinely needs interactive behaviour static HTML can't express.
 *   - Do NOT set position/inset/width/height on the slide <section> elements —
 *     the component absolutely positions every slotted child for you.
 *   - Entrance animations: make the visible end-state the base style and
 *     animate *from* hidden, so print and reduced-motion show content.
 *     Gate the animation on [data-deck-active] and the motion query, e.g.
 *     `@media (prefers-reduced-motion:no-preference){ [data-deck-active] .x{animation:fade-in .5s both} }`.
 *     Avoid infinite decorative loops on slide content.
 */
/* END USAGE */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const FINE_POINTER_MQ = matchMedia('(hover: hover) and (pointer: fine)');
  const NARROW_MQ = matchMedia('(max-width: 640px)');
  // Slide-authored controls that should keep a tap instead of it navigating.
  const INTERACTIVE_SEL = 'a[href], button, input, select, textarea, summary, label, video[controls], audio[controls], [role="button"], [onclick], [tabindex]:not([tabindex^="-"]), [contenteditable]:not([contenteditable="false" i])';
  const pad2 = n => String(n).padStart(2, '0');

  // Label precedence: data-label → data-screen-label (number stripped) → first heading → "Slide".
  const getSlideLabel = el => {
    const explicit = el.getAttribute('data-label');
    if (explicit) return explicit;
    const existing = el.getAttribute('data-screen-label');
    if (existing) return existing.replace(/^\s*\d+\s*/, '').trim() || existing;
    const h = el.querySelector('h1, h2, h3, [data-title]');
    const t = h && (h.textContent || '').trim().slice(0, 40);
    if (t) return t;
    return 'Slide';
  };
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }
    /* connectedCallback holds this until document.fonts.ready (capped 2s) so
     * the first visible paint has the deck's real typography + final rail
     * layout. opacity (not visibility) so the active slide can't un-hide
     * itself via the ::slotted([data-deck-active]) visibility:visible rule.
     * Only the stage/rail hide — the black :host background stays, so the
     * iframe doesn't flash the page's default white. */
    :host([data-fonts-pending]) .stage,
    :host([data-fonts-pending]) .rail { opacity: 0; pointer-events: none; }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Thumbnail rail ──────────────────────────────────────────────────
       Fixed column on the left; each thumbnail is a static deep-clone of
       the light-DOM slide scaled into a 16:9 (or design-aspect) frame. The
       stage re-fits around it (see _fit); hidden during present / noscale
       / print so capture geometry and fullscreen output are unchanged. */
    .rail {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--deck-rail-w, 188px);
      background: #141414;
      border-right: 1px solid rgba(255,255,255,0.08);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 2147482500;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.18) transparent;
    }
    .rail::-webkit-scrollbar { width: 8px; }
    .rail::-webkit-scrollbar-track { background: transparent; margin: 2px; }
    .rail::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.18);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    .rail::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.28);
      border: 2px solid transparent;
      background-clip: content-box;
    }
    :host([no-rail]) .rail,
    :host([noscale]) .rail { display: none; }
    .rail[data-presenting] { display: none; }
    @media (max-width: 640px) {
      .rail, .rail-resize { display: none; }
    }
    /* User-driven show/hide (the TweaksPanel toggle) slides instead of
       popping. Transitions are gated on :host([data-rail-anim]) — set only
       for the 200ms around the toggle — so window-resize and rail-width
       drag (which also call _fit) don't lag behind the cursor. */
    .rail[data-user-hidden] { transform: translateX(-100%); }
    :host([data-rail-anim]) .rail { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .stage { transition: left 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .canvas { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    /* transition shorthand replaces rather than merges — repeat the base
       .overlay opacity/transform/filter transitions so visibility changes
       during the 200ms toggle window still fade instead of popping. */
    :host([data-rail-anim]) .overlay {
      transition: margin-left 200ms cubic-bezier(.3,.7,.4,1),
                  opacity 260ms ease,
                  transform 260ms cubic-bezier(.2,.8,.2,1),
                  filter 260ms ease;
    }

    .thumb {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .thumb .num {
      width: 16px;
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 500;
      text-align: right;
      color: rgba(255,255,255,0.55);
      padding-top: 2px;
      font-variant-numeric: tabular-nums;
    }
    .thumb .frame {
      position: relative;
      flex: 1;
      min-width: 0;
      aspect-ratio: var(--deck-aspect);
      background: #fff;
      border-radius: 4px;
      outline: 2px solid transparent;
      outline-offset: 0;
      overflow: hidden;
      transition: outline-color 120ms ease;
    }
    .thumb:hover .frame { outline-color: rgba(255,255,255,0.25); }
    .thumb { outline: none; }
    .thumb:focus-visible .frame { outline-color: rgba(255,255,255,0.5); }
    .thumb[data-current] .num { color: #fff; }
    .thumb[data-current] .frame { outline-color: #D97757; }
    .thumb[data-dragging] { opacity: 0.35; }
    .thumb::before {
      content: '';
      position: absolute;
      left: 24px;
      right: 0;
      height: 3px;
      border-radius: 2px;
      background: #D97757;
      opacity: 0;
      pointer-events: none;
    }
    .thumb[data-drop="before"]::before { top: -8px; opacity: 1; }
    .thumb[data-drop="after"]::before { bottom: -8px; opacity: 1; }
    .thumb[data-skip] .frame { opacity: 0.35; }
    .thumb[data-skip] .frame::after {
      content: 'Skipped';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.45);
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .ctxmenu {
      position: fixed;
      min-width: 150px;
      padding: 4px;
      background: #242424;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 7px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      z-index: 2147483100;
      display: none;
      font-size: 12px;
    }
    .ctxmenu[data-open] { display: block; }
    .ctxmenu button {
      display: block;
      width: 100%;
      appearance: none;
      border: 0;
      background: transparent;
      color: #e8e8e8;
      font: inherit;
      text-align: left;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .ctxmenu button:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
    .ctxmenu button:disabled { opacity: 0.35; cursor: default; }
    .ctxmenu hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 4px 2px;
    }

    .rail-resize {
      position: fixed;
      left: calc(var(--deck-rail-w, 188px) - 3px);
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: col-resize;
      z-index: 2147482600;
      touch-action: none;
    }
    .rail-resize:hover,
    .rail-resize[data-dragging] { background: rgba(255,255,255,0.12); }
    :host([no-rail]) .rail-resize,
    :host([noscale]) .rail-resize,
    .rail[data-presenting] + .rail-resize,
    .rail[data-user-hidden] + .rail-resize { display: none; }

    /* Delete-confirm popup — matches the SPA's ConfirmDialog layout
       (title + message body, depressed footer with Cancel / Delete). */
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 2147483200;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .confirm-backdrop[data-open] { display: flex; }
    .confirm {
      width: 320px;
      max-width: calc(100vw - 32px);
      background: #2a2a2a;
      color: #e8e8e8;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: inherit;
      animation: deck-confirm-in 0.18s ease;
    }
    @keyframes deck-confirm-in {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .confirm .body { padding: 20px 20px 16px; }
    .confirm .title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .confirm .msg { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.65); }
    .confirm .footer {
      padding: 14px 20px;
      background: #1f1f1f;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .confirm button {
      appearance: none;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
    }
    .confirm .cancel {
      background: transparent;
      border: 0;
      color: rgba(255,255,255,0.8);
    }
    .confirm .cancel:hover { background: rgba(255,255,255,0.08); }
    .confirm .danger {
      background: #c96442;
      border: 1px solid rgba(0,0,0,0.15);
      color: #fff;
      box-shadow: 0 1px 3px rgba(166,50,68,0.3), 0 2px 6px rgba(166,50,68,0.18);
    }
    .confirm .danger:hover { background: #b5563a; }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      /* :last-child alone isn't enough once data-deck-skip hides the
         trailing slide(s) — the last *visible* slide still carries
         break-after:page and prints a blank sheet. _markLastVisible()
         maintains data-deck-last-visible on the last non-skipped slide. */
      ::slotted(*:last-child),
      ::slotted([data-deck-last-visible]) {
        break-after: auto;
        page-break-after: auto;
      }
      ::slotted([data-deck-skip]) { display: none !important; }
      .overlay, .rail, .rail-resize, .ctxmenu, .confirm-backdrop { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale', 'no-rail'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._menuIndex = -1;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTap = this._onTap.bind(this);
      this._onMessage = this._onMessage.bind(this);
      // Capture-phase close so a click anywhere dismisses the menu, but
      // ignore clicks that land inside the menu itself — otherwise the
      // capture handler runs before the menu's own (bubble) handler and
      // clears _menuIndex out from under it.
      this._onDocClick = e => {
        if (this._menu && e.composedPath && e.composedPath().includes(this._menu)) return;
        this._closeMenu();
      };
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      // Presenter-view popup loads deckUrl?_snthumb=...#N for its prev/cur/
      // next thumbnails — the rail has no business rendering inside those
      // (wrong scale, and it offsets the stage so the thumb shows a gutter).
      if (/[?&]_snthumb=/.test(location.search)) this.setAttribute('no-rail', '');
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      window.addEventListener('message', this._onMessage);
      window.addEventListener('click', this._onDocClick, true);
      this.addEventListener('click', this._onTap);
      // Print lays every slide out as its own page, so [data-deck-active]-
      // gated entrance styles need the attribute on every slide (not just
      // the current one) or their content prints at the hidden base style.
      // The transient freeze style lands BEFORE the attributes so any
      // attribute-keyed transition fires at 0s (changing transition-
      // duration after a transition has started doesn't affect it).
      this._onBeforePrint = () => {
        if (this._freezeStyle) this._freezeStyle.remove();
        this._freezeStyle = document.createElement('style');
        this._freezeStyle.textContent = '*,*::before,*::after{transition-duration:0s !important}';
        document.head.appendChild(this._freezeStyle);
        this._slides.forEach(s => s.setAttribute('data-deck-active', ''));
      };
      this._onAfterPrint = () => {
        this._applyIndex({
          showOverlay: false,
          broadcast: false
        });
        if (this._freezeStyle) {
          this._freezeStyle.remove();
          this._freezeStyle = null;
        }
      };
      window.addEventListener('beforeprint', this._onBeforePrint);
      window.addEventListener('afterprint', this._onAfterPrint);
      // Initial collection + layout happens via slotchange, which fires on mount.
      this._enableRail();
      // Hold the stage hidden until webfonts are ready so the first visible
      // paint has the deck's real typography — the :not(:defined) guard in
      // the page HTML only covers custom-element upgrade, not font load.
      // Capped so a 404'd font URL can't blank the deck indefinitely.
      this.setAttribute('data-fonts-pending', '');
      const reveal = () => this.removeAttribute('data-fonts-pending');
      // rAF first: fonts.ready is a pre-resolved promise until layout has
      // resolved the slotted text's font-family and pushed a FontFace into
      // 'loading'. Reading it here in connectedCallback (parse-time) would
      // settle the race in a microtask before any font fetch starts.
      requestAnimationFrame(() => {
        Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2000))]).then(reveal, reveal);
      });
    }
    _enableRail() {
      // Idempotent — older host builds still post __omelette_rail_enabled.
      // no-rail guard keeps the observers/stylesheet walk off the cheap path
      // for presenter-popup thumbnail iframes (up to 9 per view).
      if (this._railEnabled || this.hasAttribute('no-rail')) return;
      this._railEnabled = true;
      // Per-viewer preference — restored alongside rail width. Default on;
      // only a stored '0' (from the TweaksPanel toggle) hides it.
      this._railVisible = true;
      try {
        if (localStorage.getItem('deck-stage.railVisible') === '0') this._railVisible = false;
      } catch (e) {}
      // Live thumbnail updates: watch the light-DOM slides for content
      // edits and re-clone just the affected thumb(s), debounced. Ignore
      // the data-deck-* / data-screen-label / data-om-validate attributes
      // this component itself writes so nav doesn't trigger spurious
      // refreshes — except data-deck-skip, which now arrives from the host
      // re-render and is what updates the rail badge, print bookkeeping,
      // and deckSkipped re-broadcast.
      const OWN_ATTRS = /^data-(deck-(?!skip$)|screen-label$|om-validate$)/;
      this._liveDirty = new Set();
      this._liveObserver = new MutationObserver(records => {
        for (const r of records) {
          if (r.type === 'attributes' && OWN_ATTRS.test(r.attributeName || '')) continue;
          let n = r.target;
          while (n && n.parentElement !== this) n = n.parentElement;
          // Skip/unskip is handled below without re-cloning (the badge sits
          // on the thumb wrapper, not the clone) — don't mark the slide
          // dirty for an attr change whose only visible effect is the badge.
          if (n && this._slideSet && this._slideSet.has(n) && !(r.type === 'attributes' && r.attributeName === 'data-deck-skip')) {
            this._liveDirty.add(n);
          }
          // Host-driven skip toggle: sync the rail badge + print + presenter
          // skipped-list the way _toggleSkip used to do locally.
          if (r.type === 'attributes' && r.attributeName === 'data-deck-skip' && n && this._slideSet && this._slideSet.has(n)) {
            const i = this._slides.indexOf(n);
            if (this._thumbs && this._thumbs[i]) {
              if (n.hasAttribute('data-deck-skip')) this._thumbs[i].thumb.setAttribute('data-skip', '');else this._thumbs[i].thumb.removeAttribute('data-skip');
            }
            this._markLastVisible();
            try {
              window.postMessage({
                slideIndexChanged: this._index,
                deckTotal: this._slides.length,
                deckSkipped: this._skippedIndices()
              }, '*');
            } catch (e) {}
          }
        }
        if (this._liveDirty.size && !this._liveTimer) {
          this._liveTimer = setTimeout(() => {
            this._liveTimer = null;
            this._liveDirty.forEach(s => this._refreshThumb(s));
            this._liveDirty.clear();
          }, 200);
        }
      });
      this._liveObserver.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      // Lazy thumbnail materialization — clone the slide only when its
      // frame scrolls into (or near) the rail viewport. rootMargin gives
      // ~4 thumbs of pre-load so fast scrolling doesn't flash blanks.
      this._railObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.target.__deckThumb) {
            this._materialize(e.target.__deckThumb);
          }
        });
      }, {
        root: this._rail,
        rootMargin: '400px 0px'
      });
      // Tweaks typically change CSS vars / attrs OUTSIDE <deck-stage>
      // (on <html>, <body>, a wrapper div, or a <style> tag), which
      // _liveObserver can't see. Re-snapshot author CSS (constructable
      // sheet is shared by reference, so one replaceSync updates every
      // thumb shadow root) and re-sync each thumb host's attrs + custom
      // properties. In-slide DOM mutations are _liveObserver's job.
      // Debounced so slider drags don't thrash.
      this._onTweakChange = () => {
        clearTimeout(this._tweakTimer);
        this._tweakTimer = setTimeout(() => {
          this._snapshotAuthorCss();
          // One getComputedStyle for the whole batch — each
          // getPropertyValue read below reuses the same computed style
          // as long as nothing invalidates layout between thumbs.
          const cs = getComputedStyle(this);
          (this._thumbs || []).forEach(t => {
            if (t.host) this._syncThumbHostAttrs(t.host, cs);
          });
        }, 120);
      };
      window.addEventListener('tweakchange', this._onTweakChange);
      this._snapshotAuthorCss();
      // Build the rail now that it's enabled — slotchange already fired,
      // so _renderRail's early-return skipped the initial build.
      this._syncRailHidden();
      this._renderRail();
      this._fit();
    }

    /** Snapshot document stylesheets into a constructable sheet that each
     *  thumbnail's nested shadow root adopts — so author CSS styles the
     *  cloned slide content without touching this component's chrome.
     *  Cross-origin sheets throw on .cssRules — skip them. Re-callable:
     *  the existing constructable sheet is reused via replaceSync so every
     *  already-adopted shadow root picks up the fresh CSS without re-adopt. */
    _snapshotAuthorCss() {
      // :root in an adopted sheet inside a shadow root matches nothing
      // (only the document root qualifies), so author rules like
      // `:root[data-voice="modern"] .serif` never reach the clones.
      // Rewrite :root → :host and mirror <html>'s data-*/class/lang onto
      // each thumb host (see _syncThumbHostAttrs) so the same selectors
      // match inside the thumbnail's shadow tree.
      const authorCss = Array.from(document.styleSheets).map(sh => {
        try {
          return Array.from(sh.cssRules).map(r => r.cssText).join('\n');
        } catch (e) {
          return '';
        }
      }).join('\n')
      // The shadow host is featureless outside the functional :host(...)
      // form, so any compound on :root — [attr], .class, #id, :pseudo —
      // must become :host(<compound>) not :host<compound>. Same for the
      // html type selector (Tailwind class-strategy dark mode emits
      // html.dark; Pico uses html[data-theme]), which has nothing to
      // match inside the thumb's shadow tree.
      .replace(/:root((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)/g, ':host($1)').replace(/:root\b/g, ':host').replace(/(^|[\s,>~+(}])html((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)(?![-\w])/g, '$1:host($2)').replace(/(^|[\s,>~+(}])html(?![-\w])/g, '$1:host');
      // Every custom property the author references. _syncThumbHostAttrs
      // mirrors each one's *computed* value at <deck-stage> onto the
      // thumb host so the live value wins over the :host default above
      // regardless of which ancestor the tweak wrote to (<html>, <body>,
      // a wrapper div, or the deck-stage element itself all inherit
      // down to getComputedStyle(this)).
      this._authorVars = new Set(authorCss.match(/--[\w-]+/g) || []);
      try {
        if (!this._adoptedSheet) this._adoptedSheet = new CSSStyleSheet();
        this._adoptedSheet.replaceSync(authorCss);
      } catch (e) {
        this._adoptedSheet = null;
        this._authorCss = authorCss;
      }
    }
    _syncThumbHostAttrs(host, cs) {
      const de = document.documentElement;
      // setAttribute overwrites but can't delete — an attr removed from
      // <html> (toggleAttribute off, classList emptied) would linger on
      // the host and :host([data-*]) / :host(.foo) rules would keep
      // matching. Remove stale mirrored attrs first; iterate backward
      // because removeAttribute mutates the live NamedNodeMap.
      for (let i = host.attributes.length - 1; i >= 0; i--) {
        const n = host.attributes[i].name;
        if ((n.startsWith('data-') || n === 'class' || n === 'lang') && !de.hasAttribute(n)) {
          host.removeAttribute(n);
        }
      }
      for (const a of de.attributes) {
        if (a.name.startsWith('data-') || a.name === 'class' || a.name === 'lang') {
          host.setAttribute(a.name, a.value);
        }
      }
      // The :root→:host rewrite in _snapshotAuthorCss pins each custom
      // property to its stylesheet default on the thumb host, shadowing
      // the live value that would otherwise inherit. Tweaks can write the
      // live value on any ancestor — <html>, <body>, a wrapper div, the
      // deck-stage element — so read it as the *computed* value at
      // <deck-stage> (which sees the whole inheritance chain) rather than
      // trying to guess which element the author wrote to. Inline on the
      // host beats the :host{} rule. remove-stale covers vars dropped
      // from the stylesheet between snapshots.
      const vars = this._authorVars || new Set();
      for (let i = host.style.length - 1; i >= 0; i--) {
        const p = host.style[i];
        if (p.startsWith('--') && !vars.has(p)) host.style.removeProperty(p);
      }
      const live = cs || getComputedStyle(this);
      vars.forEach(p => {
        const v = live.getPropertyValue(p);
        if (v) host.style.setProperty(p, v.trim());else host.style.removeProperty(p);
      });
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('message', this._onMessage);
      window.removeEventListener('click', this._onDocClick, true);
      window.removeEventListener('beforeprint', this._onBeforePrint);
      window.removeEventListener('afterprint', this._onAfterPrint);
      if (this._freezeStyle) {
        this._freezeStyle.remove();
        this._freezeStyle = null;
      }
      this.removeEventListener('click', this._onTap);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
      if (this._liveTimer) clearTimeout(this._liveTimer);
      if (this._tweakTimer) clearTimeout(this._tweakTimer);
      if (this._railAnimTimer) clearTimeout(this._railAnimTimer);
      if (this._scaleRaf) cancelAnimationFrame(this._scaleRaf);
      if (this._liveObserver) this._liveObserver.disconnect();
      if (this._railObserver) this._railObserver.disconnect();
      if (this._onTweakChange) window.removeEventListener('tweakchange', this._onTweakChange);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        if (this._rail) {
          this._rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
        }
        this._fit();
        this._scaleThumbs();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-omelette-chrome', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._advance(-1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._advance(1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));

      // Thumbnail rail + context menu. Thumbnails are populated in
      // _renderRail() after _collectSlides().
      const rail = document.createElement('div');
      rail.className = 'rail export-hidden';
      rail.setAttribute('data-omelette-chrome', '');
      rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
      // Edge auto-scroll while dragging a thumb near the rail's top/bottom
      // so off-screen drop targets are reachable. Native dragover fires
      // continuously while the pointer is stationary, so a per-event nudge
      // (ramped by edge proximity) is enough — no rAF loop needed.
      rail.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        const r = rail.getBoundingClientRect();
        const EDGE = 40;
        const dt = e.clientY - r.top;
        const db = r.bottom - e.clientY;
        if (dt < EDGE) rail.scrollTop -= Math.ceil((EDGE - dt) / 3);else if (db < EDGE) rail.scrollTop += Math.ceil((EDGE - db) / 3);
      });
      const menu = document.createElement('div');
      menu.className = 'ctxmenu export-hidden';
      menu.setAttribute('data-omelette-chrome', '');
      menu.innerHTML = `
        <button type="button" data-act="skip">Skip slide</button>
        <button type="button" data-act="up">Move up</button>
        <button type="button" data-act="down">Move down</button>
        <button type="button" data-act="duplicate">Duplicate slide</button>
        <hr>
        <button type="button" data-act="delete">Delete slide</button>
      `;
      menu.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        const i = this._menuIndex;
        this._closeMenu();
        if (act === 'skip') this._toggleSkip(i);else if (act === 'up') this._moveSlide(i, i - 1);else if (act === 'down') this._moveSlide(i, i + 1);else if (act === 'duplicate') this._duplicateSlide(i);else if (act === 'delete') this._openConfirm(i);
      });
      menu.addEventListener('contextmenu', e => e.preventDefault());

      // Rail resize handle — drag to set --deck-rail-w, persisted to
      // localStorage so the width survives reloads.
      const resize = document.createElement('div');
      resize.className = 'rail-resize export-hidden';
      resize.setAttribute('data-omelette-chrome', '');
      resize.addEventListener('pointerdown', e => {
        e.preventDefault();
        resize.setPointerCapture(e.pointerId);
        resize.setAttribute('data-dragging', '');
        const move = ev => this._setRailWidth(ev.clientX);
        const up = () => {
          resize.removeEventListener('pointermove', move);
          resize.removeEventListener('pointerup', up);
          resize.removeEventListener('pointercancel', up);
          resize.removeAttribute('data-dragging');
          try {
            localStorage.setItem('deck-stage.railWidth', String(this._railPx));
          } catch (err) {}
        };
        resize.addEventListener('pointermove', move);
        resize.addEventListener('pointerup', up);
        resize.addEventListener('pointercancel', up);
      });

      // Delete-confirm dialog — mirrors the SPA's ConfirmDialog layout.
      const confirm = document.createElement('div');
      confirm.className = 'confirm-backdrop export-hidden';
      confirm.setAttribute('data-omelette-chrome', '');
      confirm.innerHTML = `
        <div class="confirm" role="dialog" aria-modal="true">
          <div class="body">
            <div class="title">Delete slide?</div>
            <div class="msg">This slide will be removed from the deck.</div>
          </div>
          <div class="footer">
            <button type="button" class="cancel">Cancel</button>
            <button type="button" class="danger">Delete</button>
          </div>
        </div>
      `;
      confirm.addEventListener('click', e => {
        if (e.target === confirm) this._closeConfirm();
      });
      confirm.querySelector('.cancel').addEventListener('click', () => this._closeConfirm());
      confirm.querySelector('.danger').addEventListener('click', () => {
        const i = this._confirmIndex;
        this._closeConfirm();
        this._deleteSlide(i);
      });
      this._root.append(style, rail, resize, stage, overlay, menu, confirm);
      this._canvas = canvas;
      this._stage = stage;
      this._slot = slot;
      this._overlay = overlay;
      this._rail = rail;
      this._resize = resize;
      this._menu = menu;
      this._confirm = confirm;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');

      // Restore persisted rail width.
      let rw = 188;
      try {
        const s = localStorage.getItem('deck-stage.railWidth');
        if (s) rw = parseInt(s, 10) || rw;
      } catch (err) {}
      this._setRailWidth(rw);
      this._syncRailHidden();
    }
    _setRailWidth(px) {
      const w = Math.max(120, Math.min(360, Math.round(px)));
      this._railPx = w;
      this.style.setProperty('--deck-rail-w', w + 'px');
      this._fit();
      // _scaleThumbs forces a sync layout (frame.offsetWidth) then writes
      // N transforms. During a resize drag this runs per-pointermove;
      // coalesce to one per frame.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } ' +
      // Jump authored animations/transitions to their end state so print
      // never captures mid-entrance — pairs with the beforeprint handler
      // in connectedCallback that sets data-deck-active on every slide.
      '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }
    _onSlotChange() {
      // Self-mutate path already reconciled synchronously and emitted
      // slidechange; skip the async slotchange it caused.
      if (this._squelchSlotChange) {
        this._squelchSlotChange = false;
        return;
      }
      // Primary lock-clear is the host's __deck_rail_ack; this clears on a
      // dropped ack so the rail can't stay dead.
      this._railLock = false;
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slideSet = new Set(this._slides);
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        slide.setAttribute('data-screen-label', `${pad2(n)} ${getSlideLabel(slide)}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
      this._markLastVisible();
      this._renderRail();
    }

    /** Tag the last non-skipped slide so print CSS can drop its
     *  break-after (see the @media print comment above — :last-child
     *  alone matches a hidden skipped slide). */
    _markLastVisible() {
      let last = null;
      this._slides.forEach(s => {
        s.removeAttribute('data-deck-last-visible');
        if (!s.hasAttribute('data-deck-skip')) last = s;
      });
      if (last) last.setAttribute('data-deck-last-visible', '');
    }
    _loadNotes() {
      // Per-slide data-speaker-notes is authoritative when present (attrs
      // travel with the element on reorder/dup/delete); a slide without
      // the attr falls through to the legacy #speaker-notes JSON array
      // PER SLIDE so a single attr on a JSON-authored deck doesn't blank
      // the rest.
      const tag = document.getElementById('speaker-notes');
      let json = null;
      if (tag) try {
        const p = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(p)) json = p;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
      }
      this._notes = this._slides.map((s, i) => {
        const a = s.getAttribute('data-speaker-notes');
        return a !== null ? a : json && typeof json[i] === 'string' ? json[i] : '';
      });
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      // Follow-scroll on every navigation (init deep-link, keyboard, click,
      // tap, external goTo) — the only time we *don't* want the rail to
      // track current is after a rail-internal mutation, where _renderRail
      // has already restored the user's scroll position and yanking back to
      // current would undo it.
      this._syncRail(reason !== 'mutation');
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr,
            deckTotal: this._slides.length,
            deckSkipped: this._skippedIndices()
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      // Host posts __omelette_presenting while in fullscreen/tab presentation
      // mode — suppress the nav footer entirely (both hover and slide-change
      // flash) so the audience sees clean slides.
      if (!this._overlay || this._presenting) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _railWidth() {
      // State-based, no offsetWidth: the first _fit() can run before the
      // rail has had layout on some load paths, and a 0 there paints the
      // slide full-width for one frame before the post-slotchange _fit()
      // corrects it.
      if (!this._railEnabled || !this._railVisible || this.hasAttribute('no-rail') || this.hasAttribute('noscale') || this._presenting || this._previewMode || NARROW_MQ.matches) return 0;
      return this._railPx || 0;
    }
    _fit() {
      if (!this._canvas) return;
      const stage = this._canvas.parentElement;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        if (stage) stage.style.left = '0';
        if (this._overlay) this._overlay.style.marginLeft = '0';
        return;
      }
      const rw = this._railWidth();
      if (stage) stage.style.left = rw + 'px';
      // Overlay is centred on the viewport via left:50% + translate(-50%);
      // marginLeft shifts the centre by rw/2 so it lands in the middle of
      // the [rw, innerWidth] stage region.
      if (this._overlay) this._overlay.style.marginLeft = rw / 2 + 'px';
      const vw = window.innerWidth - rw;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
      // Crossing the narrow-viewport breakpoint reveals the rail — rerun the
      // thumbnail scale the same way _setRailWidth does.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onMessage(e) {
      const d = e.data;
      if (d && typeof d.__omelette_presenting === 'boolean') {
        this._presenting = d.__omelette_presenting;
        if (this._presenting && this._overlay) {
          this._overlay.removeAttribute('data-visible');
          if (this._hideTimer) clearTimeout(this._hideTimer);
        }
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Host's Preview segment (ViewerMode='none'): the rail's drag-reorder /
      // right-click skip-delete affordances are editing chrome, so hide it
      // while the user is just looking at the deck. Same hard-hide path as
      // presenting; independent of the user's _railVisible preference so
      // returning to Edit restores whatever they had.
      if (d && typeof d.__omelette_preview_mode === 'boolean') {
        if (d.__omelette_preview_mode === this._previewMode) return;
        this._previewMode = d.__omelette_preview_mode;
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Host has processed a dc-op; rail input is safe again. Not tied to
      // slotchange — setAttr and refusal don't fire one. On refusal,
      // revert the optimistic _index/hash adjustment so the next nav
      // starts from what's actually on screen.
      if (d && d.__dc_op_ack) {
        this._railLock = false;
        if (d.applied === false && this._indexBeforeEmit != null) {
          this._index = this._indexBeforeEmit;
          try {
            history.replaceState(null, '', '#' + (this._index + 1));
          } catch (e) {}
        }
        this._indexBeforeEmit = null;
      }
      // Per-viewer show/hide, driven by the TweaksPanel's auto-injected
      // "Thumbnail rail" toggle (or any author script). Independent of
      // whether the Tweaks panel itself is open — closing the panel
      // doesn't change rail visibility. Persists alongside rail width.
      if (d && d.type === '__deck_rail_visible' && typeof d.on === 'boolean') {
        if (d.on === this._railVisible) return;
        this._railVisible = d.on;
        try {
          localStorage.setItem('deck-stage.railVisible', d.on ? '1' : '0');
        } catch (e) {}
        // Arm the transition, commit it, then flip state — otherwise the
        // browser coalesces both writes and nothing animates on show.
        this.setAttribute('data-rail-anim', '');
        void (this._rail && this._rail.offsetHeight);
        this._syncRailHidden();
        this._fit();
        this._scaleThumbs();
        clearTimeout(this._railAnimTimer);
        this._railAnimTimer = setTimeout(() => this.removeAttribute('data-rail-anim'), 220);
      }
      if (d && d.type === '__omelette_rail_enabled') this._enableRail();
    }
    _syncRailHidden() {
      if (!this._rail) return;
      // data-presenting is the hard hide (display:none) for flag-off,
      // presentation mode, and the host's Preview segment — instant, no
      // transition. data-user-hidden is the soft hide (translateX(-100%))
      // for the viewer's rail toggle, so show/hide slides under
      // :host([data-rail-anim]).
      const hard = !this._railEnabled || this._presenting || this._previewMode;
      if (hard) this._rail.setAttribute('data-presenting', '');else this._rail.removeAttribute('data-presenting');
      if (!this._railVisible) this._rail.setAttribute('data-user-hidden', '');else this._rail.removeAttribute('data-user-hidden');
      // translateX hide leaves thumbs (tabIndex=0) in the tab order —
      // inert keeps them unfocusable while the rail is off-screen.
      this._rail.inert = hard || !this._railVisible;
    }
    _onTap(e) {
      // Touch-only — keyboard + the overlay toolbar cover nav on desktop.
      if (FINE_POINTER_MQ.matches) return;
      // Only taps that land on the stage (slide content or letterbox); the
      // overlay / rail / menus are siblings with their own click handlers.
      const path = e.composedPath();
      if (!this._stage || !path.includes(this._stage)) return;
      // Let interactive slide content keep the tap. composedPath (not
      // e.target.closest) so we see through open shadow roots — a <button>
      // inside a slide-authored custom element retargets e.target to the
      // host but still appears in the composed path.
      if (e.defaultPrevented) return;
      for (const n of path) {
        if (n === this._stage) break;
        if (n.matches && n.matches(INTERACTIVE_SEL)) return;
      }
      e.preventDefault();
      const rw = this._railWidth();
      const mid = rw + (window.innerWidth - rw) / 2;
      this._advance(e.clientX < mid ? -1 : 1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      // Confirm dialog swallows nav keys while open; Escape cancels. Enter
      // is left to the focused button's native activation so Tab→Cancel
      // →Enter activates Cancel, not the window-level confirm path.
      if (this._confirm && this._confirm.hasAttribute('data-open')) {
        if (e.key === 'Escape') {
          this._closeConfirm();
          e.preventDefault();
        }
        return;
      }
      if (e.key === 'Escape' && this._menu && this._menu.hasAttribute('data-open')) {
        this._closeMenu();
        e.preventDefault();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._advance(1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._advance(-1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    /** Step forward/back skipping any slide marked data-deck-skip. Falls
     *  back to _go's clamp-at-ends behaviour (flash overlay) when there's
     *  nothing further in that direction. */
    _advance(dir, reason) {
      if (!this._slides.length) return;
      let i = this._index + dir;
      while (i >= 0 && i < this._slides.length && this._slides[i].hasAttribute('data-deck-skip')) {
        i += dir;
      }
      if (i < 0 || i >= this._slides.length) {
        this._flashOverlay();
        return;
      }
      this._go(i, reason);
    }

    // ── Thumbnail rail ────────────────────────────────────────────────────
    //
    // Thumbs are keyed by slide element and reused across _renderRail()
    // calls, so a reorder/delete is an O(changed) DOM shuffle instead of an
    // O(N) teardown-and-re-clone. Each thumb starts as a lightweight shell
    // (num + empty frame); the clone is materialized lazily by an
    // IntersectionObserver when the frame scrolls into (or near) view, so
    // only visible-ish slides pay the clone + image-decode cost.

    _renderRail() {
      if (!this._rail || !this._railEnabled) {
        this._thumbs = [];
        return;
      }
      // FLIP: record each *materialized* thumb's top before the reconcile.
      // Off-screen (non-materialized) thumbs don't need the animation and
      // skipping their getBoundingClientRect saves a forced layout per
      // off-screen thumb on large decks.
      const prevTops = new Map();
      (this._thumbs || []).forEach(({
        thumb,
        slide,
        host
      }) => {
        if (host) prevTops.set(slide, thumb.getBoundingClientRect().top);
      });
      const st = this._rail.scrollTop;

      // Reconcile: reuse thumbs that already exist for a slide, create
      // shells for new slides, drop thumbs for removed slides.
      const bySlide = new Map();
      (this._thumbs || []).forEach(t => bySlide.set(t.slide, t));
      const next = [];
      this._slides.forEach(slide => {
        let t = bySlide.get(slide);
        if (t) bySlide.delete(slide);else t = this._makeThumb(slide);
        next.push(t);
      });
      // Orphans — slides removed since last render.
      bySlide.forEach(t => {
        if (this._railObserver) this._railObserver.unobserve(t.frame);
        t.thumb.remove();
      });
      // Put thumbs into document order to match _slides. insertBefore on
      // an already-correctly-placed node is a no-op, so this is cheap
      // when nothing moved.
      next.forEach((t, i) => {
        const want = t.thumb;
        const at = this._rail.children[i];
        if (at !== want) this._rail.insertBefore(want, at || null);
        t.i = i;
        t.num.textContent = String(i + 1);
        if (t.slide.hasAttribute('data-deck-skip')) t.thumb.setAttribute('data-skip', '');else t.thumb.removeAttribute('data-skip');
      });
      this._thumbs = next;
      this._rail.scrollTop = st;
      if (prevTops.size) {
        const moved = [];
        this._thumbs.forEach(({
          thumb,
          slide
        }) => {
          const old = prevTops.get(slide);
          if (old == null) return;
          const dy = old - thumb.getBoundingClientRect().top;
          if (Math.abs(dy) < 1) return;
          thumb.style.transition = 'none';
          thumb.style.transform = `translateY(${dy}px)`;
          moved.push(thumb);
        });
        if (moved.length) {
          // Commit the inverted positions before flipping the transition
          // on — otherwise the browser coalesces both style writes and
          // nothing animates.
          void this._rail.offsetHeight;
          moved.forEach(t => {
            t.style.transition = 'transform 180ms cubic-bezier(.2,.7,.3,1)';
            t.style.transform = '';
          });
          setTimeout(() => moved.forEach(t => {
            t.style.transition = '';
          }), 220);
        }
      }
      requestAnimationFrame(() => this._scaleThumbs());
      this._syncRail(false);
    }

    /** Create a lightweight thumb shell for one slide. The clone is
     *  materialized later by the IntersectionObserver. Event handlers
     *  look up the thumb's *current* index (via _thumbs.indexOf) so the
     *  same element can be reused across reorders. */
    _makeThumb(slide) {
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      thumb.tabIndex = 0;
      const num = document.createElement('div');
      num.className = 'num';
      const frame = document.createElement('div');
      frame.className = 'frame';
      thumb.append(num, frame);
      const entry = {
        thumb,
        num,
        frame,
        slide,
        clone: null,
        host: null,
        i: -1
      };
      // entry.i is refreshed on every _renderRail reconcile pass, so
      // handlers read the thumb's current position without an O(N) scan.
      const idx = () => entry.i;
      thumb.addEventListener('click', () => this._go(idx(), 'click'));
      // ↑/↓ step through the rail when a thumb has focus. _go clamps at the
      // ends and _applyIndex→_syncRail scrolls the new current thumb into
      // view; we move focus to it (preventScroll — _syncRail already
      // scrolled) so a held key walks the whole list. stopPropagation keeps
      // this out of the window-level _onKey nav handler.
      thumb.addEventListener('keydown', e => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        this._go(idx() + (e.key === 'ArrowDown' ? 1 : -1), 'keyboard');
        const cur = this._thumbs && this._thumbs[this._index];
        if (cur) cur.thumb.focus({
          preventScroll: true
        });
      });
      thumb.addEventListener('contextmenu', e => {
        e.preventDefault();
        this._openMenu(idx(), e.clientX, e.clientY);
      });
      thumb.draggable = true;
      thumb.addEventListener('dragstart', e => {
        this._dragFrom = idx();
        thumb.setAttribute('data-dragging', '');
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', String(this._dragFrom));
        } catch (err) {}
      });
      thumb.addEventListener('dragend', () => {
        thumb.removeAttribute('data-dragging');
        this._clearDrop();
        this._dragFrom = null;
      });
      thumb.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const r = thumb.getBoundingClientRect();
        this._setDrop(idx(), e.clientY < r.top + r.height / 2 ? 'before' : 'after');
      });
      thumb.addEventListener('drop', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        const i = idx();
        const r = thumb.getBoundingClientRect();
        let to = e.clientY >= r.top + r.height / 2 ? i + 1 : i;
        if (this._dragFrom < to) to--;
        const from = this._dragFrom;
        this._clearDrop();
        this._dragFrom = null;
        if (to !== from) this._moveSlide(from, to);
      });
      if (this._railObserver) this._railObserver.observe(frame);
      frame.__deckThumb = entry;
      return entry;
    }

    /** Lazily build the clone for a thumb that has scrolled into view. */
    _materialize(entry) {
      if (entry.host) return;
      const dw = this.designWidth,
        dh = this.designHeight;
      let clone = entry.slide.cloneNode(true);
      clone.removeAttribute('id');
      clone.removeAttribute('data-deck-active');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      // Neuter heavy media; replace <video> with its poster so the box
      // keeps a visual. <iframe>/<audio> become empty placeholders.
      clone.querySelectorAll('iframe, audio, object, embed').forEach(el => {
        el.removeAttribute('src');
        el.removeAttribute('srcdoc');
        el.removeAttribute('data');
        el.innerHTML = '';
      });
      clone.querySelectorAll('video').forEach(el => {
        if (!el.poster) {
          el.removeAttribute('src');
          el.innerHTML = '';
          return;
        }
        const img = document.createElement('img');
        img.src = el.poster;
        img.alt = '';
        img.style.cssText = el.style.cssText + ';object-fit:cover;width:100%;height:100%;';
        img.className = el.className;
        el.replaceWith(img);
      });
      // Images: defer decode and let the browser pick the smallest
      // srcset candidate for the ~140px thumb. Same-URL clones reuse the
      // slide's decoded bitmap (URL-keyed cache), so the remaining cost
      // is paint/composite — lazy+async keeps that off the main thread.
      clone.querySelectorAll('img').forEach(el => {
        el.loading = 'lazy';
        el.decoding = 'async';
        if (el.srcset) el.sizes = (this._railPx || 188) + 'px';
      });
      // Custom elements inside the slide would have their
      // connectedCallback fire when the clone is appended. Replace them
      // with inert boxes so a component-heavy deck doesn't run N copies
      // of each component's mount logic in the rail. Children are
      // preserved so layout-wrapper elements (<my-column><h2>…</h2>)
      // still show their authored content; the querySelectorAll NodeList
      // is static, so nested custom elements in the moved subtree are
      // still visited on later iterations.
      const neuter = el => {
        const box = document.createElement('div');
        box.style.cssText = (el.getAttribute('style') || '') + ';background:rgba(0,0,0,0.06);border:1px dashed rgba(0,0,0,0.15);';
        box.className = el.className;
        // Preserve theming/i18n hooks so [data-*] / :lang() / [dir]
        // descendant selectors still match the neutered root.
        for (const a of el.attributes) {
          const n = a.name;
          if (n.startsWith('data-') || n.startsWith('aria-') || n === 'lang' || n === 'dir' || n === 'role' || n === 'title') {
            box.setAttribute(n, a.value);
          }
        }
        while (el.firstChild) box.appendChild(el.firstChild);
        return box;
      };
      // querySelectorAll('*') returns descendants only — a custom-element
      // slide root (<my-slide>…</my-slide>) would slip through and upgrade
      // on append. Swap the root first.
      if (clone.tagName.includes('-')) clone = neuter(clone);
      clone.querySelectorAll('*').forEach(el => {
        if (el.tagName.includes('-')) el.replaceWith(neuter(el));
      });
      clone.style.cssText += ';position:absolute;top:0;left:0;transform-origin:0 0;' + 'pointer-events:none;width:' + dw + 'px;height:' + dh + 'px;' + 'box-sizing:border-box;overflow:hidden;visibility:visible;opacity:1;';
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;inset:0;';
      this._syncThumbHostAttrs(host);
      const sr = host.attachShadow({
        mode: 'open'
      });
      if (this._adoptedSheet) sr.adoptedStyleSheets = [this._adoptedSheet];else {
        const st = document.createElement('style');
        st.textContent = this._authorCss || '';
        sr.appendChild(st);
      }
      sr.appendChild(clone);
      entry.frame.appendChild(host);
      entry.host = host;
      entry.clone = clone;
      if (this._thumbScale) clone.style.transform = 'scale(' + this._thumbScale + ')';
      // Once materialized the IO callback is a no-op early-return —
      // unobserve so scroll doesn't keep firing it.
      if (this._railObserver) this._railObserver.unobserve(entry.frame);
    }

    /** Re-clone a single thumb (live-update path). No-op if the thumb
     *  hasn't been materialized yet — it'll pick up current content when
     *  it scrolls into view. */
    _refreshThumb(slide) {
      const entry = (this._thumbs || []).find(t => t.slide === slide);
      if (!entry || !entry.host) return;
      entry.host.remove();
      entry.host = entry.clone = null;
      this._materialize(entry);
    }
    _scaleThumbs() {
      if (!this._thumbs || !this._thumbs.length) return;
      // Every frame is the same width; if it reads 0 the rail is
      // display:none (noscale / no-rail / presenting / print) — leave the
      // clones as-is and re-run when the rail is revealed.
      const fw = this._thumbs[0].frame.offsetWidth;
      if (!fw) return;
      this._thumbScale = fw / this.designWidth;
      this._thumbs.forEach(({
        clone
      }) => {
        if (clone) clone.style.transform = 'scale(' + this._thumbScale + ')';
      });
    }
    _setDrop(i, where) {
      // dragover fires at pointer-event rate; touch only the previous
      // and new target rather than sweeping all N thumbs.
      const t = this._thumbs && this._thumbs[i];
      if (this._dropOn && this._dropOn !== t) {
        this._dropOn.thumb.removeAttribute('data-drop');
      }
      if (t) t.thumb.setAttribute('data-drop', where);
      this._dropOn = t || null;
    }
    _clearDrop() {
      if (this._dropOn) this._dropOn.thumb.removeAttribute('data-drop');
      this._dropOn = null;
    }
    _syncRail(follow) {
      if (!this._thumbs) return;
      this._thumbs.forEach(({
        thumb
      }, i) => {
        if (i === this._index) {
          thumb.setAttribute('data-current', '');
          if (follow && typeof thumb.scrollIntoView === 'function') {
            thumb.scrollIntoView({
              block: 'nearest'
            });
          }
        } else {
          thumb.removeAttribute('data-current');
        }
      });
    }
    _openMenu(i, x, y) {
      if (!this._menu) return;
      this._menuIndex = i;
      const slide = this._slides[i];
      const skip = slide && slide.hasAttribute('data-deck-skip');
      this._menu.querySelector('[data-act="skip"]').textContent = skip ? 'Unskip slide' : 'Skip slide';
      this._menu.querySelector('[data-act="up"]').disabled = i <= 0;
      this._menu.querySelector('[data-act="down"]').disabled = i >= this._slides.length - 1;
      this._menu.querySelector('[data-act="delete"]').disabled = this._slides.length <= 1;
      // Place, then clamp to viewport after it's measurable.
      this._menu.style.left = x + 'px';
      this._menu.style.top = y + 'px';
      this._menu.setAttribute('data-open', '');
      const r = this._menu.getBoundingClientRect();
      const nx = Math.min(x, window.innerWidth - r.width - 4);
      const ny = Math.min(y, window.innerHeight - r.height - 4);
      this._menu.style.left = Math.max(4, nx) + 'px';
      this._menu.style.top = Math.max(4, ny) + 'px';
    }
    _closeMenu() {
      if (this._menu) this._menu.removeAttribute('data-open');
      this._menuIndex = -1;
    }
    _openConfirm(i) {
      if (!this._confirm) return;
      this._confirmIndex = i;
      this._confirm.querySelector('.title').textContent = 'Delete slide ' + (i + 1) + '?';
      this._confirm.setAttribute('data-open', '');
      const btn = this._confirm.querySelector('.danger');
      if (btn && btn.focus) btn.focus();
    }
    _closeConfirm() {
      if (this._confirm) this._confirm.removeAttribute('data-open');
      this._confirmIndex = -1;
    }

    /** Rail mutations. When a dc-runtime is present (`window.__dcUpdate`)
     *  the host owns the light DOM — handlers emit a dc-op only and the
     *  host applies it (to the editor's model or to the source file) and
     *  re-renders via dc-runtime; slotchange catches the rail up.
     *  Structural ops lock rail input until the host acks so a rapid second
     *  click can't address a stale index; setAttr/removeAttr respect the
     *  lock but don't set it (indices unchanged; the host serializes).
     *  `newIndex` is written to location.hash so slotchange's
     *  _restoreIndex lands on the right slide.
     *
     *  With NO dc-runtime (a raw .html deck), there's no re-render path,
     *  so handlers self-mutate locally for an instant update and emit
     *  `emitOnly: false`; the host persists to disk without
     *  re-rendering over the already-mutated DOM.
     *
     *  See docs/dc-ops.md for the contract. */
    _emitDcOp(op, slide, lock, newIndex) {
      // Slide index (template/script/style filtered — same as
      // _collectSlides). deck-stage is a filtered-index dc-op emitter;
      // the host resolves against findDeckStage().slideTids. Callers
      // already pass `to` as a slide index.
      op.at = this._slides.indexOf(slide);
      op.witness = {
        childCount: this._slides.length
      };
      // dc-runtime wraps an <x-import>-mounted component in a
      // <div class="sc-host-x" data-dc-tpl="N"> host — the stamp is on the
      // WRAPPER, not this element. closest() finds it (or this element's
      // own stamp when directly templated).
      const host = this.closest('[data-dc-tpl]');
      const tid = host && host.getAttribute('data-dc-tpl');
      op.mount = {
        tid: tid !== null ? parseInt(tid, 10) : null,
        tag: 'deck-stage'
      };
      op.emitOnly = !!window.__dcUpdate;
      if (op.emitOnly) {
        if (lock) this._railLock = true;
        if (newIndex != null && newIndex !== this._index) {
          this._indexBeforeEmit = this._index;
          this._index = newIndex;
          try {
            history.replaceState(null, '', '#' + (newIndex + 1));
          } catch (e) {}
        }
      }
      this.dispatchEvent(new CustomEvent('dc-op', {
        detail: op,
        bubbles: true,
        composed: true
      }));
      return op.emitOnly;
    }
    _deleteSlide(i) {
      if (this._railLock) return;
      const slide = this._slides[i];
      if (!slide || this._slides.length <= 1) return;
      const cur = this._index;
      const ni = i < cur || i === cur && i === this._slides.length - 1 ? cur - 1 : cur;
      if (this._emitDcOp({
        op: 'remove'
      }, slide, true, ni)) return;
      this._index = ni;
      this._squelchSlotChange = true;
      slide.remove();
      this._collectSlides();
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason: 'mutation'
      });
    }
    _duplicateSlide(i) {
      if (this._railLock) return;
      const slide = this._slides[i];
      if (!slide) return;
      if (this._emitDcOp({
        op: 'duplicate'
      }, slide, true, i + 1)) return;
      const copy = slide.cloneNode(true);
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      this._index = i + 1;
      this._squelchSlotChange = true;
      this.insertBefore(copy, slide.nextSibling);
      this._collectSlides();
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason: 'mutation'
      });
    }
    _toggleSkip(i) {
      if (this._railLock) return;
      const slide = this._slides[i];
      if (!slide) return;
      const on = !slide.hasAttribute('data-deck-skip');
      if (this._emitDcOp(on ? {
        op: 'setAttr',
        attr: 'data-deck-skip',
        value: ''
      } : {
        op: 'removeAttr',
        attr: 'data-deck-skip'
      }, slide, false)) return;
      if (on) slide.setAttribute('data-deck-skip', '');else slide.removeAttribute('data-deck-skip');
    }
    _skippedIndices() {
      const out = [];
      for (let i = 0; i < this._slides.length; i++) {
        if (this._slides[i].hasAttribute('data-deck-skip')) out.push(i);
      }
      return out;
    }
    _moveSlide(i, j) {
      if (this._railLock || j < 0 || j >= this._slides.length || j === i) return;
      const cur = this._index;
      const ni = cur === i ? j : i < cur && j >= cur ? cur - 1 : i > cur && j <= cur ? cur + 1 : cur;
      const slide = this._slides[i];
      if (this._emitDcOp({
        op: 'move',
        to: j
      }, slide, true, ni)) return;
      const ref = j < i ? this._slides[j] : this._slides[j].nextSibling;
      this._index = ni;
      this._squelchSlotChange = true;
      this.insertBefore(slide, ref);
      this._collectSlides();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'mutation'
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._advance(1, 'api');
    }
    prev() {
      this._advance(-1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "deliverables/formation-ia/deck-stage.js", error: String((e && e.message) || e) }); }

// export/ref/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/ref/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// slides/ClosingSlide.jsx
try { (() => {
/* global React */
/* Closing slide — required Attorney Advertising disclaimer + wordmark */
function ClosingSlide() {
  return /*#__PURE__*/React.createElement("section", {
    className: "dark",
    "data-screen-label": "08 Closing",
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: '88px 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: 'rgba(255,255,255,.7)'
    }
  }, "Thank you"), /*#__PURE__*/React.createElement("img", {
    src: "../assets/logos/gibson-dunn-wordmark-white.png",
    alt: "Gibson Dunn",
    style: {
      height: 28
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 132,
      lineHeight: '124px',
      letterSpacing: '-0.04em',
      color: '#fff',
      textTransform: 'uppercase'
    }
  }, "Thank", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#2E69FF'
    }
  }, "You.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      fontWeight: 400,
      fontSize: 26,
      lineHeight: '34px',
      letterSpacing: '-0.02em',
      color: 'rgba(255,255,255,.85)',
      maxWidth: 900
    }
  }, "For questions or follow-up, please contact the Gibson Dunn Office of General Counsel."))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 13,
      lineHeight: '17px',
      letterSpacing: '-0.005em',
      color: 'rgba(255,255,255,.55)',
      maxWidth: 1700
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'rgba(255,255,255,.85)',
      fontWeight: 700
    }
  }, "Attorney Advertising:"), " These materials were prepared for general informational purposes only based on information available at the time of publication and are not intended as, do not constitute, and should not be relied upon as, legal advice or a legal opinion on any specific facts or circumstances. Gibson Dunn (and its affiliates, attorneys, and employees) shall not have any liability in connection with any use of these materials. The sharing of these materials does not establish an attorney-client relationship with the recipient and should not be relied upon as an alternative for advice from qualified counsel. Please note that facts and circumstances may vary, and prior results do not guarantee a similar outcome. \xA9 2026 Gibson, Dunn & Crutcher LLP. All rights reserved. For contact and other information, please visit us at gibsondunn.com."));
}
window.ClosingSlide = ClosingSlide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/ClosingSlide.jsx", error: String((e && e.message) || e) }); }

// slides/ContentSlide.jsx
try { (() => {
/* global React */
/* Firm Overview — left text panel + right photo (placeholder cool architectural) */
function ContentSlide() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "04 Firm Overview",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 56%',
      padding: '88px 96px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow"
  }, "04 / Firm Overview"), /*#__PURE__*/React.createElement("h1", {
    className: "gd-h2",
    style: {
      marginTop: 24,
      fontSize: 72,
      lineHeight: '72px'
    }
  }, "A leading global", /*#__PURE__*/React.createElement("br", null), "law firm, advising", /*#__PURE__*/React.createElement("br", null), "on the world's", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, "most consequential"), /*#__PURE__*/React.createElement("br", null), "matters."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 64,
      lineHeight: '64px',
      letterSpacing: '-0.04em',
      color: '#000'
    }
  }, "2,200", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#2E69FF'
    }
  }, "+")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '24px',
      letterSpacing: '-0.02em',
      color: '#666'
    }
  }, "Lawyers worldwide")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 64,
      lineHeight: '64px',
      letterSpacing: '-0.04em',
      color: '#000'
    }
  }, "23"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '24px',
      letterSpacing: '-0.02em',
      color: '#666'
    }
  }, "Offices across four continents")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 64,
      lineHeight: '64px',
      letterSpacing: '-0.04em',
      color: '#000'
    }
  }, "1", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#2E69FF'
    }
  }, ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '24px',
      letterSpacing: '-0.02em',
      color: '#666'
    }
  }, "Unified firm. One partnership."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      fontWeight: 400,
      fontSize: 22,
      lineHeight: '30px',
      letterSpacing: '-0.02em',
      color: '#000',
      maxWidth: 760
    }
  }, "Our exceptional teams craft and deploy ", /*#__PURE__*/React.createElement("strong", null, "creative legal strategies"), ' ', "meticulously tailored to every matter, however complex or high-stakes \u2014 forging deep partnerships with our clients, helping them face tough challenges with courage and thrive in unprecedented times.")), /*#__PURE__*/React.createElement("div", {
    className: "vrule",
    style: {
      flex: '0 0 2px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #c5d4ea 0%, #6f88ad 60%, #2c3a55 100%)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%",
    viewBox: "0 0 840 1080",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "120",
    y: "120",
    width: "600",
    height: "960",
    fill: "#2a3a55"
  }), Array.from({
    length: 32
  }).map((_, r) => Array.from({
    length: 12
  }).map((_, c) => {
    const lit = (r * 7 + c * 3) % 11 === 0;
    return /*#__PURE__*/React.createElement("rect", {
      key: r + '-' + c,
      x: 120 + c * 50 + 4,
      y: 120 + r * 30 + 2,
      width: "42",
      height: "26",
      fill: lit ? 'rgba(214,228,255,0.85)' : 'rgba(180,205,235,0.35)'
    });
  })), Array.from({
    length: 13
  }).map((_, c) => /*#__PURE__*/React.createElement("line", {
    key: 'm' + c,
    x1: 120 + c * 50,
    y1: "120",
    x2: 120 + c * 50,
    y2: "1080",
    stroke: "rgba(20,30,50,0.7)",
    strokeWidth: "2"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "slide-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: "../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "source"
  }, "Source: Firm fact sheet, 2026"), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, "04"))));
}
window.ContentSlide = ContentSlide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/ContentSlide.jsx", error: String((e && e.message) || e) }); }

// slides/QuoteSlide.jsx
try { (() => {
/* global React */
/* Big Quote slide — full-bleed, bold black quote with blue source */
function QuoteSlide() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "06 Quote",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 30%',
      background: '#F2F2F2',
      padding: '96px 80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow"
  }, "06 / Recognition"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../assets/awards/chambers-usa-2025.jpeg",
    alt: "Chambers USA 2025",
    style: {
      width: 200,
      height: 'auto',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '24px',
      letterSpacing: '-0.02em',
      color: '#666'
    }
  }, "Chambers USA, 2025", /*#__PURE__*/React.createElement("br", null), "America's Leading Lawyers for Business")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: '#000'
    }
  }, "What clients say")), /*#__PURE__*/React.createElement("div", {
    className: "vrule",
    style: {
      flex: '0 0 2px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '96px 96px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 84,
      lineHeight: '94px',
      letterSpacing: '-0.035em',
      color: '#000',
      maxWidth: 1100
    }
  }, '\u201C', "They are ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#2E69FF'
    }
  }, "brilliant strategists"), ".", ' ', "They try cases and are very successful. Their stellar reputation is much deserved.", '\u201D'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      fontWeight: 400,
      fontSize: 30,
      lineHeight: '36px',
      letterSpacing: '-0.02em',
      color: '#2E69FF'
    }
  }, "Chambers USA")), /*#__PURE__*/React.createElement("div", {
    className: "slide-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: "../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, "06")));
}
window.QuoteSlide = QuoteSlide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/QuoteSlide.jsx", error: String((e && e.message) || e) }); }

// slides/SectionDividerSlide.jsx
try { (() => {
/* global React */
/* Section Divider — large "01 / FIRM OVERVIEW" black panel + blue panel */
function SectionDividerSlide({
  number = '01',
  title = 'Firm Overview',
  sub = 'Who we are, what we do, where we do it'
}) {
  const [first, ...rest] = title.split(' ');
  const lastWord = rest.pop() || '';
  const middle = rest.join(' ');
  return /*#__PURE__*/React.createElement("section", {
    className: "dark",
    "data-screen-label": `03 Section ${number}`,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 36%',
      background: '#000',
      color: '#fff',
      padding: '96px 80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: 'rgba(255,255,255,.7)'
    }
  }, "Section"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 280,
      lineHeight: '240px',
      letterSpacing: '-0.06em',
      color: '#fff'
    }
  }, number), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 22px/22px var(--font-sans)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: '#fff'
    }
  }, "Gibson Dunn")), /*#__PURE__*/React.createElement("div", {
    className: "vrule white",
    style: {
      flex: '0 0 2px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: '#2E69FF',
      color: '#fff',
      padding: '96px 96px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: 'rgba(255,255,255,.75)'
    }
  }, "2026 \u2014 Strategic Overview"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 132,
      lineHeight: '124px',
      letterSpacing: '-0.04em',
      textTransform: 'uppercase'
    }
  }, first, /*#__PURE__*/React.createElement("br", null), middle && /*#__PURE__*/React.createElement(React.Fragment, null, middle, " "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(255,255,255,0.55)'
    }
  }, lastWord)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 26,
      lineHeight: '32px',
      letterSpacing: '-0.02em',
      maxWidth: 720
    }
  }, sub), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 36,
      right: 64,
      fontWeight: 700,
      fontSize: 14,
      color: '#fff'
    }
  }, "03")));
}
window.SectionDividerSlide = SectionDividerSlide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/SectionDividerSlide.jsx", error: String((e && e.message) || e) }); }

// slides/StatBlockSlide.jsx
try { (() => {
/* global React */
/* Stat block — three full-bleed colored panels with key numbers */
function StatBlockSlide() {
  return /*#__PURE__*/React.createElement("section", {
    className: "dark",
    "data-screen-label": "07 By the Numbers",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: '#000',
      color: '#fff',
      padding: '96px 80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: 'rgba(255,255,255,.7)'
    }
  }, "Recognition"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 220,
      lineHeight: '200px',
      letterSpacing: '-0.05em'
    }
  }, "425"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontWeight: 400,
      fontSize: 26,
      lineHeight: '32px',
      letterSpacing: '-0.02em',
      color: 'rgba(255,255,255,.85)',
      maxWidth: 420
    }
  }, "Chambers USA 2025 rankings, including 130 first-tier rankings and 305 individual lawyer rankings.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: 'rgba(255,255,255,.6)'
    }
  }, "01 / 03")), /*#__PURE__*/React.createElement("div", {
    className: "vrule white",
    style: {
      flex: '0 0 2px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: '#2E69FF',
      color: '#fff',
      padding: '96px 80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: 'rgba(255,255,255,.75)'
    }
  }, "Volume"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 220,
      lineHeight: '200px',
      letterSpacing: '-0.05em'
    }
  }, "2,200", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5
    }
  }, "+")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontWeight: 400,
      fontSize: 26,
      lineHeight: '32px',
      letterSpacing: '-0.02em',
      maxWidth: 420
    }
  }, "Lawyers across 23 offices on four continents, operating as a single, unified firm.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: 'rgba(255,255,255,.7)'
    }
  }, "02 / 03")), /*#__PURE__*/React.createElement("div", {
    className: "vrule white",
    style: {
      flex: '0 0 2px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: '#fff',
      color: '#000',
      padding: '96px 80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow"
  }, "Reach"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 220,
      lineHeight: '200px',
      letterSpacing: '-0.05em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#2E69FF'
    }
  }, "$60B")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontWeight: 400,
      fontSize: 26,
      lineHeight: '32px',
      letterSpacing: '-0.02em',
      color: '#000',
      maxWidth: 420
    }
  }, "Combined value of the Borouge / Borealis / Nova Chemicals deal advised in 2025 \u2014 one of dozens at this scale.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: '#666'
    }
  }, "03 / 03")));
}
window.StatBlockSlide = StatBlockSlide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/StatBlockSlide.jsx", error: String((e && e.message) || e) }); }

// slides/TOCSlide.jsx
try { (() => {
/* global React */
/* Table of Contents — split black/blue layout from deck overview */
function TOCSlide() {
  const items = ['Firm Overview', 'Practice Areas', 'Representative Transactions', 'Litigation Matters', 'Awards & Accolades', 'Our Team', 'Fee Approach'];
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "02 Contents",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 38%',
      background: '#2E69FF',
      color: '#fff',
      padding: '96px 80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: 'rgba(255,255,255,.75)'
    }
  }, "02 / Contents"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 92,
      lineHeight: '88px',
      letterSpacing: '-0.035em',
      textTransform: 'uppercase'
    }
  }, "Table of", /*#__PURE__*/React.createElement("br", null), "Contents")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '24px',
      letterSpacing: '-0.02em',
      color: 'rgba(255,255,255,.85)'
    }
  }, "A reference for the document.", /*#__PURE__*/React.createElement("br", null), "Sections are numbered consecutively.")), /*#__PURE__*/React.createElement("div", {
    className: "vrule white",
    style: {
      flex: '0 0 2px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: '#fff',
      padding: '96px 96px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      counterReset: 'gd 0'
    }
  }, items.map((label, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 28,
      padding: '22px 0',
      borderTop: i === 0 ? 'none' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 22,
      lineHeight: '26px',
      letterSpacing: '-0.01em',
      color: '#2E69FF',
      width: 52,
      flexShrink: 0
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 32,
      lineHeight: '36px',
      letterSpacing: '-0.025em',
      color: '#000',
      flex: 1
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '22px',
      letterSpacing: '-0.01em',
      color: '#666'
    }
  }, (i + 1) * 2 + 2))))), /*#__PURE__*/React.createElement("div", {
    className: "slide-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: "../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, "02")));
}
window.TOCSlide = TOCSlide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/TOCSlide.jsx", error: String((e && e.message) || e) }); }

// slides/TitleSlide.jsx
try { (() => {
/* global React */
const {
  useEffect,
  useRef
} = React;

/* ============================================================
   01 — Title / Cover slide
   Black panel left with "GIBSON DUNN" wordmark, full-bleed
   architectural photo on the right (placeholder shown as a
   neutral cool block until the user supplies real imagery).
   ============================================================ */
function TitleSlide() {
  return /*#__PURE__*/React.createElement("section", {
    className: "dark",
    "data-screen-label": "01 Title",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 50%',
      background: '#000',
      padding: '96px 80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: 'rgba(255,255,255,.7)'
    }
  }, "Office of General Counsel"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 152,
      lineHeight: '136px',
      letterSpacing: '-0.04em',
      textTransform: 'uppercase'
    }
  }, "Gibson", /*#__PURE__*/React.createElement("br", null), "Dunn"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      fontWeight: 700,
      fontSize: 56,
      lineHeight: '60px',
      letterSpacing: '-0.03em',
      textTransform: 'uppercase',
      color: '#2E69FF'
    }
  }, "2026 Strategic", /*#__PURE__*/React.createElement("br", null), "Overview")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 22,
      lineHeight: '28px',
      letterSpacing: '-0.02em',
      color: 'rgba(255,255,255,.85)'
    }
  }, "Prepared for the Firm"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontWeight: 700,
      fontSize: 22,
      lineHeight: '28px',
      letterSpacing: '-0.02em',
      color: '#fff'
    }
  }, "April 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 36,
      left: 80,
      fontSize: 14,
      fontWeight: 400,
      letterSpacing: '-0.01em',
      color: 'rgba(255,255,255,.65)'
    }
  }, "Confidential. Not for further distribution.")), /*#__PURE__*/React.createElement("div", {
    className: "vrule white",
    style: {
      flex: '0 0 2px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'linear-gradient(180deg, #1f2a44 0%, #0c1224 60%, #060a18 100%)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%",
    viewBox: "0 0 960 1080",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sky",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#3a557e"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#0a0f20"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "960",
    height: "1080",
    fill: "url(#sky)"
  }), Array.from({
    length: 18
  }).map((_, i) => /*#__PURE__*/React.createElement("line", {
    key: 'v' + i,
    x1: i * 55,
    y1: "0",
    x2: i * 55,
    y2: "1080",
    stroke: "rgba(255,255,255,0.07)",
    strokeWidth: "1"
  })), Array.from({
    length: 26
  }).map((_, i) => /*#__PURE__*/React.createElement("line", {
    key: 'h' + i,
    x1: "0",
    y1: i * 45,
    x2: "960",
    y2: i * 45,
    stroke: "rgba(255,255,255,0.05)",
    strokeWidth: "1"
  })), [[3, 7], [5, 11], [8, 3], [10, 18], [12, 9], [14, 15], [7, 22], [9, 6], [11, 14], [2, 19], [15, 5], [6, 17]].map(([x, y], i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    x: x * 55 + 1,
    y: y * 45 + 1,
    width: "53",
    height: "43",
    fill: "rgba(214,228,255,0.18)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 36,
      right: 64,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: '-0.01em',
      color: 'rgba(255,255,255,.85)'
    }
  }, "01")));
}
window.TitleSlide = TitleSlide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/TitleSlide.jsx", error: String((e && e.message) || e) }); }

// slides/TwoColumnSlide.jsx
try { (() => {
/* global React */
/* Two-column Representative Transactions — bullet list across two columns */
function TwoColumnSlide() {
  const items = [{
    client: 'SpaceX',
    text: 'Advised on its $17 billion acquisition of EchoStar\'s full portfolio of AWS-4 and H-block 50 MHz spectrum licenses.'
  }, {
    client: 'Merck',
    text: 'Advised on its $9.2 billion acquisition of Cidara Therapeutics, a biotechnology company developing drug-Fc conjugate therapeutics.'
  }, {
    client: 'KKR',
    text: 'Advised on its $5 billion investment in Gulf Data Hub, one of the largest independent data center platforms in the Middle East.'
  }, {
    client: 'AT&T',
    text: 'Advised on its $5.8 billion acquisition of substantially all of Lumen\'s Mass Markets fiber business.'
  }, {
    client: 'Blackstone Infrastructure',
    text: 'Advised on its agreement to acquire Safe Harbor Marinas from Sun Communities for $5.7 billion.'
  }, {
    client: 'Apollo Global Management',
    text: 'Advised on the hybrid capital financing for the take-private of Soho House at a $2.7 billion enterprise value.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "05 Transactions",
    style: {
      display: 'block',
      padding: '96px 96px 120px 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow"
  }, "05 / Representative Transactions"), /*#__PURE__*/React.createElement("h1", {
    className: "gd-h2",
    style: {
      marginTop: 16,
      fontSize: 64,
      lineHeight: '66px'
    }
  }, "Selected ", /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, "2025\u20132026"), " Engagements"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      display: 'grid',
      gridTemplateColumns: '1fr 2px 1fr',
      columnGap: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, items.slice(0, 3).map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderTop: '2px solid #000',
      padding: '24px 0 28px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 26,
      lineHeight: '30px',
      letterSpacing: '-0.025em',
      color: '#2E69FF'
    }
  }, it.client), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontWeight: 400,
      fontSize: 22,
      lineHeight: '30px',
      letterSpacing: '-0.02em',
      color: '#000'
    }
  }, it.text)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#000'
    }
  }), /*#__PURE__*/React.createElement("div", null, items.slice(3).map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderTop: '2px solid #000',
      padding: '24px 0 28px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 26,
      lineHeight: '30px',
      letterSpacing: '-0.025em',
      color: '#2E69FF'
    }
  }, it.client), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontWeight: 400,
      fontSize: 22,
      lineHeight: '30px',
      letterSpacing: '-0.02em',
      color: '#000'
    }
  }, it.text))))), /*#__PURE__*/React.createElement("div", {
    className: "slide-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: "../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "source"
  }, "Source: Firm announcements, 2025\u20132026"), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, "05"))));
}
window.TwoColumnSlide = TwoColumnSlide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/TwoColumnSlide.jsx", error: String((e && e.message) || e) }); }

// slides/deck-stage.js
try { (() => {
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const pad2 = n => String(n).padStart(2, '0');
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
    }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    /* Tap zones for mobile — back/forward thirds like Stories.
       Transparent, no visible UI, don't block the overlay. */
    .tapzones {
      position: fixed;
      inset: 0;
      display: flex;
      z-index: 2147482000;
      pointer-events: none;
    }
    .tapzone {
      flex: 1;
      pointer-events: auto;
      -webkit-tap-highlight-color: transparent;
    }
    /* Only activate tap zones on coarse pointers (touch devices). */
    @media (hover: hover) and (pointer: fine) {
      .tapzones { display: none; }
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      ::slotted(*:last-child) {
        break-after: auto;
        page-break-after: auto;
      }
      .overlay, .tapzones { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTapBack = this._onTapBack.bind(this);
      this._onTapForward = this._onTapForward.bind(this);
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      // Initial collection + layout happens via slotchange, which fires on mount.
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        this._fit();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Tap zones (mobile): left third = back, right third = forward.
      const tapzones = document.createElement('div');
      tapzones.className = 'tapzones export-hidden';
      tapzones.setAttribute('aria-hidden', 'true');
      tapzones.setAttribute('data-noncommentable', '');
      const tzBack = document.createElement('div');
      tzBack.className = 'tapzone tapzone--back';
      const tzMid = document.createElement('div');
      tzMid.className = 'tapzone tapzone--mid';
      tzMid.style.pointerEvents = 'none';
      const tzFwd = document.createElement('div');
      tzFwd.className = 'tapzone tapzone--fwd';
      tzBack.addEventListener('click', this._onTapBack);
      tzFwd.addEventListener('click', this._onTapForward);
      tapzones.append(tzBack, tzMid, tzFwd);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-noncommentable', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._go(this._index - 1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._go(this._index + 1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));
      this._root.append(style, stage, tapzones, overlay);
      this._canvas = canvas;
      this._slot = slot;
      this._overlay = overlay;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    }
    _onSlotChange() {
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        // Determine a label for comment flow: prefer explicit data-label,
        // then an existing data-screen-label, then first heading, else "Slide".
        let label = slide.getAttribute('data-label');
        if (!label) {
          const existing = slide.getAttribute('data-screen-label');
          if (existing) {
            // Strip any leading number the author may have included.
            label = existing.replace(/^\s*\d+\s*/, '').trim() || existing;
          }
        }
        if (!label) {
          const h = slide.querySelector('h1, h2, h3, [data-title]');
          if (h) label = (h.textContent || '').trim().slice(0, 40);
        }
        if (!label) label = 'Slide';
        slide.setAttribute('data-screen-label', `${pad2(n)} ${label}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
    }
    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) {
        this._notes = [];
        return;
      }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      if (!this._overlay) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _fit() {
      if (!this._canvas) return;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        return;
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onTapBack(e) {
      e.preventDefault();
      this._go(this._index - 1, 'tap');
    }
    _onTapForward(e) {
      e.preventDefault();
      this._go(this._index + 1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._go(this._index + 1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._go(this._index - 1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._go(this._index + 1, 'api');
    }
    prev() {
      this._go(this._index - 1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/deck-stage.js", error: String((e && e.message) || e) }); }

// slides/sp-components.jsx
try { (() => {
/* global React */
/* ============================================================
   Step plan indicatif — reusable building blocks
   Built on colors_and_type.css + slides.css. Canvas 1920×1080.
   Brand rules respected: Arial, black/white/gray + GD blue,
   square corners, VERTICAL rules only.
   ============================================================ */

const SP_FOOTER_TEXT = "Step plan indicatif — document de travail confidentiel — à des fins de discussion uniquement";

/* ---- Footer (wordmark + confidentiality line + page no.) ---- */
function SPFooter({
  page,
  dark = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "slide-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: dark ? "../assets/logos/gibson-dunn-wordmark-white.png" : "../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "source"
  }, SP_FOOTER_TEXT), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, page)));
}

/* ---- Eyebrow + title + subtitle header used on content slides ---- */
function SPHeader({
  eyebrow,
  title,
  accent,
  subtitle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "gd-h2",
    style: {
      marginTop: 18,
      fontSize: 50,
      lineHeight: "52px"
    }
  }, title, " ", accent && /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, accent)), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontWeight: 400,
      fontSize: 26,
      lineHeight: "32px",
      letterSpacing: "-0.02em",
      color: "#666"
    }
  }, subtitle));
}

/* ---- Vertical timeline: continuous blue rule + square nodes ----
   rows: [{ date, event, note }]  */
function VTimeline({
  rows,
  dateWidth = 230,
  rowGap = 22
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: dateWidth,
      top: 12,
      bottom: 18,
      width: 2,
      background: "#2E69FF"
    }
  }), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: `${dateWidth}px 1fr`,
      columnGap: 44,
      marginBottom: i === rows.length - 1 ? 0 : rowGap
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      paddingRight: 26,
      fontWeight: 700,
      fontSize: 28,
      lineHeight: "30px",
      letterSpacing: "-0.02em",
      color: "#000",
      paddingTop: 2
    }
  }, r.date), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: dateWidth,
      top: 6,
      width: 12,
      height: 12,
      background: "#2E69FF",
      transform: "translateX(-50%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 25,
      lineHeight: "30px",
      letterSpacing: "-0.02em",
      color: "#000"
    }
  }, r.event), r.note && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontWeight: 400,
      fontSize: 21,
      lineHeight: "27px",
      letterSpacing: "-0.015em",
      color: "#666",
      maxWidth: 1180
    }
  }, r.note)))));
}

/* ---- Generic sequence slide (used 4×) ---- */
function SequenceSlide({
  eyebrow,
  title,
  accent,
  subtitle,
  rows,
  page,
  rowGap
}) {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": eyebrow,
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "78px 96px 0",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(SPHeader, {
    eyebrow: eyebrow,
    title: title,
    accent: accent,
    subtitle: subtitle
  }), /*#__PURE__*/React.createElement(VTimeline, {
    rows: rows,
    rowGap: rowGap
  })), /*#__PURE__*/React.createElement(SPFooter, {
    page: page
  }));
}
Object.assign(window, {
  SPFooter,
  SPHeader,
  VTimeline,
  SequenceSlide,
  SP_FOOTER_TEXT
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/sp-components.jsx", error: String((e && e.message) || e) }); }

// slides/sp-slides.jsx
try { (() => {
/* global React, SequenceSlide, SPFooter */

/* ============================================================
   01 — Couverture
   ============================================================ */
function TitleSP() {
  return /*#__PURE__*/React.createElement("section", {
    className: "dark",
    "data-screen-label": "01 Couverture",
    style: {
      display: "flex",
      flexDirection: "column",
      padding: "96px 110px",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logos/gibson-dunn-wordmark-white.png",
    alt: "Gibson Dunn",
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: "rgba(255,255,255,.7)"
    }
  }, "Restructuration financi\xE8re")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "vrule blue",
    style: {
      flex: "0 0 3px"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 132,
      lineHeight: "120px",
      letterSpacing: "-0.04em",
      textTransform: "uppercase",
      color: "#fff"
    }
  }, "Step plan", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#2E69FF"
    }
  }, "indicatif")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      fontWeight: 400,
      fontSize: 30,
      lineHeight: "40px",
      letterSpacing: "-0.02em",
      color: "rgba(255,255,255,.85)",
      maxWidth: 1080
    }
  }, "Conciliations, sauvegardes acc\xE9l\xE9r\xE9es et mise en \u0153uvre de l'accord."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 22,
      letterSpacing: "-0.02em",
      color: "rgba(255,255,255,.7)"
    }
  }, "Mise \xE0 jour"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "-0.02em",
      color: "#fff"
    }
  }, "10 juin 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 16,
      letterSpacing: "-0.01em",
      color: "rgba(255,255,255,.6)"
    }
  }, "Document de travail \u2014 confidentiel \u2014 privil\xE9gi\xE9")));
}

/* ============================================================
   02 — Avertissement / Note liminaire
   ============================================================ */
function DisclaimerSP() {
  const body = {
    fontWeight: 400,
    fontSize: 21,
    lineHeight: "29px",
    letterSpacing: "-0.015em",
    color: "#333"
  };
  const lead = {
    fontSize: 24,
    lineHeight: "33px",
    color: "#000"
  };
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "02 Avertissement",
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "84px 96px 0",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow"
  }, "Avertissement"), /*#__PURE__*/React.createElement("h1", {
    className: "gd-h2",
    style: {
      marginTop: 18,
      fontSize: 50,
      lineHeight: "52px"
    }
  }, "Note liminaire"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...body,
      ...lead,
      marginTop: 38,
      maxWidth: 1640
    }
  }, "Le tableau ci-apr\xE8s constitue une pr\xE9sentation ", /*#__PURE__*/React.createElement("strong", null, "indicative et de haut niveau"), " des principales \xE9tapes juridiques de la restructuration financi\xE8re envisag\xE9e de la Soci\xE9t\xE9 et de certaines de ses filiales, telle que refl\xE9t\xE9e dans le ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "normal",
      fontWeight: 700
    }
  }, "Restructuring Term Sheet"), ". Il a \xE9t\xE9 pr\xE9par\xE9 \xE0 des fins de discussion uniquement."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      display: "grid",
      gridTemplateColumns: "1fr 2px 1fr",
      columnGap: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "gd-body-header-lg",
    style: {
      fontSize: 14,
      marginBottom: 12
    }
  }, "Note importante"), /*#__PURE__*/React.createElement("div", {
    style: body
  }, "Les dates indiqu\xE9es au titre des proc\xE9dures judiciaires et des \xE9tapes proc\xE9durales correspondantes le sont \xE0 titre ", /*#__PURE__*/React.createElement("strong", null, "purement illustratif"), " et sont susceptibles de varier en fonction de nombreux facteurs. Les d\xE9lais sont calcul\xE9s conform\xE9ment aux articles 640 et suivants du Code de proc\xE9dure civile. Lorsqu'un d\xE9lai expire un samedi, un dimanche ou un jour f\xE9ri\xE9 ou ch\xF4m\xE9, il est prorog\xE9 jusqu'au premier jour ouvrable suivant.", /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#666"
    }
  }, "Jours f\xE9ri\xE9s sur la p\xE9riode : "), "6 avril, 1", /*#__PURE__*/React.createElement("sup", null, "er"), " mai, 8 mai, 14 mai, 25 mai, 14 juillet, 15 ao\xFBt, 1", /*#__PURE__*/React.createElement("sup", null, "er"), " novembre et 11 novembre 2026."))), /*#__PURE__*/React.createElement("div", {
    className: "vrule",
    style: {
      background: "#CCC"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "gd-body-header-lg",
    style: {
      fontSize: 14,
      marginBottom: 12
    }
  }, "R\xE9serves"), /*#__PURE__*/React.createElement("div", {
    style: body
  }, "D'autres \xE9tapes juridiques pourront devoir \xEAtre ajout\xE9es le cas \xE9ch\xE9ant, notamment au titre de la repr\xE9sentation du personnel, en fonction du p\xE9rim\xE8tre et du contenu de l'op\xE9ration.", /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, "Les termes commen\xE7ant par une majuscule et non d\xE9finis dans le pr\xE9sent step plan ont le sens qui leur est attribu\xE9 dans le ", /*#__PURE__*/React.createElement("strong", null, "Restructuring Term Sheet"), "."))))), /*#__PURE__*/React.createElement(SPFooter, {
    page: "2"
  }));
}

/* ============================================================
   03 — Vue d'ensemble : 3 séquences + 7 jalons + point d'attention
   ============================================================ */
function Milestone({
  date,
  l1,
  l2
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      flex: 1,
      padding: "0 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      background: "#2E69FF",
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 24,
      lineHeight: "26px",
      letterSpacing: "-0.02em",
      color: "#000"
    }
  }, date), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontWeight: 400,
      fontSize: 17,
      lineHeight: "21px",
      letterSpacing: "-0.015em",
      color: "#666"
    }
  }, l1, /*#__PURE__*/React.createElement("br", null), l2));
}
function SeqGroup({
  tag,
  name,
  range,
  children,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      borderRight: last ? "none" : "2px solid #CCC",
      padding: "0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      fontSize: 13
    }
  }, tag), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontWeight: 700,
      fontSize: 22,
      lineHeight: "26px",
      letterSpacing: "-0.025em",
      color: "#000"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: "-0.01em",
      color: "#2E69FF",
      textTransform: "uppercase"
    }
  }, range), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30,
      display: "flex",
      flex: 1,
      alignItems: "flex-start"
    }
  }, children));
}
function OverviewSP() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "03 Vue d'ensemble",
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "84px 80px 0",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 34
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow"
  }, "Vue d'ensemble"), /*#__PURE__*/React.createElement("h1", {
    className: "gd-h2",
    style: {
      marginTop: 18,
      fontSize: 50,
      lineHeight: "52px"
    }
  }, "Trois s\xE9quences, de la conciliation au ", /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, "closing"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SeqGroup, {
    tag: "S\xE9quence 1",
    name: "Conciliation n\xB01 & documentation",
    range: "Mars \u2014 juillet 2026"
  }, /*#__PURE__*/React.createElement(Milestone, {
    date: "17 mars",
    l1: "Ouverture",
    l2: "conciliation n\xB01"
  }), /*#__PURE__*/React.createElement(Milestone, {
    date: "8 juin",
    l1: "Premi\xE8res versions",
    l2: "lock-up & 4 TS"
  }), /*#__PURE__*/React.createElement(Milestone, {
    date: "20 juil.",
    l1: "Signature",
    l2: "lock-up & TS"
  })), /*#__PURE__*/React.createElement(SeqGroup, {
    tag: "S\xE9quence 2",
    name: "Conciliation n\xB02 & ouverture des SFA",
    range: "Septembre 2026"
  }, /*#__PURE__*/React.createElement(Milestone, {
    date: "~25 sept.",
    l1: "Jugement d'ouverture",
    l2: "des SFA"
  })), /*#__PURE__*/React.createElement(SeqGroup, {
    tag: "S\xE9quence 3",
    name: "Vote & approbation du plan",
    range: "Octobre \u2014 novembre 2026",
    last: true
  }, /*#__PURE__*/React.createElement(Milestone, {
    date: "[20] oct.",
    l1: "Vote des classes",
    l2: "sur le plan"
  }), /*#__PURE__*/React.createElement(Milestone, {
    date: "9 nov.",
    l1: "Jugement",
    l2: "d'approbation"
  }), /*#__PURE__*/React.createElement(Milestone, {
    date: "Fin nov.",
    l1: "Closing",
    l2: "restructuration"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "gd-block-blue",
    style: {
      display: "flex",
      gap: 32,
      padding: "30px 40px",
      marginBottom: 88
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      paddingTop: 3
    }
  }, "Point d'attention"), /*#__PURE__*/React.createElement("div", {
    className: "vrule white",
    style: {
      flex: "0 0 2px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 20,
      lineHeight: "27px",
      letterSpacing: "-0.015em"
    }
  }, "Fin th\xE9orique de la conciliation n\xB01 le 17 ao\xFBt, incompatible avec une signature fin juillet \u2014 le calendrier repose sur une ", /*#__PURE__*/React.createElement("strong", null, "cl\xF4ture anticip\xE9e [\xE0 confirmer]"), ", le relais par des mandats ad hoc pendant le d\xE9lai de carence de 3 mois (art. L. 611-6 C. com.) et l'ouverture des conciliations n\xB02 mi-septembre."))), /*#__PURE__*/React.createElement(SPFooter, {
    page: "3"
  }));
}

/* ============================================================
   08 — Synthèse / Points de vigilance
   ============================================================ */
function VigCard({
  title,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "gd-block-tint",
    style: {
      display: "flex",
      gap: 24,
      padding: "30px 34px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "vrule blue",
    style: {
      flex: "0 0 2px"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 24,
      lineHeight: "28px",
      letterSpacing: "-0.025em",
      color: "#000"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontWeight: 400,
      fontSize: 20,
      lineHeight: "27px",
      letterSpacing: "-0.015em",
      color: "#666"
    }
  }, body)));
}
function SynthesisSP() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "08 Synth\xE8se",
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "84px 96px 0",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow"
  }, "Synth\xE8se"), /*#__PURE__*/React.createElement("h1", {
    className: "gd-h2",
    style: {
      marginTop: 18,
      fontSize: 50,
      lineHeight: "52px"
    }
  }, "Points de ", /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, "vigilance"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridAutoRows: "1fr",
      gap: 28,
      flex: 1,
      paddingBottom: 92
    }
  }, /*#__PURE__*/React.createElement(VigCard, {
    title: "Tension calendaire & articulation",
    body: "Fin th\xE9orique de la conciliation n\xB01 le 17 ao\xFBt, incompatible avec une signature fin juillet. Le calendrier repose sur une cl\xF4ture anticip\xE9e [\xE0 confirmer], le relais par mandats ad hoc pendant le d\xE9lai de carence de 3 mois (art. L. 611-6) et l'ouverture des conciliations n\xB02 mi-septembre."
  }), /*#__PURE__*/React.createElement(VigCard, {
    title: "Structure du deal non arr\xEAt\xE9e",
    body: "Niveau de soutien (RCF ? Apollo ?), valeur d'entreprise et faisabilit\xE9 d'un cross-class cramdown, structure tax au closing, p\xE9rim\xE8tre des proc\xE9dures (FR / US / UK), consent fee : autant de pr\xE9alables \xE0 la finalisation des TS."
  }), /*#__PURE__*/React.createElement(VigCard, {
    title: "Agent de calcul",
    body: "Souhait de la soci\xE9t\xE9 de retenir Glas ; mission jusqu'ici surtout r\xE9alis\xE9e en France par Kroll. \xC9changes plus cons\xE9quents \xE0 pr\xE9voir sur les modalit\xE9s d'impl\xE9mentation en sauvegarde acc\xE9l\xE9r\xE9e."
  }), /*#__PURE__*/React.createElement(VigCard, {
    title: "Liste des cr\xE9ances L. 628-7",
    body: "Certification par les CAC requise : un r\xE9troplanning d\xE9di\xE9 doit \xEAtre anticip\xE9 en amont de l'ouverture des SFA (semaine du 15 septembre)."
  }))), /*#__PURE__*/React.createElement(SPFooter, {
    page: "8"
  }));
}
Object.assign(window, {
  TitleSP,
  DisclaimerSP,
  OverviewSP,
  SynthesisSP
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/sp-slides.jsx", error: String((e && e.message) || e) }); }

// step-plan/deck-stage.js
try { (() => {
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const pad2 = n => String(n).padStart(2, '0');
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
    }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    /* Tap zones for mobile — back/forward thirds like Stories.
       Transparent, no visible UI, don't block the overlay. */
    .tapzones {
      position: fixed;
      inset: 0;
      display: flex;
      z-index: 2147482000;
      pointer-events: none;
    }
    .tapzone {
      flex: 1;
      pointer-events: auto;
      -webkit-tap-highlight-color: transparent;
    }
    /* Only activate tap zones on coarse pointers (touch devices). */
    @media (hover: hover) and (pointer: fine) {
      .tapzones { display: none; }
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      ::slotted(*:last-child) {
        break-after: auto;
        page-break-after: auto;
      }
      .overlay, .tapzones { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTapBack = this._onTapBack.bind(this);
      this._onTapForward = this._onTapForward.bind(this);
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      // Initial collection + layout happens via slotchange, which fires on mount.
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        this._fit();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Tap zones (mobile): left third = back, right third = forward.
      const tapzones = document.createElement('div');
      tapzones.className = 'tapzones export-hidden';
      tapzones.setAttribute('aria-hidden', 'true');
      tapzones.setAttribute('data-noncommentable', '');
      const tzBack = document.createElement('div');
      tzBack.className = 'tapzone tapzone--back';
      const tzMid = document.createElement('div');
      tzMid.className = 'tapzone tapzone--mid';
      tzMid.style.pointerEvents = 'none';
      const tzFwd = document.createElement('div');
      tzFwd.className = 'tapzone tapzone--fwd';
      tzBack.addEventListener('click', this._onTapBack);
      tzFwd.addEventListener('click', this._onTapForward);
      tapzones.append(tzBack, tzMid, tzFwd);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-noncommentable', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._go(this._index - 1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._go(this._index + 1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));
      this._root.append(style, stage, tapzones, overlay);
      this._canvas = canvas;
      this._slot = slot;
      this._overlay = overlay;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    }
    _onSlotChange() {
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        // Determine a label for comment flow: prefer explicit data-label,
        // then an existing data-screen-label, then first heading, else "Slide".
        let label = slide.getAttribute('data-label');
        if (!label) {
          const existing = slide.getAttribute('data-screen-label');
          if (existing) {
            // Strip any leading number the author may have included.
            label = existing.replace(/^\s*\d+\s*/, '').trim() || existing;
          }
        }
        if (!label) {
          const h = slide.querySelector('h1, h2, h3, [data-title]');
          if (h) label = (h.textContent || '').trim().slice(0, 40);
        }
        if (!label) label = 'Slide';
        slide.setAttribute('data-screen-label', `${pad2(n)} ${label}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
    }
    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) {
        this._notes = [];
        return;
      }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      if (!this._overlay) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _fit() {
      if (!this._canvas) return;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        return;
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onTapBack(e) {
      e.preventDefault();
      this._go(this._index - 1, 'tap');
    }
    _onTapForward(e) {
      e.preventDefault();
      this._go(this._index + 1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._go(this._index + 1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._go(this._index - 1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._go(this._index + 1, 'api');
    }
    prev() {
      this._go(this._index - 1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "step-plan/deck-stage.js", error: String((e && e.message) || e) }); }

// step-plan/sp-deck.jsx
try { (() => {
/* global React */
/* ============================================================
   Step plan indicatif — Gibson Dunn deck
   8 slides : couverture, synthèse, avertissement, vue
   d'ensemble, et 4 tableaux de séquences.
   ============================================================ */

const SOURCE = "Step plan indicatif — document de travail confidentiel — à des fins de discussion uniquement";
function Footer({
  page,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "slide-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: dark ? "assets/gibson-dunn-wordmark-white.png" : "assets/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "source"
  }, SOURCE), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, page)));
}

/* ---------- 1 — Couverture ---------- */
function CoverSlide() {
  return /*#__PURE__*/React.createElement("section", {
    className: "dark",
    "data-screen-label": "01 Couverture",
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "0 0 58%",
      background: "#000",
      color: "#fff",
      padding: "100px 88px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: "rgba(255,255,255,.7)"
    }
  }, "Restructuration financi\xE8re"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 116,
      lineHeight: "104px",
      letterSpacing: "-0.04em",
      textTransform: "uppercase"
    }
  }, "Step plan", /*#__PURE__*/React.createElement("br", null), "indicatif"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      fontWeight: 700,
      fontSize: 30,
      lineHeight: "38px",
      letterSpacing: "-0.025em",
      color: "#2E69FF",
      maxWidth: 820
    }
  }, "Conciliations, sauvegardes acc\xE9l\xE9r\xE9es et mise en \u0153uvre de l'accord")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "28px",
      letterSpacing: "-0.02em",
      color: "rgba(255,255,255,.85)"
    }
  }, "Mise \xE0 jour"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontWeight: 700,
      fontSize: 22,
      lineHeight: "28px",
      letterSpacing: "-0.02em",
      color: "#fff"
    }
  }, "10 juin 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 40,
      left: 88,
      fontSize: 14,
      fontWeight: 400,
      letterSpacing: "-0.01em",
      color: "rgba(255,255,255,.6)"
    }
  }, "Document de travail \u2014 confidentiel \u2014 privil\xE9gi\xE9")), /*#__PURE__*/React.createElement("div", {
    className: "vrule blue",
    style: {
      flex: "0 0 6px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: "#2E69FF",
      color: "#fff",
      padding: "100px 80px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gd-eyebrow",
    style: {
      color: "rgba(255,255,255,.8)"
    }
  }, "Strictement confidentiel"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 92,
      lineHeight: "82px",
      letterSpacing: "-0.04em",
      textTransform: "uppercase"
    }
  }, "Gibson", /*#__PURE__*/React.createElement("br", null), "Dunn"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 20,
      lineHeight: "27px",
      letterSpacing: "-0.015em",
      color: "rgba(255,255,255,.9)",
      maxWidth: 560
    }
  }, "Pr\xE9sentation indicative et de haut niveau des principales \xE9tapes juridiques de la restructuration financi\xE8re envisag\xE9e.")));
}

/* ---------- 2 — Synthèse / points de vigilance ---------- */
function SyntheseSlide() {
  const vigs = [{
    h: "Tension calendaire & articulation",
    b: /*#__PURE__*/React.createElement(React.Fragment, null, "Fin th\xE9orique de la conciliation n\xB01 le ", /*#__PURE__*/React.createElement("strong", null, "17 ao\xFBt"), ", incompatible avec une signature fin juillet. Le calendrier repose sur une cl\xF4ture anticip\xE9e [\xE0 confirmer], le relais par mandats ad hoc pendant le d\xE9lai de carence de 3 mois (art. L. 611-6) et l'ouverture des conciliations n\xB02 mi-septembre.")
  }, {
    h: "Structure du deal non arrêtée",
    b: /*#__PURE__*/React.createElement(React.Fragment, null, "Niveau de soutien (RCF\xA0? Apollo\xA0?), valeur d'entreprise et faisabilit\xE9 d'un ", /*#__PURE__*/React.createElement("strong", null, "cross-class cramdown"), ", structure tax au closing, p\xE9rim\xE8tre des proc\xE9dures (FR\xA0/\xA0US\xA0/\xA0UK), consent fee\xA0: autant de pr\xE9alables \xE0 la finalisation des TS.")
  }, {
    h: "Agent de calcul",
    b: /*#__PURE__*/React.createElement(React.Fragment, null, "Souhait de la soci\xE9t\xE9 de retenir ", /*#__PURE__*/React.createElement("strong", null, "Glas"), "\xA0; mission jusqu'ici surtout r\xE9alis\xE9e en France par Kroll. \xC9changes plus cons\xE9quents \xE0 pr\xE9voir sur les modalit\xE9s d'impl\xE9mentation en sauvegarde acc\xE9l\xE9r\xE9e.")
  }, {
    h: "Liste des créances L. 628-7",
    b: /*#__PURE__*/React.createElement(React.Fragment, null, "Certification par les ", /*#__PURE__*/React.createElement("strong", null, "CAC"), " requise\xA0: un r\xE9troplanning d\xE9di\xE9 doit \xEAtre anticip\xE9 en amont de l'ouverture des SFA (semaine du 15 septembre).")
  }];
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "02 Synth\xE8se",
    style: {
      display: "block",
      padding: "84px 96px 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-kicker"
  }, "Synth\xE8se"), /*#__PURE__*/React.createElement("h1", {
    className: "sp-title",
    style: {
      fontSize: 52,
      lineHeight: "54px"
    }
  }, "Points de ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#2E69FF"
    }
  }, "vigilance")), /*#__PURE__*/React.createElement("div", {
    className: "sp-vig-grid",
    style: {
      marginTop: 40
    }
  }, vigs.map((v, i) => /*#__PURE__*/React.createElement("div", {
    className: "sp-vig",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-vig-num"
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    className: "sp-vig-h"
  }, v.h), /*#__PURE__*/React.createElement("div", {
    className: "sp-vig-b"
  }, v.b)))), /*#__PURE__*/React.createElement(Footer, {
    page: "02"
  }));
}

/* ---------- 3 — Avertissement ---------- */
function AvertissementSlide() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "03 Avertissement",
    style: {
      display: "block",
      padding: "84px 96px 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-kicker"
  }, "Avertissement"), /*#__PURE__*/React.createElement("h1", {
    className: "sp-title",
    style: {
      fontSize: 52,
      lineHeight: "54px"
    }
  }, "Note liminaire"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44,
      display: "flex",
      flexDirection: "column",
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-disc-p"
  }, "Le tableau ci-apr\xE8s constitue une ", /*#__PURE__*/React.createElement("strong", null, "pr\xE9sentation indicative et de haut niveau"), " des principales \xE9tapes juridiques de la restructuration financi\xE8re envisag\xE9e de la Soci\xE9t\xE9 et de certaines de ses filiales, telle que refl\xE9t\xE9e dans le Restructuring Term Sheet. Il a \xE9t\xE9 pr\xE9par\xE9 \xE0 des fins de discussion uniquement."), /*#__PURE__*/React.createElement("div", {
    className: "sp-disc-note",
    style: {
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-disc-p",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Note importante"), " \u2014 les dates indiqu\xE9es au titre des proc\xE9dures judiciaires et des \xE9tapes proc\xE9durales correspondantes le sont \xE0 titre purement illustratif et sont susceptibles de varier en fonction de nombreux facteurs. Les d\xE9lais sont calcul\xE9s conform\xE9ment aux articles 640 et suivants du Code de proc\xE9dure civile. En particulier, lorsqu'un d\xE9lai expire un samedi, un dimanche ou un jour f\xE9ri\xE9 ou ch\xF4m\xE9, il est prorog\xE9 jusqu'au premier jour ouvrable suivant. Jours f\xE9ri\xE9s sur la p\xE9riode consid\xE9r\xE9e\xA0: 6 avril, 1er mai, 8 mai, 14 mai, 25 mai, 14 juillet, 15 ao\xFBt, 1er novembre et 11 novembre 2026.")), /*#__PURE__*/React.createElement("p", {
    className: "sp-disc-p",
    style: {
      marginTop: 26
    }
  }, "D'autres \xE9tapes juridiques pourront devoir \xEAtre ajout\xE9es le cas \xE9ch\xE9ant, notamment au titre de la repr\xE9sentation du personnel, en fonction du p\xE9rim\xE8tre et du contenu de l'op\xE9ration. Les termes commen\xE7ant par une majuscule et non d\xE9finis dans le pr\xE9sent step plan ont le sens qui leur est attribu\xE9 dans le Restructuring Term Sheet.")), /*#__PURE__*/React.createElement(Footer, {
    page: "03"
  }));
}

/* ---------- 4 — Vue d'ensemble ---------- */
function VueEnsembleSlide() {
  const cols = [{
    tag: "Séquence 1",
    name: "Conciliation n°1 & documentation",
    range: "Mars — juillet 2026",
    ms: [{
      d: "17 mars",
      l: "Ouverture conciliation n°1"
    }, {
      d: "8 juin",
      l: "Premières versions lock-up & 4 TS"
    }, {
      d: "20 juil.",
      l: "Signature lock-up & TS"
    }]
  }, {
    tag: "Séquence 2",
    name: "Conciliation n°2 & ouverture des SFA",
    range: "Septembre 2026",
    ms: [{
      d: "Sem. 15 sept.",
      l: "Ouverture des conciliations n°2"
    }, {
      d: "~25 sept.",
      l: "Jugement d'ouverture des SFA"
    }]
  }, {
    tag: "Séquence 3",
    name: "Vote & approbation du plan",
    range: "Octobre — novembre 2026",
    ms: [{
      d: "[20] oct.",
      l: "Vote des classes sur le plan"
    }, {
      d: "9 nov.",
      l: "Jugement d'approbation"
    }, {
      d: "Fin nov.",
      l: "Closing"
    }]
  }];
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "04 Vue d'ensemble",
    style: {
      display: "flex",
      flexDirection: "column",
      padding: "84px 96px 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-kicker"
  }, "Vue d'ensemble"), /*#__PURE__*/React.createElement("h1", {
    className: "sp-title",
    style: {
      fontSize: 48,
      lineHeight: "50px"
    }
  }, "Trois s\xE9quences, de la ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#2E69FF"
    }
  }, "conciliation"), " au closing"), /*#__PURE__*/React.createElement("div", {
    className: "sp-seq-grid",
    style: {
      marginTop: 48
    }
  }, cols.map((c, i) => /*#__PURE__*/React.createElement("div", {
    className: "sp-seq-col",
    key: i,
    style: i === 0 ? {
      paddingLeft: 0
    } : null
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-seq-tag"
  }, c.tag), /*#__PURE__*/React.createElement("div", {
    className: "sp-seq-name"
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "sp-seq-range"
  }, c.range), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, c.ms.map((m, j) => /*#__PURE__*/React.createElement("div", {
    className: "sp-milestone",
    key: j
  }, /*#__PURE__*/React.createElement("div", {
    className: "node"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sp-ms-date"
  }, m.d), /*#__PURE__*/React.createElement("div", {
    className: "sp-ms-label"
  }, m.l)))))))), /*#__PURE__*/React.createElement("div", {
    className: "sp-callout",
    style: {
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Point d'attention"), /*#__PURE__*/React.createElement("div", {
    className: "txt"
  }, "Fin th\xE9orique de la conciliation n\xB01 le ", /*#__PURE__*/React.createElement("strong", null, "17 ao\xFBt"), ", incompatible avec une signature fin juillet \u2014 le calendrier repose sur une ", /*#__PURE__*/React.createElement("strong", null, "cl\xF4ture anticip\xE9e"), " [\xE0 confirmer], le relais par des mandats ad hoc pendant le d\xE9lai de carence de 3 mois (art. L. 611-6 C. com.) et l'ouverture des conciliations n\xB02 mi-septembre."))), /*#__PURE__*/React.createElement(Footer, {
    page: "04"
  }));
}

/* ---------- 5-8 — Tableaux de séquences ---------- */
function SequenceSlide({
  page,
  label,
  kicker,
  title,
  subtitle,
  rows
}) {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": label,
    style: {
      display: "block",
      padding: "76px 72px 116px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-kicker"
  }, kicker), /*#__PURE__*/React.createElement("h1", {
    className: "sp-title",
    style: {
      fontSize: 38,
      lineHeight: "40px"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "sp-subtitle"
  }, subtitle), /*#__PURE__*/React.createElement("table", {
    className: "sp-table",
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("colgroup", null, /*#__PURE__*/React.createElement("col", {
    style: {
      width: "15%"
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: "43%"
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: "42%"
    }
  })), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Date indicative"), /*#__PURE__*/React.createElement("th", null, "\xC9tape"), /*#__PURE__*/React.createElement("th", null, "Commentaires"))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "sp-date"
  }, r.date)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "sp-step"
  }, r.step)), /*#__PURE__*/React.createElement("td", null, r.comment === "—" ? /*#__PURE__*/React.createElement("div", {
    className: "sp-comment dash"
  }, "\u2014") : /*#__PURE__*/React.createElement("div", {
    className: "sp-comment"
  }, r.comment)))))), /*#__PURE__*/React.createElement(Footer, {
    page: page
  }));
}
window.CoverSlide = CoverSlide;
window.SyntheseSlide = SyntheseSlide;
window.AvertissementSlide = AvertissementSlide;
window.VueEnsembleSlide = VueEnsembleSlide;
window.SequenceSlide = SequenceSlide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "step-plan/sp-deck.jsx", error: String((e && e.message) || e) }); }

// step-plan/sp-tables.jsx
try { (() => {
/* global React, SequenceSlide */
/* Données des tableaux — séquences 1 à 3 (slides 5 à 8). */

function Seq1aSlide() {
  const rows = [{
    date: "17 mars 2026",
    step: "Ouverture de la conciliation n°1",
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "Fin th\xE9orique le ", /*#__PURE__*/React.createElement("strong", null, "17 ao\xFBt 2026"), ". Le calendrier repose sur une cl\xF4ture anticip\xE9e [\xE0 confirmer] puis un relais par mandats ad hoc pendant le d\xE9lai de carence de 3 mois (art. L. 611-6 C. com.).")
  }, {
    date: "Sem. du 8 juin 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, "\xC9change des ", /*#__PURE__*/React.createElement("strong", null, "premi\xE8res versions"), " : accord de lock-up, Restructuring TS, New Money TS, Reinstated Debt TS, Governance TS, waiver and amendment letter (TBD) \u2014 envoi \xE0 l'AHG"),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "Versions n\xE9cessairement incompl\xE8tes. La structure finale d\xE9pend\xA0:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "du niveau de soutien (RCF\xA0? Apollo\xA0?) et de la valeur d'entreprise (cross-class cramdown\xA0?)\xA0;"), /*#__PURE__*/React.createElement("li", null, "de la structure tax au closing (entit\xE9s de conversion, \xAB\xA0remont\xE9e\xA0\xBB des cr\xE9ances)\xA0;"), /*#__PURE__*/React.createElement("li", null, "du p\xE9rim\xE8tre des proc\xE9dures (holdings FR, garantes FR\xA0/\xA0US\xA0/\xA0UK\xA0?)\xA0;"), /*#__PURE__*/React.createElement("li", null, "du mode de mise en \u0153uvre (SFA seules, Chapter 15\xA0/\xA011, distressed disposal, loi applicable)\xA0;"), /*#__PURE__*/React.createElement("li", null, "du consent fee et de sa m\xE9thode de calcul.")))
  }, {
    date: "8 – 11 juin 2026",
    step: "Remise de la note d'information au CSE et ouverture formelle de la consultation",
    comment: "—"
  }, {
    date: "Sem. du 15 juin 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, "S\xE9lection de l'", /*#__PURE__*/React.createElement("strong", null, "expert ind\xE9pendant \xAB\xA0valorisation\xA0\xBB"), " et de l'agent de calcul \u2014 cl\xF4ture anticip\xE9e de la conciliation n\xB01 [\xE0 confirmer] \u2014 ouverture des mandats ad hoc"),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "La soci\xE9t\xE9 souhaite passer par ", /*#__PURE__*/React.createElement("span", {
      className: "em"
    }, "Glas"), " pour l'agent de calcul\xA0; mission surtout r\xE9alis\xE9e en France par Kroll. \xC9changes plus cons\xE9quents \xE0 pr\xE9voir sur les modalit\xE9s d'impl\xE9mentation en sauvegarde acc\xE9l\xE9r\xE9e en droit fran\xE7ais.")
  }, {
    date: "8 juin – 10 juil. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, "\xC9changes entre toutes les parties sur le lock-up et les 4 TS \u2014 circulation avec le G3 et l'AHG (travail en deux temps) \u2014 \xE9changes avec l'agent de calcul (trading, mode de calcul) \u2014 structure d'impl\xE9mentation"),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "Avant l'\xE9tape \xAB\xA0valeur d'entreprise\xA0\xBB, les TS et le lock-up resteront incomplets par d\xE9finition. V\xE9rifications d'opposabilit\xE9 en droit US et en droit UK (proc\xE9dures, clauses de la documentation, composition des classes).")
  }];
  return /*#__PURE__*/React.createElement(SequenceSlide, {
    page: "05",
    label: "05 S\xE9quence 1 (1/2)",
    kicker: "S\xE9quence 1 \u2014 Conciliation n\xB01 & documentation \xB7 1/2",
    title: "De l'ouverture aux premiers \xE9changes",
    subtitle: "Mars \u2014 juin 2026",
    rows: rows
  });
}
function Seq1bSlide() {
  const rows = [{
    date: "Sem. du 29 juin 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, "Retour pr\xE9liminaire sur la ", /*#__PURE__*/React.createElement("strong", null, "valeur d'entreprise"), " \u2014 accord de principe sur la structure et le mode de mise en \u0153uvre \u2014 finalisation d'un step plan"),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "em"
    }, "Retour essentiel"), "\xA0: il permet de comprendre comment impl\xE9menter le deal (p\xE9rim\xE8tre des SFA, application forc\xE9e interclasses, clauses type distressed disposal), donc de d\xE9terminer si un CCDM est possible et de finaliser les termes de l'accord (\xE9conomiques et juridiques).")
  }, {
    date: "1er – 20 juil. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, "Finalisation du lock-up, des 4 Term Sheets et du step plan \u2014 finalisation du rapport sur la valeur d'entreprise"),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "Les termes finaux d'impl\xE9mentation sont fix\xE9s \xE0 l'\xE9tape pr\xE9c\xE9dente. Certains membres de l'AHG indiquent avoir besoin de ", /*#__PURE__*/React.createElement("strong", null, "3 semaines"), " pour obtenir l'accord de leur comit\xE9 d'investissement.")
  }, {
    date: "2 juil. 2026",
    step: "Expiration du délai conventionnel de consultation — remise de l'avis du CSE sur le changement de contrôle",
    comment: "—"
  }, {
    date: "20 juil. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Signature du lock-up"), ", des Term Sheets et du step plan par la soci\xE9t\xE9 et les \xAB\xA0original consenting creditors\xA0\xBB"),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "P\xE9riode d'accession au lock-up TBD (15 jours ouvr\xE9s\xA0?).")
  }];
  return /*#__PURE__*/React.createElement(SequenceSlide, {
    page: "06",
    label: "06 S\xE9quence 1 (2/2)",
    kicker: "S\xE9quence 1 \u2014 Conciliation n\xB01 & documentation \xB7 2/2",
    title: "De la valorisation \xE0 la signature du lock-up",
    subtitle: "Fin juin \u2014 20 juillet 2026",
    rows: rows
  });
}
function Seq2Slide() {
  const rows = [{
    date: "Sem. du 7 sept. 2026",
    step: "Dépôt des requêtes en ouverture de conciliation n°2",
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "Sur le p\xE9rim\xE8tre d\xE9fini dans le lock-up.")
  }, {
    date: "Sem. du 15 sept. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Ouverture des conciliations n\xB02"), " \u2014 finalisation des projets de plans de SFA et des classes de parties affect\xE9es \u2014 rapport du conciliateur \u2014 listes des cr\xE9ances de droit commun et affect\xE9es"),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "\xC0 l'expiration du d\xE9lai de carence de 3 mois depuis la fin de la conciliation n\xB01. ", /*#__PURE__*/React.createElement("span", {
      className: "em"
    }, "Attention"), "\xA0: la liste des cr\xE9ances L. 628-7 doit \xEAtre certifi\xE9e par les CAC (r\xE9troplanning \xE0 pr\xE9voir). Validation des listes par les conseils des cr\xE9anciers avec les CAC.")
  }, {
    date: "Sem. du 15 sept. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, "D\xE9signation par le CSE de l'UES de son/ses repr\xE9sentant(s) pour l'audience d'ouverture \u2014 d\xE9p\xF4t des ", /*#__PURE__*/React.createElement("strong", null, "demandes d'ouverture des SFA")),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "Pi\xE8ces jointes\xA0: copie de la d\xE9cision d'ouverture de la conciliation\xA0; tableau de financement (et flux de tr\xE9sorerie si comptes consolid\xE9s)\xA0; budget de tr\xE9sorerie 3 mois\xA0; plan de financement pr\xE9visionnel\xA0; projet de plan (L. 628-1 al. 2).")
  }, {
    date: "Sem. du 21 sept. 2026",
    step: "Audience sur l'ouverture de la sauvegarde accélérée",
    comment: "—"
  }, {
    date: "[Vers le 25] sept. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Jugement d'ouverture"), " des sauvegardes acc\xE9l\xE9r\xE9es"),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "D\xE9p\xF4t des listes L. 628-7\xA0; requ\xEAte au juge-commissaire (poursuite de la mission de l'expert, r\xE9duction \xE0 15 j du d\xE9lai de convocation des CPA)\xA0; lancement de l'info-consultation de l'UES sur le projet de plan\xA0; notification des classes par l'AJ.")
  }, {
    date: "J+10 de l'ouverture",
    step: "Désignation d'un représentant des salariés — ordonnance relative à la mission de l'expert et à la réduction du délai de convocation à 15 j",
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "Le repr\xE9sentant des salari\xE9s participera aux autres audiences de la sauvegarde acc\xE9l\xE9r\xE9e.")
  }];
  return /*#__PURE__*/React.createElement(SequenceSlide, {
    page: "07",
    label: "07 S\xE9quence 2",
    kicker: "S\xE9quence 2 \u2014 Conciliation n\xB02 & ouverture des SFA",
    title: "Conciliation n\xB02 et ouverture des sauvegardes acc\xE9l\xE9r\xE9es",
    subtitle: "Septembre 2026",
    rows: rows
  });
}
function Seq3Slide() {
  const rows = [{
    date: "[5] oct. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, "Ach\xE8vement de l'info-consultation de l'UES sur le projet de plan \u2014 convocation des classes \xE0 J+15 \u2014 envoi du projet de plan"),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "Lancement concomitant de l'info-consultation de l'UES sur (i) le bilan \xE9conomique, social et environnemental de l'AJ et (ii) son avis sur le projet de plan, en vue de l'audience d'approbation.")
  }, {
    date: "[20] oct. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Vote des classes"), " de cr\xE9anciers sur le plan"),
    comment: "—"
  }, {
    date: "Avant l'audience",
    step: "Achèvement de l'info-consultation de l'UES sur le bilan ESE et l'avis de l'AJ",
    comment: "—"
  }, {
    date: "5 nov. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, "Audience devant le ", /*#__PURE__*/React.createElement("strong", null, "Tribunal des activit\xE9s \xE9conomiques de Nanterre")),
    comment: /*#__PURE__*/React.createElement(React.Fragment, null, "Examen du projet de plan et des contestations de valorisation.")
  }, {
    date: "Sem. du 9 nov. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Jugement approuvant"), " le plan de sauvegarde acc\xE9l\xE9r\xE9e"),
    comment: "—"
  }, {
    date: "Fin nov. 2026",
    step: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Date effective"), " de la restructuration \u2014 closing"),
    comment: "—"
  }];
  return /*#__PURE__*/React.createElement(SequenceSlide, {
    page: "08",
    label: "08 S\xE9quence 3",
    kicker: "S\xE9quence 3 \u2014 Vote & approbation du plan",
    title: "Vote des classes et approbation du plan",
    subtitle: "Octobre \u2014 novembre 2026",
    rows: rows
  });
}
window.Seq1aSlide = Seq1aSlide;
window.Seq1bSlide = Seq1bSlide;
window.Seq2Slide = Seq2Slide;
window.Seq3Slide = Seq3Slide;
})(); } catch (e) { __ds_ns.__errors.push({ path: "step-plan/sp-tables.jsx", error: String((e && e.message) || e) }); }

// ui_kits/word-document/AwardsPage.jsx
try { (() => {
/* global React */
/* Awards & Accolades — grid of badge images with captions; inspired by Word Master template */
function AwardsPage() {
  const badges = [{
    src: '../../assets/awards/chambers-global-2026.jpeg',
    name: 'Chambers Global',
    year: '2026',
    desc: 'Top-Ranked firm across M&A, Capital Markets, and Disputes worldwide.'
  }, {
    src: '../../assets/awards/chambers-usa-2025.jpeg',
    name: 'Chambers USA',
    year: '2025',
    desc: '425 rankings, including 130 first-tier rankings and 305 individual lawyer rankings.'
  }, {
    src: '../../assets/awards/american-lawyer-a-list.jpeg',
    name: 'The American Lawyer',
    year: 'A-List 2025',
    desc: 'Among the elite firms recognized for revenue, pro bono, diversity, and associate satisfaction.'
  }, {
    src: '../../assets/awards/law360-firm-of-the-year-2025.png',
    name: 'Law360',
    year: 'Firm of the Year 2025',
    desc: 'Recognized for the most landmark wins of the year across high-stakes practices.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "gd-page"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '96px 96px 0 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#2E69FF'
    }
  }, "02 / Awards & Accolades"), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: 12
    }
  }, "Recognition ", /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, "2025\u20132026")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      lineHeight: '15px',
      letterSpacing: '-0.01em',
      maxWidth: 540
    }
  }, "Selected from a year of independent recognition by the legal market's most rigorous publications. Each ranking reflects directed client feedback and evidence of work.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 96,
      right: 96,
      top: 280
    }
  }, badges.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '88px 1fr',
      gap: 28,
      alignItems: 'center',
      padding: '20px 0',
      borderTop: i === 0 ? '1.5px solid #000' : '0.5px solid #d9d9d9',
      borderBottom: i === badges.length - 1 ? '1.5px solid #000' : 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: b.src,
    alt: b.name,
    style: {
      width: 88,
      height: 88,
      objectFit: 'contain',
      display: 'block',
      background: '#fff'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      lineHeight: '16px',
      letterSpacing: '-0.015em',
      color: '#000'
    }
  }, b.name, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#2E69FF',
      fontWeight: 400,
      marginLeft: 8
    }
  }, b.year)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontWeight: 400,
      fontSize: 10.5,
      lineHeight: '15px',
      letterSpacing: '-0.01em',
      color: '#000',
      maxWidth: 480
    }
  }, b.desc))))), /*#__PURE__*/React.createElement("div", {
    className: "gd-page-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: "../../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, "03")));
}
window.AwardsPage = AwardsPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/word-document/AwardsPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/word-document/BioPage.jsx
try { (() => {
/* global React */
/* Bio page — "Bio Name" + role + portrait placeholder + bullets */
function BioPage() {
  const bios = [{
    name: 'Stephen I. Glover',
    role: 'Partner · Washington, D.C.',
    practice: 'Mergers & Acquisitions',
    desc: 'Co-Chair of the Firm\'s M&A Practice. Recognized as a leading dealmaker by Chambers USA, The Legal 500, and IFLR1000. Advises public and private companies, private equity sponsors, and boards on strategic transactions.',
    stats: [['$120B+', 'Lifetime deal value advised'], ['25+', 'Years at Gibson Dunn']]
  }, {
    name: 'Saee Muzumdar',
    role: 'Partner · New York',
    practice: 'Mergers & Acquisitions',
    desc: 'Advises strategic and private equity clients on complex, cross-border M&A. Particular focus on technology, consumer, and industrial transactions. Frequently called on for take-privates and contested situations.',
    stats: [['$80B+', 'Recent deal value'], ['40+', 'Cross-border deals 2024–25']]
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "gd-page"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '96px 96px 0 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#2E69FF'
    }
  }, "04 / Engagement Team"), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: 12
    }
  }, "Lead ", /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, "Partners"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 96,
      right: 96,
      top: 220,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, bios.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 24,
      paddingTop: 16,
      borderTop: '1.5px solid #000'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      height: 150,
      background: '#1a1a1a',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "120",
    height: "150",
    viewBox: "0 0 120 150"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "120",
    height: "150",
    fill: "#262626"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "58",
    r: "22",
    fill: "#4a4a4a"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 18 150 Q 60 92 102 150 Z",
    fill: "#4a4a4a"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 18,
      lineHeight: '22px',
      letterSpacing: '-0.025em',
      color: '#000'
    }
  }, b.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontWeight: 400,
      fontSize: 10.5,
      lineHeight: '14px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: '#2E69FF'
    }
  }, b.role, " \xA0\xB7\xA0 ", b.practice), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 10,
      fontSize: 10.5,
      lineHeight: '15px'
    }
  }, b.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      marginTop: 12
    }
  }, b.stats.map(([n, l], j) => /*#__PURE__*/React.createElement("div", {
    key: j
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 18,
      lineHeight: '20px',
      letterSpacing: '-0.03em',
      color: '#000'
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 9,
      lineHeight: '12px',
      letterSpacing: '-0.005em',
      color: '#666',
      marginTop: 2
    }
  }, l)))))))), /*#__PURE__*/React.createElement("div", {
    className: "gd-page-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: "../../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, "05")));
}
window.BioPage = BioPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/word-document/BioPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/word-document/BodyPage.jsx
try { (() => {
/* global React */
/* Body page 1 — Firm Overview, Why Gibson Dunn, two-column body copy */
function BodyPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "gd-page"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '96px 96px 0 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#2E69FF'
    }
  }, "01 / Firm Overview"), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: 12
    }
  }, "Why Gibson ", /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, "Dunn")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      lineHeight: '17px',
      letterSpacing: '-0.015em',
      maxWidth: 600,
      fontWeight: 400
    }
  }, "Gibson Dunn is a leading global law firm, advising clients on ", /*#__PURE__*/React.createElement("strong", null, "significant transactions and disputes"), " around the world. Our exceptional teams craft and deploy creative legal strategies that are meticulously tailored to every matter, however complex or high-stakes. We forge deep partnerships with our clients \u2014 built on trust, shared judgment, and consistent results.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 96,
      right: 96,
      top: 320,
      display: 'grid',
      gridTemplateColumns: '1fr 1px 1fr',
      columnGap: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Strategic counsel"), /*#__PURE__*/React.createElement("p", null, "We act as counsel-as-strategist on matters that shape industries: cross-border transactions, novel financings, bet-the-company litigation, and regulatory inflection points. Our teams are partner-led and deliberately small."), /*#__PURE__*/React.createElement("h3", null, "Sector depth"), /*#__PURE__*/React.createElement("p", null, "Coverage across technology, energy, financial services, healthcare and life sciences, media and entertainment, and infrastructure \u2014 paired with practice depth in M&A, capital markets, private equity, antitrust, tax, and dispute resolution."), /*#__PURE__*/React.createElement("h3", null, "Global reach, single partnership"), /*#__PURE__*/React.createElement("p", null, "More than ", /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, /*#__PURE__*/React.createElement("strong", null, "2,200 lawyers")), " across", /*#__PURE__*/React.createElement("strong", null, " 23 offices"), " on four continents, operating as a unified firm with one P&L and one set of clients.")), /*#__PURE__*/React.createElement("div", {
    className: "gd-vrule",
    style: {
      height: 460
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Our approach"), /*#__PURE__*/React.createElement("ul", {
    className: "gd-bullets"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Partner-led teams."), " The lawyers who win the engagement run it."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Tailored strategy."), " No template responses, no off-the-shelf advice."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Transparent fees."), " Phased budgets, monthly burn reports."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "One firm."), " No regional balkanization, no inter-office handoffs.")), /*#__PURE__*/React.createElement("h3", null, "Recent recognition"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Chambers USA 2025"), " \u2014 425 firm and individual rankings, including 130 first-tier rankings.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Chambers Global 2026"), " \u2014 Top-Ranked across M&A, Capital Markets, and Disputes.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "The American Lawyer A-List 2025"), ".", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Law360 Firm of the Year 2025"), "."))), /*#__PURE__*/React.createElement("div", {
    className: "gd-page-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: "../../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 18,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 9px/12px var(--font-sans)',
      color: '#666',
      letterSpacing: '-0.01em'
    }
  }, "Confidential. Not for further distribution."), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, "02"))));
}
window.BodyPage = BodyPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/word-document/BodyPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/word-document/ClosingPage.jsx
try { (() => {
/* global React */
/* Closing page with full Attorney Advertising notice (required boilerplate) */
function ClosingPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "gd-page"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '96px 96px 0 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#2E69FF'
    }
  }, "Contact & Notices"), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: 12
    }
  }, "Thank ", /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, "You.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11.5,
      lineHeight: '16px',
      maxWidth: 540
    }
  }, "We appreciate the opportunity to put forward this proposal. To discuss the matters described in this document, please contact the lead partners on page 5, or reach the Office of General Counsel directly."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "By telephone"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      lineHeight: '15px'
    }
  }, "+1 (213) 229-7000"), /*#__PURE__*/React.createElement("h3", null, "By email"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      lineHeight: '15px'
    }
  }, "oogc@gibsondunn.com")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Headquarters"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      lineHeight: '15px'
    }
  }, "333 South Grand Avenue", /*#__PURE__*/React.createElement("br", null), "Los Angeles, CA 90071", /*#__PURE__*/React.createElement("br", null), "United States")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 96,
      right: 96,
      bottom: 120,
      borderTop: '1px solid #000',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 9,
      lineHeight: '12px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#000',
      marginBottom: 8
    }
  }, "Attorney Advertising"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 8.5,
      lineHeight: '12px',
      letterSpacing: '-0.005em',
      color: '#666'
    }
  }, "These materials were prepared for general informational purposes only based on information available at the time of publication and are not intended as, do not constitute, and should not be relied upon as, legal advice or a legal opinion on any specific facts or circumstances. Gibson Dunn (and its affiliates, attorneys, and employees) shall not have any liability in connection with any use of these materials. The sharing of these materials does not establish an attorney-client relationship with the recipient and should not be relied upon as an alternative for advice from qualified counsel. Please note that facts and circumstances may vary, and prior results do not guarantee a similar outcome. \xA9 2026 Gibson, Dunn & Crutcher LLP. All rights reserved. For contact and other information, please visit us at gibsondunn.com.")), /*#__PURE__*/React.createElement("div", {
    className: "gd-page-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: "../../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, "06")));
}
window.ClosingPage = ClosingPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/word-document/ClosingPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/word-document/CoverPage.jsx
try { (() => {
/* global React */
/* Cover page — black, big GIBSON DUNN, prepared for X */
function CoverPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "gd-page cover-dark"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 96,
      top: 96,
      right: 96,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/gibson-dunn-wordmark-white.png",
    alt: "Gibson Dunn",
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.7)'
    }
  }, "April 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 96,
      top: 360,
      right: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 60,
      lineHeight: '56px',
      letterSpacing: '-0.04em',
      textTransform: 'uppercase',
      color: '#fff'
    }
  }, "Response to", /*#__PURE__*/React.createElement("br", null), "Request for", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#2E69FF'
    }
  }, "Proposal")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      fontWeight: 400,
      fontSize: 13,
      lineHeight: '17px',
      letterSpacing: '-0.015em',
      color: 'rgba(255,255,255,.85)',
      maxWidth: 380
    }
  }, "Prepared for ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#fff'
    }
  }, "[Client Company]"), " in connection with its proposed acquisition of [Target Company].")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 96,
      bottom: 96,
      display: 'flex',
      alignItems: 'flex-end',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.7)'
    }
  }, "Lead partners"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontWeight: 400,
      fontSize: 11,
      lineHeight: '16px',
      letterSpacing: '-0.01em',
      color: '#fff'
    }
  }, "Stephen Glover \xA0\xB7\xA0 Andrew Kaplan", /*#__PURE__*/React.createElement("br", null), "Eduardo Gallardo \xA0\xB7\xA0 Saee Muzumdar"))), /*#__PURE__*/React.createElement("div", {
    className: "gd-confidential-stripe"
  }, "Confidential. Not for further distribution."));
}
window.CoverPage = CoverPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/word-document/CoverPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/word-document/TransactionsPage.jsx
try { (() => {
/* global React */
/* Two-column transaction list — modeled on Word Master "Representative Transactions" */
function TransactionsPage() {
  const items = [{
    client: 'SpaceX',
    text: 'Advised on its $17 billion acquisition of EchoStar\'s full portfolio of AWS-4 and H-block 50 MHz spectrum licenses.',
    sector: 'Technology / Telecom'
  }, {
    client: 'Merck',
    text: 'Advised on its $9.2 billion acquisition of Cidara Therapeutics, a biotechnology company.',
    sector: 'Healthcare'
  }, {
    client: 'KKR',
    text: 'Advised on its $5 billion investment in Gulf Data Hub, one of the largest independent data center platforms in the Middle East.',
    sector: 'Infrastructure'
  }, {
    client: 'AT&T',
    text: 'Advised on its $5.8 billion acquisition of substantially all of Lumen\'s Mass Markets fiber business.',
    sector: 'Telecommunications'
  }, {
    client: 'Blackstone Infrastructure',
    text: 'Advised on its agreement to acquire Safe Harbor Marinas from Sun Communities for $5.7 billion.',
    sector: 'Real Assets'
  }, {
    client: 'Apollo Global Management',
    text: 'Advised on the hybrid capital financing for the take-private of Soho House at a $2.7 billion enterprise value.',
    sector: 'Private Equity'
  }, {
    client: 'Skechers',
    text: 'Advised on its $9.4 billion take-private transaction by 3G Capital.',
    sector: 'Consumer / Retail'
  }, {
    client: 'Borouge / Borealis',
    text: 'Advised on the $60 billion combination with Nova Chemicals to create one of the world\'s largest polyolefins producers.',
    sector: 'Energy / Chemicals'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "gd-page"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '96px 96px 0 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#2E69FF'
    }
  }, "03 / Representative Transactions"), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: 12
    }
  }, "Selected ", /*#__PURE__*/React.createElement("span", {
    className: "blue"
  }, "2025\u20132026"), " Engagements"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      lineHeight: '15px',
      letterSpacing: '-0.01em',
      maxWidth: 540
    }
  }, "A representative cross-section of recent matters. The full list is available on request.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 96,
      right: 96,
      top: 248,
      display: 'grid',
      gridTemplateColumns: '1fr 1px 1fr',
      columnGap: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, items.slice(0, 4).map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderTop: '1.5px solid #000',
      padding: '12px 0 14px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      lineHeight: '15px',
      letterSpacing: '-0.015em',
      color: '#2E69FF'
    }
  }, it.client), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 8.5,
      lineHeight: '11px',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#666'
    }
  }, it.sector)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontWeight: 400,
      fontSize: 10,
      lineHeight: '14px',
      letterSpacing: '-0.01em',
      color: '#000'
    }
  }, it.text)))), /*#__PURE__*/React.createElement("div", {
    className: "gd-vrule",
    style: {
      minHeight: 540
    }
  }), /*#__PURE__*/React.createElement("div", null, items.slice(4).map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderTop: '1.5px solid #000',
      padding: '12px 0 14px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      lineHeight: '15px',
      letterSpacing: '-0.015em',
      color: '#2E69FF'
    }
  }, it.client), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 400,
      fontSize: 8.5,
      lineHeight: '11px',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#666'
    }
  }, it.sector)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontWeight: 400,
      fontSize: 10,
      lineHeight: '14px',
      letterSpacing: '-0.01em',
      color: '#000'
    }
  }, it.text))))), /*#__PURE__*/React.createElement("div", {
    className: "gd-page-footer"
  }, /*#__PURE__*/React.createElement("img", {
    className: "wordmark",
    src: "../../assets/logos/gibson-dunn-wordmark-black.png",
    alt: "Gibson Dunn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pageno"
  }, "04")));
}
window.TransactionsPage = TransactionsPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/word-document/TransactionsPage.jsx", error: String((e && e.message) || e) }); }

})();
