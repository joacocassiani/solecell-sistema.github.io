document.addEventListener("DOMContentLoaded", () => {
  const newSaleForm = document.getElementById("newSaleForm");

  const productSelect = document.getElementById("product-select");

  // Obtener el stock del localStorage
  const stock = JSON.parse(localStorage.getItem("stock")) || [];

  // Renderizar opciones en el select
  stock.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.name;
    option.textContent = `${product.name} (${product.quantity} disponibles)`;
    productSelect.appendChild(option);
  });

  newSaleForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const clientName = document.getElementById("clientName").value;
    const dni = document.getElementById("clientDni").value;
    const phone = document.getElementById("clientNumber").value;
    const product = document.getElementById("product-select").value;
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    const saleDate = document.getElementById("saleDate").value;
    const paymentCount = parseInt(document.getElementById("saleCant").value, 10);
    const periodicity = document.getElementById("periodicidad").value;
    const amount = parseFloat(document.getElementById("saleAmount").value); // Monto unitario
    const cost = parseFloat(document.getElementById("productCost").value);

    // Calcular el total como cantidad * monto
    const total = quantity * amount;

    // Calcular la fecha de finalización
    const startDate = new Date(saleDate);
    let endDate = new Date(startDate);

    if (periodicity === "Semanal") {
      endDate.setDate(startDate.getDate() + paymentCount * 7);
    } else if (periodicity === "Quincenal") {
      endDate.setDate(startDate.getDate() + paymentCount * 15);
    } else if (periodicity === "Mensual") {
      endDate.setMonth(startDate.getMonth() + paymentCount);
    }

    // Verificar y actualizar el stock
    const stock = JSON.parse(localStorage.getItem("stock")) || [];
    const selectedProduct = stock.find((item) => item.name === product);

    if (selectedProduct) {
      if (selectedProduct.quantity >= quantity) {
        selectedProduct.quantity -= quantity; // Restar la cantidad del stock
      } else {
        alert(`No hay suficiente stock de ${product}. Disponible: ${selectedProduct.quantity}`);
        return; // Cancelar la operación si no hay suficiente stock
      }
    } else {
      alert(`El producto ${product} no existe en el stock.`);
      return; // Cancelar la operación si el producto no existe
    }

    // Guardar el stock actualizado en el localStorage
    localStorage.setItem("stock", JSON.stringify(stock));

    // Crear un objeto con los datos de la venta
    const newSale = {
      dni,
      clientName,
      saleDate,
      endDate: endDate.toISOString().split("T")[0], // Fecha final en formato YYYY-MM-DD
      product,
      quantity, // Nuevo campo
      periodicity, // Periodicidad
      payments: paymentCount,
      productCost: cost, // Capturar costo
      total,
      phone,
    };

    // Obtener las ventas existentes del localStorage
    const sales = JSON.parse(localStorage.getItem("sales")) || [];

    // Agregar la nueva venta a las ventas existentes
    sales.push(newSale);

    // Guardar las ventas actualizadas en el localStorage
    localStorage.setItem("sales", JSON.stringify(sales));

    // Mostrar mensaje de éxito
    alert("Venta registrada exitosamente");

    // Redirigir a la página de ventas
    window.location.href = "../html/ventas.html";
  });
});

document.querySelectorAll('input[type="number"]').forEach((input) => {
  // Deshabilitar el scroll en los campos de número
  input.addEventListener('wheel', (e) => e.preventDefault());
});