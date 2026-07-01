'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Plot3D from '@/components/Plot3D';
import { useOptiAgro } from './hooks';

export default function Home() {
  const {
    modoInteractividad,
    setModoInteractividad,
    restaurarCasoBase,
    valorX, setValorX,
    valorY, setValorY,
    vectorUx, setVectorUx,
    vectorUy, setVectorUy,
    evalX, setEvalX,
    evalY, setEvalY,
    modoVista, setModoVista,
    constA, setConstA,
    constB, setConstB,
    constC, setConstC,
    constD, setConstD,
    rangoX, setRangoX,
    rangoY, setRangoY,
    conPresupuesto, setConPresupuesto,
    costoX, setCostoX,
    costoY, setCostoY,
    presupuesto, setPresupuesto,
    resultadoCalculo,
    resultadoOptimo,
    datosSuperficie,
    cargandoCalculo,
    cargandoSuperficie,
    cargandoOptimo,
    error,
    escenarios,
    cargandoEscenarios,
    handleCalcular,
    handleOptimizar,
    handleGuardarEscenario,
    handleEliminarEscenario,
    handleExportarCSV,
  } = useOptiAgro();

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-6">
      {/* Premium Header */}
      <header className="flex flex-col items-center justify-center space-y-2 py-4 border-b border-emerald-900/10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gradient py-2 leading-relaxed overflow-visible">
          OptiAgro
        </h1>
        <p className="text-emerald-900/70 font-medium text-lg text-center max-w-2xl">
          Modelo Matemático de Rendimiento Agrícola y Optimización de Recursos
        </p>
        <Tabs 
          value={modoInteractividad} 
          onValueChange={(val) => {
            setModoInteractividad(val);
            if (val === 'base') restaurarCasoBase();
          }}
          className="w-full max-w-md pt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="base" className="font-semibold text-emerald-900">Modo Caso Base</TabsTrigger>
            <TabsTrigger value="exploracion" className="font-semibold text-emerald-900">Modo Exploración</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Panel izquierdo: parámetros y resultados */}
          {modoInteractividad === 'base' ? (
            <div className="lg:col-span-1 flex flex-col gap-6">
              <Card className="glass-card border-emerald-500/20 shadow-sm">
                <CardHeader className="border-b border-emerald-900/5 pb-4 mb-4 bg-emerald-50/30">
                  <CardTitle className="text-emerald-950 flex items-center gap-2">
                    Resumen del Modelo (Caso Base)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2 text-sm">
                    <h3 className="font-semibold text-emerald-900 border-l-2 border-emerald-500 pl-2">Parámetros Establecidos</h3>
                    <div className="grid grid-cols-2 gap-4 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 mt-2">
                      <div className="flex justify-between"><span className="text-emerald-900/70">a:</span> <span className="font-mono font-medium">{constA}</span></div>
                      <div className="flex justify-between"><span className="text-emerald-900/70">b:</span> <span className="font-mono font-medium">{constB}</span></div>
                      <div className="flex justify-between"><span className="text-emerald-900/70">c:</span> <span className="font-mono font-medium">{constC}</span></div>
                      <div className="flex justify-between"><span className="text-emerald-900/70">d:</span> <span className="font-mono font-medium">{constD}</span></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <h3 className="font-semibold text-emerald-900 border-l-2 border-emerald-500 pl-2">Rangos de Simulación</h3>
                    <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 mt-2 space-y-2">
                      <div className="flex justify-between"><span className="text-emerald-900/70">Agua (x):</span> <span className="font-mono font-medium">[0.1, {rangoX}]</span></div>
                      <div className="flex justify-between"><span className="text-emerald-900/70">Fertilizante (y):</span> <span className="font-mono font-medium">[0.1, {rangoY}]</span></div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <h3 className="font-semibold text-emerald-900 border-l-2 border-emerald-500 pl-2">Punto de Máximo Rendimiento</h3>
                    {cargandoOptimo ? (
                      <div className="p-4 text-center text-emerald-900/60 italic animate-pulse">
                        Calculando punto óptimo...
                      </div>
                    ) : resultadoOptimo ? (
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200 shadow-sm mt-2 space-y-3">
                        <div className="flex justify-between border-b border-emerald-900/5 pb-2">
                          <span className="text-emerald-900/70">x óptimo (Agua)</span>
                          <span className="font-mono font-bold text-emerald-900">{resultadoOptimo.x_optimo.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between border-b border-emerald-900/5 pb-2">
                          <span className="text-emerald-900/70">y óptimo (Fertilizante)</span>
                          <span className="font-mono font-bold text-emerald-900">{resultadoOptimo.y_optimo.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between border-b border-emerald-900/5 pb-2 mt-1">
                          <span className="text-emerald-900 font-semibold">Rendimiento Máximo</span>
                          <span className="font-mono font-bold text-emerald-700 text-lg">{resultadoOptimo.valor_optimo.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between pt-1 items-center">
                          <span className="text-emerald-900/70 text-xs">Naturaleza del punto</span>
                          <span className="capitalize text-emerald-800 font-semibold text-[10px] uppercase tracking-wider bg-emerald-200/50 px-2 py-1 rounded-full border border-emerald-200">{resultadoOptimo.tipo.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-emerald-900/60 text-center p-2">Sin resultados. Revisa la conexión al backend.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Constantes del modelo */}
          <Card className="glass-card">
            <CardHeader className="border-b border-emerald-900/5 pb-4 mb-4">
              <CardTitle className="text-emerald-950">Constantes del modelo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      disabled={modoInteractividad === 'base'}
                      className="transition-all hover:border-emerald-400 focus:border-emerald-600 focus:ring-emerald-600/20 disabled:opacity-60"
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
                  disabled={modoInteractividad === 'base'}
                  onValueChange={(val: any) => setRangoX(Array.isArray(val) ? val[0] : val)}
                  className="py-2 disabled:opacity-60"
                />
              </div>
              <div className="space-y-2 pt-2">
                <Label className="text-emerald-900 font-semibold">Rango Y (Fertilizante): {rangoY}</Label>
                <Slider
                  value={[rangoY]}
                  min={2}
                  max={50}
                  step={1}
                  disabled={modoInteractividad === 'base'}
                  onValueChange={(val: any) => setRangoY(Array.isArray(val) ? val[0] : val)}
                  className="py-2 disabled:opacity-60"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="valorX" className="text-emerald-900">x</Label>
                  <Input id="valorX" type="number" step="0.1" value={valorX} onChange={(e) => setValorX(e.target.value)} disabled={modoInteractividad === 'base'} className="transition-all hover:border-emerald-400 disabled:opacity-60" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="valorY" className="text-emerald-900">y</Label>
                  <Input id="valorY" type="number" step="0.1" value={valorY} onChange={(e) => setValorY(e.target.value)} disabled={modoInteractividad === 'base'} className="transition-all hover:border-emerald-400 disabled:opacity-60" />
                </div>
              </div>
              {/* Nuevos campos para derivadas direccionales y plano tangente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="vectorUx" className="text-emerald-900">Vector u (x)</Label>
                  <Input id="vectorUx" type="number" step="0.1" value={vectorUx} onChange={(e) => setVectorUx(e.target.value)} disabled={modoInteractividad === 'base'} className="transition-all hover:border-emerald-400 disabled:opacity-60" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="vectorUy" className="text-emerald-900">Vector u (y)</Label>
                  <Input id="vectorUy" type="number" step="0.1" value={vectorUy} onChange={(e) => setVectorUy(e.target.value)} disabled={modoInteractividad === 'base'} className="transition-all hover:border-emerald-400 disabled:opacity-60" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="evalX" className="text-emerald-900">Eval. linealización (x)</Label>
                  <Input id="evalX" type="number" step="0.1" value={evalX} onChange={(e) => setEvalX(e.target.value)} disabled={modoInteractividad === 'base'} className="transition-all hover:border-emerald-400 disabled:opacity-60" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="evalY" className="text-emerald-900">Eval. linealización (y)</Label>
                  <Input id="evalY" type="number" step="0.1" value={evalY} onChange={(e) => setEvalY(e.target.value)} disabled={modoInteractividad === 'base'} className="transition-all hover:border-emerald-400 disabled:opacity-60" />
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
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-emerald-900/5 mb-4 gap-3 sm:gap-0">
              <CardTitle className="text-emerald-950">Optimización</CardTitle>
              <Button
                size="sm"
                variant={conPresupuesto ? 'default' : 'outline'}
                onClick={() => setConPresupuesto(!conPresupuesto)}
                disabled={modoInteractividad === 'base'}
                className={conPresupuesto ? 'bg-amber-500 hover:bg-amber-600 text-white border-none disabled:opacity-60' : 'text-emerald-900 border-emerald-200 hover:bg-emerald-50 disabled:opacity-60'}
              >
                Restricción Presupuestaria
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {conPresupuesto && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="costoX" className="text-emerald-900">Costo x ($C_x$)</Label>
                    <Input id="costoX" type="number" value={costoX} onChange={(e) => setCostoX(e.target.value)} disabled={modoInteractividad === 'base'} className="focus:border-amber-500 focus:ring-amber-500/20 disabled:opacity-60" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="costoY" className="text-emerald-900">Costo y ($C_y$)</Label>
                    <Input id="costoY" type="number" value={costoY} onChange={(e) => setCostoY(e.target.value)} disabled={modoInteractividad === 'base'} className="focus:border-amber-500 focus:ring-amber-500/20 disabled:opacity-60" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="presupuesto" className="text-emerald-900">Ppto ($B$)</Label>
                    <Input id="presupuesto" type="number" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} disabled={modoInteractividad === 'base'} className="focus:border-amber-500 focus:ring-amber-500/20 disabled:opacity-60" />
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
          )}

        {/* Panel derecho: gráfico 3D */}
        <Card className="lg:col-span-2 glass-card h-fit lg:sticky lg:top-6 overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-emerald-900/5 mb-2 gap-3 sm:gap-0">
            <CardTitle className="text-emerald-950">Visualización Topográfica</CardTitle>
            <div className="flex w-full sm:w-auto gap-2 bg-emerald-50 p-1 rounded-lg border border-emerald-100">
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
          <CardContent className="h-[400px] md:h-[500px] lg:h-[650px] p-2 relative w-full">
            <Plot3D
              datos={datosSuperficie ?? undefined}
              puntoOptimo={resultadoOptimo}
              cargando={cargandoSuperficie}
              modo={modoVista}
            />
          </CardContent>
        </Card>
        </div>

        {/* Panel Inferior: Tabla de Escenarios (ocupa 3 columnas) */}
        <Card className="w-full glass-card border-emerald-500/20">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-emerald-900/5 pb-4 mb-4 gap-3 sm:gap-0">
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
