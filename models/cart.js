const fs = require("fs");
const path = require("path");

const rootPath = require("../util/path");

const p = path.join(rootPath, "data", "cart.json");

const getCartFromFile = (cb) => {
  fs.readFile(p, (error, fileContent) => {
    if (error) {
      return cb({ products: [], totalPrice: 0 });
    } else if (Buffer.concat([fileContent]).toString() === "") {
      return cb({ products: [], totalPrice: 0 });
    } else {
      return cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  // existingProduct ===> {id: ...,amount: ...}
  static addToCart(id, productPrice) {
    getCartFromFile((cart) => {
      console.log(cart, ">>><<<");
      const existingProduct = cart.products.find(
        (product) => product.id === id
      );
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );

      if (existingProduct) {
        const clone = { ...existingProduct };
        clone.amount++;
        cart.products.splice(existingProductIndex, 1, clone);
      } else {
        const product = { id: id, amount: 1 };
        cart.products.push(product);
      }

      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    getCartFromFile((cart) => {
      const deletedProduct = cart.products.find((product) => product.id === id);
      console.log(deletedProduct, "dsaasd");
      if (!deletedProduct) {
        return;
      }

      const newCartProducts = cart.products.filter(
        (product) => product.id !== id
      );
      const newCartTotalPrice =
        cart.totalPrice - productPrice * deletedProduct.amount;

      console.log(deletedProduct.amount, "deletedProduct.amount");
      console.log(newCartTotalPrice, "newCartTotalPrice");

      const newCart = {
        products: newCartProducts,
        totalPrice: newCartTotalPrice,
      };

      fs.writeFile(p, JSON.stringify(newCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    getCartFromFile(cb);
  }
};
