export interface EscenarioData {
  id: number;
  x: number;
  y: number;
  a: number;
  b: number;
  c: number;
  d: number;
  rendimiento: number;
  partial_x: number;
  partial_y: number;
}

export interface ResultadoCalculo {
  resultado: number;
  partial_x: number;
  partial_y: number;
  gradiente: [number, number];
  magnitud: number;
  derivada_direccional: number;
  aproximacion_tangente: number;
}

export interface ResultadoOptimo {
  x_optimo: number;
  y_optimo: number;
  valor_optimo: number;
  tipo: string;
}

export interface DatosSuperficie {
  x: number[][];
  y: number[][];
  z: number[][];
}
