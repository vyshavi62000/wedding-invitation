/*
 * Applies config.js (window.INVITE_CONFIG) to the page.
 *
 * Loaded with `defer` right before app.*.js, so it runs after the HTML is parsed
 * but before the animation script reads the text. It also publishes
 * window.__INVITE, which app.*.js uses for the countdown, calendar, map and
 * share features.
 */
(function () {
  "use strict";
  var C = window.INVITE_CONFIG || {};
  var root = document.documentElement;

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function empty(v) { return v == null || v === "" || (Array.isArray(v) && !v.length); }

  /* ── colours ─────────────────────────────────────────────────────────── */
  var colors = C.colors || {};
  Object.keys(colors).forEach(function (k) {
    if (!empty(colors[k])) root.style.setProperty("--" + k, colors[k]);
  });
  var tint = (C.artwork || {}).tint;
  if (tint && tint !== "none") root.style.setProperty("--art-filter", tint);
  window.__cssv = function (name, fallback) {
    return getComputedStyle(root).getPropertyValue(name).trim() || fallback;
  };

  /* ── names ───────────────────────────────────────────────────────────── */
  var couple = C.couple || {};
  var bride = (couple.bride || "Bride").trim(), groom = (couple.groom || "Groom").trim();
  var groomFirst = /^groom/i.test(couple.order || "");
  var first = groomFirst ? groom : bride, second = groomFirst ? bride : groom;
  var mono = (couple.monogram || (first.charAt(0) + "&" + second.charAt(0))).toUpperCase().split("&");
  var ini1 = (mono[0] || "").trim(), ini2 = (mono[1] || "").trim();

  /* ── date & time (wall-clock of the venue, independent of the viewer) ─ */
  var ev = C.event || {};
  var off = (ev.utcOffset || "+00:00").match(/^([+-])(\d{1,2}):?(\d{2})?$/) || ["", "+", "0", "0"];
  var offsetMin = (off[1] === "-" ? -1 : 1) * (parseInt(off[2], 10) * 60 + parseInt(off[3] || "0", 10));
  function parseLocal(s) {
    var m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2}))?/);
    if (!m) return Date.now();
    return Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) - offsetMin * 60000;
  }
  var start = parseLocal(ev.start), end = ev.end ? parseLocal(ev.end) : start + 3 * 3600000;
  var locale = ev.locale || "en-GB";
  function fmt(t, opts, loc) {
    opts.timeZone = "UTC";
    return new Intl.DateTimeFormat(loc || locale, opts).format(new Date(t + offsetMin * 60000));
  }
  function time(t) { return fmt(t, { hour: "numeric", minute: "2-digit", hour12: true }, "en-US"); }
  var wall = new Date(start + offsetMin * 60000);
  var pad = function (n) { return String(n).padStart(2, "0"); };

  var venue = C.venue || {};
  var V = {
    bride: bride, groom: groom, first: first, second: second,
    title: ev.title || "", subtitle: ev.subtitle || "",
    weekday: fmt(start, { weekday: "long" }),
    day: String(wall.getUTCDate()),
    month: fmt(start, { month: "long" }),
    year: String(wall.getUTCFullYear()),
    time: time(start), timeEnd: time(end),
    venue: venue.name || "", place: venue.place || "",
    tzLabel: ev.timeZoneLabel || ""
  };
  V.date = V.day + " " + V.month + " " + V.year;
  V.dateShort = pad(wall.getUTCDate()) + " · " + pad(wall.getUTCMonth() + 1) + " · " + V.year;
  V.timeRange = V.time + " – " + V.timeEnd;
  var nk = C.nikah || null, nkStart = 0, nkEnd = 0;
  if (nk) {
    nkStart = parseLocal(nk.start); nkEnd = nk.end ? parseLocal(nk.end) : nkStart + 2 * 3600000;
    var nkWall = new Date(nkStart + offsetMin * 60000);
    V.nikahWeekday = fmt(nkStart, { weekday: "long" });
    V.nikahDate = nkWall.getUTCDate() + " " + fmt(nkStart, { month: "long" }) + " " + nkWall.getUTCFullYear();
    V.nikahTime = time(nkStart); V.nikahTimeEnd = time(nkEnd);
    V.nikahTimeRange = nk.end ? V.nikahTime + " – " + V.nikahTimeEnd : V.nikahTime;
    V.nikahVenue = get(nk, "venue.name") || ""; V.nikahPlace = get(nk, "venue.place") || "";
  }
  V.imageName = tpl((C.share || {}).saveImageName || "Invitation.jpg");

  function tpl(s) {
    return typeof s === "string" ? s.replace(/\{(\w+)\}/g, function (m, k) { return k in V ? V[k] : m; }) : s;
  }
  function val(path) {
    if (path.charAt(0) === "$") return V[path.slice(1)];
    var v = get(C, path);
    return Array.isArray(v) ? v.map(tpl) : tpl(v);
  }

  /* ── data published for app.*.js ─────────────────────────────────────── */
  var lat = +venue.lat || 0, lng = +venue.lng || 0;
  var share = C.share || {};
  var slug = (first + "-" + second).replace(/[^\w-]+/g, "");
  var mapQuery = [venue.fullName || venue.name, venue.place].filter(Boolean).join(", ");
  window.__INVITE = {
    mapQuery: mapQuery, lat: lat, lng: lng,
    shareText: tpl(share.text || ""),
    event: {
      title: tpl(ev.calendarTitle || "{title} {subtitle}"),
      start: start, end: end,
      timeZone: ev.timeZone || "UTC", offsetMin: offsetMin,
      venue: [venue.name, venue.place].filter(Boolean).join(", "),
      address: [venue.fullName].concat(venue.address || []).filter(Boolean).join(", "),
      maps: venue.mapsUrl || ("https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng),
      directions: "https://www.google.com/maps/dir/?api=1&destination=" + ((venue.address || []).length ? encodeURIComponent([venue.name].concat(venue.address).join(", ")) : lat + "," + lng),
      embed: "https://maps.google.com/maps?q=" + encodeURIComponent(mapQuery) + "&ll=" + lat + "," + lng + "&z=16&output=embed",
      hosts: get(C, "hosts.names") || "",
      day: V.day, month: V.month,
      uid: slug.toLowerCase() + "-" + start + "@invitation",
      reminder: tpl(ev.calendarReminder || ""),
      shareTitle: tpl(share.title || "{first} & {second}"),
      imageName: tpl(share.saveImageName || "Invitation.jpg"),
      storageKey: "invite-date-revealed-" + start
    }
  };

  /* ── document head ───────────────────────────────────────────────────── */
  var shareTitle = window.__INVITE.event.shareTitle;
  document.title = shareTitle;
  function meta(sel, v) { var m = document.querySelector(sel); if (m) m.setAttribute("content", v); }
  meta('meta[name="description"]', window.__INVITE.shareText);
  meta('meta[property="og:title"]', shareTitle);
  meta('meta[property="og:description"]', V.weekday + ", " + V.date + " · " + V.time + " · " + V.venue + ", " + V.place);
  meta('meta[name="theme-color"]', colors.backdrop || "#ecebde");

  /* ── fill the page ───────────────────────────────────────────────────── */
  function apply() {
    // plain text:      data-cfg="path"   ("$key" = computed value, e.g. $weekday)
    document.querySelectorAll("[data-cfg]").forEach(function (el) {
      var v = val(el.getAttribute("data-cfg"));
      if (empty(v)) { if (el.hasAttribute("data-cfg-optional")) el.hidden = true; return; }
      el.textContent = Array.isArray(v) ? v.join(" ") : v;
    });
    // template text:   data-cfg-tpl="… {first} …"
    document.querySelectorAll("[data-cfg-tpl]").forEach(function (el) {
      el.textContent = tpl(el.getAttribute("data-cfg-tpl"));
    });
    // attributes:      data-cfg-attr="href:path;title:path"
    document.querySelectorAll("[data-cfg-attr]").forEach(function (el) {
      el.getAttribute("data-cfg-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"), v = val(p.slice(1).join(":"));
        if (empty(v)) { if (p[0] === "href") el.setAttribute("href", "#"); return; }
        el.setAttribute(p[0], v);
      });
    });
    // whole block hidden when its data is null/empty
    document.querySelectorAll("[data-cfg-if]").forEach(function (el) {
      if (empty(val(el.getAttribute("data-cfg-if")))) {
        el.remove();
      }
    });
    // spans per line
    document.querySelectorAll("[data-cfg-lines]").forEach(function (el) {
      var lines = val(el.getAttribute("data-cfg-lines")) || [];
      el.textContent = "";
      lines.forEach(function (line, i) {
        if (i) el.appendChild(document.createTextNode(el.hasAttribute("data-cfg-br") ? "" : " "));
        if (i && el.hasAttribute("data-cfg-br")) el.appendChild(document.createElement("br"));
        var s = document.createElement("span"); s.textContent = line; el.appendChild(s);
      });
    });
    // names with the swash first letter
    document.querySelectorAll("[data-name]").forEach(function (el) {
      var n = el.getAttribute("data-name") === "2" ? second : first;
      el.querySelector(".sr").textContent = n;
      el.querySelector(".name__sw").textContent = n.charAt(0);
      el.querySelector(".name__rest").textContent = n.slice(1);
    });
    document.querySelectorAll("[data-mono]").forEach(function (el) {
      el.textContent = el.getAttribute("data-mono") === "2" ? ini2 : ini1;
    });
    // misc
    var mapEl = document.getElementById("map");
    if (mapEl && venue.mapImage) mapEl.style.setProperty("--map-img", 'url("' + venue.mapImage + '")');
    var frame = document.getElementById("map-frame");
    if (frame) frame.title = "Map showing " + mapQuery;
    var ics = document.getElementById("cal-ics");
    if (ics) ics.setAttribute("download", slug + "-" + (ev.subtitle || "Event").replace(/\s+/g, "-") + ".ics");
    if (nk) {
      var nv = nk.venue || {};
      var nq = [nv.name, (nv.address || []).join(", ") || nv.place].filter(Boolean).join(", ");
      var nmap = document.getElementById("nikah-map");
      if (nmap) nmap.href = nv.mapsUrl || (nv.lat != null && nv.lat !== "" ? "https://www.google.com/maps/dir/?api=1&destination=" + nv.lat + "," + nv.lng : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(nq));
      var hasLL = nv.lat != null && nv.lng != null && nv.lat !== "" && nv.lng !== "";
      var nbox = document.getElementById("nikah-map-box"), nframe = document.getElementById("nikah-map-frame"), nveil = document.getElementById("nikah-map-veil");
      if (nbox) {
        if (nv.mapImage) nbox.style.setProperty("--map-img", 'url("' + nv.mapImage + '")');
        nframe.title = "Map showing " + nq;
        var nembed = "https://maps.google.com/maps?q=" + encodeURIComponent(hasLL ? nv.name || nq : nq) + (hasLL ? "&ll=" + nv.lat + "," + nv.lng : "") + "&z=16&output=embed";
        if (!navigator.onLine) {
          nveil.querySelector(".map__cta").textContent = "Open in Google Maps";
          nveil.addEventListener("click", function () { window.open(nmap.href, "_blank", "noopener"); });
        } else {
          var nloaded = false;
          nframe.addEventListener("load", function () { if (nloaded) nbox.classList.add("is-loaded"); });
          nveil.addEventListener("click", function () { if (!nloaded) { nloaded = true; nframe.src = nembed; } nbox.classList.add("is-live"); });
          document.addEventListener("pointerdown", function (e) { if (nbox.classList.contains("is-live") && !nbox.contains(e.target)) nbox.classList.remove("is-live"); }, { passive: true });
        }
      }
      var ncal = document.getElementById("nikah-cal");
      if (ncal) {
        var g = function (t) { return new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
        var u = new URL("https://calendar.google.com/calendar/render");
        u.searchParams.set("action", "TEMPLATE");
        u.searchParams.set("text", tpl(nk.calendarTitle || "Nikah"));
        u.searchParams.set("dates", g(nkStart) + "/" + g(nkEnd));
        u.searchParams.set("location", nq);
        ncal.href = u.toString();
      }
    }
    var dir = document.getElementById("act-map");
    if (dir) dir.href = window.__INVITE.event.directions;
  }

  /* ── wax seal + favicon with the couple's initials ──────────────────── */
  function drawSeal() {
    if (!window.__SEAL_BLANK) return;
    var img = new Image();
    img.onload = function () {
      var fontsReady = document.fonts && document.fonts.load
        ? Promise.all([document.fonts.load('500 120px "Cormorant Garamond"', ini1 + ini2 + "&")]).catch(function () {})
        : Promise.resolve();
      Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 2500); })]).then(function () {
        var W = img.naturalWidth, H = img.naturalHeight, s = W / 400;
        var c = document.createElement("canvas"); c.width = W; c.height = H;
        var x = c.getContext("2d");
        x.drawImage(img, 0, 0);
        var big = 'normal 500 ' + Math.round(118 * s) + 'px "Cormorant Garamond", Garamond, serif';
        var amp = 'italic 500 ' + Math.round(62 * s) + 'px "Cormorant Garamond", Garamond, serif';
        x.textBaseline = "alphabetic";
        x.font = big; var w1 = x.measureText(ini1).width, w3 = x.measureText(ini2).width;
        x.font = amp; var w2 = x.measureText("&").width;
        var gap = 6 * s, total = w1 + gap + w2 + gap + w3, maxW = 205 * s;
        var k = total > maxW ? maxW / total : 1;
        var cx = W / 2, base = 238 * s, left = cx - total * k / 2;
        function glyphs(dx, dy, style) {
          x.save(); x.translate(left + dx, base + dy); x.scale(k, k);
          x.fillStyle = style;
          x.font = big; x.fillText(ini1, 0, 0);
          x.font = amp; x.fillText("&", w1 + gap, -6 * s);
          x.font = big; x.fillText(ini2, w1 + gap + w2 + gap, 0);
          x.restore();
        }
        // embossed look: soft cast shadow, bright upper-left rim, gold face
        x.save(); x.shadowColor = "rgba(45,28,8,.8)"; x.shadowBlur = 3.5 * s; x.shadowOffsetX = 2 * s; x.shadowOffsetY = 3 * s;
        glyphs(0, 0, "rgba(80,55,25,.95)"); x.restore();
        glyphs(1.2 * s, 1.6 * s, "rgba(70,46,18,.85)");
        glyphs(-1.3 * s, -1.5 * s, "rgba(255,238,198,.9)");
        var g = x.createLinearGradient(0, 150 * s, 0, 250 * s);
        g.addColorStop(0, "#d2ae73"); g.addColorStop(.5, "#b08a52"); g.addColorStop(1, "#8f6a3a");
        glyphs(0, 0, g);
        var url = c.toDataURL("image/webp", .92);
        if (url.indexOf("data:image/webp") !== 0) url = c.toDataURL("image/png");
        root.style.setProperty("--seal-img", 'url("' + url + '")');
        // favicon
        var f = document.createElement("canvas"); f.width = f.height = 96;
        f.getContext("2d").drawImage(c, 4, 4, 88, 88 * H / W);
        var ico = f.toDataURL("image/png");
        document.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"]').forEach(function (l) { l.href = ico; });
      });
    };
    img.src = window.__SEAL_BLANK;
  }

  apply();
  drawSeal();
})();
