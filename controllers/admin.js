const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      products: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  console.log(req.params.productId);
  console.log(req.query.edit);

  Product.getProduct(req.params.productId, (product) => {
    res.render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      editing: true,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imgUrl, price, description } = req.body;
  const editedProduct = new Product(
    productId,
    title,
    imgUrl,
    price,
    description
  );
  editedProduct.save();
  res.redirect("/");
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteProduct(productId, () => {
    res.redirect("/admin/products");
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imgUrl, price, description } = req.body;
  const product = new Product(null, title, imgUrl, price, description);
  product.save();
  res.redirect("/");
};
