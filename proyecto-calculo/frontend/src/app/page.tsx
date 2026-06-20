'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Plot3D from '@/components/Plot3D';
import { calculate, getSurface, optimize } from '@/lib/api';

interface ResultadoCalculo {
  resultado: number;
  parcial_x: number;
  parcial_y: number;
  gradiente: [number, number];
  magnitud: number;
}

interface ResultadoOptimo {
  x_optimo: number;
  y_optimo: number;
  valor_optimo: number;
  tipo: string;
}

interface DatosSuperficie {
  x: number[][];
  y: number[][];
  z: number[][];
}

export default function Home() {
  // Coordenadas del punto a evaluar
  const [valorX, setValorX] = useState<string>('1');
  const [valorY, setValorY] = useState<string>('1');

  // Constantes del modelo
  const [constA, setConstA] = useState<string>('2');
  const [constB, setConstB] = useState<string>('2');
  const [constC, setConstC] = useState<string>('0.5');
  const [constD, setConstD] = useState<string>('0.5');

  // Rango de la superficie
  const [rango, setRango] = useState<number>(10);

  // Resultados
  const [resultadoCalculo, setResultadoCalculo] = useState<ResultadoCalculo | null>(null);
  const [resultadoOptimo, setResultadoOptimo] = useState<ResultadoOptimo | null>(null);
  const [datosSuperficie, setDatosSuperficie] = useState<DatosSuperficie | null>(null);

  // Estados de carga y error
  const [cargandoCalculo, setCargandoCalculo] = useState(false);
  const [cargandoSuperficie, setCargandoSuperficie] = useState(false);
  const [cargandoOptimo, setCargandoOptimo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parametrosModelo = {
    a: parseFloat(constA) || 2,
    b: parseFloat(constB) || 2,
    c: parseFloat(constC) || 0.5,
    d: parseFloat(constD) || 0.5,
  };

  // Cargar superficie automáticamente cuando cambian constantes o rango
  const cargarSuperficie = useCallback(async () => {
    setCargandoSuperficie(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        a: String(parametrosModelo.a),
        b: String(parametrosModelo.b),
        c: String(parametrosModelo.c),
        d: String(parametrosModelo.d),
        rango: String(rango),
        puntos: '40',
      });
      const datos = await getSurface(params.toString());
      setDatosSuperficie(datos);
    } catch {
      setError('Error al cargar la superficie. Verifica que el backend esté activo.');
    } finally {
      setCargandoSuperficie(false);
    }
  }, [constA, constB, constC, constD, rango]);

  useEffect(() => {
    cargarSuperficie();
  }, [cargarSuperficie]);

  const handleCalcular = async () => {
    setError(null);
    setCargandoCalculo(true);
    try {
      const datos = await calculate(
        parseFloat(valorX) || 0,
        parseFloat(valorY) || 0,
        parametrosModelo,
      );
      setResultadoCalculo(datos);
    } catch {
      setError('Error al calcular. Verifica los valores ingresados.');
    } finally {
      setCargandoCalculo(false);
    }
  };

  const handleOptimizar = async () => {
    setError(null);
    setCargandoOptimo(true);
    try {
      const datos = await optimize(parametrosModelo);
      setResultadoOptimo(datos);
    } catch {
      setError('Error al optimizar.');
    } finally {
      setCargandoOptimo(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 p-6 lg:grid-cols-3">
      {/* Panel izquierdo: parámetros y resultados */}
      <div className="lg:col-span-1 flex flex-col gap-4">

        {/* Constantes del modelo */}
        <Card>
          <CardHeader>
            <CardTitle>Constantes del modelo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'constA', label: 'a', valor: constA, setter: setConstA },
                { id: 'constB', label: 'b', valor: constB, setter: setConstB },
                { id: 'constC', label: 'c', valor: constC, setter: setConstC },
                { id: 'constD', label: 'd', valor: constD, setter: setConstD },
              ].map(({ id, label, valor, setter }) => (
                <div key={id} className="space-y-1">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type="number"
                    step="0.1"
                    value={valor}
                    onChange={(e) => setter(e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Rango de superficie: {rango}</Label>
              <Slider
                value={[rango]}
                min={2}
                max={50}
                step={1}
                onValueChange={(val) => setRango(val[0])}
              />
            </div>
          </CardContent>
        </Card>

        {/* Punto a evaluar */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluar punto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="valorX">x</Label>
                <Input
                  id="valorX"
                  type="number"
                  step="0.1"
                  value={valorX}
                  onChange={(e) => setValorX(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="valorY">y</Label>
                <Input
                  id="valorY"
                  type="number"
                  step="0.1"
                  value={valorY}
                  onChange={(e) => setValorY(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleCalcular} disabled={cargandoCalculo}>
              {cargandoCalculo ? 'Calculando...' : 'Calcular'}
            </Button>
          </CardContent>
        </Card>

        {/* Resultados del cálculo */}
        {resultadoCalculo && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">R(x, y)</span>
                <span className="font-mono font-semibold">{resultadoCalculo.resultado.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">∂R/∂x</span>
                <span className="font-mono">{resultadoCalculo.parcial_x.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">∂R/∂y</span>
                <span className="font-mono">{resultadoCalculo.parcial_y.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">∇R</span>
                <span className="font-mono">
                  [{resultadoCalculo.gradiente[0].toFixed(4)}, {resultadoCalculo.gradiente[1].toFixed(4)}]
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">‖∇R‖</span>
                <span className="font-mono">{resultadoCalculo.magnitud.toFixed(6)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Optimización */}
        <Card>
          <CardHeader>
            <CardTitle>Optimización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={handleOptimizar}
              disabled={cargandoOptimo}
            >
              {cargandoOptimo ? 'Buscando óptimo...' : 'Encontrar máximo'}
            </Button>
            {resultadoOptimo && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">x óptimo</span>
                  <span className="font-mono font-semibold">{resultadoOptimo.x_optimo.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">y óptimo</span>
                  <span className="font-mono font-semibold">{resultadoOptimo.y_optimo.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">R máximo</span>
                  <span className="font-mono font-semibold">{resultadoOptimo.valor_optimo.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo</span>
                  <span className="capitalize">{resultadoOptimo.tipo}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Panel derecho: gráfico 3D */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Superficie 3D</CardTitle>
        </CardHeader>
        <CardContent className="h-[600px]">
          <Plot3D
            datos={datosSuperficie ?? undefined}
            puntoOptimo={resultadoOptimo}
            cargando={cargandoSuperficie}
          />
        </CardContent>
      </Card>
    </div>
  );
}
