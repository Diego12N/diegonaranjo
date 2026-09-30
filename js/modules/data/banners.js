/* Banners reales de la página "Diseño visual para web".
   Cada campaña puede tener versión desktop (d) y/o mobile (m): [ancho, alto]. */

export const RUBRO = {
  "electro": {
    "es": "Electrodomésticos y hogar",
    "en": "Home appliances"
  },
  "colchon": {
    "es": "Colchones y descanso",
    "en": "Mattresses"
  },
  "obra": {
    "es": "Sanitarios y construcción",
    "en": "Plumbing and construction"
  },
  "perfume": {
    "es": "Perfumería",
    "en": "Fragrances"
  }
};

export const BANNERS = [
  {
    "id": "carnaval-2024",
    "r": "electro",
    "d": [
      1920,
      612
    ],
    "m": [
      768,
      888
    ],
    "t": {
      "es": "Carnaval de Ofertas 2024",
      "en": "Carnival Deals 2024"
    }
  },
  {
    "id": "vuelta-a-clases",
    "r": "electro",
    "d": [
      1920,
      500
    ],
    "m": [
      768,
      888
    ],
    "t": {
      "es": "Vuelta a clases",
      "en": "Back to school"
    }
  },
  {
    "id": "mes-de-mama",
    "r": "electro",
    "d": [
      1820,
      500
    ],
    "m": [
      768,
      888
    ],
    "t": {
      "es": "Mes de Mamá 2024",
      "en": "Mother’s Day 2024"
    }
  },
  {
    "id": "aires",
    "r": "electro",
    "d": [
      1820,
      500
    ],
    "m": [
      768,
      888
    ],
    "t": {
      "es": "Aires y ventilación",
      "en": "Air conditioning and fans"
    }
  },
  {
    "id": "bancor",
    "r": "electro",
    "d": [
      1920,
      612
    ],
    "m": [
      768,
      888
    ],
    "t": {
      "es": "Beneficios Tarjeta Bancor",
      "en": "Bancor card benefits"
    }
  },
  {
    "id": "naranja-x",
    "r": "electro",
    "d": [
      1920,
      612
    ],
    "m": [
      768,
      888
    ],
    "t": {
      "es": "Beneficios Naranja X",
      "en": "Naranja X benefits"
    }
  },
  {
    "id": "cuotas",
    "r": "electro",
    "d": [
      1820,
      500
    ],
    "m": [
      768,
      888
    ],
    "t": {
      "es": "Registrate y participá",
      "en": "Sign up and save"
    }
  },
  {
    "id": "carnaval-2023",
    "r": "electro",
    "d": [
      1920,
      500
    ],
    "m": [
      768,
      888
    ],
    "t": {
      "es": "Carnaval de Ofertas 2023",
      "en": "Carnival Deals 2023"
    }
  },
  {
    "id": "oferta-colchon",
    "r": "colchon",
    "d": [
      1820,
      900
    ],
    "m": [
      768,
      888
    ],
    "t": {
      "es": "Oferta del mes",
      "en": "Deal of the month"
    }
  },
  {
    "id": "presupuesto",
    "r": "obra",
    "d": [
      1920,
      500
    ],
    "m": [
      768,
      320
    ],
    "t": {
      "es": "Presupuestá tu obra",
      "en": "Get a quote for your project"
    }
  },
  {
    "id": "seleccion",
    "r": "electro",
    "d": [
      1820,
      500
    ],
    "m": null,
    "t": {
      "es": "Alentamos a la Selección",
      "en": "Cheering for the national team"
    }
  },
  {
    "id": "samsung",
    "r": "electro",
    "d": [
      1920,
      1280
    ],
    "m": null,
    "t": {
      "es": "Beneficios Samsung",
      "en": "Samsung benefits"
    }
  },
  {
    "id": "fragancias",
    "r": "perfume",
    "d": [
      1842,
      854
    ],
    "m": null,
    "t": {
      "es": "Fragancias",
      "en": "Fragrances"
    }
  },
  {
    "id": "importados",
    "r": "perfume",
    "d": [
      1846,
      852
    ],
    "m": null,
    "t": {
      "es": "Importados",
      "en": "Imported fragrances"
    }
  }
];

export const bSrc = (c, dev) => `assets/images/banners/${c.id}-${dev === 'd' ? 'desktop' : 'mobile'}.webp`;

/* Campañas del visor y piezas de la galería (mismas variables que usa el visor). */
export const CAMPAIGNS = [], PIECES = [];
BANNERS.forEach((c, i) => {
  CAMPAIGNS.push(c);
  PIECES.push({ camp: i, dev: 'd', src: bSrc(c, 'd'), w: c.d[0], h: c.d[1], ratio: c.d[0] / c.d[1] });
  if (c.m) PIECES.push({ camp: i, dev: 'm', src: bSrc(c, 'm'), w: c.m[0], h: c.m[1], ratio: c.m[0] / c.m[1] });
});

/* Faja de información de la tienda simulada (contenido ficticio). */
export const STORE_ICO = {
  "ship": "<path d=\"M3 7h11v9H3z M14 10h4l3 3v3h-7\" /><circle cx=\"7\" cy=\"17.5\" r=\"1.6\"/><circle cx=\"17\" cy=\"17.5\" r=\"1.6\"/>",
  "card": "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M3 10h18 M7 14.5h4\"/>",
  "back": "<path d=\"M4 9h11a5 5 0 0 1 0 10H9\"/><path d=\"M8 5 4 9l4 4\"/>"
};
export const STORE_INFO = [
  {
    "i": "ship",
    "k": {
      "es": "Envío gratis a todo el país",
      "en": "Free nationwide shipping"
    },
    "a": {
      "es": "Ver condiciones",
      "en": "See terms"
    }
  },
  {
    "i": "card",
    "k": {
      "es": "Hasta 6 cuotas sin interés",
      "en": "Up to 6 interest-free payments"
    },
    "a": {
      "es": "Medios de pago",
      "en": "Payment methods"
    }
  },
  {
    "i": "back",
    "k": {
      "es": "Primer cambio sin cargo",
      "en": "First exchange free of charge"
    },
    "a": {
      "es": "Cómo funciona",
      "en": "How it works"
    }
  }
];

/* La página "Diseño visual para web" solo se muestra si hay piezas cargadas. */
export const showVisual = () => PIECES.length > 0;
