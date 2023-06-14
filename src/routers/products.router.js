import { Router } from "express";
import productManager from "../productManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.send({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const id = parseFloat(req.params.pid);
    const product = await productManager.getProductById(id);
    if (!product) {
      return res.json({ message: "This product does not exist" });
    }
    res.send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: "Fields are required" });
    }
    const product = await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status || true
    );
    if (product) {
      const addedProduct = await productManager.getProducts();
      req.app.get("socketio").emit("updatedProducts", addedProduct);

      return res.status(201).json({
        message: "Product added successfully",
        product,
      });
    }
    return res.status(404).json({ error: "Error adding a product" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    if (updatedProduct.id && updatedProduct.id !== productId) {
      return res.status(404).json({ error: "Cannot modify the product ID" });
    }
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with ID ${productId} does not exist` });
    }
    await productManager.updateProduct(productId, updatedProduct);

    const update = await productManager.getProducts();
    req.app.get("socketio").emit("updatedProducts", update);

    res.json({ message: `Product with ID ${productId} updated successfully` });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with ID ${productId} does not exist` });
    }
    await productManager.deleteProduct(productId);

    const update = await productManager.getProducts();
    req.app.get("socketio").emit("updatedProducts", update);

    res.json({
      message: `Product with ID ${productId} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
