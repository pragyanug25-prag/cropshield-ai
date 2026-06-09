// ─── Mock AI response data ────────────────────────────────────────────────────
// Realistic plant disease data used to simulate backend responses.
// Each entry mirrors what a real ML model would return.

export const diseases = {
  tomato_early_blight: {
    id: 'tomato_early_blight',
    name: 'Early Blight',
    host: 'Tomato',
    scientificName: 'Alternaria solani',
    severity: 'medium',
    confidence: 91,
    description:
      'Early blight is one of the most common fungal diseases of tomato, caused by the soil-borne fungus Alternaria solani. It appears as dark brown spots with concentric rings forming a "target" pattern, surrounded by yellow tissue.',
    symptoms: [
      'Dark-brown target-shaped lesions on lower leaves',
      'Yellow halo surrounding each lesion',
      'Premature leaf drop starting from the base',
      'Stem lesions may appear near soil line',
    ],
    treatment: [
      {
        step: 1,
        action: 'Remove infected leaves',
        detail: 'Prune and destroy all visibly infected leaves immediately. Do not compost.',
      },
      {
        step: 2,
        action: 'Apply copper-based fungicide',
        detail: 'Spray a copper hydroxide or mancozeb fungicide every 7–10 days during wet seasons.',
      },
      {
        step: 3,
        action: 'Improve air circulation',
        detail: 'Stake plants and remove suckers to reduce humidity around foliage.',
      },
      {
        step: 4,
        action: 'Apply mulch',
        detail: 'Thick mulch prevents soil splash that spreads fungal spores to lower leaves.',
      },
    ],
    products: [
      { name: 'Mancozeb 75 WP', type: 'Fungicide', dosage: '2.5 g/L water' },
      { name: 'Copper Oxychloride', type: 'Fungicide', dosage: '3 g/L water' },
      { name: 'Trichoderma viride', type: 'Biocontrol', dosage: '4 g/L water' },
    ],
    prevention: [
      'Use certified disease-free seeds or resistant varieties (e.g., Mountain Magic)',
      'Practice 2–3 year crop rotation with non-solanaceous crops',
      'Water at the base — avoid wetting foliage',
      'Maintain adequate plant spacing (45–60 cm) for airflow',
      'Scout fields weekly during humid or rainy periods',
    ],
    icon: '🍅',
    color: 'from-red-800 to-orange-900',
  },

  potato_late_blight: {
    id: 'potato_late_blight',
    name: 'Late Blight',
    host: 'Potato',
    scientificName: 'Phytophthora infestans',
    severity: 'high',
    confidence: 87,
    description:
      'Late blight is a devastating oomycete disease responsible for the 1840s Irish famine. Water-soaked lesions rapidly spread across foliage and tubers under cool, moist conditions, often destroying entire fields within days.',
    symptoms: [
      'Water-soaked, pale-green patches on leaf edges',
      'White cottony sporulation on leaf undersides in humid conditions',
      'Brown-black lesions that spread rapidly across leaflets',
      'Tuber rot with reddish-brown internal discolouration',
    ],
    treatment: [
      {
        step: 1,
        action: 'Apply systemic fungicide immediately',
        detail: 'Use metalaxyl + mancozeb or cymoxanil formulations at first sign of infection.',
      },
      {
        step: 2,
        action: 'Remove and destroy infected haulm',
        detail: 'Cut all above-ground tissue and burn or bag it — do not incorporate into soil.',
      },
      {
        step: 3,
        action: 'Delay harvest if possible',
        detail: 'Allow tubers to skin-set for 2 weeks after haulm removal before digging.',
      },
      {
        step: 4,
        action: 'Treat store with ventilation',
        detail: 'Keep storage below 4 °C with adequate airflow to slow disease spread in tubers.',
      },
    ],
    products: [
      { name: 'Ridomil Gold MZ', type: 'Fungicide', dosage: '2 g/L water' },
      { name: 'Cymoxanil + Mancozeb', type: 'Fungicide', dosage: '2.5 g/L water' },
      { name: 'Amistar (Azoxystrobin)', type: 'Fungicide', dosage: '1 mL/L water' },
    ],
    prevention: [
      'Plant certified blight-free seed tubers',
      'Choose resistant varieties (Sarpo Mira, Defender)',
      'Apply protectant fungicide before disease appears during blight-risk alerts',
      'Avoid overhead irrigation — use drip systems',
      'Ensure wide row spacing and good drainage',
    ],
    icon: '🥔',
    color: 'from-yellow-900 to-amber-900',
  },

  leaf_spot: {
    id: 'leaf_spot',
    name: 'Bacterial Leaf Spot',
    host: 'Pepper / Tomato',
    scientificName: 'Xanthomonas campestris pv. vesicatoria',
    severity: 'low',
    confidence: 78,
    description:
      'Bacterial leaf spot is a common bacterial disease affecting peppers and tomatoes worldwide. Small water-soaked spots enlarge and turn brown with yellow margins, reducing photosynthetic area and fruit quality.',
    symptoms: [
      'Small, dark water-soaked circular spots (1–2 mm)',
      'Lesions turn tan to brown with yellow chlorotic halos',
      'Spots may coalesce to form large dead areas',
      'Raised or scab-like spots on fruit surface',
    ],
    treatment: [
      {
        step: 1,
        action: 'Apply copper bactericide',
        detail: 'Copper hydroxide sprays at 7–10 day intervals reduce bacterial populations.',
      },
      {
        step: 2,
        action: 'Reduce leaf wetness',
        detail: 'Switch to drip irrigation and avoid working in the field when foliage is wet.',
      },
      {
        step: 3,
        action: 'Remove severely infected tissue',
        detail: 'Prune heavily spotted branches and bag waste for disposal.',
      },
    ],
    products: [
      { name: 'Kocide 3000 (Copper Hydroxide)', type: 'Bactericide', dosage: '1.5 g/L water' },
      { name: 'Bordeaux Mixture', type: 'Bactericide', dosage: '10 g/L water' },
    ],
    prevention: [
      'Use disease-free, heat-treated seed',
      'Avoid overhead watering',
      'Remove crop debris at season end',
      'Practice 2-year rotation away from solanaceous crops',
      'Stake plants to keep foliage off the ground',
    ],
    icon: '🌿',
    color: 'from-green-900 to-teal-900',
  },

  powdery_mildew: {
    id: 'powdery_mildew',
    name: 'Powdery Mildew',
    host: 'Cucurbits / Grapes',
    scientificName: 'Podosphaera xanthii',
    severity: 'medium',
    confidence: 94,
    description:
      'Powdery mildew is one of the most easily recognised fungal diseases, producing a characteristic white to grey powdery coating on leaf surfaces. Unlike most fungi it thrives in warm, dry conditions with high humidity nights.',
    symptoms: [
      'White or grey powdery spots on upper leaf surfaces',
      'Spots enlarge to cover entire leaf in advanced stages',
      'Leaves may yellow, curl, and drop prematurely',
      'Reduced fruit size and poor flavour',
    ],
    treatment: [
      {
        step: 1,
        action: 'Apply potassium bicarbonate or sulfur',
        detail: 'These disrupt fungal cell membranes. Spray at first sign, repeat every 7 days.',
      },
      {
        step: 2,
        action: 'Use neem oil spray',
        detail: 'Dilute neem oil (5 mL/L + emulsifier) coats leaves and prevents spore germination.',
      },
      {
        step: 3,
        action: 'Improve air circulation',
        detail: 'Thin canopy through pruning to increase airflow and reduce humidity pockets.',
      },
    ],
    products: [
      { name: 'Sulfur 80 WP', type: 'Fungicide', dosage: '3 g/L water' },
      { name: 'Trifloxystrobin (Flint)', type: 'Fungicide', dosage: '0.5 g/L water' },
      { name: 'Neem Oil EC', type: 'Biopesticide', dosage: '5 mL/L water' },
    ],
    prevention: [
      'Plant resistant varieties where available',
      'Avoid high nitrogen fertilisation that promotes lush, susceptible growth',
      'Ensure good spacing and canopy ventilation',
      'Avoid late evening irrigation',
      'Remove infected crop debris at end of season',
    ],
    icon: '🍇',
    color: 'from-purple-900 to-indigo-900',
  },
}

// Returns a random disease for the demo
export function getRandomDisease() {
  const keys = Object.keys(diseases)
  return diseases[keys[Math.floor(Math.random() * keys.length)]]
}
