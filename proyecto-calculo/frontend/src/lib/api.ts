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
  u_x: number = 1.0,
  u_y: number = 0.0,
  x_eval: number | null = null,
  y_eval: number | null = null,
) {
  const respuesta = await fetch(`${BASE_URL}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      x, y, ...parametros, 
      u_x, u_y, 
      x_eval: x_eval ?? x, 
      y_eval: y_eval ?? y 
    }),
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

export async function optimizeBudget(parametros: ParametrosModelo, costo_x: number, costo_y: number, presupuesto: number) {
  const respuesta = await fetch(`${BASE_URL}/optimize_budget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...parametros, costo_x, costo_y, presupuesto }),
  });
  if (!respuesta.ok) throw new Error('Error en /optimize_budget');
  return respuesta.json();
}

export async function getEscenarios() {
  const respuesta = await fetch(`${BASE_URL}/escenarios`);
  if (!respuesta.ok) throw new Error('Error al obtener escenarios');
  return respuesta.json();
}

export async function saveEscenario(data: any) {
  const respuesta = await fetch(`${BASE_URL}/escenarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!respuesta.ok) throw new Error('Error al guardar escenario');
  return respuesta.json();
}

export async function deleteEscenario(id: number) {
  const respuesta = await fetch(`${BASE_URL}/escenarios/${id}`, {
    method: 'DELETE',
  });
  if (!respuesta.ok) throw new Error('Error al eliminar escenario');
  return respuesta.json();
}