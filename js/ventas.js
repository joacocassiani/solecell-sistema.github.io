document.addEventListener("DOMContentLoaded", () => {
  const salesTableBody = document.getElementById("salesTableBody");
  const searchInput = document.getElementById("searchInput"); // Input de búsqueda
  const totalSalesElement = document.getElementById("totalSales"); // Elemento para mostrar el total de ventas

  // Obtener las ventas del localStorage
  const sales = JSON.parse(localStorage.getItem("sales")) || [];

  // Elementos para las cartas de acumuladores
  const monthlyCounter = document.getElementById("monthlyCounter");
  const biweeklyCounter = document.getElementById("biweeklyCounter");
  const weeklyCounter = document.getElementById("weeklyCounter");

  // Función para determinar el estado de una venta
  const getSaleStatus = (sale) => {
    const today = new Date();
    const endDate = new Date(sale.endDate);

    if (today <= endDate) {
      return "Activo";
    } else {
      return "Pagado";
    }
  };

  // Función para renderizar las ventas en la tabla
  const renderSales = (filter = "") => {
    salesTableBody.innerHTML = ""; // Limpiar la tabla antes de renderizar

    // Inicializar acumuladores
    let monthlySales = 0;
    let biweeklySales = 0;
    let weeklySales = 0;
    let totalSales = 0; // Inicializar el total de ventas

    // Filtrar las ventas según el término de búsqueda
    const filteredSales = sales.filter((sale) => {
      return (
        sale.clientName.toLowerCase().includes(filter.toLowerCase()) ||
        sale.product.toLowerCase().includes(filter.toLowerCase()) ||
        (sale.dni || "").toString().includes(filter)
      );
    });

    // Procesar cada venta filtrada
    filteredSales.forEach((sale, index) => {
      // Contar las ventas según la periodicidad
      if (sale.periodicity === "Mensual") {
        monthlySales++;
      } else if (sale.periodicity === "Quincenal") {
        biweeklySales++;
      } else if (sale.periodicity === "Semanal") {
        weeklySales++;
      }

      // Sumar el total de la venta
      totalSales ++;

      // Determinar el estado de la venta
      const status = getSaleStatus(sale);

      // Renderizar fila de la tabla
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${sale.dni || "Sin DNI"}</td>
        <td>${sale.clientName}</td>
        <td>${sale.saleDate}</td>
        <td>${sale.endDate}</td>
        <td>${sale.product}</td>
        <td>${sale.quantity}</td>
        <td>${sale.periodicity}</td>
        <td>${sale.payments}</td>
        <td>$${Math.round(sale.productCost).toLocaleString("es-AR")}</td>
        <td>$${Math.round(sale.total).toLocaleString("es-AR")}</td>
        
        <td>${status}</td>
        <td>
          <button class="whatsapp-sale" data-index="${index}" clientNumber="${sale.phone}">📞</button>
          <button class="edit-sale" data-index="${index}">✏️</button>
          <button class="delete-sale" data-index="${index}">❌</button>
        </td>
      `;

      salesTableBody.appendChild(row);
    });

    // Actualizar valores de las cartas
    monthlyCounter.textContent = monthlySales;
    biweeklyCounter.textContent = biweeklySales;
    weeklyCounter.textContent = weeklySales;

    // Actualizar el total de ventas en el HTML
    totalSalesElement.textContent = `${Math.round(totalSales)}`;
  };

  // Función para eliminar una venta
  const deleteSale = (index) => {
    sales.splice(index, 1);
    localStorage.setItem("sales", JSON.stringify(sales));
    renderSales();
  };

  // Manejo de clics en la tabla
  salesTableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("whatsapp-sale")) {
      const phone = e.target.getAttribute("clientNumber");
      if (phone) {
        const message = encodeURIComponent("Hola, me contacto desde el sistema de ventas.");
        const whatsappURL = `https://wa.me/${phone}?text=${message}`;
        window.open(whatsappURL);
      } else {
        alert("Número de teléfono no disponible.");
      }
    }

    if (e.target.classList.contains("delete-sale")) {
      const index = e.target.getAttribute("data-index");
      if (confirm("¿Seguro que deseas eliminar esta venta?")) {
        deleteSale(index);
      }
    }

    if (e.target.classList.contains("edit-sale")) {
      const index = e.target.getAttribute("data-index");
      const saleToEdit = sales[index];

      const editForm = document.getElementById("edit-form");
      document.getElementById("edit-dni").value = saleToEdit.dni;
      document.getElementById("edit-clientName").value = saleToEdit.clientName;
      document.getElementById("edit-saleDate").value = saleToEdit.saleDate;
      document.getElementById("edit-endDate").value = saleToEdit.endDate;
      document.getElementById("edit-product").value = saleToEdit.product;
      document.getElementById("edit-periodicity").value = saleToEdit.periodicity;
      document.getElementById("edit-payments").value = saleToEdit.payments;
      document.getElementById("edit-productCost").value = saleToEdit.productCost;
      document.getElementById("edit-total").value = saleToEdit.total;
      

      editForm.style.display = "block";

      document.getElementById("save-edit").onclick = () => {
        saleToEdit.dni = document.getElementById("edit-dni").value;
        saleToEdit.clientName = document.getElementById("edit-clientName").value;
        saleToEdit.saleDate = document.getElementById("edit-saleDate").value;
        saleToEdit.endDate = document.getElementById("edit-endDate").value;
        saleToEdit.product = document.getElementById("edit-product").value;
        saleToEdit.periodicity = document.getElementById("edit-periodicity").value;
        saleToEdit.payments = document.getElementById("edit-payments").value;
        saleToEdit.productCost = document.getElementById("edit-productCost").value;
        saleToEdit.total = document.getElementById("edit-total").value;

        
        localStorage.setItem("sales", JSON.stringify(sales));
        editForm.style.display = "none";
        renderSales();
      };
    }
  });

  // Escuchar eventos en el campo de búsqueda
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    renderSales(searchTerm); // Filtrar las ventas según el texto ingresado
  });

  // Renderizar las ventas al cargar la página
  renderSales();
});