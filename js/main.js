function eliminar_registro(arreglo, id) {
  var elemeto_borrado = arreglo.findIndex(function (el) {
    return el.id === id;
  });
  arreglo.splice(elemeto_borrado, 1);
}

function buscar_registro(arreglo, id) {
  var elemeto_buscado = arreglo.findIndex(function (el) {
    if (isNaN(id)) {
      return el.dni === id;
    } else {
      return el.id === id;
    }
  });
  return elemeto_buscado;
}

function buscar_registro_pro(arreglo, id) {
  var elemeto_buscado = arreglo.findIndex(function (el) {
    if (isNaN(id)) {
      return el.ref === id;
    } else {
      return el.id === id;
    }
  });
  return elemeto_buscado;
}

function guardar_fihero_clientes(datos) {
  var str = JSON.stringify(datos);
  ajax2 = new XMLHttpRequest();
  ajax2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("clientes actualizados");
    } else if (this.readyState == 4 && this.status != 200) {
      alert(
        "ha ocurrido un error, consulte la consola del navegador para mas informacion"
      );
      console.log(this.status + ": " + this.statusText);
    }
  };

  ajax2.open("POST", "php/post.php?param=" + str, true);
  ajax2.send(str);
}

function guardar_fihero_productos(datos) {
  var str = JSON.stringify(datos);
  ajax2 = new XMLHttpRequest();

  ajax2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //window.location.reload();
      console.log("productos actualizados");
    } else if (this.readyState == 4 && this.status != 200) {
      alert(
        "ha ocurrido un error, consulte la consola del navegador para mas informacion"
      );
      console.log(this.status + ": " + this.statusText);
    }
  };

  ajax2.open("POST", "php/post_pro.php?param=" + str, true);
  ajax2.send(str);
}
