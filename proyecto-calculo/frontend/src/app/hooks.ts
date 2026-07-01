import { useState, useEffect, useCallback } from 'react';
import { calculate, getSurface, optimize, optimizeBudget, getEscenarios, saveEscenario, deleteEscenario } from '@/lib/api';
import { EscenarioData, ResultadoCalculo, ResultadoOptimo, DatosSuperficie } from './types';

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

export function useOptiAgro() {
  // Modo de Interactividad
  const [modoInteractividad, setModoInteractividad] = useState<string>('base');

  const restaurarCasoBase = useCallback(() => {
    setConstA('2');
    setConstB('2');
    setConstC('0.5');
    setConstD('0.5');
    setValorX('1');
    setValorY('1');
    setVectorUx('1');
    setVectorUy('0');
    setEvalX('1.1');
    setEvalY('1.1');
    setRangoX(10);
    setRangoY(10);
    setConPresupuesto(false);
    setCostoX('1');
    setCostoY('1');
    setPresupuesto('10');
  }, []);

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

  const handleOptimizar = useCallback(async () => {
    setError(null);
    setCargandoOptimo(true);
    try {
      let datos;
      if (conPresupuesto) {
        datos = await optimizeBudget(
          { a: parseFloat(constA) || 2, b: parseFloat(constB) || 2, c: parseFloat(constC) || 0.5, d: parseFloat(constD) || 0.5 },
          parseFloat(costoX) || 1,
          parseFloat(costoY) || 1,
          parseFloat(presupuesto) || 10
        );
      } else {
        datos = await optimize({ a: parseFloat(constA) || 2, b: parseFloat(constB) || 2, c: parseFloat(constC) || 0.5, d: parseFloat(constD) || 0.5 });
      }
      setResultadoOptimo(datos);
    } catch {
      setError('Error al optimizar.');
    } finally {
      setCargandoOptimo(false);
    }
  }, [conPresupuesto, costoX, costoY, presupuesto, constA, constB, constC, constD]);

  const handleCalcular = useCallback(async () => {
    setError(null);
    setCargandoCalculo(true);
    try {
      const datos = await calculate(
        parseFloat(valorX) || 0,
        parseFloat(valorY) || 0,
        { a: parseFloat(constA) || 2, b: parseFloat(constB) || 2, c: parseFloat(constC) || 0.5, d: parseFloat(constD) || 0.5 },
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
  }, [valorX, valorY, constA, constB, constC, constD, vectorUx, vectorUy, evalX, evalY]);

  useEffect(() => {
    cargarSuperficie();
  }, [cargarSuperficie]);

  useEffect(() => {
    cargarEscenarios();
  }, [cargarEscenarios]);

  useEffect(() => {
    if (modoInteractividad === 'base') {
      handleOptimizar();
      // Opcional: También calcular el rendimiento base si se desea
      // handleCalcular();
    }
  }, [modoInteractividad, handleOptimizar]);

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
      .join('\n');

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

  return {
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
  };
}
