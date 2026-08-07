import { storageUrl } from '@/lib/constants'

// ── Food & Drinks menu data ──
// Transcribed from the printed menus served at LENGOLF (also hosted at
// menus/food-menu-1.jpg, menus/food-menu-2.jpg, menus/drink-menu.jpg in
// Supabase Storage and linked from booking.len.golf). Keep this file in
// sync with the printed menu whenever the kitchen partners update prices.

export interface MenuItem {
  name: string
  /** Price in THB (numeric, for JSON-LD offers) */
  price: number
  /** Display label, e.g. "330 THB" or "950 THB / bottle" */
  priceLabel: string
  description?: string
}

export interface MenuSection {
  id: string
  title: string
  note?: string
  items: MenuItem[]
}

export interface MenuGroup {
  id: string
  title: string
  subtitle: string
  sections: MenuSection[]
}

const thb = (n: number): string => `${n.toLocaleString('en-US')} THB`
const item = (name: string, price: number, description?: string, priceSuffix = ''): MenuItem => ({
  name,
  price,
  priceLabel: `${thb(price)}${priceSuffix}`,
  ...(description ? { description } : {}),
})

// ── Food by Smith & Co ──
export const foodMenuGroup: MenuGroup = {
  id: 'food',
  title: 'Food',
  subtitle: 'Burgers, sliders, and sharing plates by Smith & Co, served straight to your bay.',
  sections: [
    {
      id: 'burgers',
      title: 'Burgers',
      note: 'Fries as sides available: Sweet Potato 80 THB, Super Skinny 70 THB, French Fries 70 THB',
      items: [
        item('Signature Smash', 330, 'Ground beef patty, BBQ black garlic sauce, caramelized onion, mozzarella cheese, cheddar cheese, garlic butter'),
        item("Smith's Burger", 330, 'Ground beef patty, BBQ sauce, cheddar cheese, garlic butter, pickled cucumber'),
        item('Classic Cheese', 320, 'Ground beef patty, cheddar cheese slice, mustard, onion, tomato sauce, pickled cucumber'),
      ],
    },
    {
      id: 'butter-rolls',
      title: 'Butter Rolls',
      items: [
        item('BBQ Brisket', 360, 'Brisket, sriracha mayo, mint yogurt sauce, parmesan cheese, spring onion, garlic butter toast'),
        item('Mentaiko Shrimp', 360, 'Shrimp, mentaiko sauce, mayonnaise, lettuce, parmesan cheese, spring onion, garlic butter toast'),
        item('Pulled Pork', 290, 'Pulled pork, BBQ dark beer sauce, mustard, mint yogurt sauce, parmesan cheese, spring onion, garlic butter toast'),
      ],
    },
    {
      id: 'appetizers',
      title: 'Appetizers',
      items: [
        item('Calamari', 290, 'Deep fried squid, tartar sauce, slice of lemon'),
        item('Sweet Potato Fries', 240, 'Deep fried sweet potatoes, thousand island, ketchup'),
        item('French Fries', 200),
      ],
    },
    {
      id: 'toast',
      title: 'Toast',
      items: [
        item('Crab', 290, 'Crab, bell pepper, red onion, Italian dressing, garlic butter toast'),
        item('Smoked Salmon', 270, 'Smoked salmon, sour cream, dill, garlic butter toast'),
        item('Shrimp Ebiko', 270, 'Shrimp ebiko, sriracha mayo, mint yogurt sauce, spring onion, garlic butter toast'),
      ],
    },
    {
      id: 'sliders',
      title: 'Sliders',
      note: '3 mini pieces per serving',
      items: [
        item('BBQ Brisket Sliders', 420, 'Beef brisket, coleslaw, dark beer BBQ, super skinny fries, charcoal buns'),
        item('Beef Steak Sliders', 390, 'Sliced beef, honey dijon mustard, rocket salad, garlic butter'),
        item('Crispy Chicken Sliders', 330, 'Fried chicken, thousand island, jalapeno ranch, cheddar cheese, mini charcoal buns, iceberg lettuce'),
      ],
    },
    {
      id: 'salad',
      title: 'Salad',
      items: [
        item('Spicy Salmon Salad', 340, 'Diced grilled salmon, mixed salad, cherry tomatoes, spicy dressing'),
        item('Chicken Caesar Salad', 270, 'Grilled chicken breast on mixed greens, caesar dressing, croutons, parmesan cheese'),
      ],
    },
  ],
}

// ── Pizza by Sexy Pizza ──
export const pizzaMenuGroup: MenuGroup = {
  id: 'pizza',
  title: 'Pizza',
  subtitle: 'Wood-fired Neapolitan pizzas from Sexy Pizza x LENGOLF. All prices include 7% VAT.',
  sections: [
    {
      id: 'pizzas',
      title: 'Pizzas',
      items: [
        item('Morel Parma Monalisa', 690, 'Morel mushrooms, prosciutto di Parma, cream sauce'),
        item('4+1 Cheese', 630, 'Blue cheese, brie cheese, Parmigiano, mozzarella, burrata, honey truffle'),
        item('Crab-Tastic Saffron', 630, 'Saffron sauce, crab, chilli, parsley'),
        item('Diavola', 580, 'Spicy salami, mozzarella, Parmigiano, hot honey'),
        item('Hawaiian', 570, 'Caramelised pineapple, smoked ham'),
        item('Margherita', 380, 'Cherry tomato confit, mozzarella, Parmigiano, basil'),
      ],
    },
  ],
}

// ── Drinks ──
export const drinksMenuGroup: MenuGroup = {
  id: 'drinks',
  title: 'Drinks',
  subtitle: 'Full bar with signature golf cocktails, Japanese highballs, beer, wine, and soft drinks.',
  sections: [
    {
      id: 'cocktails',
      title: 'Cocktails',
      items: [
        item('Bunker Blast', 250, 'Rum and coke, the perfect sand sipper'),
        item('Fairway Fizz', 250, 'Gin and tonic, a timeless classic on the green'),
        item('Monster Drive', 310, 'Vodka and Red Bull, boost your drive'),
      ],
    },
    {
      id: 'highballs',
      title: 'Highballs',
      items: [
        item('Luxury (Hibiki)', 800),
        item('Premium (Chita)', 390),
        item('Original (Kakubin)', 270),
      ],
    },
    {
      id: 'beer',
      title: 'Bottled Beer',
      items: [
        item('Hoegaarden', 270),
        item('Chatri IPA', 270),
        item('Asahi Super Dry', 200),
        item('Heineken', 200),
        item('Singha', 160),
      ],
    },
    {
      id: 'wine',
      title: 'Wine',
      items: [
        item('House Red (glass)', 290),
        item('House White (glass)', 290),
        item('Arcadian Sauvignon Blanc 2023', 950, undefined, ' / bottle'),
        item('Wolf Blass Chardonnay 2023', 1100, undefined, ' / bottle'),
        item('Penfolds Chardonnay 2023', 1600, undefined, ' / bottle'),
        item('Arcadian Shiraz 2023', 950, undefined, ' / bottle'),
        item('Wolf Blass Merlot 2021', 1100, undefined, ' / bottle'),
        item('Penfolds Cabernet Sauvignon 2022', 1600, undefined, ' / bottle'),
        item('Bisol Belstar Prosecco Brut', 1400, 'Sparkling', ' / bottle'),
      ],
    },
    {
      id: 'non-alcoholic',
      title: 'Non-Alcoholic',
      note: 'Unlimited soft drinks available: 100 THB per hour per person',
      items: [
        item('Unlimited Soft Drinks', 100, 'Refill as much as you like while you play', ' / hour per person'),
        item('Water', 30),
        item('Soda', 35),
        item('Coca Cola (Zero)', 70),
        item('Sprite', 70),
        item('Zuza', 60),
        item('Red Bull', 150),
        item('Hot Tea', 80),
        item('Festilia Premium Juice', 110),
      ],
    },
    {
      id: 'snacks',
      title: 'Snacks',
      items: [
        item('Premium Nuts Mix', 130),
        item('Spiced Nuts', 120),
        item('Popcorn', 120),
      ],
    },
  ],
}

export const menuGroups: MenuGroup[] = [foodMenuGroup, pizzaMenuGroup, drinksMenuGroup]

// ── Printed menu images (same content as the tables above) ──
export const menuImages = [
  {
    src: storageUrl('menus/food-menu-1.jpg'),
    title: 'Food Menu',
    alt: 'LENGOLF food menu by Smith & Co: burgers 320-330 THB, butter rolls 290-360 THB, appetizers 200-290 THB, toast 270-290 THB, sliders 330-420 THB, salads 270-340 THB',
    width: 1920,
    height: 1354,
    previewPosition: 'left top',
  },
  {
    src: storageUrl('menus/food-menu-2.jpg'),
    title: 'Pizza Menu',
    alt: 'Sexy Pizza x LENGOLF pizza menu: Margherita 380 THB, Hawaiian 570 THB, Diavola 580 THB, 4+1 Cheese 630 THB, Crab-Tastic Saffron 630 THB, Morel Parma Monalisa 690 THB, unlimited soft drinks 100 THB per hour',
    width: 795,
    height: 2057,
    previewPosition: 'center top',
  },
  {
    src: storageUrl('menus/drink-menu.jpg'),
    title: 'Drinks Menu',
    alt: 'LENGOLF drinks menu: cocktails 250-310 THB, highballs 270-800 THB, bottled beer 160-270 THB, wine by the glass 290 THB, wine bottles 950-1,600 THB, soft drinks from 30 THB, snacks from 120 THB',
    width: 1749,
    height: 2481,
    previewPosition: 'center top',
  },
]

// FAQ content lives in the MenuFaq namespace in messages/{locale}.json
// (canonical English in messages/en.json) so it translates per locale.
