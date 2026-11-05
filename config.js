/*
 * ────────────────────────────────────────────────────────────────────────────
 *  INVITATION SETTINGS — edit the object below, save, and reload the page.
 *
 *  Text values may use these placeholders:
 *    {bride} {groom} {first} {second}   names (first/second follow "order")
 *    {weekday} {day} {month} {year} {date} {dateShort} {time} {timeEnd} {timeRange}
 *    {venue} {place}
 *  Set an optional block (e.g. "wishes", "nikah") to null or "" to hide it.
 *
 *  artwork.tint: CSS filter applied to the watercolour flowers, leaves and washes
 *  ("none" keeps the original green).
 * ────────────────────────────────────────────────────────────────────────────
 */
window.INVITE_CONFIG = {
  "couple": {
    "bride": "Vyshnavi P",
    "groom": "Vivek PK",
    "order": "bride-first",
    "monogram": "V&V"
  },

  "event": {
    "title": "",
    "subtitle": "Ceremony",
    "start": "2027-04-12T11:00",   // Muhurtham start
    "end": "2027-04-12T11:30",     // Muhurtham end
    "utcOffset": "+05:30",
    "timeZone": "Asia/Kolkata",
    "timeZoneLabel": "Muhurtham · India Standard Time",
    "locale": "en-GB",
    "calendarTitle": "Wedding of {first} & {second}",
    "calendarReminder": "Wedding muhurtham today at {time}"
  },

  "invitation": {
    "bismillah": "Om Shri Ganeshaya Namah",
    "lines": [
      "With the blessings of Lord Ganesha",
      "and the love of our families,",
      "we joyfully invite you to the wedding of"
    ]
  },

  "venue": {
    "name": "Nova Auditorium",
    "fullName": "Nova Auditorium",
    "place": "Kozhikode",
    "address": [
      "Palazhi Road, Opposite Hi-Lite Mall",
      "Kozhikode, Kerala 673014"
    ],
    "lat": 11.2487,
    "lng": 75.8339,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Nova+Auditorium%2C+Palazhi+Road%2C+opposite+Hi-Lite+Mall%2C+Kozhikode%2C+Kerala+673014",
    "mapImage": "a/map-placeholder.webp"
  },

  "hosts": {
    "intro": "With the blessings of",
    "names": "Vinod Kumar & Prasanthini",
    "relation": "Parents of the Bride"
  },

  "wishes": {
    "label": "",
    "names": "Mohandas PK & Jiji",
    "relation": "Parents of the Groom"
  },

  "nikah": null,

  "sections": {
    "verse": {
      "kicker": "The Seven Sacred Vows",
      "title": "Saptapadi",
      "arabic": "With seven steps, we become friends for life.",
      "english": "Let us walk together in strength, in prosperity, in wisdom and in joy; let us cherish our families, share every season, and remain companions forever.",
      "reference": "Vedic Wedding Vows"
    },
    "countdown": {
      "title": "Save the Date",
      "kicker": "Every moment brings us closer"
    },
    "venue": {
      "title": "Where Hearts Meet",
      "kicker": "The Venue"
    },
    "blessing": {
      "title": "Bless the Couple",
      "kicker": "Your blessings are the most precious gift",
      "arabic": "May the divine bless this sacred union with love, harmony and happiness."
    },
    "finale": {
      "line": "Your presence and blessings will make our joy complete.",
      "sub": "We look forward to celebrating with you."
    }
  },

  "share": {
    "title": "{first} & {second} · Wedding",
    "text": "With the blessings of Lord Ganesha, you are warmly invited to the wedding of {first} & {second} — {weekday}, {date}, Muhurtham {timeRange} at Nova Auditorium, Palazhi Road, opposite Hi-Lite Mall, Kozhikode. Location: https://www.google.com/maps/search/?api=1&query=Nova+Auditorium%2C+Palazhi+Road%2C+opposite+Hi-Lite+Mall%2C+Kozhikode%2C+Kerala+673014",
    "saveImage": "invitation.jpg",
    "saveImageName": "{first}-{second}-Invitation.jpg"
  },

  "artwork": {
    "tint": "saturate(.8) brightness(1.06) hue-rotate(-8deg)"
  },

  // Pastel Lavender & Blush palette: lavender envelope, blush paper, soft gold, muted plum text
  "colors": {
    "paper": "#fdf9fa",
    "backdrop": "#f1ebf5",
    "ink": "#4a3a5c",
    "ink-2": "#66557a",
    "sage": "#9d8fae",
    "gold": "#b08a45",
    "gold-hi": "#efd8a2",
    "gold-lo": "#7d6026",
    "env": "#cfc1e3",
    "env-2": "#c4b4dc",
    "env-in": "#b3a1cf",

    "foil-1": "#96733a",
    "foil-2": "#d6b26c",
    "foil-3": "#f7e5b8",
    "foil-4": "#c29d57",
    "foil-5": "#8a6930",
    "foil-mid": "#c19c5a",
    "foil-text": "#45300c",
    "foil-sheen": "#fff8e6",
    "glint": "#f9edcf",
    "glow": "#ebcf8c",
    "sheen": "#fffbf2",
    "paper-hi": "#fffcfd",
    "pin": "#fffcfd",
    "map-bg": "#ece5f1",
    "svg-gold-1": "#7d6026",
    "svg-gold-2": "#b08a45",
    "svg-gold-3": "#e6cb8d",
    "svg-ink-1": "#bb9550",
    "svg-ink-2": "#a5803f"
  }
};
