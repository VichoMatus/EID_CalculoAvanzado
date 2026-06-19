'use client';

import React from 'react';
import Plot from 'react-plotly.js';

export default function Plot3D() {
  return (
    <Plot
      data={[
        {
          type: 'surface',
          x: [-2, -1, 0, 1, 2],
          y: [-2, -1, 0, 1, 2],
          z: [
            [4, 2, 0, 2, 4],
            [2, 1, 0, 1, 2],
            [0, 0, 0, 0, 0],
            [2, 1, 0, 1, 2],
            [4, 2, 0, 2, 4],
          ],
          colorscale: 'Viridis',
        },
      ]}
      layout={{
        title: 'R(x, y)',
        autosize: true,
        scene: {
          xaxis: { title: 'x' },
          yaxis: { title: 'y' },
          zaxis: { title: 'R(x, y)' },
        },
      }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  );
}
