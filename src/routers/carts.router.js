import { Router } from "express";
import cartManager from "../cartManager.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const addCart = await cartManager.addCart();
    res.json({ message: "New cart added succefully", addCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(cartId) || isNaN(productId)) {
      return res.status(400).json({ error: "Invalid cartId or productId" });
    }

    if (productId <= 0) {
      return res.status(404).json({ error: "Not valid product" });
    }

    const cart = await cartManager.addProductsToCart(cartId, productId);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `The cart with id ${cartId} does not exist` });
    }
    res.json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `The cart with id ${cartId} doesnot exist` });
    }
    res.send(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
