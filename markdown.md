# Plan de Trabajo: Proyecto Final 6 - Producción Agrícola y Uso de Recursos

## 📅 Hitos y Fechas Clave
* [cite_start]**Entrega del Informe y Códigos:** Hasta el 01 de julio de 2026[cite: 225].
* [cite_start]**Entrega de la Presentación (PDF):** Hasta el 01 de julio de 2026[cite: 226].
* [cite_start]**Exposiciones:** 02 de julio de 2026[cite: 227].

---

## 🛠️ Stack Tecnológico
* **Backend / Motor Matemático:** Python con Flask (recomendado usar librerías como NumPy y SciPy para optimización, y SymPy para derivadas parciales si se requiere cálculo simbólico).
* **Frontend:** Next.js (React) para la estructura de la aplicación.
* **UI Components:** shadcn/ui para inputs, selectores, tarjetas de resultados y modales.
* **Visualización (Gráficos):** Plotly.js o Recharts integrados en Next.js para renderizar la gráfica de superficie 3D y las curvas de nivel.

---

## 📋 Fase 1: Análisis Matemático y Modelado Teórico (Semanas 1)
**Objetivo:** Resolver el problema en papel y plantear las bases para el informe y el código.
* [cite_start]**1.1 Definición de Variables:** Establecer $x$ como cantidad de agua e $y$ como cantidad de fertilizante[cite: 40, 41]. [cite_start]Investigar un tipo de cultivo real para contextualizar los recursos[cite: 42].
* [cite_start]**1.2 Análisis del Modelo Base y Extendido:** Estudiar $R(x,y)=x^{a}y^{b}e^{-cx}e^{-dy}$ y cómo cambian las constantes $a, b, c$ y $d$[cite: 66, 67].
* [cite_start]**1.3 Derivadas y Gradiente:** Calcular las derivadas parciales $\frac{\partial R}{\partial x}$ y $\frac{\partial R}{\partial y}$[cite: 78, 80, 82, 83]. [cite_start]Construir el vector gradiente $\nabla R(x,y)$[cite: 86, 87].
* [cite_start]**1.4 Optimización y Puntos Críticos:** Encontrar los puntos donde $\nabla R(x,y)=0$ y clasificarlos (máximos, mínimos, puntos de silla) para identificar las configuraciones que maximizan la producción[cite: 101, 102, 103, 105].
* [cite_start]**1.5 Aproximaciones Lineales:** Estudiar el plano tangente y linealización para estimar cambios ante pequeñas variaciones[cite: 91, 92].

---

## 💻 Fase 2: Desarrollo del Backend en Flask (Semana 2)
**Objetivo:** Crear una API REST que reciba parámetros y devuelva cálculos matemáticos.
* **2.1 Setup de Flask:** Crear un servidor básico con endpoints (ej. `/api/calculate`, `/api/optimize`).
* [cite_start]**2.2 Lógica de Cálculo:** Implementar en Python la función que calcule el rendimiento asociado al modificar agua y fertilizante[cite: 113, 114].
* [cite_start]**2.3 Lógica Vectorial:** Programar funciones para calcular numéricamente gradientes, derivadas direccionales y encontrar los puntos óptimos[cite: 117, 118].
* [cite_start]**2.4 Generación de Datos para Gráficos:** Crear un endpoint que devuelva las matrices de datos necesarias (coordenadas X, Y, Z) para graficar la superficie $z=R(x,y)$ y las curvas de nivel $R(x,y)=c$ en el frontend[cite: 74, 75, 107, 108].

---

## 🖥️ Fase 3: Desarrollo del Frontend en Next.js (Semana 3)
**Objetivo:** Construir la interfaz de usuario interactiva y consumir la API de Flask.
* [cite_start]**3.1 Interfaz de Entrada:** Usar componentes de shadcn (Sliders, Inputs, Cards) para crear un panel de control donde el usuario pueda modificar cantidades de agua, fertilizante y las constantes $a, b, c, d$[cite: 113, 138].
* [cite_start]**3.2 Visualización de Resultados:** Mostrar en tiempo real el rendimiento calculado y la comparación de escenarios productivos[cite: 114, 119].
* [cite_start]**3.3 Gráficos Multivariables:** Implementar un visualizador interactivo (ej. Plotly) para representar la superficie del modelo identificando máximos y regiones de alto rendimiento, además de trazar las curvas de nivel[cite: 109, 115, 116].

---

## 📝 Fase 4: Redacción del Informe Técnico (Semana 4)
[cite_start]**Objetivo:** Consolidar el trabajo en un documento formal de máximo 15 páginas (sin anexos ni código)[cite: 175].
* [cite_start]**4.1 Estructura del Documento:** Completar Portada, Introducción, Formulación matemática, Desarrollo analítico, Implementación del código, Análisis de resultados, Conclusiones y Referencias[cite: 196, 197, 198, 199, 200, 201, 202, 203].
* [cite_start]**4.2 Análisis Crítico:** Interpretar la influencia física/agrícola del agua y fertilizante[cite: 131, 132]. [cite_start]Discutir el comportamiento del gradiente, eficiencia de recursos y qué ocurre físicamente en las distintas zonas de la gráfica[cite: 110, 133, 136].
* [cite_start]**4.3 Responder Pregunta Extra:** Elegir al menos una variante (ej. restricción presupuestaria, tercera variable como temperatura, etc.) y discutir cómo afectaría el modelo[cite: 140, 141, 142].

---

## 🎤 Fase 5: Preparación de la Presentación (Últimos Días)
[cite_start]**Objetivo:** Armar la defensa oral evaluada en 50% de la nota final[cite: 191].
* **5.1 Armar Diapositivas:** Sintetizar el problema, mostrar la simulación computacional funcionando, explicar la matemática clave y exponer conclusiones.
* [cite_start]**5.2 Ensayo de Tiempos:** Ajustar el discurso para cumplir estrictamente con los 10 minutos de exposición[cite: 184]. [cite_start]Prepararse para los 5 minutos de preguntas[cite: 184].
* [cite_start]**5.3 Empaquetado:** Exportar la presentación a formato PDF para la entrega del 1 de julio [cite: 226] [cite_start]y empaquetar los códigos generados[cite: 176].
