'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface DatosSuperifice {
  x: number[][];
  y: number[][];
  z: number[][];
}

interface Props {
  datos?: DatosSuperifice;
  puntoOptimo?: { x_optimo: number; y_optimo: number; valor_optimo: number } | null;
  cargando?: boolean;
  modo?: 'superficie' | 'contorno';
  rangoX?: number;
  rangoY?: number;
}

export default function Plot3D({ datos, puntoOptimo, cargando, modo = 'superficie', rangoX = 10, rangoY = 10 }: Props) {
  const trazas: Plotly.Data[] = [];

  if (datos) {
    if (modo === 'superficie') {
      trazas.push({
        type: 'surface',
        x: datos.x,
        y: datos.y,
        z: datos.z,
        colorscale: 'Viridis',
        name: 'R(x, y)',
      });
    } else {
      trazas.push({
        type: 'contour',
        x: datos.x[0],
        y: datos.y.map(row => row[0]),
        z: datos.z,
        colorscale: 'Viridis',
        name: 'R(x, y) Curvas de Nivel',
      });
    }
  }

  let optimoExcedeLimites = false;

  if (puntoOptimo) {
    if (puntoOptimo.x_optimo > rangoX || puntoOptimo.y_optimo > rangoY) {
      optimoExcedeLimites = true;
    }

    if (!optimoExcedeLimites) {
      if (modo === 'superficie') {
        trazas.push({
          type: 'scatter3d',
          x: [puntoOptimo.x_optimo],
          y: [puntoOptimo.y_optimo],
          z: [puntoOptimo.valor_optimo],
          mode: 'markers',
          marker: { size: 8, color: 'red', symbol: 'diamond' },
          name: 'Punto óptimo',
        } as Plotly.Data);
      } else {
        trazas.push({
          type: 'scatter',
          x: [puntoOptimo.x_optimo],
          y: [puntoOptimo.y_optimo],
          mode: 'markers',
          marker: { size: 12, color: 'red', symbol: 'diamond' },
          name: 'Punto óptimo',
        } as Plotly.Data);
      }
    }
  }

  return (
    <div className="relative w-full h-full">
      {optimoExcedeLimites && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-lg text-sm font-semibold shadow-md whitespace-nowrap">
          Aviso: El óptimo económico excede el rango de tolerancia biológica del cultivo
        </div>
      )}
      {cargando && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-xl">
          <span className="text-sm text-muted-foreground">Cargando superficie...</span>
        </div>
      )}
      <Plot
        data={trazas.length > 0 ? trazas : [
          {
            type: modo === 'superficie' ? 'surface' : 'contour',
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
          margin: { l: 60, r: 40, t: 40, b: 60 },
          xaxis: { title: 'x (recurso 1)' },
          yaxis: { title: 'y (recurso 2)' },
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
