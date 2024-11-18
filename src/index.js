const express = require("express");
const dotenv = require("dotenv");
const prisma = require("./db");

const app = express();
app.use(express.json());

dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.get("/test", async (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});

app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.status(200).json({
      message: "All products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed fetching products",
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed fetching product",
    });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    await prisma.product.create({
      data: {
        name,
        price,
        description,
      },
    });

    res.status(200).json({
      message: "Product created",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed creating product",
    });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      return res.status(404).json({
        messasge: "Product not found",
      });
    }

    const updatedProduct = {
      name,
      price,
      description,
    };

    await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: updatedProduct,
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed updating product",
    });
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!product) {
    return res.status(404).json({
      messasge: "Product not found",
    });
  }

  await prisma.product.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({
    message: "Product deleted successfully",
  });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  res.status(200).json({
    message: "User created successfully",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "Email is not registered",
    });
  }

  if (user.password !== password) {
    return res.status(402).json({
      message: "Password is incorrect",
    });
  }

  res.status(200).json({
    message: "Login successful",
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Express API running in localhost:5000`);
});
