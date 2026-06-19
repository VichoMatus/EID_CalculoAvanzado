# Plan de Trabajo: Proyecto Final 6 - Producción Agrícola y Uso de Recursos

## 📅 Hitos y Fechas Clave
- **Entrega del Informe y Códigos:** Hasta el 01 de julio de 2026
- **Entrega de la Presentación (PDF):** Hasta el 01 de julio de 2026
- **Exposiciones:** 02 de julio de 2026

---

## 🛠️ Stack Tecnológico
- **Backend / Motor Matemático:** Python con Flask (NumPy, SciPy para optimización, SymPy para cálculo simbólico)
- **Frontend:** Next.js 16 + React 19
- **UI Components:** shadcn/ui (sliders, inputs, cards, botones)
- **Visualización (Gráficos):** Plotly.js (react-plotly.js) para superficie 3D y curvas de nivel

---

## 📋 Estado del Proyecto

### ✅ Completado (Infraestructura)
- [x] **Backend:** Proyecto Flask creado con CORS, blueprint registrado en `/api`, entorno virtual configurado, dependencias instaladas (Flask, flask-cors, numpy, scipy, sympy)
- [x] **Frontend:** Proyecto Next.js 16 creado con todas las dependencias (plotly.js, shadcn/ui, tailwind v4, lucide icons, TypeScript)
- [x] **UI Components:** Instalados y configurados: Slider, Input, Label, Card, Button
- [x] **Layout:** Página principal con layout de 2 columnas (Parámetros + Superficie 3D)
- [x] **API Layer:** Funciones `calculate()`, `getSurface()`, `optimize()` definidas en `src/lib/api.ts`
- [x] **Plot 3D:** Componente Plotly renderizado (actualmente con datos demo hardcodeados)
- [x] **Scripts:** `install.sh`, `start.sh`, `stop.sh` funcionales

### ⏳ Pendiente — Backend (`/backend`)
- [ ] **Modelo matemático (`core/math_model.py`):**
  - Definir variables simbólicas `x`, `y` y función `R(x,y) = x^a * y^b * e^{-cx} * e^{-dy}`
  - Implementar cálculo de derivadas parciales `∂R/∂x` y `∂R/∂y`
  - Implementar gradiente `∇R(x,y)`
  - Evaluar funciones en puntos específicos
  - Encontrar puntos críticos (máximos, mínimos, puntos de silla)
- [ ] **Endpoints (`api/routes.py`):**
  - `POST /api/calculate`: Devolver `{resultado, parcial_x, parcial_y, gradiente}` dado `{x, y, a, b, c, d}`
  - `GET /api/surface`: Generar y devolver malla `{x, y, z}` para graficar la superficie
  - `POST /api/optimize`: Encontrar punto óptimo dados valores iniciales y constantes
- [ ] **Aproximación lineal / plano tangente** (no implementado aún)

### ⏳ Pendiente — Frontend (`/frontend`)
- [ ] **Conectar inputs con estado:** Usar `useState` para `x`, `y`, constantes `a, b, c, d`
- [ ] **Sliders para constantes a, b, c, d:** Agregar controles específicos para cada constante del modelo
- [ ] **Botón "Calcular":** Conectar a `POST /api/calculate` y mostrar resultados
- [ ] **Panel de resultados:** Mostrar rendimiento calculado, derivadas parciales, gradiente
- [ ] **Gráfico 3D:** Reemplazar datos demo con datos reales desde `GET /api/surface`
- [ ] **Curvas de nivel:** Agregar visualización de contornos `R(x,y) = c`
- [ ] **Optimización:** Botón para ejecutar optimización y mostrar el punto máximo encontrado
- [ ] **Estados de carga/error:** Manejar loading states y errores de API

### ⏳ Pendiente — Documentación (`/docs`)
- [ ] **Informe LaTeX (`informe.tex`):** Escribir contenido real (actualmente solo tiene secciones vacías con TODOs)
  - Portada, Introducción, Formulación matemática, Desarrollo analítico
  - Implementación del código, Análisis de resultados, Conclusiones, Referencias
- [ ] **Responder pregunta extra:** Elegir variante (restricción presupuestaria, temperatura, etc.)

### ⏳ Pendiente — Presentación
- [ ] Armar diapositivas (10 min de exposición + 5 min de preguntas)
- [ ] Exportar a PDF para entrega del 1 de julio
- [ ] Empaquetar códigos generados

---

## 🔄 Flujo de Trabajo Recomendado

1. **Primero:** Implementar el modelo matemático en `core/math_model.py` (la función `R`, derivadas, gradiente)
2. **Segundo:** Conectar los endpoints en `api/routes.py` usando el modelo matemático
3. **Tercero:** Wirear el frontend: state management, llamadas a la API, panel de resultados
4. **Cuarto:** Reemplazar datos demo del gráfico 3D con datos reales y agregar curvas de nivel
5. **Quinto:** Escribir el informe en LaTeX
6. **Sexto:** Preparar la presentación

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
# 1. Instalar dependencias (solo la primera vez)
bash install.sh

# 2. Iniciar backend y frontend
bash start.sh

# 3. Abrir en navegador: http://localhost:3000
#    Backend corre en: http://localhost:5000

# 4. Detener servicios
bash stop.sh
```

---

## 📁 Estructura del Repositorio

```
EID_CalculoAvanzado/
├── markdown.md              # Este archivo (plan de trabajo y estado)
├── README.md
├── PDFs/                    # Presentaciones u otros PDFs
└── proyecto-calculo/
    ├── install.sh           # Instala dependencias (Python + Node)
    ├── start.sh             # Inicia Flask + Next.js
    ├── stop.sh              # Detiene Flask + Next.js
    ├── backend/
    │   ├── app.py           # Entry point de Flask
    │   ├── requirements.txt
    │   ├── core/
    │   │   └── math_model.py    # ⚠️ POR IMPLEMENTAR
    │   └── api/
    │       └── routes.py        # ⚠️ POR IMPLEMENTAR
    ├── frontend/
    │   ├── src/
    │   │   ├── app/page.tsx         # ⚠️ POR IMPLEMENTAR (sin interactividad)
    │   │   ├── components/Plot3D.tsx # ⚠️ Datos demo, conectar a API
    │   │   └── lib/api.ts           # ✅ Definido pero no usado
    │   └── ...configuración...
    └── docs/
        └── informe.tex          # ⚠️ Solo estructura vacía
```
