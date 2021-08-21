let cart = document.querySelector('.cart__items');

function emptyCart() {
  const cartList = document.querySelector('.cart ol');
  const priceValue = document.querySelector('.cart .total-price');
  cartList.innerHTML = '';
  priceValue.innerText = 0;
  localStorage.setItem('price', priceValue.innerHTML);
}

function saveLocalStorage() {
  localStorage.setItem('products', cart.innerHTML);
}

const totalPrice = () => {
  const priceValue = document.querySelector('.total-price');
  const cartItems = document.querySelectorAll('.cart ol li');
  const cartItemsArray = [];
  cartItems.forEach((item) => {
    cartItemsArray.push(+item.innerText.split('$')[1]);
    console.log(cartItemsArray);
  });
  let result = 0;
  cartItemsArray.forEach((item) => {
    result += item;
  });
  priceValue.innerText = Math.round((result) * 100) / 100;
  localStorage.setItem('price', priceValue.innerHTML);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function mapCartItem(item) {
  return { 
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  };
}

async function fetchCartItem(event) {
  const target = event.target.parentNode.firstChild.innerText;
  await fetch(`https://api.mercadolibre.com/items/${target}`)
  .then((response) => response.json())
  .then((computer) => {
    cart = document.querySelector('.cart__items');
    cart.appendChild(createCartItemElement(mapCartItem(computer)));
    totalPrice();
  })
  .then(saveLocalStorage); 
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const btn = document.querySelectorAll('.item__add');    
  btn.forEach((button) => button.addEventListener('click', fetchCartItem));
  return section;
}

function append(section) {
  const sectionFather = document.querySelector('.items');
  const sectionChild = section;
  sectionFather.appendChild(sectionChild);
}

function mapComputerList(computerFromApi) {
  return {
    name: computerFromApi.title,
    sku: computerFromApi.id,
    image: computerFromApi.thumbnail,
  };
}

function requestML($QUERY) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`)
    .then((response) => response.json());
}

function loadLocalStorage() {  
  cart = document.querySelector('.cart ol');
  cart.innerHTML = localStorage.getItem('products');
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  const cartPrice = document.querySelector('.total-price');
  cartPrice.innerHTML = localStorage.getItem('price');
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

window.onload = () => { 
  requestML('computador')    
  .then((computerListApi) => computerListApi.results.map(mapComputerList))
  .then((computers) => computers.forEach((computer) =>
    append(createProductItemElement(computer))))
  .then(loadLocalStorage)
  .then(removeLoading)
  .catch((error) => console.log(error));
};
