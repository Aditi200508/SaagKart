// product list with image filenames matching public/images/
const products = [
  { id:1, name:'Munga Saag', price:60, img:'images/munga.png' },
  { id:2, name:'Methi Saag', price:60, img:'images/methi.png' },
  { id:3, name:'Palak Saag', price:60, img:'images/palak.png' },
  { id:4, name:'Bathua Saag', price:60, img:'images/bathua.png' },
  { id:5, name:'Poi Saag', price:60, img:'images/poi.png' },
  { id:6, name:'Sarson Saag', price:70, img:'images/sarson.png' },
  { id:7, name:'Noni Saag', price:65, img:'images/noni.png' },
  { id:8, name:'Koinar Saag', price:60, img:'images/koinar.png' },
  { id:9, name:'Chakod Saag', price:60, img:'images/chakod.png' },
  { id:10, name:'Beng Saag', price:60, img:'images/beng.png' },
  { id:11, name:'Ghonghi Saag', price:60, img:'images/ghonghi.png' },
  { id:12, name:'Lobia Saag', price:60, img:'images/lobia.png' },
];

let cart = [];
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const cartItems = document.getElementById('cartItems');
const cartDrawer = document.getElementById('cartDrawer');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');

function renderProducts(){
  productsGrid.innerHTML = '';
  products.forEach(p=>{
    const el = document.createElement('div');
    el.className='product';
    el.innerHTML = `<img src="${p.img}" alt="${p.name}"><h4>${p.name}</h4><p>₹${p.price}</p>
      <div style="margin-top:auto">
        <button class="btn primary" onclick="addToCart(${p.id})">Add</button>
      </div>`;
    productsGrid.appendChild(el);
  });
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({...p, qty:1});
  updateCartUI();
  openCart();
}

function updateCartUI(){
  cartItems.innerHTML = '';
  let total = 0; let count = 0;
  if(cart.length===0) cartItems.innerHTML = '<div class="muted">Your cart is empty</div>';
  cart.forEach(item=>{
    total += item.price * item.qty; count += item.qty;
    const row = document.createElement('div');
    row.style.display='flex';row.style.justifyContent='space-between';row.style.marginBottom='8px';
    row.innerHTML = `<div><strong>${item.name}</strong><div style="font-size:13px;color:#666">₹${item.price} × ${item.qty}</div></div>
      <div>
        <button class="btn outline" onclick="changeQty(${item.id}, -1)">−</button>
        <button class="btn outline" onclick="changeQty(${item.id}, 1)">+</button>
      </div>`;
    cartItems.appendChild(row);
  });
  cartCount.textContent = count;
  cartTotalEl.textContent = total.toFixed(2);
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i=>i.id!==id);
  updateCartUI();
}

function openCart(){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); }
function closeCart(){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);

const proceedCheckoutBtn = document.getElementById('proceedCheckout');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const orderPreview = document.getElementById('orderPreview');
const cancelCheckoutBtn = document.getElementById('cancelCheckout');

proceedCheckoutBtn.addEventListener('click', ()=>{
  if(cart.length===0){ alert('Cart is empty'); return; }
  orderPreview.innerHTML = cart.map(i=>`${i.name} × ${i.qty} — ₹${(i.price*i.qty).toFixed(2)}`).join('<br/>');
  checkoutModal.setAttribute('aria-hidden','false');
});

cancelCheckoutBtn.addEventListener('click', ()=> checkoutModal.setAttribute('aria-hidden','true'));

checkoutForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('customer_name').value.trim();
  const email = document.getElementById('customer_email').value.trim();
  const phone = document.getElementById('customer_phone').value.trim();
  const address = document.getElementById('customer_address').value.trim();
  const total = cart.reduce((s,i)=>s + i.price*i.qty, 0);

  if(!name || !email || !address){ alert('Please fill required fields'); return; }

  const payload = {
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    customer_address: address,
    cart: cart.map(i=>({id:i.id,name:i.name,price:i.price,qty:i.qty})),
    total: total
  };

  try {
    const res = await fetch('../backend/order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      alert('Order placed! Reference: ' + result.order_ref);
      cart = []; updateCartUI(); checkoutModal.setAttribute('aria-hidden','true'); closeCart();
    } else {
      alert('Order failed: ' + (result.message || 'unknown'));
    }
  } catch (err) {
    console.error(err); alert('Could not reach server.');
  }
});

// Contact form
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('contact_name').value.trim();
  const email = document.getElementById('contact_email').value.trim();
  const message = document.getElementById('contact_message').value.trim();
  if(!name || !email){ alert('Name and email required'); return; }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('message', message);

  try {
    const res = await fetch('../backend/contact.php', { method:'POST', body: formData });
    const json = await res.json();
    if(json.success){ alert('Message sent — thank you!'); contactForm.reset(); }
    else alert('Failed: ' + (json.message || 'unknown'));
  } catch (err) {
    console.error(err); alert('Could not send message.');
  }
});

// init
renderProducts();
updateCartUI();

  const slides = document.querySelector('.slides'); 
  const images = document.querySelectorAll('.slides img'); 
  const leftArrow = document.querySelector('.arrow.left');
   const rightArrow = document.querySelector('.arrow.right'); 
   let currentIndex = 0; 

   function showSlide(index) {
    if(index < 0) index = images.length - 1; 
    if(index >= images.length) index = 0;
     slides.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
     }

      leftArrow.addEventListener('click', () => {
        showSlide(currentIndex - 1)
      });
      rightArrow.addEventListener('click', () => {
        showSlide(currentIndex + 1)
      }); 
   setInterval(() => {
    showSlide(currentIndex + 1);
   }, 3000); 