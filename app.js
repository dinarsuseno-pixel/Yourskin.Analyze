const $ = id => document.getElementById(id);

/* ---------- Penyimpanan (dengan cadangan bila localStorage diblokir) ---------- */
const mem = {};
let storageOK = true;
function sGet(k){
  try { const v = localStorage.getItem(k); return v === null ? (mem[k] ?? null) : v; }
  catch(e){ storageOK = false; return mem[k] ?? null; }
}
function sSet(k, v){
  mem[k] = v;
  try { localStorage.setItem(k, v); } catch(e){ storageOK = false; }
}
function sDel(k){ delete mem[k]; try { localStorage.removeItem(k); } catch(e){} }
function getUsers(){ try { return JSON.parse(sGet("gc_users")) || {}; } catch(e){ return {}; } }

/* ---------- Hash kata sandi (cadangan bila crypto.subtle tidak tersedia) ---------- */
async function hash(s){
  try {
    if (window.crypto && crypto.subtle) {
      const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
      return "s:" + [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
    }
  } catch(e){}
  let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0;
  return "d:" + h;
}

/* ---------- Auth ---------- */
let user = null;
try { user = JSON.parse(sGet("gc_session")); } catch(e){}

function nav(){
  $("nav").innerHTML = `<button class="ghost" onclick="go('home')">Beranda</button>` +
    (user ? `<button class="ghost" onclick="go('scan')">Scan</button><button onclick="logout()">Keluar (${user.nama})</button>`
          : `<button onclick="go('login')">Masuk</button>`);
}
function go(p){
  if (p === "scan" && !user){ alert("Silakan login terlebih dahulu untuk memakai fitur scan wajah."); p = "login"; }
  document.querySelectorAll(".page").forEach(s => s.classList.remove("on"));
  $(p).classList.add("on");
  window.scrollTo(0, 0);
  if (p === "scan") buildScan();
}
async function doRegister(){
  const err = $("rerr"); err.className = "err";
  try {
    const n = $("rn").value.trim(), e = $("re").value.trim().toLowerCase(), p = $("rp").value;
    if (!n || !e){ err.textContent = "Nama dan email wajib diisi."; return; }
    if (!e.includes("@")){ err.textContent = "Format email tidak valid."; return; }
    if (p.length < 6){ err.textContent = "Kata sandi minimal 6 karakter."; return; }
    const u = getUsers();
    if (u[e]){ err.textContent = "Email sudah terdaftar. Silakan masuk."; return; }
    u[e] = { nama: n, pw: await hash(p) };
    sSet("gc_users", JSON.stringify(u));
    $("le").value = e; $("lp").value = "";
    $("lerr").className = "err ok";
    $("lerr").textContent = "Akun berhasil dibuat. Silakan masuk." + (storageOK ? "" : " (Catatan: penyimpanan browser diblokir, akun hanya berlaku selama halaman tidak ditutup.)");
    err.textContent = ""; go("login");
  } catch(x){ err.textContent = "Terjadi kesalahan: " + x.message; }
}
async function doLogin(){
  const err = $("lerr"); err.className = "err";
  try {
    const e = $("le").value.trim().toLowerCase(), p = $("lp").value, u = getUsers()[e];
    if (!u || u.pw !== await hash(p)){ err.textContent = "Email atau kata sandi salah."; return; }
    user = { nama: u.nama, email: e };
    sSet("gc_session", JSON.stringify(user));
    err.textContent = ""; $("lp").value = ""; nav(); go("scan");
  } catch(x){ err.textContent = "Terjadi kesalahan: " + x.message; }
}
function logout(){ user = null; sDel("gc_session"); nav(); go("home"); }

/* ---------- Kartu & modal tipe kulit ---------- */
function bg(t){
  return t.gambar ? `style="background-image:url('${t.gambar}')"`
                  : `style="background:linear-gradient(135deg,#ffd9e2,#ffeef2)"`;
}
$("types").innerHTML = TYPES.map(t => `<div class="card" onclick="openType('${t.id}')">
  <div class="img" ${bg(t)}>${t.gambar ? "" : t.emoji}</div>
  <div class="t"><h3>${t.nama}</h3><p>${t.ringkas}</p></div></div>`).join("");

function openType(id){
  const t = TYPES.find(x => x.id === id);
  $("mbody").innerHTML = `<button class="close" onclick="closeM()">Tutup ✕</button>
  <h2>${t.emoji} ${t.nama}</h2><p>${t.ringkas}</p>
  <h4>Ciri-ciri</h4><ul>${t.ciri.map(c => `<li>${c}</li>`).join("")}</ul>
  <h4>Rekomendasi Skincare</h4>
  <ul>${t.produk.map(p => `<li><b>${p[0]}:</b> ${p[1]} — <span class="ph">${p[2] || B}</span></li>`).join("")}</ul>
  <h4>Tips</h4><p>${t.tips}</p>
  <p class="note">Pagi: cleanser → toner → serum → pelembap → sunscreen. Malam: cleanser → toner → serum/treatment → pelembap. Lakukan patch test untuk produk baru.</p>`;
  $("modal").classList.add("on");
}
function closeM(){ $("modal").classList.remove("on"); }
$("modal").addEventListener("click", e => { if (e.target.id === "modal") closeM(); });

/* ---------- Scan wajah ---------- */
const ANGLES = [["depan","Tampak Depan"],["kanan","Samping Kanan"],["kiri","Samping Kiri"]];
let photos = {};
/* Pertanyaan penentu tipe kulit: tiap pilihan memberi poin ke tipe tertentu */
const QS = [
 {q:"Satu jam setelah cuci muka (tanpa produk apa pun), kulit wajahmu terasa…",o:[
  ["Nyaman, tidak berminyak dan tidak kencang",{normal:2}],
  ["Berminyak di seluruh wajah",{berminyak:2}],
  ["Kencang, kasar, atau bersisik",{kering:2}],
  ["Berminyak di dahi, hidung, dagu; pipi normal atau kering",{kombinasi:2}]]},
 {q:"Menjelang siang, wajahmu biasanya…",o:[
  ["Tidak mengkilap, tampak segar",{normal:2}],
  ["Mengkilap di seluruh wajah",{berminyak:2}],
  ["Tampak kusam dan terasa tertarik",{kering:2}],
  ["Mengkilap hanya di area T-zone",{kombinasi:2}]]},
 {q:"Seberapa sering muncul jerawat atau komedo?",o:[
  ["Jarang sekali",{normal:1,kering:1}],
  ["Kadang, terutama di area T-zone",{kombinasi:1,berminyak:1}],
  ["Sering, termasuk jerawat meradang atau bernanah",{acne:3}]]},
 {q:"Bagaimana reaksi kulitmu terhadap produk baru, panas, atau cuaca?",o:[
  ["Biasa saja, jarang bereaksi",{normal:1}],
  ["Sering merah, perih, terasa panas, atau gatal",{sensitif:3}],
  ["Kadang kering atau berminyak, tapi tidak perih",{}]]},
 {q:"Bagaimana pori-pori wajahmu?",o:[
  ["Kecil, hampir tidak terlihat",{normal:1,kering:1}],
  ["Besar di hidung dan dahi saja",{kombinasi:2}],
  ["Besar di sebagian besar wajah",{berminyak:2,acne:1}]]},
 {q:"Bagaimana tekstur kulitmu?",o:[
  ["Halus dan rata",{normal:2}],
  ["Bersisik atau mengelupas",{kering:2,sensitif:1}],
  ["Kasar, ada benjolan atau bekas jerawat",{acne:2,berminyak:1}]]}
];
let ans = {};

function buildScan(){
  $("shots").innerHTML = ANGLES.map(a => `<div class="shot ${photos[a[0]] ? "done" : ""}">
    <b>${a[1]}</b><br><br>
    <label class="btn">📷 ${photos[a[0]] ? "Ulangi foto" : "Ambil foto"}
      <input type="file" accept="image/*" capture="environment" hidden onchange="take('${a[0]}',this)"></label>
    ${photos[a[0]] ? `<img src="${photos[a[0]]}">` : ""}</div>`).join("");
  const ok = ANGLES.every(a => photos[a[0]]);
  $("after").style.display = ok ? "block" : "none";
  if (ok) renderAfter();
}

function renderAfter(){
  $("after").innerHTML = `<h3>Foto lengkap ✅ — Tentukan tipe kulitmu</h3>
  <p class="note">Lihat foto yang baru kamu ambil, lalu jawab ${QS.length} pertanyaan berikut sesuai kondisi kulitmu sehari-hari.</p>` +
  QS.map((x, i) => `<div style="margin:14px 0"><b>${i + 1}. ${x.q}</b>` +
    x.o.map((o, j) => `<label style="display:block;margin:6px 0;cursor:pointer">
      <input type="radio" name="q${i}" ${ans[i] === j ? "checked" : ""} onchange="ans[${i}]=${j}"> ${o[0]}</label>`).join("") + `</div>`).join("") +
  `<button onclick="showResult()">Lihat Hasil</button><div id="res"></div>`;
}

function showResult(){
  if (QS.some((_, i) => ans[i] === undefined)){ alert("Jawab semua pertanyaan terlebih dahulu."); return; }
  const sc = {}; TYPES.forEach(t => sc[t.id] = 0);
  QS.forEach((x, i) => { const p = x.o[ans[i]][1]; for (const k in p) sc[k] += p[k]; });
  const top = TYPES.slice().sort((a, b) => sc[b.id] - sc[a.id])[0];
  let extra = "";
  if (top.id !== "sensitif" && sc.sensitif >= 3) extra += `<li>Ada kecenderungan <b>kulit sensitif</b>: pilih produk tanpa pewangi dan lakukan patch test.</li>`;
  if (top.id !== "acne" && sc.acne >= 3) extra += `<li>Ada kecenderungan <b>berjerawat (acne)</b>: hindari memencet jerawat dan pilih produk non-comedogenic.</li>`;
  $("res").innerHTML = `<div style="margin-top:18px;padding:16px;border:2px solid var(--pink);border-radius:14px;background:#fff8fa">
    <div style="font-size:42px">${top.emoji}</div>
    <h3 style="margin:4px 0">Indikasi tipe kulitmu: ${top.nama}</h3>
    <p>${top.ringkas}</p>${extra ? `<ul>${extra}</ul>` : ""}
    <button onclick="openType('${top.id}')">Lihat Rekomendasi Skincare</button>
    <p class="note">Hasil ini perkiraan berdasarkan jawabanmu, bukan diagnosis medis. Untuk jerawat parah, iritasi berkepanjangan, atau kondisi kulit yang mengkhawatirkan, konsultasikan ke dokter kulit.</p></div>`;
  $("res").scrollIntoView({behavior:"smooth"});
}
function take(k, inp){
  const f = inp.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { photos[k] = r.result; buildScan(); };
  r.readAsDataURL(f);
}

nav();