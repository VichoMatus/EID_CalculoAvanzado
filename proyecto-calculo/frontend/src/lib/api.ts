const BASE_URL = 'http://localhost:5000/api';

interface ParametrosModelo {
  a: number;
  b: number;
  c: number;
  d: number;
}

export async function calculate(
  x: number,
  y: number,
  parametros: ParametrosModelo,
) {
  const respuesta = await fetch(`${BASE_URL}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x, y, ...parametros }),
  });
  if (!respuesta.ok) throw new Error('Error en /calculate');
  return respuesta.json();
}

export async function getSurface(queryParams: string) {
  const respuesta = await fetch(`${BASE_URL}/surface?${queryParams}`);
  if (!respuesta.ok) throw new Error('Error en /surface');
  return respuesta.json();
}

export async function optimize(parametros: ParametrosModelo) {
  const respuesta = await fetch(`${BASE_URL}/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parametros),
  });
  if (!respuesta.ok) throw new Error('Error en /optimize');
  return respuesta.json();
}