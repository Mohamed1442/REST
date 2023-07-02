const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

//get /admin/add-product
router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getAdminProducts);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

//post /admin/add-product
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
