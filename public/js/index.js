const socket = io();
const containerProducts = document.getElementById("realTimeProducts");
const inputTitle = document.getElementById("inputTitle");
const inputDescription = document.getElementById("inputDescription");
const inputPrice = document.getElementById("inputPrice");
const inputCode = document.getElementById("inputCode");
const inputStock = document.getElementById("inputStock");
const inputCategory = document.getElementById("inputCategory");

document.getElementById("createProduct").addEventListener("click", (e) => {
  e.preventDefault();

  const body = {
    title: inputTitle.value,
    description: inputDescription.value,
    price: Number(inputPrice.value),
    code: Number(inputCode.value),
    stock: Number(inputStock.value),
    category: inputCategory.value,
  };

  fetch("/api/products", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") {
        throw new Error(result.error);
      }
    })
    .then(() => fetch("/api/products"))
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") {
        throw new Error(result.error);
      } else {
        socket.emit("productList", body);
      }
      alert("Product added.");
    })
    .catch((err) => alert(`There was an error: (\n${err}`));
});

const deleteProduct = (id) => {
  fetch(`/api/products/${id}`, {
    method: "delete",
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") {
        throw new Error(result.error);
      }
      alert("Product deleted");
    })
    .catch((err) => alert(`there was an error: (\n${err})`));
};

socket.on("updatedProducts", (products) => {
    console.log(typeof products)
    if (Object.keys(products).length != 0) {
      containerProducts.innerHTML = "";
      [products].forEach((item) => {
        const productHtml = `
          <div id="${item.id}">
            <button onclick="deleteProduct('${item.id}')">Eliminar</button>
            <p>${item.id}</p>
            <div>
              <h1>${item.title}</h1>
              <p><b>Descripción:</b> ${item.description}</p>
              <p><b>Código:</b> ${item.code}</p>
              <p><b>Stock:</b> ${item.stock}</p>
              <p><b>Precio:</b> ${item.price}</p>
              <p><b>Categoría:</b> ${item.category}</p>
            </div>
          </div>
        `;
        containerProducts.innerHTML += productHtml;
      });
    } else {
      console.error("El valor de 'data' no es un array.");
    }
  });
  
