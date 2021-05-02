var btn_r_pro = document.querySelector("#btn_registro_pro");
var btn_m_pro = document.querySelector("#btn_modificar_pro");

var form_registro_pro = document.querySelector("#form_registro_pro");
var f = form_registro_pro.elements;

var lista_productos = [];
var cont = 0;
var id_producto;
var modificar = false;
var ref_existente;

var producto_prueba = {
  ref: "Xbox Series X",
  descripcion: "La consola mas potente del mercado",
  familia: "Videojuegos",
  precio: "499",
  stock: "10",
  id: 0,
};

window.addEventListener("load", function () {
  cargar_productos();
  limpiar_formulario_productos();
});

btn_r_pro.addEventListener("click", function () {
  if (validacion_producto() == true) {
    producto_nuevo(
      f["ref"].value,
      f["des"].value,
      f["fam"].value,
      f["pre"].value,
      f["stock"].value,
      cont
    );
    cargar_productos();
    limpiar_formulario_productos();
    location.reload();

  } else {
    alert("Rellena bien el formulario");
  }

});

btn_m_pro.addEventListener("click", function () {
  modificar = true;
  if (validacion_producto() == true) {
    var e = buscar_registro_pro(lista_productos, id_producto);

    lista_productos[e].ref = f["ref"].value;
    lista_productos[e].descripcion = f["des"].value;
    lista_productos[e].precio = f["pre"].value;
    lista_productos[e].familia = f["fam"].value;
    lista_productos[e].stock = f["stock"].value;
    id_producto = undefined;

    guardar_fihero_productos(lista_productos);
    cargar_productos();
    limpiar_formulario_productos();
    location.reload();

  } else {
    alert("Rellena bien el formulario");
  }
  modificar = false;

});

function producto_nuevo(ref, des, fam, pre, st) {
  cont = lista_productos.length;
  var producto = {
    ref: ref,
    descripcion: des,
    familia: fam,
    precio: pre,
    stock: st,
    id: cont,
  };
  lista_productos.push(producto);
  guardar_fihero_productos(lista_productos);
}

function imprimir_tabla_productos() {
  lista = lista_productos;
  if (lista == null) {
    lista = lista_productos;
    var html = "<table>";
    for (var i = 0; i < lista.length; i++) {
      html +=
        "<tr><td>" +
        lista[i].ref +
        "</td>" +
        "<td>" +
        lista[i].descripcion +
        "</td>" +
        "<td>" +
        lista[i].familia +
        "</td>" +
        "<td>" +
        lista[i].precio +
        "</td>" +
        "<td class = 'stock'>" +
        lista[i].stock +
        "</td>" +
        "<td><a href ='#' onclick='modificar_producto(" +
        lista[i].id +
        ")' >Modificar</a></td>" +
        "<td><a href ='#' onclick='eliminar_producto(" +
        lista[i].id +
        ")' >Eliminar</a></td></tr>";
    }
    html += "</table>";

    document.getElementById("contenido_productos").innerHTML = html;
  } else {
    var html = "<table>";
    for (var i = 0; i < lista.length; i++) {
      html +=
        "<tr><td>" +
        lista[i].ref +
        "</td>" +
        "<td>" +
        lista[i].descripcion +
        "</td>" +
        "<td>" +
        lista[i].familia +
        "</td>" +
        "<td>" +
        lista[i].precio +
        "</td>" +
        "<td class = 'stock'>" +
        lista[i].stock +
        "</td>" +
        "<td><a href ='#' onclick='modificar_producto(" +
        lista[i].id +
        ")' >Editar</a></td>" +
        "<td><a href ='#' onclick='eliminar_producto(" +
        lista[i].id +
        ")' >Eliminar</a></td></tr>";
    }
    html += "</table>";

    document.getElementById("contenido_productos").innerHTML = html;
  }
}

function validacion_producto() {
  var correct = true;

  if (
    f["ref"].value == null ||
    f["ref"].value == 0 ||
    /^\s+$/.test(f["ref"].value) ||
    comprobarRef()
  ) {
    f["ref"].className = "invalido";
    correct = false;
  } else {
    f["ref"].className = " ";
  }

  if (
    f["des"].value == null ||
    f["des"].value == 0 ||
    /^\s+$/.test(f["des"].value)
  ) {
    f["des"].className = "invalido";
    correct = false;
  } else {
    f["des"].className = " ";
  }

  if (
    f["fam"].value == null ||
    f["fam"].value == 0 ||
    /^\s+$/.test(f["fam"].value)
  ) {
    f["fam"].className = "invalido";
    correct = false;
  } else {
    f["fam"].className = " ";
  }

  if (f["pre"].value == null || f["pre"].value == 0) {
    f["pre"].className = "invalido";
    correct = false;
  } else {
    f["pre"].className = " ";
  }

  if (f["stock"].value == null || f["stock"].value == 0) {
    f["stock"].className = "invalido";
    correct = false;
  } else {
    f["stock"].className = " ";
  }

  if (correct) {
    return true;
  }
}

function comprobarRef() {
  var e = false;
  var p = lista_productos;

  p.forEach((i) => {
    if (i.ref == ref_existente && modificar) {
      e = false;
    } else if (i.ref == f["ref"].value) {
      e = true;
    }
  });
  return e;
}

function modificar_producto(id) {
  var e = buscar_registro_pro(lista_productos, id);
  ref_existente = lista_productos[e].ref;

  f["ref"].value = lista_productos[e].ref;
  f["des"].value = lista_productos[e].descripcion;
  f["pre"].value = lista_productos[e].precio;
  f["fam"].value = lista_productos[e].familia;
  f["stock"].value = lista_productos[e].stock;
  id_producto = id;
}

function eliminar_producto(id) {
  eliminar_registro(lista_productos, id);
  guardar_fihero_productos(lista_productos);
  cargar_productos();
  location.reload();

}

function limpiar_formulario_productos() {
  f["ref"].value = "";
  f["des"].value = "";
  f["fam"].value = "";
  f["pre"].value = "";
  f["stock"].value = "";
}

function cargar_productos() {
  ajax = new XMLHttpRequest();
  ajax.open("GET", "json/productos.json", true);
  ajax.send();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      lista_productos = JSON.parse(this.responseText);
      imprimir_tabla_productos(lista_productos);
    } else if (this.readyState == 4 && this.status != 200) {
      alert(
        "ha ocurrido un error, consulte la consola del navegador para mas informacion"
      );
      console.log(this.status + ": " + this.statusText);
    }
  };
}
