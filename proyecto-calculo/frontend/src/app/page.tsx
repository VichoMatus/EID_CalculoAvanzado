'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Plot3D from '@/components/Plot3D';
import { calculate, getSurface, optimize, optimizeBudget, getEscenarios, saveEscenario, deleteEscenario } from '@/lib/api';

interface EscenarioData {
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

interface ResultadoCalculo {
  resultado: number;
  partial_x: number;
  partial_y: number;
  gradiente: [number, number];
  magnitud: number;
  derivada_direccional: number;
  aproximacion_tangente: number;
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

// Custom Hook para Debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function Home() {
  // Coordenadas del punto a evaluar
  const [valorX, setValorX] = useState<string>('1');
  const [valorY, setValorY] = useState<string>('1');

  // Dirección u y punto a evaluar linealización
  const [vectorUx, setVectorUx] = useState<string>('1');
  const [vectorUy, setVectorUy] = useState<string>('0');
  const [evalX, setEvalX] = useState<string>('1.1');
  const [evalY, setEvalY] = useState<string>('1.1');

  // Modo de vista del gráfico
  const [modoVista, setModoVista] = useState<'superficie' | 'contorno'>('superficie');

  // Constantes del modelo
  const [constA, setConstA] = useState<string>('2');
  const [constB, setConstB] = useState<string>('2');
  const [constC, setConstC] = useState<string>('0.5');
  const [constD, setConstD] = useState<string>('0.5');

  // Rango de la superficie
  const [rangoX, setRangoX] = useState<number>(10);
  const [rangoY, setRangoY] = useState<number>(10);

  // Valores con Debounce (retraso) para evitar sobrecargar el backend al mover sliders
  const debouncedRangoX = useDebounce(rangoX, 500);
  const debouncedRangoY = useDebounce(rangoY, 500);
  const debouncedA = useDebounce(constA, 500);
  const debouncedB = useDebounce(constB, 500);
  const debouncedC = useDebounce(constC, 500);
  const debouncedD = useDebounce(constD, 500);

  // Optimización con Presupuesto
  const [conPresupuesto, setConPresupuesto] = useState(false);
  const [costoX, setCostoX] = useState<string>('1');
  const [costoY, setCostoY] = useState<string>('1');
  const [presupuesto, setPresupuesto] = useState<string>('10');

  // Resultados
  const [resultadoCalculo, setResultadoCalculo] = useState<ResultadoCalculo | null>(null);
  const [resultadoOptimo, setResultadoOptimo] = useState<ResultadoOptimo | null>(null);
  const [datosSuperficie, setDatosSuperficie] = useState<DatosSuperficie | null>(null);

  // Estados de carga y error
  const [cargandoCalculo, setCargandoCalculo] = useState(false);
  const [cargandoSuperficie, setCargandoSuperficie] = useState(false);
  const [cargandoOptimo, setCargandoOptimo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Escenarios desde la DB
  const [escenarios, setEscenarios] = useState<EscenarioData[]>([]);
  const [cargandoEscenarios, setCargandoEscenarios] = useState(false);

  const parametrosModelo = {
    a: parseFloat(constA) || 2,
    b: parseFloat(constB) || 2,
    c: parseFloat(constC) || 0.5,
    d: parseFloat(constD) || 0.5,
  };

  // Cargar superficie automáticamente cuando cambian constantes o rango (usando los debounced)
  const cargarSuperficie = useCallback(async () => {
    setCargandoSuperficie(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        a: String(parseFloat(debouncedA) || 2),
        b: String(parseFloat(debouncedB) || 2),
        c: String(parseFloat(debouncedC) || 0.5),
        d: String(parseFloat(debouncedD) || 0.5),
        rango_x: String(debouncedRangoX),
        rango_y: String(debouncedRangoY),
        puntos: '40',
      });
      const datos = await getSurface(params.toString());
      setDatosSuperficie(datos);
    } catch {
      setError('Error al cargar la superficie. Verifica que el backend esté activo.');
    } finally {
      setCargandoSuperficie(false);
    }
  }, [debouncedA, debouncedB, debouncedC, debouncedD, debouncedRangoX, debouncedRangoY]);

  const cargarEscenarios = useCallback(async () => {
    try {
      const data = await getEscenarios();
      setEscenarios(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    cargarSuperficie();
  }, [cargarSuperficie]);

  useEffect(() => {
    cargarEscenarios();
  }, [cargarEscenarios]);

  const handleCalcular = async () => {
    setError(null);
    setCargandoCalculo(true);
    try {
      const datos = await calculate(
        parseFloat(valorX) || 0,
        parseFloat(valorY) || 0,
        parametrosModelo,
        parseFloat(vectorUx) || 0,
        parseFloat(vectorUy) || 0,
        parseFloat(evalX) || 0,
        parseFloat(evalY) || 0,
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
      let datos;
      if (conPresupuesto) {
        datos = await optimizeBudget(
          parametrosModelo,
          parseFloat(costoX) || 1,
          parseFloat(costoY) || 1,
          parseFloat(presupuesto) || 10
        );
      } else {
        datos = await optimize(parametrosModelo);
      }
      setResultadoOptimo(datos);
    } catch {
      setError('Error al optimizar.');
    } finally {
      setCargandoOptimo(false);
    }
  };

  const handleGuardarEscenario = async () => {
    if (!resultadoCalculo) return;
    setCargandoEscenarios(true);
    try {
      await saveEscenario({
        x: parseFloat(valorX) || 0,
        y: parseFloat(valorY) || 0,
        a: parametrosModelo.a,
        b: parametrosModelo.b,
        c: parametrosModelo.c,
        d: parametrosModelo.d,
        rendimiento: resultadoCalculo.resultado,
        partial_x: resultadoCalculo.partial_x,
        partial_y: resultadoCalculo.partial_y,
      });
      await cargarEscenarios();
    } catch (err) {
      setError('Error al guardar el escenario en la base de datos.');
    } finally {
      setCargandoEscenarios(false);
    }
  };

  const handleEliminarEscenario = async (id: number) => {
    setCargandoEscenarios(true);
    try {
      await deleteEscenario(id);
      await cargarEscenarios();
    } catch (err) {
      setError('Error al eliminar el escenario.');
    } finally {
      setCargandoEscenarios(false);
    }
  };

  const handleExportarCSV = () => {
    if (escenarios.length === 0) return;
    const headers = ['id', 'x (Agua)', 'y (Fertilizante)', 'a', 'b', 'c', 'd', 'Rendimiento', 'Derivada x', 'Derivada y'];
    const rows = escenarios.map(e => [
      e.id, e.x, e.y, e.a, e.b, e.c, e.d, e.rendimiento, e.partial_x, e.partial_y
    ]);
    const csvContent = [headers.join(',')]
      .concat(rows.map(row => row.join(',')))
      .join('\\n');
      
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'escenarios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-6">
      {/* Premium Header */}
      <header className="flex flex-col items-center justify-center space-y-2 py-4 border-b border-emerald-900/10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gradient">
          OptiAgro
        </h1>
        <p className="text-emerald-900/70 font-medium text-lg text-center max-w-2xl">
          Modelo Matemático de Rendimiento Agrícola y Optimización de Recursos
        </p>
      </header>

      <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Panel izquierdo: parámetros y resultados */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Constantes del modelo */}
          <Card className="glass-card">
            <CardHeader className="border-b border-emerald-900/5 pb-4 mb-4">
              <CardTitle className="text-emerald-950">Constantes del modelo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'constA', label: 'a', valor: constA, setter: setConstA },
                  { id: 'constB', label: 'b', valor: constB, setter: setConstB },
                  { id: 'constC', label: 'c', valor: constC, setter: setConstC },
                  { id: 'constD', label: 'd', valor: constD, setter: setConstD },
                ].map(({ id, label, valor, setter }) => (
                  <div key={id} className="space-y-1">
                    <Label htmlFor={id} className="text-emerald-900">{label}</Label>
                    <Input
                      id={id}
                      type="number"
                      step="0.1"
                      value={valor}
                      onChange={(e) => setter(e.target.value)}
                      className="transition-all hover:border-emerald-400 focus:border-emerald-600 focus:ring-emerald-600/20"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-2">
                <Label className="text-emerald-900 font-semibold">Rango X (Agua): {rangoX}</Label>
                <Slider
                  value={[rangoX]}
                  min={2}
                  max={50}
                  step={1}
                  onValueChange={(val: any) => setRangoX(Array.isArray(val) ? val[0] : val)}
                  className="py-2"
                />
              </div>
              <div className="space-y-2 pt-2">
                <Label className="text-emerald-900 font-semibold">Rango Y (Fertilizante): {rangoY}</Label>
                <Slider
                  value={[rangoY]}
                  min={2}
                  max={50}
                  step={1}
                  onValueChange={(val: any) => setRangoY(Array.isArray(val) ? val[0] : val)}
                  className="py-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Punto a evaluar */}
          <Card className="glass-card">
            <CardHeader className="border-b border-emerald-900/5 pb-4 mb-4">
              <CardTitle className="text-emerald-950">Evaluar punto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="valorX" className="text-emerald-900">x</Label>
                  <Input id="valorX" type="number" step="0.1" value={valorX} onChange={(e) => setValorX(e.target.value)} className="transition-all hover:border-emerald-400" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="valorY" className="text-emerald-900">y</Label>
                  <Input id="valorY" type="number" step="0.1" value={valorY} onChange={(e) => setValorY(e.target.value)} className="transition-all hover:border-emerald-400" />
                </div>
              </div>
            {/* Nuevos campos para derivadas direccionales y plano tangente */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="vectorUx" className="text-emerald-900">Vector u (x)</Label>
                  <Input id="vectorUx" type="number" step="0.1" value={vectorUx} onChange={(e) => setVectorUx(e.target.value)} className="transition-all hover:border-emerald-400" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="vectorUy" className="text-emerald-900">Vector u (y)</Label>
                  <Input id="vectorUy" type="number" step="0.1" value={vectorUy} onChange={(e) => setVectorUy(e.target.value)} className="transition-all hover:border-emerald-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="evalX" className="text-emerald-900">Eval. linealización (x)</Label>
                  <Input id="evalX" type="number" step="0.1" value={evalX} onChange={(e) => setEvalX(e.target.value)} className="transition-all hover:border-emerald-400" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="evalY" className="text-emerald-900">Eval. linealización (y)</Label>
                  <Input id="evalY" type="number" step="0.1" value={evalY} onChange={(e) => setEvalY(e.target.value)} className="transition-all hover:border-emerald-400" />
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-primary border-none py-6 text-base font-semibold" onClick={handleCalcular} disabled={cargandoCalculo}>
                {cargandoCalculo ? 'Calculando...' : 'Calcular Rendimiento'}
              </Button>
            </CardContent>
          </Card>

          {/* Resultados del cálculo */}
          {resultadoCalculo && (
            <Card className="glass-card border-emerald-500/30 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-400"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-950">Resultados Analíticos</CardTitle>
              </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">R(x, y)</span>
                <span className="font-mono font-semibold">{resultadoCalculo.resultado.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">∂R/∂x</span>
                <span className="font-mono">{resultadoCalculo.partial_x.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">∂R/∂y</span>
                <span className="font-mono">{resultadoCalculo.partial_y.toFixed(6)}</span>
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
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-muted-foreground">D_u R(x,y)</span>
                <span className="font-mono">{resultadoCalculo.derivada_direccional.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plano Tangente (L)</span>
                <span className="font-mono">{resultadoCalculo.aproximacion_tangente.toFixed(6)}</span>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button 
                variant="secondary" 
                className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-200 transition-all shadow-sm font-semibold" 
                onClick={handleGuardarEscenario}
                disabled={cargandoEscenarios}
              >
                {cargandoEscenarios ? 'Guardando...' : 'Guardar Escenario en BD'}
              </Button>
            </div>
          </Card>
        )}

        {/* Optimización */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-emerald-900/5 mb-4">
            <CardTitle className="text-emerald-950">Optimización</CardTitle>
            <Button 
              size="sm" 
              variant={conPresupuesto ? 'default' : 'outline'}
              onClick={() => setConPresupuesto(!conPresupuesto)}
              className={conPresupuesto ? 'bg-amber-500 hover:bg-amber-600 text-white border-none' : 'text-emerald-900 border-emerald-200 hover:bg-emerald-50'}
            >
              Restricción Presupuestaria
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {conPresupuesto && (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="costoX" className="text-emerald-900">Costo x ($C_x$)</Label>
                  <Input id="costoX" type="number" value={costoX} onChange={(e) => setCostoX(e.target.value)} className="focus:border-amber-500 focus:ring-amber-500/20" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="costoY" className="text-emerald-900">Costo y ($C_y$)</Label>
                  <Input id="costoY" type="number" value={costoY} onChange={(e) => setCostoY(e.target.value)} className="focus:border-amber-500 focus:ring-amber-500/20" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="presupuesto" className="text-emerald-900">Ppto ($B$)</Label>
                  <Input id="presupuesto" type="number" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} className="focus:border-amber-500 focus:ring-amber-500/20" />
                </div>
              </div>
            )}
            <Button
              className="w-full bg-gradient-primary border-none font-semibold"
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
      <Card className="lg:col-span-2 glass-card h-fit sticky top-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-emerald-900/5 mb-2">
          <CardTitle className="text-emerald-950">Visualización Topográfica</CardTitle>
          <div className="flex gap-2 bg-emerald-50 p-1 rounded-lg border border-emerald-100">
            <Button 
              size="sm" 
              variant={modoVista === 'superficie' ? 'default' : 'ghost'}
              onClick={() => setModoVista('superficie')}
              className={modoVista === 'superficie' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/50'}
            >
              Superficie 3D
            </Button>
            <Button 
              size="sm" 
              variant={modoVista === 'contorno' ? 'default' : 'ghost'}
              onClick={() => setModoVista('contorno')}
              className={modoVista === 'contorno' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/50'}
            >
              Curvas de Nivel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-[650px] p-2">
          <Plot3D
            datos={datosSuperficie ?? undefined}
            puntoOptimo={resultadoOptimo}
            cargando={cargandoSuperficie}
            modo={modoVista}
          />
        </CardContent>
      </Card>

      {/* Panel Inferior: Tabla de Escenarios (ocupa 3 columnas) */}
      <Card className="lg:col-span-3 glass-card border-emerald-500/20">
        <CardHeader className="flex flex-row items-center justify-between border-b border-emerald-900/5 pb-4 mb-4">
          <CardTitle className="text-emerald-950">Historial de Escenarios</CardTitle>
          <Button variant="outline" onClick={handleExportarCSV} disabled={escenarios.length === 0} className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
            Descargar CSV
          </Button>
        </CardHeader>
        <CardContent>
          {escenarios.length === 0 ? (
            <p className="text-sm text-emerald-900/60 italic text-center py-8">No hay escenarios guardados. Calcula un rendimiento y guárdalo para comparar.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-emerald-900/10">
              <table className="w-full text-sm text-left">
                <thead className="bg-emerald-50/50 text-emerald-900 border-b border-emerald-900/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Agua (x)</th>
                    <th className="px-6 py-4 font-semibold">Fertilizante (y)</th>
                    <th className="px-6 py-4 font-semibold text-emerald-900/60">Params (a,b,c,d)</th>
                    <th className="px-6 py-4 font-bold text-emerald-950">Rendimiento Máx</th>
                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/5 bg-white/40">
                  {escenarios.map((e) => (
                    <tr key={e.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-6 py-4 font-mono text-emerald-900/60">#{e.id}</td>
                      <td className="px-6 py-4 font-medium">{e.x}</td>
                      <td className="px-6 py-4 font-medium">{e.y}</td>
                      <td className="px-6 py-4 text-emerald-900/60">
                        {e.a}, {e.b}, {e.c}, {e.d}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 border border-emerald-200 shadow-sm">
                          {e.rendimiento.toFixed(4)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEliminarEscenario(e.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      </main>
    </div>
  );
}
