export interface ApplicationConfig {
  slug: string
  title: string
  intro: string
  description: string
  categorySlugs: string[]
  sampleCategory: string
  productIndex?: number
  imageIndex?: number
  benefits: string[]
}

export const APPLICATIONS: ApplicationConfig[] = [
  {
    slug: 'warehouses-distribution',
    title: 'Warehouses & Distribution',
    intro: 'High bays for 15–45 ft ceilings, with motion and emergency options.',
    description:
      'High-ceiling storage, fulfillment centers, and industrial facilities demand bright, uniform illumination with instant-on reliability and minimal maintenance.',
    categorySlugs: ['linear-highbays', 'ufo-high-bay-lights'],
    sampleCategory: 'linear-highbays',
    productIndex: 0,
    imageIndex: 0,
    benefits: [
      'High efficacy (up to 150+ lm/W) to cut utility costs across large square footage.',
      'Optional microwave motion sensors and bi-level dimming for aisleways.',
      'Emergency battery backup configurations code-compliant for egress.',
      '0–10V dimmable drivers ready for automated lighting controls.',
    ],
  },
  {
    slug: 'parking-lots-streets',
    title: 'Parking Lots & Streets',
    intro: 'Shoebox area lights, poles and brackets for full site packages.',
    description:
      'Engineered for maximum pole spacing and clean cutoffs that eliminate light trespass, our area lights keep commercial parking lots and roadways safe and compliant.',
    categorySlugs: ['led-shoebox-lights', 'tenon-adapters'],
    sampleCategory: 'led-shoebox-lights',
    productIndex: 6,
    imageIndex: 0,
    benefits: [
      'Type III, IV, and V optical distributions tailored to lot geometry.',
      'Dusk-to-dawn photocell receptacles standard across all wattages.',
      'Die-cast aluminum housings with durable powder coat and IP65/IP66 ratings.',
      'Universal mounting brackets: slipfitter, direct arm, trunnion, and round pole mounts.',
    ],
  },
  {
    slug: 'gas-stations-canopies',
    title: 'Gas Stations & Canopies',
    intro: 'Low-profile canopy lights rated for wet locations.',
    description:
      'High-output, glare-reduced canopy fixtures that enhance nighttime curb appeal, promote customer safety, and withstand vibration and weather exposure.',
    categorySlugs: ['led-canopy-lights'],
    sampleCategory: 'led-canopy-lights',
    productIndex: 2,
    imageIndex: 0,
    benefits: [
      'Slim low-profile housings designed for surface mount or pendant installation.',
      'Sealed, gasketed optical chambers rated for wet locations.',
      'Shatter-resistant polycarbonate optics eliminating harsh hotspot glare.',
      'Utility rebate qualified with DLC Premium listings.',
    ],
  },
  {
    slug: 'offices-schools-retail',
    title: 'Offices, Schools & Retail',
    intro: 'Flat panels, troffers and downlights with selectable CCT.',
    description:
      'Architectural-grade ambient fixtures offering flicker-free dimming, selectable color temperatures, and clean aesthetics for learning and commercial work environments.',
    categorySlugs: ['led-panel-light'],
    sampleCategory: 'led-panel-light',
    productIndex: 0,
    imageIndex: 0,
    benefits: [
      'Field-selectable CCT (3500K / 4000K / 5000K) and wattage on a single SKU.',
      'Flicker-free 0–10V smooth dimming down to 10%.',
      'Ultra-thin edge-lit and back-lit profiles that drop into standard T-bar grids.',
      'High CRI (80+) rendering natural skin tones and merchandise colors.',
    ],
  },
  {
    slug: 'sports-fields-arenas',
    title: 'Sports Fields & Arenas',
    intro: 'High-output sport lights with selectable beam angles.',
    description:
      'Heavy-duty flood and stadium fixtures engineered for athletic fields, courts, driving ranges, and large outdoor arenas requiring precision beam projection.',
    categorySlugs: ['led-stadium-lights'],
    sampleCategory: 'led-stadium-lights',
    productIndex: 1,
    imageIndex: 0,
    benefits: [
      'Narrow to wide NEMA beam distributions for optimal vertical and horizontal lux.',
      'Surge protection (10kV/20kV) built-in to withstand outdoor lightning strikes.',
      'Rugged yoke and slipfitter mounts with precise degree aiming indicators.',
      'Engineered heat sinks preventing lumen depreciation under sustained runtime.',
    ],
  },
  {
    slug: 'building-exteriors-security',
    title: 'Building Exteriors & Security',
    intro: 'Wall packs and flood lights with dusk-to-dawn photocells.',
    description:
      'Commercial-grade wall packs, cutoff fixtures, and perimeter floodlights designed for perimeter security, pathways, and commercial building facades.',
    categorySlugs: ['led-wall-packs'],
    sampleCategory: 'led-wall-packs',
    productIndex: 2,
    imageIndex: 0,
    benefits: [
      'Traditional forward-throw and architectural full-cutoff dark-sky friendly models.',
      'Integrated button photocell for automated dusk-to-dawn operation.',
      'Borosilicate glass or UV-stabilized polycarbonate lenses that resist yellowing.',
      'Multiple 1/2-inch threaded conduit knockouts for straightforward electrical tie-in.',
    ],
  },
  {
    slug: 'hazardous-locations',
    title: 'Hazardous Locations',
    intro: 'Class I Div 1 & 2 explosion-proof fixtures for oil, gas and chemical sites.',
    description:
      'Certified explosion-proof and severe environment LED luminaires engineered for refineries, paint booths, grain silos, and chemical processing plants.',
    categorySlugs: ['hazardous-lighting'],
    sampleCategory: 'hazardous-lighting',
    productIndex: 2,
    imageIndex: 0,
    benefits: [
      'CID1, CID2, CIID1, CIID2 ratings for flammable vapors and combustible dusts.',
      'Copper-free aluminum housing with corrosion-resistant finish.',
      'Thermal management designed to meet strict T-code operating temperature limits.',
      'Vibration and shock tested for harsh heavy-industry conditions.',
    ],
  },
  {
    slug: 'life-safety-exit-signs',
    title: 'Life Safety & Exit Signs',
    intro: 'Battery-backed exit signs and emergency lights, code-ready.',
    description:
      'UL 924 compliant emergency egress lighting, illuminated exit signs, and combo units ensuring life safety code compliance in all commercial facilities.',
    categorySlugs: ['emergency-combo-exit-signs'],
    sampleCategory: 'emergency-combo-exit-signs',
    productIndex: 3,
    imageIndex: 0,
    benefits: [
      'UL 924 listed and NFPA 101 Life Safety Code compliant.',
      'Long-life maintenance-free Ni-Cd or sealed lead-acid battery backup.',
      'Dual-voltage input (120/277V) with push-to-test switch and charge indicator.',
      'Universal mounting canopy for side, top, or back surface installations.',
    ],
  },
]

export const APPLICATION_OPTIONS = APPLICATIONS.map((a) => ({
  slug: a.slug,
  title: a.title,
}))
