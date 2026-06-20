'use client';

import React from 'react';
import Plot from 'react-plotly.js';

interface DatosSuperifice {
  x: number[][];
  y: number[][];
  z: number[][];
}

interface Props {
  datos?: DatosSuperifice;
  puntoOptimo?: { x_optimo: number; y_optimo: number; valor_optimo: number } | null;
  cargando?: boolean;
}

export default function Plot3D({ datos, puntoOptimo, cargando }: Props) {
  const trazas: Plotly.Data[] = [];

  if (datos) {
    trazas.push({
      type: 'surface',
      x: datos.x,
      y: datos.y,
      z: datos.z,
      colorscale: 'Viridis',
      name: 'R(x, y)',
    });
  }

  if (puntoOptimo) {
    trazas.push({
      type: 'scatter3d',
      x: [puntoOptimo.x_optimo],
      y: [puntoOptimo.y_optimo],
      z: [puntoOptimo.valor_optimo],
      mode: 'markers',
      marker: { size: 8, color: 'red', symbol: 'diamond' },
      name: 'Punto óptimo',
    } as Plotly.Data);
  }

  return (
    <div className="relative w-full h-full">
      {cargando && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-xl">
          <span className="text-sm text-muted-foreground">Cargando superficie...</span>
        </div>
      )}
      <Plot
        data={trazas.length > 0 ? trazas : [
          {
            type: 'surface',
            x: [[0]],
            y: [[0]],
            z: [[0]],
            colorscale: 'Viridis',
            showscale: false,
          },
        ]}
        layout={{
          title: { text: 'R(x, y) — Superficie de rendimiento', font: { size: 14 } },
          autosize: true,
          margin: { l: 0, r: 0, t: 40, b: 0 },
          scene: {
            xaxis: { title: 'x (recurso 1)' },
            yaxis: { title: 'y (recurso 2)' },
            zaxis: { title: 'R(x, y)' },
          },
          legend: { x: 0, y: 1 },
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
        config={{ responsive: true }}
      />
    </div>
  );
}
