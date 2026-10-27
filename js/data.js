/* =========================================================
   شَهد — بيانات المتجر (الأصناف، الأقسام، الأوزان، الشحن، الكوبونات)
   لتغيير صورة: ضع رابط صورة كاملًا مكان اسم الصورة في PHOTOS،
   أو استبدل الملف بنفس الاسم داخل assets/sweets/.
   ========================================================= */

/* الصور الحقيقية (assets/photos) — اسم الصورة ← الملف
   لإضافة صورة: عالجها بـ tools/process-photos.py ثم أضف اسمها هنا.
   أي اسم مش موجود هنا بيستخدم الرسمة من assets/sweets. */
const PHOTO_FILES = [
  'konafa-cream', 'konafa-round', 'konafa-naama', 'konafa-naama-box', 'konafa-naama-squares', 'balah',
  'basbousa', 'basbousa-cream', 'basbousa-nutella', 'harissa', 'harissa-squares', 'shakarbara',
  'baklava', 'baklava-tray', 'assorted-tray', 'fingers', 'fingers-mini', 'triangles', 'gift-box'
];
const PHOTOS = Object.fromEntries(PHOTO_FILES.map(k => [k, `assets/photos/${k}.webp`]));
// يمكن أيضًا وضع رابط كامل: PHOTOS['konafa-cream'] = 'https://example.com/konafa.jpg';

/* يرجّع رابط الصورة (العرض w محفوظ للتوافق مع الصور الخارجية) */
function img(key, w = 900) {
  const src = PHOTOS[key] || key;
  if (/^(https?:|data:|\.?\/|assets\/)/.test(src)) return src;
  return `assets/sweets/${src}.svg`;
}
const isPhoto = key => !!PHOTOS[key];

const CATEGORIES = [
  { id: 'konafa', label: 'كنافة وبلح الشام', short: 'الكنافة', desc: 'كنافة شعر وناعمة بالقشطة، وبلح الشام المقرمش بالعسل', image: 'konafa-round' },
  { id: 'basbousa', label: 'بسبوسة وهريسة', short: 'البسبوسة', desc: 'بسبوسة طرية بالسمن البلدي، بالقشطة والبندق والنوتيلا', image: 'basbousa' },
  { id: 'baklava', label: 'بقلاوة وجلاش', short: 'البقلاوة', desc: 'رقائق ذهبية بالفستق والمكسرات، صواني وعلب هدايا', image: 'baklava-tray' },
  { id: 'kahk', label: 'كحك ومعمول وبسكويت', short: 'المخبوزات', desc: 'طعم العيد في كل يوم، بالسمن والسكر البودرة', image: 'kahk' },
  { id: 'cakes', label: 'تورت وحلويات غربي', short: 'التورت', desc: 'تورت وتشيز كيك وجاتوه لكل احتفال', image: 'cake-strawberry' },
  { id: 'cups', label: 'كاسات وحلويات باردة', short: 'الكاسات', desc: 'أم علي، أرز بلبن ومهلبية', image: 'mahalabia' }
];

/* المكوّن الأساسي (يظهر في قسم «من المكوّن إلى الطبق» وفي الفلاتر) */
const FLAVORS = {
  ghee: { label: 'سمن بلدي', note: 'سمن بلدي أصلي يدّي الحلويات ريحة البيت وطعم زمان', image: 'basbousa' },
  cream: { label: 'قشطة', note: 'قشطة طازة بتتعمل كل يوم الصبح، ناعمة وخفيفة', image: 'konafa-cream' },
  pistachio: { label: 'فستق ومكسرات', note: 'فستق حلبي وعين جمل ولوز، محمّصين على خفيف', image: 'baklava' },
  nuts: { label: 'بندق وعسل', note: 'بندق محمّص وعسل نحل طبيعي', image: 'harissa' },
  chocolate: { label: 'شوكولاتة', note: 'شوكولاتة بلجيكي ونوتيلا للي بيحبوا الطعم الغني', image: 'basbousa-nutella' }
};

const OCCASIONS = { daily: 'تحلية يومية', guests: 'عزومة', ramadan: 'رمضان والعيد', gift: 'هدايا' };

/* الأوزان والأحجام: factor = مضاعف السعر الأساسي */
const SIZE_OPTIONS = {
  q: { label: 'ربع كيلو', factor: 0.25 },
  h: { label: 'نص كيلو', factor: 0.5 },
  k: { label: 'كيلو', factor: 1 },
  s: { label: 'صغيرة · 6 أفراد', factor: 1 },
  m: { label: 'وسط · 10 أفراد', factor: 1.6 },
  l: { label: 'كبيرة · 16 فرد', factor: 2.3 },
  box6: { label: 'علبة 6 قطع', factor: 1 },
  box12: { label: 'علبة 12 قطعة', factor: 1.9 },
  c1: { label: 'كاسة واحدة', factor: 1 },
  c4: { label: 'علبة 4 كاسات', factor: 3.6 },
  sm: { label: 'علبة صغيرة', factor: 1 },
  lg: { label: 'علبة كبيرة', factor: 1.8 }
};
const KILO = ['q', 'h', 'k'];
const CAKE = ['s', 'm', 'l'];

/* =========================================================
   الأصناف
   variants: [{ name, hex, images: [أسماء صور] }] — أنواع/نكهات الصنف
   price: سعر الحجم الأساسي (factor = 1)، unit: وحدة السعر المعروضة
   tags: featured | new | sale | signature
   ========================================================= */
const PRODUCTS = [
  {
    id: 1, name: 'كنافة بالقشطة', cat: 'konafa', price: 420, oldPrice: null, unit: 'الكيلو',
    flavor: 'cream', occasion: 'guests', sizes: KILO,
    variants: [
      { name: 'قطع بالقشطة', hex: '#fff3dc', images: ['konafa-cream', 'konafa-round'] },
      { name: 'صينية كاملة', hex: '#e8962f', images: ['konafa-round', 'konafa-cream'] }
    ],
    stock: 14, rating: 4.9, reviews: 212, tags: ['featured', 'signature'],
    desc: 'كنافة شعر محمّرة بالسمن البلدي ومحشية قشطة طازة، عليها شربات خفيف. الصنف اللي بيخلص أول واحد في كل عزومة.',
    details: ['كنافة شعر يدوي', 'قشطة طازة من نفس اليوم', 'قطع جاهزة أو صينية كاملة', 'تتسخن 5 دقايق في الفرن']
  },
  {
    id: 2, name: 'كنافة ناعمة بالقشطة', cat: 'konafa', price: 400, oldPrice: null, unit: 'الكيلو',
    flavor: 'cream', occasion: 'daily', sizes: KILO,
    variants: [
      { name: 'بالقشطة', hex: '#e9ae55', images: ['konafa-naama', 'konafa-naama-squares', 'konafa-naama-box'] }
    ],
    stock: 10, rating: 4.8, reviews: 140, tags: ['new', 'featured', 'signature'],
    desc: 'كنافة مفرومة ناعمة ومقرمشة، بطبقة قشطة غنية في النص. بتدوب في البُق.',
    details: ['كنافة مفرومة ناعم', 'طبقة قشطة غنية', 'متاحة صينية أو قطع في علبة', 'تتقدّم دافية']
  },
  {
    id: 3, name: 'بلح الشام بالعسل', cat: 'konafa', price: 180, oldPrice: 210, unit: 'الكيلو',
    flavor: 'ghee', occasion: 'daily', sizes: KILO,
    variants: [
      { name: 'بالعسل', hex: '#f2a93b', images: ['balah'] }
    ],
    stock: 28, rating: 4.7, reviews: 95, tags: ['sale', 'featured'],
    desc: 'بلح شام مقرمش من برّه وطري من جوّه، متغرّق شربات وعسل. يتاكل سخن.',
    details: ['يتعمل وقت الطلب', 'شربات خفيف وعسل', 'مقرمش وطري', 'الأحلى مع الشاي']
  },
  {
    id: 4, name: 'بسبوسة بالسمن البلدي', cat: 'basbousa', price: 220, oldPrice: null, unit: 'الكيلو',
    flavor: 'ghee', occasion: 'daily', sizes: KILO,
    variants: [
      { name: 'سادة باللوز', hex: '#e9ae55', images: ['basbousa'] }
    ],
    stock: 30, rating: 4.9, reviews: 310, tags: ['featured', 'signature'],
    desc: 'بسبوسة طرية بالسمن البلدي، مقطّعة معيّنات وكل قطعة عليها لوزة. البسبوسة اللي بتفكّرك بتاعة تيتا.',
    details: ['سمن بلدي 100%', 'لوز مقشّر', 'شربات بماء الورد', 'تعيش 4 أيام برّه التلاجة']
  },
  {
    id: 5, name: 'بسبوسة بالقشطة', cat: 'basbousa', price: 300, oldPrice: null, unit: 'الكيلو',
    flavor: 'cream', occasion: 'guests', sizes: KILO,
    variants: [
      { name: 'قشطة', hex: '#fff3dc', images: ['basbousa-cream'] }
    ],
    stock: 12, rating: 4.8, reviews: 124, tags: ['featured'],
    desc: 'طبقتين بسبوسة بينهم قشطة طازة، خفيفة ومش مسكّرة زيادة.',
    details: ['طبقة قشطة في النص', 'تتحفظ في التلاجة', 'تتقدّم باردة', 'مناسبة للعزايم']
  },
  {
    id: 6, name: 'بسبوسة نوتيلا', cat: 'basbousa', price: 320, oldPrice: 380, unit: 'الكيلو',
    flavor: 'chocolate', occasion: 'daily', sizes: KILO,
    variants: [
      { name: 'نوتيلا وبندق', hex: '#6b3a22', images: ['basbousa-nutella'] }
    ],
    stock: 8, rating: 4.6, reviews: 61, tags: ['sale'],
    desc: 'بسبوسة كلاسيك متغطية نوتيلا وعليها بندق محمّص. مزيج الشرقي والغربي في قطعة واحدة.',
    details: ['نوتيلا أصلية', 'بندق محمّص', 'شربات خفيف جدًا', 'محبوبة عند الأطفال']
  },
  {
    id: 7, name: 'هريسة بالبندق', cat: 'basbousa', price: 280, oldPrice: null, unit: 'الكيلو',
    flavor: 'nuts', occasion: 'guests', sizes: KILO,
    variants: [
      { name: 'بندق', hex: '#b07a45', images: ['harissa', 'harissa-squares'] }
    ],
    stock: 18, rating: 4.8, reviews: 87, tags: ['new', 'featured'],
    desc: 'هريسة محمّرة بالسمن، أتقل شوية من البسبوسة وطعمها أغنى، ومليانة بندق محمّص.',
    details: ['سمن بلدي', 'بندق محمّص', 'صينية أو قطع', 'تعيش 4 أيام']
  },
  {
    id: 8, name: 'شكر بارة بالشربات', cat: 'basbousa', price: 260, oldPrice: null, unit: 'الكيلو',
    flavor: 'ghee', occasion: 'daily', sizes: KILO,
    variants: [
      { name: 'بالشربات', hex: '#e2a04a', images: ['shakarbara'] }
    ],
    stock: 22, rating: 4.7, reviews: 73, tags: ['new'],
    desc: 'كرات سميد طرية بالسمن متشرّبة شربات خفيف، بتدوب في البُق.',
    details: ['سميد وسمن', 'شربات بماء الورد', 'حجم اللقمة', 'تعيش 5 أيام']
  },
  {
    id: 9, name: 'بقلاوة مشكلة', cat: 'baklava', price: 750, oldPrice: null, unit: 'الكيلو',
    flavor: 'pistachio', occasion: 'gift', sizes: KILO,
    variants: [
      { name: 'تشكيلة', hex: '#8cbf4d', images: ['baklava', 'baklava-tray'] }
    ],
    stock: 6, rating: 4.9, reviews: 154, tags: ['signature', 'featured'],
    desc: 'أصابع وعش بلبل ومعيّنات بقلاوة، رقائق رفيعة بالسمن ومحشية فستق ومكسرات.',
    details: ['40 طبقة رقائق', 'فستق ومكسرات', 'سمن بلدي', 'تعيش أسبوع']
  },
  {
    id: 10, name: 'أصابع بقلاوة بالمكسرات', cat: 'baklava', price: 520, oldPrice: null, unit: 'الكيلو',
    flavor: 'pistachio', occasion: 'guests', sizes: KILO,
    variants: [
      { name: 'مكسرات', hex: '#e9ae55', images: ['fingers', 'fingers-mini'] }
    ],
    stock: 16, rating: 4.8, reviews: 92, tags: ['new', 'featured'],
    desc: 'أصابع رقائق ملفوفة ومقرمشة محشية مكسرات، كبيرة أو ميني على قد اللقمة.',
    details: ['مكسرات مشكلة', 'رقائق مقرمشة', 'حجمين', 'تعيش أسبوع']
  },
  {
    id: 11, name: 'مثلثات جلاش بالمكسرات', cat: 'baklava', price: 460, oldPrice: null, unit: 'الكيلو',
    flavor: 'pistachio', occasion: 'daily', sizes: KILO,
    variants: [
      { name: 'مكسرات', hex: '#e9ae55', images: ['triangles'] }
    ],
    stock: 20, rating: 4.7, reviews: 66, tags: ['new'],
    desc: 'مثلثات جلاش ذهبية محشية عين جمل ولوز، مقرمشة وخفيفة.',
    details: ['مكسرات مشكلة', 'رقائق مقرمشة', 'عسل خفيف', 'تعيش أسبوع']
  },
  {
    id: 12, name: 'صينية شرقي مشكّل', cat: 'baklava', price: 640, oldPrice: 720, unit: 'الكيلو',
    flavor: 'pistachio', occasion: 'guests', sizes: KILO,
    variants: [
      { name: 'تشكيلة شهد', hex: '#f2a93b', images: ['assorted-tray', 'baklava-tray'] }
    ],
    stock: 7, rating: 4.8, reviews: 118, tags: ['sale', 'featured'],
    desc: 'صينية فيها أحلى أصنافنا الشرقي في مكان واحد. الحل السريع لأي عزومة.',
    details: ['تشكيلة أصناف', 'صينية بغطا', 'تعيش 5 أيام', 'مناسبة للعزايم']
  },
  {
    id: 13, name: 'علبة هدايا شهد', cat: 'baklava', price: 450, oldPrice: null, unit: 'العلبة',
    flavor: 'pistachio', occasion: 'gift', sizes: ['sm', 'lg'],
    variants: [
      { name: 'كنافة وبسبوسة', hex: '#7fcfb3', images: ['gift-box', 'konafa-naama-box'] }
    ],
    stock: 9, rating: 4.9, reviews: 64, tags: ['signature', 'new'],
    desc: 'علبة أنيقة فيها تشكيلة كنافة وبسبوسة وقطع بالقشطة. الهدية اللي متغلطش.',
    details: ['علبة هدايا', 'كارت إهداء مجاني', 'تشكيلة 3 أصناف', 'تعيش 3 أيام في التلاجة']
  },
  {
    id: 14, name: 'كحك بالعجمية', cat: 'kahk', price: 340, oldPrice: null, unit: 'الكيلو',
    flavor: 'ghee', occasion: 'ramadan', sizes: KILO,
    variants: [
      { name: 'بالعجمية', hex: '#f2d29a', images: ['kahk', 'kahk-2'] },
      { name: 'سادة', hex: '#fbf2df', images: ['kahk-2', 'kahk'] }
    ],
    stock: 25, rating: 4.9, reviews: 260, tags: ['featured'],
    desc: 'كحك العيد بالسمن البلدي، بيدوب في البُق، محشي عجمية بالعسل ومتغطي سكر بودرة.',
    details: ['سمن بلدي', 'عجمية بالعسل', 'نقش يدوي', 'يعيش أسبوعين']
  },
  {
    id: 15, name: 'معمول بالتمر', cat: 'kahk', price: 380, oldPrice: null, unit: 'الكيلو',
    flavor: 'ghee', occasion: 'ramadan', sizes: KILO,
    variants: [
      { name: 'بالتمر', hex: '#8a5a2e', images: ['maamoul', 'maamoul-2'] },
      { name: 'بالفستق', hex: '#8cbf4d', images: ['maamoul-2', 'maamoul'] }
    ],
    stock: 15, rating: 4.8, reviews: 73, tags: [],
    desc: 'معمول بالسميد والسمن محشي عجوة أو فستق، بنقشة شامي تقليدية وسكر بودرة.',
    details: ['سميد وسمن', 'عجوة أو فستق', 'نقش بالقالب الخشب', 'يعيش أسبوعين']
  },
  {
    id: 16, name: 'غريبة بالسمن', cat: 'kahk', price: 300, oldPrice: null, unit: 'الكيلو',
    flavor: 'ghee', occasion: 'daily', sizes: KILO,
    variants: [{ name: 'بالفستق', hex: '#fbf2df', images: ['ghorayeba', 'ghorayeba-2'] }],
    stock: 22, rating: 4.8, reviews: 101, tags: [],
    desc: 'غريبة بيضا ناعمة بتدوب أول ما تلمس لسانك، وفي نص كل قطعة حباية فستق.',
    details: ['3 مكونات بس', 'سمن بلدي', 'فستق حلبي', 'مع الشاي بتاعك']
  },
  {
    id: 17, name: 'بسكويت النشادر', cat: 'kahk', price: 190, oldPrice: 230, unit: 'الكيلو',
    flavor: 'ghee', occasion: 'daily', sizes: KILO,
    variants: [{ name: 'فانيليا', hex: '#eabf7a', images: ['biscuits', 'biscuits-2'] }],
    stock: 35, rating: 4.6, reviews: 84, tags: ['sale'],
    desc: 'بسكويت بيتي مقرمش بالفانيليا والسمن، رفيق الشاي بالحليب في الصبح.',
    details: ['فانيليا طبيعي', 'مقرمش وخفيف', 'من غير مواد حافظة', 'يعيش 3 أسابيع']
  },
  {
    id: 18, name: 'تورتة الفراولة', cat: 'cakes', price: 450, oldPrice: null, unit: 'الصغيرة',
    flavor: 'cream', occasion: 'guests', sizes: CAKE,
    variants: [{ name: 'فراولة وكريمة', hex: '#ffc6d4', images: ['cake-strawberry', 'cake-strawberry-2'] }],
    stock: 8, rating: 4.9, reviews: 132, tags: ['featured'],
    desc: 'كيكة فانيليا هشة بطبقات كريمة شانتيه وفراولة طازة. اكتب اسم صاحب العيد في الملاحظات.',
    details: ['فراولة طازة', 'كريمة شانتيه', 'كتابة الاسم مجانًا', 'تُطلب قبلها بيوم']
  },
  {
    id: 19, name: 'تورتة الشوكولاتة', cat: 'cakes', price: 520, oldPrice: null, unit: 'الصغيرة',
    flavor: 'chocolate', occasion: 'guests', sizes: CAKE,
    variants: [{ name: 'شوكولاتة وكريز', hex: '#7a432a', images: ['cake-chocolate', 'cake-chocolate-2'] }],
    stock: 6, rating: 4.9, reviews: 118, tags: ['featured'],
    desc: 'كيكة شوكولاتة رطبة بجاناش بلجيكي غني وكريز وسبرينكلز ملونة.',
    details: ['شوكولاتة بلجيكي', 'جاناش غني', 'كتابة الاسم مجانًا', 'تُطلب قبلها بيوم']
  },
  {
    id: 20, name: 'تشيز كيك التوت', cat: 'cakes', price: 480, oldPrice: null, unit: 'الصغيرة',
    flavor: 'cream', occasion: 'guests', sizes: CAKE,
    variants: [{ name: 'توت مشكل', hex: '#b5274f', images: ['cheesecake', 'cheesecake-2'] }],
    stock: 5, rating: 4.8, reviews: 64, tags: [],
    desc: 'تشيز كيك نيويورك مخبوز على قاعدة بسكويت بالزبدة، ومن فوق صوص توت وتوت طازة.',
    details: ['جبنة كريمي', 'قاعدة بسكويت بالزبدة', 'صوص توت بيتي', 'يتقدّم بارد']
  },
  {
    id: 21, name: 'جاتوه مشكّل', cat: 'cakes', price: 240, oldPrice: null, unit: '6 قطع',
    flavor: 'chocolate', occasion: 'guests', sizes: ['box6', 'box12'],
    variants: [{ name: 'تشكيلة ألوان', hex: '#ffb3c6', images: ['gateau', 'gateau-2'] }],
    stock: 12, rating: 4.7, reviews: 57, tags: ['featured'],
    desc: 'قطع جاتوه صغيرة ملونة: فراولة، شوكولاتة، مانجو وفستق. مثالية لحفلات الأطفال.',
    details: ['6 نكهات', 'قطع على قد اللقمة', 'علبة هدية', 'تتحفظ في التلاجة']
  },
  {
    id: 22, name: 'أم علي بالمكسرات', cat: 'cups', price: 75, oldPrice: null, unit: 'الفخارة',
    flavor: 'nuts', occasion: 'daily', sizes: ['c1', 'c4'],
    variants: [{ name: 'مكسرات وزبيب', hex: '#f2c472', images: ['om-ali', 'om-ali-2'] }],
    stock: 24, rating: 4.9, reviews: 190, tags: ['featured'],
    desc: 'أم علي سخنة في فخارة، رقائق منفوخة باللبن والقشطة والمكسرات وجوز الهند.',
    details: ['تتسخن في الفرن', 'لبن كامل الدسم', 'مكسرات وزبيب', 'فخارة هدية']
  },
  {
    id: 23, name: 'أرز بلبن', cat: 'cups', price: 45, oldPrice: null, unit: 'الكاسة',
    flavor: 'cream', occasion: 'daily', sizes: ['c1', 'c4'],
    variants: [{ name: 'قرفة', hex: '#fffaf0', images: ['rice-pudding', 'rice-pudding-2'] }],
    stock: 40, rating: 4.8, reviews: 230, tags: ['featured'],
    desc: 'أرز بلبن كريمي متسوّي على نار هادية، ومن فوق قرفة وزبيب. بارد ومنعش.',
    details: ['لبن كامل الدسم', 'قرفة وزبيب', 'سكر معتدل', 'يتقدّم بارد']
  },
  {
    id: 24, name: 'مهلبية بالفستق', cat: 'cups', price: 50, oldPrice: null, unit: 'الكاسة',
    flavor: 'pistachio', occasion: 'daily', sizes: ['c1', 'c4'],
    variants: [{ name: 'فستق وماء ورد', hex: '#ffb3c6', images: ['mahalabia', 'mahalabia-2'] }],
    stock: 30, rating: 4.8, reviews: 112, tags: [],
    desc: 'مهلبية ناعمة بماء الورد، عليها فستق مجروش وورد مجفف. خفيفة بعد الأكل.',
    details: ['ماء ورد طبيعي', 'فستق مجروش', 'ورد مجفف', 'تتقدّم باردة']
  }
];

/* سعر وحدة الصنف حسب الوزن/الحجم المختار */
function sizePrice(p, size) {
  const f = (SIZE_OPTIONS[size] || { factor: 1 }).factor;
  return Math.round(p.price * f / 5) * 5;
}
const sizeLabel = s => (SIZE_OPTIONS[s] || { label: s }).label;
const defaultSize = p => (p.sizes.includes('h') ? 'h' : p.sizes[0]);

/* آراء العملاء (تُوزّع على الأصناف) */
const SEED_REVIEWS = [
  { name: 'منة الله ع.', city: 'القاهرة', rating: 5, text: 'الكنافة وصلت سخنة ومقرمشة، والقشطة طعمها طازة جدًا. أكيد هطلب تاني.' },
  { name: 'أحمد م.', city: 'الإسكندرية', rating: 5, text: 'البسبوسة طرية والسمن ريحته حلوة، والسكر مظبوط مش زيادة.' },
  { name: 'نورهان ك.', city: 'الجيزة', rating: 4, text: 'جميلة جدًا، الدليفري اتأخر ربع ساعة بس خدمة العملاء كانوا محترمين.' },
  { name: 'محمود ح.', city: 'المنصورة', rating: 5, text: 'تاني مرة أطلب الكحك من شهد، بيدوب في البُق فعلًا.' },
  { name: 'هبة س.', city: 'طنطا', rating: 5, text: 'طلبت صينية مشكّل لعزومة وكل الناس سألوني جايباها منين.' },
  { name: 'كريم ف.', city: 'أسيوط', rating: 4, text: 'التغليف ممتاز والحلويات وصلت سليمة رغم المسافة.' }
];

const TESTIMONIALS = [
  { name: 'ملك الشريف', role: 'عميلة من 2023', text: 'أول مرة ألاقي بسبوسة طعمها زي بتاعة تيتا بالظبط. السمن البلدي فارق جدًا.', product: 'بسبوسة بالسمن البلدي' },
  { name: 'يوسف عادل', role: 'عريس 2026', text: 'طلبنا صواني المشكّل لكتب الكتاب، الشكل كان يفتح النفس والطعم أحلى. شكرًا يا شهد.', product: 'صينية شرقي مشكّل' },
  { name: 'د. رحاب منصور', role: 'أم لثلاثة', text: 'الولاد بقوا مستنيين يوم الجمعة عشان الكنافة النوتيلا. خفيفة ومش مسكّرة زيادة.', product: 'كنافة نوتيلا' },
  { name: 'فرح النجار', role: 'منظمة حفلات', text: 'التورت دايمًا في المعاد والكتابة عليها نضيفة. الجاتوه المشكّل نجم أي حفلة أطفال.', product: 'جاتوه مشكّل' }
];

/* مناطق التوصيل */
const SHIPPING_ZONES = {
  metro: { label: 'القاهرة الكبرى', fee: 40, days: '1' },
  delta: { label: 'الدلتا والإسكندرية والقناة', fee: 60, days: '1–2' },
  upper: { label: 'الصعيد', fee: 80, days: '2–3' },
  remote: { label: 'المحافظات الحدودية', fee: 110, days: '3–5' }
};
const GOVERNORATES = [
  ['القاهرة', 'metro'], ['الجيزة', 'metro'], ['القليوبية', 'metro'],
  ['الإسكندرية', 'delta'], ['البحيرة', 'delta'], ['الدقهلية', 'delta'], ['الغربية', 'delta'],
  ['المنوفية', 'delta'], ['الشرقية', 'delta'], ['كفر الشيخ', 'delta'], ['دمياط', 'delta'],
  ['بورسعيد', 'delta'], ['الإسماعيلية', 'delta'], ['السويس', 'delta'],
  ['الفيوم', 'upper'], ['بني سويف', 'upper'], ['المنيا', 'upper'], ['أسيوط', 'upper'],
  ['سوهاج', 'upper'], ['قنا', 'upper'], ['الأقصر', 'upper'], ['أسوان', 'upper'],
  ['البحر الأحمر', 'remote'], ['مطروح', 'remote'], ['الوادي الجديد', 'remote'],
  ['شمال سيناء', 'remote'], ['جنوب سيناء', 'remote']
];
const FREE_SHIPPING_MIN = 1000;
const PRICE_MAX = 1500;

/* أكواد الخصم التجريبية */
const COUPONS = {
  SHAHD10: { type: 'percent', value: 10, min: 0, label: 'خصم 10% على طلبك' },
  WELCOME15: { type: 'percent', value: 15, min: 500, label: 'خصم 15% للطلبات فوق 500 ج.م' },
  SWEET100: { type: 'fixed', value: 100, min: 1200, label: 'خصم 100 ج.م للطلبات فوق 1,200 ج.م' }
};

const ORDER_STEPS = [
  { key: 'placed', label: 'تم استلام الطلب', note: 'وصلنا طلبك وجارٍ مراجعته' },
  { key: 'prep', label: 'في المطبخ', note: 'بنحضّر طلبك طازة ونغلّفه بعناية' },
  { key: 'shipped', label: 'جاهز للتوصيل', note: 'الطلب اتسلّم للمندوب' },
  { key: 'out', label: 'في الطريق', note: 'المندوب في طريقه ليك' },
  { key: 'delivered', label: 'تم التسليم', note: 'بالهنا والشفا!' }
];

const STORE_INFO = {
  whatsapp: '201000000000',
  phone: '+20 100 000 0000',
  email: 'hello@shahd.sweets',
  instagram: '@shahd.sweets',
  address: 'مصر الجديدة، القاهرة'
};
