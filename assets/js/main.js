async function getProducts() {
    try {
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );
        const res = await data.json();
        window.localStorage.setItem("products", JSON.stringify(res));
        return res;
    } catch (error) {
        console.log(error);
    }
}

function printProducs(db) {
    const productsHtml = document.querySelector(".products");
    html = "";
    for (const product of db) {
        const buttonAdd = product.quantity
            ? `<i class="bx bx-plus" id="${product.id}"></i>`
            : "<span class='sout-of-stock'>Sin Stock</span>";

        html += `
            <div class="product"> 
                <div class="product__img">
                    <img src="${product.image}" alt="imagen" />
                </div>
                <div class="product__info">
                    <h3>
                        $ ${product.price} USD ${buttonAdd}  <span>| Stock:${product.quantity}</span>
                    </h3>
                    <h4> <p class="showModalProduct" id="${product.id}">${product.name}</p> </h4>  
                </div> 
            </div>
        `;
    }
    productsHtml.innerHTML = html;
}

function handleShowCart() {
    const iconartHTML = document.querySelector(".bx-shopping-bag");
    const cartHTML = document.querySelector(".contentCart");

    iconartHTML.addEventListener("click", function (e) {
        cartHTML.classList.toggle("cart__show");
    });
}

function addToCartFromProducts(db) {
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);
            const productFind = db.products.find(
                (product) => product.id === id
            );
            if (db.cart[productFind.id]) {
                if (productFind.quantity === db.cart[productFind.id].amount)
                    return alert("No tenemos mas en Stock");
                db.cart[productFind.id].amount++;
            } else {
                db.cart[productFind.id] = { ...productFind, amount: 1 };
            }
            window.localStorage.setItem("cart", JSON.stringify(db.cart));
            printProducsInCart(db);
            printTotales(db);
            handlePrintAmountProducts(db);
        }
    });
}

function printProducsInCart(db) {
    const cartProducts = document.querySelector(".contentCart__products");
    let html = "";
    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product];
        html += `
            <div class="contentCart__product">
                <div class="product__card">
                    <div class="product__card--img">
                        <img src="${image}" alt="image" />
                    </div>
                    <div class="product__card--body">
                        <h4>${name} | $${price} </h4>
                        <p>Stock: ${quantity}</p>
                        <div class="product__card--body-op" id="${id}">
                            <i class="bx bx-minus"></i>    
                            <span>${amount} unit</span>
                            <i class="bx bx-plus"></i>    
                            <i class="bx bx-trash"></i>    
                        </div>
                    </div>
                </div>       
            </div>   
    `;
    }
    cartProducts.innerHTML = html;
}

function handleProductsInCart(db) {
    const cartProducts = document.querySelector(".contentCart__products");
    cartProducts.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.parentElement.id);
            const productFind = db.products.find(
                (product) => product.id === id
            );

            if (productFind.quantity === db.cart[productFind.id].amount)
                return alert("No tenemos mas en Stock");
            db.cart[id].amount++;
        }

        if (e.target.classList.contains("bx-minus")) {
            const id = Number(e.target.parentElement.id);
            if (db.cart[id].amount === 1) {
                const response = confirm(
                    "Está seguro de eliminar este producto?"
                );
                if (!response) return;
                delete db.cart[id];
            } else {
                db.cart[id].amount--;
            }
        }

        if (e.target.classList.contains("bx-trash")) {
            const id = Number(e.target.parentElement.id);
            const response = confirm("Está seguro de eliminar este producto?");
            if (!response) return;

            delete db.cart[id];
        }

        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        printProducsInCart(db);
        printTotales(db);
        handlePrintAmountProducts(db);
    });
}

function printTotales(db) {
    const infoTotal = document.querySelector(".totalPrice");
    const infoAmount = document.querySelector(".numberItems");

    let totalProducts = 0;
    let amountProducts = 0;

    for (const product in db.cart) {
        const { amount, price } = db.cart[product];
        totalProducts += price * amount;
        amountProducts += amount;
    }

    infoAmount.textContent = amountProducts + "Unit";
    infoTotal.textContent = "$" + totalProducts + ".00";
}

function handleTotal(db) {
    const btnBuy = document.querySelector(".btn__buy");
    btnBuy.addEventListener("click", function () {
        if (!Object.values(db.cart).length)
            return alert(
                "El carrito está vacío: Ingrese los productos que desea comprar."
            );

        const response = confirm("Está seguro que quiere comprar?");
        if (!response) return;

        const currentProducts = [];
        for (const product of db.products) {
            const productCart = db.cart[product.id];
            if (product.id === productCart?.id) {
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount,
                });
            } else {
                currentProducts.push(product);
            }
        }
        db.products = currentProducts;
        db.cart = {};
        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        printTotales(db);
        printProducsInCart(db);
        printProducs(db.products);
    });
}

function handlePrintAmountProducts(db) {
    const amountProductsP = document.querySelector(".totalAmountProducts");
    let amount = 0;
    for (const product in db.cart) {
        amount += db.cart[product].amount;
    }
    amountProductsP.textContent = amount;
}

function filterProductsBD(db, filterProducts) {
    const selectFilterHtml = document.querySelectorAll(".filter");
    const productHtml = document.querySelector(".products");

    for (const productCategoryFilter of selectFilterHtml) {
        productCategoryFilter.addEventListener("click", function (e) {
            const prodCategory =
                e.currentTarget.firstElementChild.textContent.toLowerCase();

            if (prodCategory === "show all") {
                filterProducts = db.products;
            } else {
                let cantidFilter = 0;
                switch (prodCategory) {
                    case "shirt":
                        cantidFilter = 7;
                        break;
                    case "hoddie":
                        cantidFilter = 6;
                        break;
                    case "sweater":
                        cantidFilter = 5;
                        break;
                    default:
                        break;
                }
                filterProducts = db.products.filter(
                    (product) => product.category === prodCategory
                );
                filterProducts = filterProducts.slice(0, cantidFilter);
            }
            printProducs(filterProducts);
        });
    }
}

function handleTheme() {
    const iconTheme = document.querySelector(".bx-moon");

    iconTheme.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");
    });
}

function handleNavbar() {
    const iconMenu = document.querySelector(".bx-menu");
    const menu = document.querySelector(".navbar_menu");

    iconMenu.addEventListener("click", function () {
        menu.classList.toggle("menu__show");
    });
}

function transitionNavbar() {
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", function () {
        if (window.scrollY > 200) {
            navbar.classList.add("navbar__active");
        } else {
            navbar.classList.remove("navbar__active");
        }
    });
}

function printProductUnitView(db) {
    const productViewHTML = document.querySelector(".products");
    const productModal = document.querySelector(".modalProduct");

    productViewHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("showModalProduct")) {
            const id = Number(e.target.id);

            const productFind = db.products.find(
                (product) => product.id === id
            );

            productModal.classList.add("modalProduct__show");
            const buttonAdd = productFind.quantity
                ? `<i class="bx bx-plus" id="${productFind.id}"></i>`
                : "<span class='product__soldout'>Sold out</span>";

            let html = "";

            html += `
                <div class="contentProduct">
                    <i class="bx bxs-x-circle closeModal"></i>
                    <div class="contentProduct__img">
                        <img src="${productFind.image}" alt="">
                    </div>
                    <h3 class="contentProduct__name">${productFind.name} <span>${productFind.category}</span></h3>
                    <p class="contentProduct__p">${productFind.description}</p>
                    <div class="contentProduct__info">
                        <h3>
                            $ ${productFind.price} USD ${buttonAdd} 
                        </h3>
                        <p>Stock:${productFind.quantity}</p>
                    </div>
                </div>
                `;
            productModal.innerHTML = html;
        }
    });
}

function addProductCartWindowModal(db) {
    const productsHTML = document.querySelector(".modalProduct");

    productsHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);

            console.log(id);
            console.log(e.target);

            const productFind = db.products.find(
                (product) => product.id === id
            );

            if (db.cart[productFind.id]) {
                if (productFind.quantity === db.cart[productFind.id].amount)
                    return alert("No tenemos mas en Stock");
                db.cart[productFind.id].amount++;
            } else {
                db.cart[productFind.id] = { ...productFind, amount: 1 };
            }
            window.localStorage.setItem("cart", JSON.stringify(db.cart));
            printProducsInCart(db);
            printTotales(db);
            handlePrintAmountProducts(db);
        }
    });
}

function handleClosModal() {
    const productModalHtml = document.querySelector(".modalProduct");
    productModalHtml.addEventListener("click", function (e) {
        if (e.target.classList.contains("closeModal")) {
            productModalHtml.classList.toggle("modalProduct__show");
        }
    });
}

function handleLinkActive() {
    const linkMenuprod = document.querySelectorAll(".navbar_menu");
    for (const prdIem of linkMenuprod) {
        prdIem.addEventListener("click", function (e) {
            let itemMenuHeader = e.target.textContent.toLowerCase();
            const linkHome = document.querySelector(
                'ul.navbar_menu a[href="#home"]'
            );
            const linkProducts = document.querySelector(
                'ul.navbar_menu a[href="#products"]'
            );

            if (itemMenuHeader === "products") {
                linkHome.classList.remove("link__active");
                linkProducts.classList.add("link__active");
            } else {
                linkHome.classList.add("link__active");
                linkProducts.classList.remove("link__active");
            }
        });
    }
}

async function main() {
    const db = {
        products:
            JSON.parse(window.localStorage.getItem("products")) ||
            (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {},
    };

    const filterProducts = db.products;
    filterProductsBD(db, filterProducts);
    printProducs(filterProducts);

    handleShowCart();
    addToCartFromProducts(db);
    printProductUnitView(db); //Visualiza ventana modal y adiciona producto a carrito de compras
    printProducsInCart(db);
    handleProductsInCart(db);
    printTotales(db);
    handleTotal(db);
    handlePrintAmountProducts(db);
    addProductCartWindowModal(db); //Adicionar desde el boton modal

    handleTheme();
    transitionNavbar();
    handleLinkActive();
    handleClosModal();
}

main();
