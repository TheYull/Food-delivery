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
                <button>Замовити</button>
                </div>
            </div>
            ` 
        })
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
}


const db = new DataBase();
const productView = new ProductView();
