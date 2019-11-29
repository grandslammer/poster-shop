let loadNum = 4;
let watcher;

setTimeout(() => {
    new Vue({
        el: "#app",
        data: {
            total: 0,
            products: [
                // Dummy products for testing. Now uses search to get procucts instead.
                // {title: "Product 1", id: 1, price: 9.99},
                // {title: "Product 2", id: 2, price: 9.99},
                // {title: "Product 3", id: 3, price: 9.99}
            ],
            cart: [],
            search: "dog",
            lastSearch: "",
            loading: false,
            results: []
        },
        methods: {
            addToCart: function (product) {
                this.total += product.price;

                // Increments qty if product is already in cart
                let found = false;
                for (let i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === product.id) {
                        this.cart[i].qty++;
                        found = true;
                    }
                }

                // Adds item to cart and sets qty for that item to 1
                if (!found) {
                    this.cart.push({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        qty: 1
                    });
                }
            },
            // Incrememt item (+ button)
            inc: function (item) {
                item.qty++;
                this.total += item.price;
            },
            //Decrement item (- button)
            dec: function (item) {
                // Prevents - button from going past 0 and removes item from cart
                if (item.qty <= 1) {
                    let i = this.cart.indexOf(item);
                    this.cart.splice(i, 1);
                }
                item.qty--;
                this.total -= item.price;
            },
            onSubmit: function () {
                this.products = []; // Empties the search results immediately
                this.results = [];
                this.loading = true;
                //Sets up AJAX request
                let path = "/search?q=".concat(this.search);
                this.$http.get(path)
                    .then(function (response) { // JS promise / callback function
                        setTimeout(function () { // Simulates search delay - 200 miliseconds
                            console.log(response);
                            this.results = response.body;
                            this.lastSearch = this.search;
                            this.appendResults();
                            this.loading = false;
                        }.bind(this), 200); // Binds function scope to the parent scope
                    });

            },
            appendResults: function () {
                if (this.products.length < this.results.length) {
                    let toAppend = this.results.slice(this.products.length, loadNum + this.products.length);
                    this.products = this.products.concat(toAppend);
                }
            }
        },
        filters: {
            // Formats price to 2 decimal places and inserts € symbol
            currency: (price) => {
                return "€".concat(price.toFixed(2));
            }
        },
        created: function () {
            this.onSubmit();
        },
        updated: function () {
            let sensor = document.querySelector("#product-list-bottom");

            // Using Scrollmonitor JS library installed via npm
            watcher = scrollMonitor.create(sensor);

            watcher.enterViewport(this.appendResults);
        },
        beforeUpdate: function () {
            if (watcher) {
                watcher.destroy();
                watcher = null;
            }
        }
    });
}, 3000);


