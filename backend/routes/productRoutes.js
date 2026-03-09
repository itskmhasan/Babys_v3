const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../config/auth");
const {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
} = require("../controller/productController");

//add a product
router.post("/add", isAuth, isAdmin, addProduct);

//add multiple products
router.post("/all", isAuth, isAdmin, addAllProducts);

//get a product
router.post("/:id", getProductById);

//get showing products only
router.get("/show", getShowingProducts);

//get showing products in store
router.get("/store", getShowingStoreProducts);

//get all products
router.get("/", getAllProducts);

//get a product by slug
router.get("/product/:slug", getProductBySlug);

//update a product
router.patch("/:id", isAuth, isAdmin, updateProduct);

//update many products
router.patch("/update/many", isAuth, isAdmin, updateManyProducts);

//update a product status
router.put("/status/:id", isAuth, isAdmin, updateStatus);

//delete a product
router.delete("/:id", isAuth, isAdmin, deleteProduct);

//delete many product
router.patch("/delete/many", isAuth, isAdmin, deleteManyProducts);

module.exports = router;
