
const B = "[nama produk]";

const TYPES = [
 {id:"normal",nama:"Kulit Normal",emoji:"😊",gambar:"kulit normal.jpg",ringkas:"Seimbang, tidak terlalu berminyak maupun kering.",
  ciri:["Pori-pori kecil, tekstur halus","Jarang berjerawat","Tidak terasa kencang atau berminyak berlebih"],
  tips:"Pertahankan keseimbangan dengan rutinitas sederhana dan selalu pakai sunscreen.",
  produk:[["Pembersih wajah","Gentle cleanser", "Wardah Lightning Whip Facial Foam / Aloe Hydramild"],["Toner","Toner menyegarkan", "Emina Skin Buddy"],["Pelembap","Moisturizer ringan", "Glad2Glow Blueberry 5% Ceramide Moisturizer"],["Tabir surya","Sunscreen SPF 30+", "Collagen Water Sunscreen"]]},
 {id:"berminyak",nama:"Kulit Berminyak",emoji:"💧",gambar:"kulit berminyak.jpg",ringkas:"Produksi sebum berlebih, wajah mudah mengkilap.",
  ciri:["Wajah mengkilap, terutama T-zone","Pori-pori tampak besar","Mudah muncul komedo"],
  tips:"Hindari produk berat; pilih water-based atau oil-free. Tetap lembapkan kulit.",
  produk:[["Pembersih wajah","Foaming cleanser / salicylic acid", "Emina Bright Stuff for Acne Prone Skin Face Wash"],["Toner","Toner BHA / pengontrol minyak", "The Originote Cica-B5 Soothing Essence Toner"],["Serum","Niacinamide", "Hanasui Power Acne Serum / Niacinamide Serum"],["Pelembap","Gel moisturizer oil-free", "Emina Bright Stuff Acne Prone Skin Moisturizer"],["Tabir surya","Sunscreen gel matte", "Azarine Cicamide Barrier SPF 35"]]},
 {id:"kering",nama:"Kulit Kering",emoji:"🌵",gambar:"kulit kering.jpg",ringkas:"Kurang kelembapan, terasa kencang dan bersisik.",
  ciri:["Terasa kencang setelah cuci muka","Tampak kusam, kadang mengelupas","Garis halus lebih terlihat"],
  tips:"Pakai pembersih lembut dan pelembap yang kaya. Hindari air panas.",
  produk:[["Pembersih wajah","Creamy / milk cleanser", "Hada Labo Gokujyun Ultimate Moisturizing Face Wash"],["Toner","Hydrating toner", "Hada Labo Gokujyun Ultimate Moisturizing Lotion (sebagai hydrating toner)"],["Serum","Hyaluronic acid", "The Originote Hyalucera Serum"],["Pelembap","Cream dengan ceramide", "Glad2Glow Centella Allantoin Soothing Gel / Blueberry Moisturizer"],["Tabir surya","Sunscreen moisturizing" ,"Implora Perfect Shield Sunscreen SPF 40"]]},
 {id:"kombinasi",nama:"Kulit Kombinasi",emoji:"🌗",gambar:"kulit kombinasi.jpg",ringkas:"Berminyak di T-zone, normal/kering di pipi.",
  ciri:["Dahi, hidung, dagu berminyak","Pipi normal atau cenderung kering","Pori besar hanya di area tertentu"],
  tips:"Pakai produk ringan yang menyeimbangkan; bisa multi-masking sesuai area.",
  produk:[["Pembersih wajah","Gentle foaming cleanser", "Wardah Hydra Rose Gel Cleanser / Aloe Wash"],["Toner","Balancing toner", "The Originote Cica-B5 Soothing Essence Toner"],["Serum","Niacinamide / hyaluronic acid", "Hanasui Power Barrier Serum"],["Pelembap","Gel-cream ringan", "Glad2Glow Blueberry 5% Ceramide Moisturizer"],["Tabir surya","Sunscreen non-comedogenic", "Hanasui Collagen Water Sunscreen SPF 50"]]},
 {id:"acne",nama:"Kulit Berjerawat (Acne)",emoji:"🔴",gambar:"OIP.jpg",ringkas:"Mudah meradang, muncul jerawat dan komedo.",
  ciri:["Jerawat meradang, papula, atau pustula","Komedo hitam/putih","Bekas jerawat kemerahan atau kehitaman"],
  tips:"Jangan memencet jerawat. Kenalkan bahan aktif bertahap. Jerawat parah/kistik sebaiknya diperiksakan ke dokter kulit.",
  produk:[["Pembersih wajah","Acne cleanser / salicylic acid", "Acnes Creamy Wash (50g)"],["Toner","Toner BHA lembut", "Viva White Soothing Aloe Vera Toner / Hanasui Acne Toner"],["Treatment","Benzoyl peroxide / azelaic acid", "Skintific 2% Salicylic Acid Anti Acne Serum (10ml travel size)"],["Pelembap","Gel moisturizer non-comedogenic", "Dermaluz Acne Moisturizer Gel / Glad2Glow Centella Gel"],["Tabir surya","Sunscreen oil-free", "Azarine Cicamide Barrier Sunscreen SPF 35 PA+++"]]},
 {id:"sensitif",nama:"Kulit Sensitif",emoji:"🌷",gambar:"kulit sensitif.jpg",ringkas:"Mudah merah, perih, atau gatal terhadap produk.",
  ciri:["Mudah kemerahan atau terasa panas","Perih saat memakai produk baru","Reaktif terhadap pewangi dan alkohol"],
  tips:"Pilih produk fragrance-free, minim bahan aktif, dan selalu patch test.",
  produk:[["Pembersih wajah","Mild / fragrance-free cleanser", "Cetaphil Gentle Skin Cleanser (50ml mini size)"],["Toner","Soothing toner tanpa alkohol", "The Originote Cica-B5 Soothing Essence Toner"],["Serum","Centella asiatica / panthenol", "The Originote Hyalucera Serum"],["Pelembap","Barrier repair cream", "Glad2Glow Centella Allantoin Soothing Gel Moisturizer"],["Tabir surya","Mineral sunscreen", "Azarine Cicamide Barrier Sunscreen SPF 35 PA+++"]]}
];
