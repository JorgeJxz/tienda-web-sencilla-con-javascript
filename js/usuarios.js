var btn_r = document.querySelector("#btn_registro");
var btn_m = document.querySelector("#btn_modificar");

var form_registro = document.querySelector("#form_registro");
var f = form_registro.elements;
var dni_existente;
var modificar = false;

var lista_clientes = [];
var cont = 0;
var tiempo_sesion = 0;

var exp_dni = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
var exp_fecha = /^\d{4}[-]\d{2}[-]\d{2}$/;
var exp_email = /^(.+\@.+\..+)$/;

var id_cliente;

window.addEventListener("load", function () {
  cargar_clientes();
  limpiar_formulario();
  if(document.cookie == ""){
        alert("Tienes 30 minutos para usar la aplicación")
        var now = new Date();
        var minutes = 30;
        now.setTime(now.getTime() + (minutes * 60 * 1000));
        cookievalue =  "sesion;"
        document.cookie="name=" + cookievalue + ";expires=" + now.toUTCString() + ";";
        setInterval(tiempo,1000);
    }
});

btn_r.addEventListener("click", function () {
  if (validacion_cliente() == true) {
    cliente_nuevo(
      f["nombre"].value,
      f["ape"].value,
      f["dni"].value,
      f["f_nac"].value,
      f["email"].value,
      f["pasw"].value,
      cont
    );
    cargar_clientes();
    limpiar_formulario();
    location.reload();
  } else {
    alert("Rellena bien el formulario");
  }
});

btn_m.addEventListener("click", function () {
  modificar = true;
  if (validacion_cliente() == true) {
    var e = buscar_registro(lista_clientes, id_cliente);

    lista_clientes[e].nombre = f["nombre"].value;
    lista_clientes[e].ape = f["ape"].value;
    lista_clientes[e].dni = f["dni"].value;
    lista_clientes[e].f_nac = f["f_nac"].value;
    lista_clientes[e].email = f["email"].value;
    lista_clientes[e].pasw = f["pasw"].value;
    id_cliente = undefined;

    guardar_fihero_clientes(lista_clientes);
    cargar_clientes();
    limpiar_formulario();
    location.reload();

  } else {
    alert("Rellena bien el formulario");
  }
  modificar = false;

});


function cliente_nuevo(nom, ape, dni, f_nac, email, pasw) {
  cont = lista_clientes.length;
  var cliente = {
    nombre: nom,
    ape: ape,
    dni: dni,
    f_nac: f_nac,
    email: email,
    pasw: pasw,
    id: cont,
  };
  lista_clientes.push(cliente);
  guardar_fihero_clientes(lista_clientes);
}

function imprimir_tabla_clientes() {
  var lista = lista_clientes;
  if (lista == null) {
    lista = lista_clientes;
    var html = "<table>";

    for (var i = 0; i < lista.length; i++) {
      html +=
        "<tr><td>" +
        lista[i].nombre +
        "</td>" +
        "<td>" +
        lista[i].ape +
        "</td>" +
        "<td>" +
        lista[i].dni +
        "</td>" +
        "<td>" +
        lista[i].f_nac +
        "</td>" +
        "<td>" +
        lista[i].email +
        "</td>" +
        "<td><a href ='#' onclick='cargar_datos_cliente(" +
        lista[i].id +
        ")' >Editar</a></td>" +
        "<td><a href ='#' onclick='eliminar_cliente(" +
        lista[i].id +
        ")' >Eliminar</a></td></tr>";
    }
    html += "</table>";

    document.getElementById("contenido").innerHTML = html;
  } else {
    var html = "<table>";

    for (var i = 0; i < lista.length; i++) {
      html +=
        "<tr><td>" +
        lista[i].nombre +
        "</td>" +
        "<td>" +
        lista[i].ape +
        "</td>" +
        "<td>" +
        lista[i].dni +
        "</td>" +
        "<td>" +
        lista[i].f_nac +
        "</td>" +
        "<td>" +
        lista[i].email +
        "</td>" +
        "<td><a href ='#' onclick='cargar_datos_cliente(" +
        lista[i].id +
        ")' >Editar</a></td>" +
        "<td><a href ='#' onclick='eliminar_cliente(" +
        lista[i].id +
        ")' >Eliminar</a></td></tr>";
    }
    html += "</table>";

    document.getElementById("contenido").innerHTML = html;
  }
}

function cargar_datos_cliente(id) {
  var e = buscar_registro(lista_clientes, id);
  dni_existente = lista_clientes[e].dni;

  f["nombre"].value = lista_clientes[e].nombre;
  f["ape"].value = lista_clientes[e].ape;
  f["dni"].value = lista_clientes[e].dni;
  f["f_nac"].value = lista_clientes[e].f_nac;
  f["email"].value = lista_clientes[e].email;
  f["pasw"].value = lista_clientes[e].pasw;
  id_cliente = id;
}

function eliminar_cliente(id) {
  eliminar_registro(lista_clientes, id);
  guardar_fihero_clientes(lista_clientes);
  cargar_clientes();
  location.reload();

}

function cargar_clientes() {
  ajax = new XMLHttpRequest();
  ajax.open("GET", "json/clientes.json", true);
  ajax.send();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      lista_clientes = JSON.parse(this.responseText);
      imprimir_tabla_clientes();
    } else if (this.readyState == 4 && this.status != 200) {
      alert(
        "ha ocurrido un error, consulte la consola del navegador para mas informacion"
      );
      console.log(this.status + ": " + this.statusText);
    }
  };
}

function validacion_cliente() {
  var correct = true;
  if (
    f["nombre"].value == null ||
    f["nombre"].value == 0 ||
    /^\s+$/.test(f["nombre"].value)
  ) {
    f["nombre"].className = "invalido";
    correct = false;
  } else {
    f["nombre"].className = " ";
  }
  if (
    f["ape"].value == null ||
    f["ape"].value == 0 ||
    /^\s+$/.test(f["ape"].value)
  ) {
    f["ape"].className = "invalido";
    correct = false;
  } else {
    f["ape"].className = " ";
  }
  if (
    f["dni"].value == null ||
    f["dni"].value == 0 ||
    exp_dni.test(f["dni"].value) == false ||
    comprobarDni()
  ) {
    f["dni"].className = "invalido";
    correct = false;
  } else {
    f["dni"].className = " ";
  }
  if (
    exp_fecha.test(f["f_nac"].value) == false ||
    comprobarFecha(f["f_nac"].value) == false
  ) {
    f["f_nac"].className = "invalido";
    correct = false;
  } else {
    f["f_nac"].className = " ";
  }
  if (
    f["email"].value == null ||
    f["email"].value == 0 ||
    exp_email.test(f["email"].value) == false
  ) {
    f["email"].className = "invalido";
    correct = false;
  } else {
    f["email"].className = " ";
  }
  if (
    f["pasw"].value == null ||
    f["pasw"].value == 0 ||
    /^\s+$/.test(f["pasw"].value) ||
    f["pasw"].value < 8
  ) {
    f["pasw"].className = "invalido";
    correct = false;
  } else {
    f["pasw"].className = " ";
  }

  if (correct) {
    return true;
  }
}

function comprobarFecha(f) {
  let time = Date.now();
  let hoy = new Date(time);
  let fecha_usuario = new Date(f);

  if (hoy >= fecha_usuario) {
    return true;
  } else {
    return false;
  }
}

function comprobarDni() {
  var e = false;
  var c = lista_clientes;
  c.forEach((i) => {
    if (i.dni == dni_existente && modificar) {
      e = false;
    } else if (i.dni == f["dni"].value) {
      e = true;
    }
  });
  return e;
}

function limpiar_formulario() {
  f["nombre"].value = "";
  f["ape"].value = "";
  f["dni"].value = "";
  f["f_nac"].value = "";
  f["email"].value = "";
  f["pasw"].value = "";
}


function tiempo() {
    tiempo_sesion++;
    if (tiempo_sesion == 1500) {
      alert("Te quedan 5 minutos de sesión");
    }
  
    if (document.cookie == "") {
      alert("Has consumido todo tu tiempo de sesión");
    }
  }
  
