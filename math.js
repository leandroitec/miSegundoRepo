function sumar(a, b) {
  return a + b;
}

function restar(a, b) {
  return a - b;
}

function multiplicar(a, b) {
  return a * b;
}

// Exportamos para poder usarlos en otros archivos si hace falta
module.exports = { sumar, restar, multiplicar };
