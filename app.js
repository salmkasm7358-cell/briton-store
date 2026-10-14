const PRODUCTS=[
{id:1,name:"مجموعة العناية اليومية",category:"care",price:129,tag:"اختيار مميز",desc:"مجموعة عناية بتصميم أنيق وعملي."},
{id:2,name:"منتج عناية شخصي",category:"women",price:159,tag:"الأكثر طلبًا",desc:"خيار أنيق ضمن مجموعة العناية الشخصية."},
{id:3,name:"مجموعة رجالية",category:"men",price:99,tag:"جديد",desc:"اختيار عملي بتصميم بسيط."},
{id:4,name:"إكسسوار أنيق",category:"accessories",price:79,tag:"سعر مميز",desc:"إضافة أنيقة إلى مجموعتك الخاصة."},
{id:5,name:"مجموعة العناية الفاخرة",category:"care",price:189,tag:"مميز",desc:"مجموعة مختارة لتجربة عناية مريحة."},
{id:6,name:"منتج شخصي أنيق",category:"women",price:139,tag:"جديد",desc:"تصميم بسيط وتجربة تسوق سهلة."},
{id:7,name:"اختيار رجالي يومي",category:"men",price:119,tag:"مقترح",desc:"منتج تجريبي يمكنك استبداله بتفاصيلك."},
{id:8,name:"إكسسوار خاص",category:"accessories",price:69,tag:"قيمة رائعة",desc:"تفاصيل أنيقة ضمن تشكيلة BRITON."}
];
// استبدل الرقم التالي برقم واتساب التجاري مع رمز الدولة، دون + أو مسافات.
const WHATSAPP_NUMBER="966500000000";
let cart=JSON.parse(sessionStorage.getItem("britonCart")||"[]");
const grid=document.getElementById("productGrid");
const money=n=>new Intl.NumberFormat("ar-SA").format(n)+" ر.س";
function renderProducts(filter="all"){grid.innerHTML=PRODUCTS.filter(p=>filter==="all"||p.category===filter).map(p=>`<article class="product-card"><div class="product-visual"><span class="product-tag">${p.tag}</span><div class="product-shape">B</div></div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">أضف للسلة +</button></div></div></article>`).join("");}
function updateCart(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);document.getElementById("cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><b>${x.name}</b><p>${money(x.price)} × ${x.qty}</p></div><button data-remove="${x.id}">حذف</button></div>`).join(""):'<p style="color:#78869a;text-align:center;padding:35px 0">سلتك فارغة حاليًا.</p>';sessionStorage.setItem("britonCart",JSON.stringify(cart));}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const p=PRODUCTS.find(x=>x.id===Number(b.dataset.add));const old=cart.find(x=>x.id===p.id);if(old)old.qty++;else cart.push({...p,qty:1});updateCart();toast("تمت إضافة المنتج إلى السلة");});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter)}));
const drawer=document.getElementById("cartDrawer"),overlay=document.getElementById("overlay");
function openCart(){drawer.classList.add("open");overlay.classList.add("show");drawer.setAttribute("aria-hidden","false")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show");drawer.setAttribute("aria-hidden","true")}
document.getElementById("cartOpen").onclick=openCart;document.getElementById("cartClose").onclick=closeCart;overlay.onclick=closeCart;
document.getElementById("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(!b)return;cart=cart.filter(x=>x.id!==Number(b.dataset.remove));updateCart()});
document.getElementById("checkout").onclick=()=>{if(!cart.length){toast("أضف منتجًا إلى السلة أولًا");return}const lines=cart.map(x=>`• ${x.name} — ${x.qty} × ${x.price} ر.س`).join("\n");const total=cart.reduce((s,x)=>s+x.price*x.qty,0);const msg=`مرحبًا BRITON، أريد طلب المنتجات التالية:\n${lines}\nالإجمالي: ${total} ر.س\nالاسم:\nالمدينة والعنوان:\nطريقة التواصل:`;if(WHATSAPP_NUMBER==="966500000000"){toast("ضع رقم واتساب الصحيح في app.js قبل استقبال الطلبات");return}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank")};
document.getElementById("year").textContent=new Date().getFullYear();
let installPrompt=null;const installBanner=document.getElementById("installBanner");const installBtn=document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;installBtn.textContent="تثبيت التطبيق";});
installBtn.addEventListener("click",async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null}else{toast("من قائمة المتصفح ⋮ اختر «إضافة إلى الشاشة الرئيسية» أو «تثبيت التطبيق»") }});
document.getElementById("dismissInstall").addEventListener("click",()=>installBanner.remove());
window.addEventListener("appinstalled",()=>{installBanner.remove();toast("تم تثبيت BRITON بنجاح")});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
renderProducts();updateCart();