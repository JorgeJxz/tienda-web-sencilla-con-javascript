var tabla = document.querySelector("#tabla_ventas");
var cont = 0;
var total_final = 0;
var ventas = [];
var id_venta = 0;
var id_act;
var stock_venta;
var clientes;
var productos;

var btn_cli_sel = document.querySelector("#btn_cli_sel");
var clientes_select = document.querySelector("#clientes_select");
var cli_ventas = document.querySelector("#cli_ventas");

var contenido_ventas = document.querySelector("#contenido_ventas");
var sel_producto = document.querySelector("#sel_producto");
var productos_select = document.querySelector("#productos_select");
var stock_disponible = document.querySelector("#stock_disponible");
var btn_pro_agregar = document.querySelector("#btn_pro_agregar");
var btn_pro_borrar = document.querySelector("#btn_pro_borrar");
var btn_pro_guardar = document.querySelector("#btn_pro_guardar");

var btn_vts_recuperar = document.querySelector("#btn_vts_recuperar");
var btn_vts_borrar = document.querySelector("#btn_vts_borrar");
var btn_vts_actualizar = document.querySelector("#btn_vts_actualizar");
var ventas_select = document.querySelector("#ventas_select");

window.addEventListener("load", function () {
  cargar_clientes();
  cargar_productos();
  cargar_ventas();

});

btn_cli_sel.addEventListener("click", function () {
  var j = buscar_registro(clientes, clientes_select.value);
  var html = " ";

  html +=
    "<td>" +
    clientes[j].nombre +
    "</td>" +
    "<td>" +
    clientes[j].ape +
    "</td>" +
    "<td>" +
    clientes[j].dni +
    "</td>" +
    "<td>" +
    clientes[j].f_nac +
    "</td>" +
    "<td>" +
    clientes[j].email +
    "</td>";

  document.querySelector("#cli_ventas").innerHTML = html;
  sel_producto.classList.remove("disabledbutton");
});

btn_pro_agregar.addEventListener("click", function () {
  var cantidad = document.querySelector("#cantidad").value;
  var pro_sel = productos_select.value;
  var carrito = document.querySelectorAll(".filas");
  var control = false;
  var stock;
  var total;

  productos.forEach((p) => {
    if (p.id == pro_sel) {
      pro_sel = productos.indexOf(p);
      console.log(pro_sel);
    }
  });

  carrito.forEach((c) => {
    if (productos_select.value == c.firstChild.className) {
      control = true;
    }
  });

  if (cantidad == "" || cantidad == 0) {
    alert("Debes ingresar una cantidad");
  } else if (parseInt(stock_disponible.innerHTML) < parseInt(cantidad)) {
    alert(
      "No hay Stock disponible, solo quedan: " +
        stock_disponible.innerHTML +
        " unidades"
    );
  } else if (control) {
    for (let i = 0; i < carrito.length; i++) {
      if (productos_select.value == carrito[i].firstChild.className) {
        total = cantidad * parseInt(productos[pro_sel].precio);
        total_final = total_final + total;
        carrito[i].childNodes[4].innerText =
          parseInt(carrito[i].childNodes[4].innerText) + parseInt(cantidad);
        cantidad = parseInt(carrito[i].childNodes[4].innerText);
        carrito[i].childNodes[5].innerText =
          cantidad * parseInt(productos[pro_sel].precio);
        document.querySelector("#total_final").innerHTML =
          total_final + ",00 €";

        stock =
          stock_disponible.innerHTML -
          document.querySelector("#cantidad").value;
        stock_disponible.innerHTML = stock;

        productos[pro_sel].stock = stock;
        guardar_fihero_productos(productos);
      }
    }
  } else {
    console.log(pro_sel);

    prod_ingresado = productos[pro_sel].id;
    total = cantidad * productos[pro_sel].precio;
    total_final = total_final + total;

    var html = "<tr id='fila" + cont + "' class='filas'>";

    html +=
      "<td class =" +
      productos[pro_sel].id +
      " >" +
      productos[pro_sel].ref +
      "</td>" +
      "<td>" +
      productos[pro_sel].descripcion +
      "</td>" +
      "<td>" +
      productos[pro_sel].familia +
      "</td>" +
      "<td>" +
      productos[pro_sel].precio +
      "</td>" +
      "<td class ='cantidad' >" +
      cantidad +
      "</td>" +
      "<td class ='total'>" +
      total +
      "</td>" +
      "<td><a href ='#' onclick='eliminar_fila(" +
      productos[pro_sel].id +
      "," +
      cont +
      ")' >Eliminar</a></td></tr>";

    html += "</tr>";
    document.querySelector("#contenido_ventas").innerHTML += html;
    cont++;
    document.querySelector("#total_final").innerHTML = total_final + ",00 €";

    stock = stock_disponible.innerHTML - cantidad;
    stock_disponible.innerHTML = stock;

    productos[pro_sel].stock = stock;
    guardar_fihero_productos(productos);

    sel_producto.classList.remove("disabledbutton");
    control = false;
  }
});

btn_pro_borrar.addEventListener("click", function () {
  var eliminar = confirm("¿Seguro que quieres borrar la tabla?");
  if (eliminar) {
    var filas = document.querySelectorAll(".filas");
    for (var i = 0; i < filas.length; i++) {
      let e = buscar_registro_pro(productos, productos[i].ref);
      productos[e].stock =
        productos[e].stock + parseInt(filas[i].childNodes[4].innerText);
    }
    guardar_fihero_productos(productos);
    productos_select.selectedIndex = 0;
    stock_disponible.innerHTML = "-";
    vaciar_carrito();
  }
});

btn_pro_guardar.addEventListener("click", function () {
  var cont_id = 0;

  if (ventas == null || ventas.length == 0) {
    ventas = [];
    id_venta = ventas.length;
    var carrito = document.querySelectorAll(".filas");
    var j = buscar_registro(clientes, clientes_select.value);

    let venta =
      '{"id":"' +
      id_venta +
      '","cliente":{"nombre" :"' +
      clientes[j].nombre +
      '","ape" : "' +
      clientes[j].ape +
      '","dni" : "' +
      clientes[j].dni +
      '","f_nac" : "' +
      clientes[j].f_nac +
      '"' +
      ',"email" : "' +
      clientes[j].email +
      '","contraseña" : "' +
      clientes[j].pasw +
      '"},"productos" :[';
    for (let i = 0; i < carrito.length; i++) {
      for (let j = 0; j < productos.length; j++) {
        if (productos[j].id == carrito[i].firstChild.className) {
          venta += "{";
          venta += '"ref":"' + productos[j].ref + '",';
          venta += '"descripcion":"' + productos[j].descripcion + '",';
          venta += '"familia":"' + productos[j].familia + '",';
          venta += '"precio":"' + productos[j].precio + '",';
          venta += '"id":"' + productos[j].id  + '",';
          venta += '"cantidad":"' + carrito[i].childNodes[4].innerText + '",';
          venta +=
            '"total":"' +
            carrito[i].childNodes[4].innerText * productos[j].precio +
            '"';
          venta += "},";
          cont_id++;
        }
      }
    }
    venta = venta.substring(0, venta.length - 1);
    venta += "]}";

    let venta_final = JSON.parse(venta);
    ventas.push(venta_final);

    guardar_ventas(ventas);
    vaciar_carrito();
    cargar_ventas();

    id_venta++;
    total_final = 0;
    cont = 0;
    location.reload();

  } else {
    id_venta = parseInt(ventas[ventas.length - 1].id) + 1;

    var carrito = document.querySelectorAll(".filas");
    var j = buscar_registro(clientes, clientes_select.value);

    let venta =
      '{"id":"' +
      id_venta +
      '","cliente":{"nombre" :"' +
      clientes[j].nombre +
      '","ape" : "' +
      clientes[j].ape +
      '","dni" : "' +
      clientes[j].dni +
      '","f_nac" : "' +
      clientes[j].f_nac +
      '"' +
      ',"email" : "' +
      clientes[j].email +
      '","contraseña" : "' +
      clientes[j].pasw +
      '"},"productos" :[';

    for (let i = 0; i < carrito.length; i++) {
      for (let j = 0; j < productos.length; j++) {
        if (productos[j].id == carrito[i].firstChild.className) {
          venta += "{";
          venta += '"ref":"' + productos[j].ref + '",';
          venta += '"descripcion":"' + productos[j].descripcion + '",';
          venta += '"familia":"' + productos[j].familia + '",';
          venta += '"precio":"' + productos[j].precio + '",';
          venta += '"id":"' + productos[j].id + '",';
          venta += '"cantidad":"' + carrito[i].childNodes[4].innerText + '",';
          venta +=
            '"total":"' +
            carrito[i].childNodes[5].innerText * productos[j].precio +
            '"';
          venta += "},";
          cont_id++;
        }
      }
    }
    venta = venta.substring(0, venta.length - 1);
    venta += "]}";

    let venta_final = JSON.parse(venta);
    ventas.push(venta_final);

    guardar_ventas(ventas);
    vaciar_carrito();
    cargar_ventas();

    id_venta++;
    total_final = 0;
    cont = 0;
    location.reload();

  }
});

btn_vts_recuperar.addEventListener("click", function () {
  var v_id = ventas_select.value;
  id_act = v_id;

  for (let i = 0; i < ventas.length; i++) {
    if (v_id == ventas[i].id) {
      cont = 0;
      vaciar_carrito();

      let cliente_vts = ventas[i].cliente;
      let productos_vts = ventas[i].productos;

      var html_c = " ";

      html_c +=
        "<td>" +
        cliente_vts.nombre +
        "</td>" +
        "<td>" +
        cliente_vts.ape +
        "</td>" +
        "<td>" +
        cliente_vts.dni +
        "</td>" +
        "<td>" +
        cliente_vts.f_nac +
        "</td>" +
        "<td>" +
        cliente_vts.email +
        "</td>";

      document.querySelector("#cli_ventas").innerHTML = html_c;

      total_final = 0;
      productos_vts.forEach((prod) => {
        var html = "<tr id='fila" + cont + "' class='filas'>";
        html +=
          "<td class =" +
          prod.id +
          ">" +
          prod.ref +
          "</td>" +
          "<td>" +
          prod.descripcion +
          "</td>" +
          "<td>" +
          prod.familia +
          "</td>" +
          "<td>" +
          prod.precio +
          "</td>" +
          "<td class ='cantidad'>" +
          prod.cantidad +
          "</td>" +
          "<td class ='total'>" +
          prod.precio * prod.cantidad +
          "</td>" +
          "<td><a href ='#' onclick='eliminar_fila(" +
          prod.id +
          "," +
          cont +
          ")' >Eliminar</a></td></tr>";

        html += "</tr>";
        total_final = parseInt(total_final + prod.precio * prod.cantidad);
        document.querySelector("#contenido_ventas").innerHTML += html;
        document.querySelector("#total_final").innerHTML =
          total_final + ",00 €";
        cont++;
      });

      sel_producto.classList.remove("disabledbutton");
      btn_vts_borrar.classList.remove("disabledbutton");
      btn_vts_actualizar.classList.remove("disabledbutton");
    }
  }
});

btn_vts_borrar.addEventListener("click", function () {
  var v_id = ventas_select.value;
  var filas = document.querySelectorAll(".filas");
  for (var i = 0; i < filas.length; i++) {
    var e = buscar_registro_pro(
      productos,
      parseInt(filas[i].firstChild.className)
    );
    productos[e].stock =
      productos[e].stock + parseInt(filas[i].childNodes[4].innerText);
    lista_productos = productos;
    guardar_fihero_productos(productos);
  }

  eliminar_registro(ventas, v_id);

  guardar_ventas(ventas);
  vaciar_carrito();
  cargar_ventas();
  btn_vts_borrar.classList.add("disabledbutton");
  btn_vts_actualizar.classList.add("disabledbutton");
  location.reload();
});

btn_vts_actualizar.addEventListener("click", function () {
  var carrito = document.querySelectorAll(".filas");
  var j = buscar_registro(clientes, clientes_select.value);
  var cont_id = 0;

  let venta =
    '{"id":"' +
    id_act +
    '","cliente":{"nombre" :"' +
    clientes[j].nombre +
    '","ape" : "' +
    clientes[j].ape +
    '","dni" : "' +
    clientes[j].dni +
    '","f_nac" : "' +
    clientes[j].f_nac +
    '"' +
    ',"email" : "' +
    clientes[j].email +
    '","contraseña" : "' +
    clientes[j].pasw +
    '"},"productos" :[';

  for (let i = 0; i < carrito.length; i++) {
    for (let j = 0; j < productos.length; j++) {
      if (productos[j].id == carrito[i].firstChild.className) {
        venta += "{";
        venta += '"ref":"' + productos[j].ref + '",';
        venta += '"descripcion":"' + productos[j].descripcion + '",';
        venta += '"familia":"' + productos[j].familia + '",';
        venta += '"precio":"' + productos[j].precio + '",';
        venta += '"id":"' + productos[j].id + '",';
        venta += '"cantidad":"' + carrito[i].childNodes[4].innerText + '",';
        venta +=
          '"total":"' +
          carrito[i].childNodes[4].innerText * productos[j].precio +
          '"';
        venta += "},";
        cont_id++;
      }
    }
  }
  venta = venta.substring(0, venta.length - 1);
  venta += "]}";

  let venta_final = JSON.parse(venta);

  ventas.forEach((v) => {
    if (v.id == id_act) {
      ventas[ventas.indexOf(v)] = venta_final;
    }
  });

  guardar_ventas(ventas);
  vaciar_carrito();
  cargar_ventas();

  btn_vts_borrar.classList.add("disabledbutton");
  btn_vts_actualizar.classList.add("disabledbutton");
  location.reload();
});

productos_select.addEventListener("change", function () {
  if (productos_select.selectedIndex == 0) {
    stock_disponible.innerHTML = "-";
    alert("Escoge un producto");
  } else {
    productos.forEach((p) => {
      if (p.id == productos_select.value) {
        pro_sel = productos.indexOf(p);
      }
    });
    stock_disponible.innerHTML = productos[pro_sel].stock;
  }
});

function cargar_clientes() {
  ajax = new XMLHttpRequest();
  ajax.open("GET", "json/clientes.json", true);
  ajax.send();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      clientes = JSON.parse(this.responseText);
      clientes.forEach((i) => {
        document.querySelector("#clientes_select").innerHTML +=
          "<option value='" +
          i.dni +
          "'>" +
          i.nombre +
          " " +
          i.ape +
          "</option>";
      });
    } else if (this.readyState == 4 && this.status != 200) {
      alert(
        "ha ocurrido un error, consulte la consola del navegador para mas informacion"
      );
      console.log(this.status + ": " + this.statusText);
    }
  };
}

function cargar_productos() {
  ajax = new XMLHttpRequest();
  ajax.open("GET", "json/productos.json", true);
  ajax.send();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      productos = JSON.parse(this.responseText);
      productos.forEach((i) => {
        document.querySelector("#productos_select").innerHTML +=
          "<option value='" + i.id + "'>" + i.ref + "</option>";
      });
    } else if (this.readyState == 4 && this.status != 200) {
      alert(
        "ha ocurrido un error, consulte la consola del navegador para mas informacion"
      );
      console.log(this.status + ": " + this.statusText);
    }
  };
}

function cargar_ventas() {
  ajax = new XMLHttpRequest();
  ajax.open("GET", "json/ventas.json", true);
  ajax.send();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      ventas = JSON.parse(this.responseText);
      document.querySelector("#ventas_select").innerHTML = "";
      if (ventas == null || ventas.length == 0 || ventas == undefined) {
        ventas = [];
      } else {
        var mis_ventas = ventas;
        mis_ventas.forEach((i) => {
          document.querySelector("#ventas_select").innerHTML +=
            "<option value='" + i.id + "'>V#" + i.id + "</option>";
        });
      }
    } else if (this.readyState == 4 && this.status != 200) {
      alert(
        "ha ocurrido un error, consulte la consola del navegador para mas informacion"
      );
      console.log(this.status + ": " + this.statusText);
    }
  };
}

function eliminar_fila(id, id_fila) {
  var filas = document.querySelectorAll(".filas");
  var total = document.querySelectorAll(".total");
  let e = buscar_registro_pro(productos, id);
  for (var i = 0; i < filas.length; i++) {
    if (filas[i].id == "fila" + id_fila) {
      productos_select.selectedIndex = 0;
      stock_disponible.innerHTML = "-";
      var cantidad = document.querySelector("#cantidad").value = "";

      productos[e].stock =
        productos[e].stock + parseInt(filas[i].childNodes[4].innerText);

      guardar_fihero_productos(productos);

      document.getElementById(filas[i].id).remove();
      total_final = total_final - total[i].innerHTML;
      document.querySelector("#total_final").innerHTML = total_final + ",00 €";
    }
  }
}

function guardar_ventas(datos) {
  var str = JSON.stringify(datos);
  ajax2 = new XMLHttpRequest();
  ajax2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("ventas actualizados");
    } else if (this.readyState == 4 && this.status != 200) {
      alert(
        "ha ocurrido un error, consulte la consola del navegador para mas informacion"
      );
      console.log(this.status + ": " + this.statusText);
    }
  };

  ajax2.open("POST", "php/post_vts.php?param=" + str, true);
  ajax2.send(str);
}

function vaciar_carrito() {
  cli_ventas.innerHTML = "";
  contenido_ventas.innerHTML = "";
  document.querySelector("#total_final").innerHTML = "0,00 €";
  sel_producto.className = "disabledbutton selets_car";
}
