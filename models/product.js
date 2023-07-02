const fs = require("fs");
const path = require("path");

const Cart = require("./cart");
const rootPath = require("../util/path");

const p = path.join(rootPath, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    return cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imgUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    if (this.id) {
      getProductsFromFile((products) => {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const existingProducts = [...products];
        existingProducts[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(existingProducts), (err) => {
          console.log(err);
        });
      });
    } else {
      getProductsFromFile((products) => {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      });
    }
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static getProduct(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      cb(product);
    });
  }

  static deleteProduct(id, cb) {
    getProductsFromFile((products) => {
      const productIndex = products.findIndex((product) => product.id === id);
      const editedProducts = [...products];
      editedProducts.splice(productIndex, 1);
      fs.writeFile(p, JSON.stringify(editedProducts), (err) => {
        if (!err) {
          const productPrice = products[productIndex].price;
          Cart.deleteProduct(id, productPrice);
          cb();
        }
      });
    });
  }
};
