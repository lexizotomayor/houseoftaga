// House of Taga: share, time-ago, reading progress, short/full toggle, forms.
(() => {
  // Share: Web Share where available, otherwise copy the link and say so for 1.6s.
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-share]");
    if (!btn) return;
    const { title, url } = btn.dataset;
    if (navigator.share) { navigator.share({ title, url }).catch(() => {}); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    const label = btn.querySelector("[data-share-label]");
    label.textContent = "copied";
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { label.textContent = "share"; }, 1600);
  });

  // Time-ago text, refreshed every minute.
  const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  const ago = (iso) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    for (const [n, v] of units) {
      const q = Math.floor(s / v);
      if (q >= 1) return `${q} ${n}${q > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };
  const tick = () => document.querySelectorAll("[data-ago]").forEach((t) => { t.textContent = ago(t.dateTime); });
  tick();
  setInterval(tick, 60000);

  // Reading progress.
  const bar = document.querySelector("[data-progress]");
  if (bar) {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? Math.min(1, scrollY / max) * 100 : 0) + "%";
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  // Short / full story. Both versions are in the page; short shows first.
  const story = document.querySelector("[data-story][data-mode]");
  if (story) {
    const setMode = (mode, jump) => {
      story.dataset.mode = mode;
      document.querySelectorAll("[data-version]").forEach((el) => { el.hidden = el.dataset.version !== mode; });
      document.querySelectorAll(".toggle [data-set-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setMode === mode)));
      if (jump) {
        const body = document.querySelector('.prose[data-version="full"]');
        if (body) body.scrollIntoView({ block: "start" });
      }
    };
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-set-mode]");
      if (b) setMode(b.dataset.setMode, !b.closest(".toggle"));
    });
    if (location.hash === "#full") setMode("full");
  }

  // Netlify forms: post in place and show the thank-you; without JS they land on /thanks/.
  document.querySelectorAll("form[data-ajax]").forEach((form) => {
    const fail = form.querySelector("[data-fail]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      fail.hidden = true;
      try {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!res.ok) throw new Error(res.status);
        if (form.hasAttribute("data-contact")) {
          const sent = document.querySelector("[data-sent]");
          sent.querySelector("[data-first]").textContent = (form.elements.name.value.trim().split(/\s+/)[0]) || "friend";
          sent.querySelector("[data-email]").textContent = form.elements.email.value;
          form.hidden = true;
          sent.hidden = false;
          sent.focus();
        } else {
          form.elements.comment.value = "";
          form.querySelector("[data-done]").hidden = false;
        }
      } catch {
        fail.hidden = false;
      } finally {
        btn.disabled = false;
      }
    });
  });
  const again = document.querySelector("[data-again]");
  if (again) again.addEventListener("click", () => {
    const form = document.querySelector("form[data-contact]");
    form.elements.message.value = "";
    form.hidden = false;
    document.querySelector("[data-sent]").hidden = true;
    form.elements.message.focus();
  });

  // Thanks page: link back to the story the comment came from.
  const back = document.querySelector("[data-back]");
  const from = new URLSearchParams(location.search).get("from");
  if (back && from && /^[\w-]+$/.test(from)) {
    back.href = `/stories/${from}/#comments`;
    back.lastChild.textContent = "back to the story";
  }
})();
