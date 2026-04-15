import type { CatalogueProductCard } from '../models/product'

export const catalogueProducts: CatalogueProductCard[] = [
  {
    id: 'pdt-spunta-g1',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCOS0mJEhO57c0M1w2HmcC-WDTuUL82X2_AaPM7s-2fbS1Hzh0nNFbb9koGrV885mys8GWGMxRkPZ1VhyQxzXbQYJC5XP9uqHZG4Wag5Es2-4LAG1dfB3glKForgwvPNKdVpc9TosUdrLWxb_z_u_ov2cl9czLvEg8fKJ0w185Z7AdbFQCf6OkbPGIPI8pPquo5JJL1VH6SQaIPZls06wHM8gjIKss5XpnbNc6s0ib10TXrUCGSTguO2GNmIaZ_O8ih_O3lTZ0nZ3k',
    badges: [
      { label: 'Algeria Origin', tone: 'primary' },
      { label: 'Premium', tone: 'secondary' },
    ],
    category: 'Legumes frais',
    name: 'Pomme de Terre Spunta G1',
    priceTiers: [
      { label: '1 Palette (1.2t)', amountDa: 45000 },
      { label: '5 Palettes+', amountDa: 42000, highlighted: true },
    ],
    stockLabel: '24 palettes dispos',
    shippingLabel: 'Expedition 24/48h',
    stockTone: 'primary',
  },
  {
    id: 'carottes-nantaise-jumbo',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPPLVUvoE-3Qlk00QAzuHummw_Pe1-2CfdBi97YSpW4c50rvP_lqhFnK-ORl2daCJdEh7BkV8LgD5o4dz9SvU6MQeARzIYYQrOVfaEVzqX5k9onKhHrVEXr2xumhSeGnNj8aRlgsoyHbeofeyplKgt3H78AMJXtthgOv32bDGfxCyQDBXuGKr_LL4cu7lot3OXSTCoAnwbi_duASpLCFfugwx9MoOCeFodoKjARpxKhJUe1VWB0BzJx6gOYATNpW-puX_S5LsUi5I',
    badges: [{ label: 'Algeria Origin', tone: 'primary' }],
    category: 'Legumes frais',
    name: 'Carottes Nantaise Jumbo',
    priceTiers: [
      { label: '1 Carton (25kg)', amountDa: 3200 },
      { label: '1 Palette (40c)', amountDa: 2900 },
    ],
    stockLabel: 'Stock limite',
    shippingLabel: 'Local: Biskra',
    stockTone: 'secondary',
  },
  {
    id: 'pois-chiches-import-12mm',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBlgUoM6EPJbDCXvhjIYwescHqE0IHHnT60c-t4G_zYxrQU3WxHr0X-IH344YUYub0Zodd3hkppNKDJn3LxoF6PNM2X-eO_FQF2BCWmQ9g3BcN7ng1ODFdkpxvjCBJBGWSs8hb3AR1PGvM9Dm5blNMJTEKtSTaBIAI9ThX1CEju6LGXukkw6pDfS8vIQ93rqcHDtj7IQC2jGbSSQx9wBG9aXnyv-6a3qQhO155-nTeMNgGW0tTkM9IbgJ-G8jjO0hOnVYJvSSkV7Tk',
    badges: [{ label: 'Imported', tone: 'neutral' }],
    category: 'Cereales & Grains',
    name: 'Pois Chiches Import 12mm',
    priceTiers: [
      { label: 'Sac 50kg', amountDa: 12500 },
      { label: '100+ Sacs', amountDa: 11800 },
    ],
    stockLabel: 'Disponible',
    shippingLabel: 'Origine: Canada',
    stockTone: 'primary',
  },
]

