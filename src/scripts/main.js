/////////// Function

// let category;

// function renderProducts(product){
//     let containerProducts = document.querySelector('.container-products');
//     containerProducts.innerHTML = '';

//     product.forEach(product => {
//         containerProducts.innerHTML += `
//         <div class="product-card">
//             <img src="./src/img/${category}/${product.urlImg}"/>
//             <h4>${product.name}</h4>
//             <div class="container-card-price">
//             <span>${product.price} грн</span>
//             <button>Замовити</button>
//             </div>
//         </div>
//         ` 
//     })
// }

// let tabs = document.querySelectorAll('button[data-category]');
// tabs.forEach(btn => {
//     btn.addEventListener('click', () => {
//         category = btn.dataset.category;
//         fetch(`./data/db-${category}.json`)
//             .then(res => res.json())
//             .then(data => renderProducts(data))
//     })
// })

//////////
////////////// Class

class Product{
    name;
    urlImg;
    price;
    id;
    category;

    constructor(name, urlImg, price, id, category){
        this.name = name;
        this.urlImg = urlImg;
        this.price = price;
        this.id = id;
        this.category = category;
    }
}

class DataBase{
    data = [];
    constructor(){
        fetch(`./data/db-pizzas.json`)
            .then(res => res.json())
            .then(pizzas => pizzas.forEach(item => {
                const product = new Product(item.name, item.urlImg, item.price, item.id, 'pizzas');
                this.data.push(product);
            }))
        
        fetch(`./data/db-drinks.json`)
            .then(res => res.json())
            .then(drinks => drinks.forEach(({ name, urlImg, price, id}) => {
                const product = new Product(name, urlImg, price, id, 'drinks');
                this.data.push(product);
            }))
    }

    getProduct(category){
        return this.data.filter(item => item.category === category);
    }

    getProductById(id){
        return this.data.find(obj => obj.id === id);
    }
}

class ProductView{
    products = [];
    tabs;

    constructor(){
        this.tabs = document.querySelectorAll('button[data-category]');
        this.changeCategory();
        setTimeout(() => {
            this.products = db.getProduct('pizzas');
            this.renderProducts()}, 1000)
    }

    renderProducts(){
        let containerProducts = document.querySelector('.container-products');
        containerProducts.innerHTML = '';
    
        this.products.forEach(product => {
            containerProducts.innerHTML += `
            <div class="product-card">
                <img src="./src/img/${product.category}/${product.urlImg}"/>
                <h4>${product.name}</h4>
                <div class="container-card-price">
                <span><b>${product.price} грн</b></span>
                <button data-id="${product.id}">Замовити</button>
                </div>
            </div>
            ` 
        })
        this.onByProduct();
    }

    changeCategory(){
        this.tabs.forEach(btn => {
            btn.addEventListener('click', () => {
               const category = btn.dataset.category;
                this.products = db.getProduct(category);
                this.renderProducts();
            })
        })
        
    }

    onByProduct(){
        const btns = document.querySelectorAll('button[data-id]');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                // console.log(btn.dataset.id);
                basket.add(db.getProductById(btn.dataset.id));
            })
        })
    }

}

class BasketProduct{
    name;
    count;
    price;
    id;
    totalPrice;

    constructor(name, count, price, id) {
        this.name = name;
        this.count = count;
        this.price = price;
        this.id = id;
        this.totalPrice = price;
    }

}

class Basket{
    products = [];
    basketContainer;

    constructor(){
        this.basketContainer = document.querySelector('.basket');
    }

    add(product){
        console.log(product);
        let currentProduct = this.products.find(obj => obj.id === product.id);

        if(currentProduct){
            currentProduct.count++;
            currentProduct.totalPrice += product.price;
            this.render();
            return;
        }

        this.products.push(new BasketProduct(product.name, 1, product.price, product.id));
        this.render();
    }

    createCard(product){
        const card = document.createElement('div');
        card.classList.add('basket-container')
        card.insertAdjacentHTML('beforeend', `
        <div class="basket-card">
            <h4>${product.name}</h4>
            <p>${product.price}</p>
            <div class="basket-count-button">
            <button class="count-btn">+</button>
            <p>${product.count}</p>
            <button class="count-btn">-</button></div>
            <p>${product.totalPrice}</p>
        </div>
        `);

        this.basketContainer.append(card);
    }

    render(){
        this.basketContainer.innerHTML = "";
        this.products.forEach(product => {
            this.createCard(product);
        })
    }
}

const db = new DataBase();
const productView = new ProductView();
const basket = new Basket();
