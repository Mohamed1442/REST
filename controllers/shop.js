const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      products: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/products-list", {
      products: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.getProduct(prodId, (product) => {
    res.render("shop/product-details", {
      product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];

      products.forEach((prod) => {
        const cartItem = cart.products.find(
          (product) => product.id === prod.id
        );
        if (cartItem) {
          cartProducts.push({ productData: prod, amount: cartItem.amount });
        }
      });

      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  Product.getProduct(req.body.productId, (product) => {
    Cart.addToCart(req.body.productId, product.price);
    res.redirect("/cart");
  });
};

exports.postDeleteCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.getProduct(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
