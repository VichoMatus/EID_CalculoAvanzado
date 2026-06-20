import numpy as np
import sympy as sp

x, y, a, b, c, d = sp.symbols("x y a b c d", real=True)

funcion_R = x**a * y**b * sp.exp(-c * x) * sp.exp(-d * y)
derivada_parcial_x = sp.diff(funcion_R, x)
derivada_parcial_y = sp.diff(funcion_R, y)

funcion_R_numerica = sp.lambdify((x, y, a, b, c, d), funcion_R, modules="numpy")
derivada_x_numerica = sp.lambdify((x, y, a, b, c, d), derivada_parcial_x, modules="numpy")
derivada_y_numerica = sp.lambdify((x, y, a, b, c, d), derivada_parcial_y, modules="numpy")


def calcular_funcion(x_val, y_val, a=2, b=2, c=0.5, d=0.5):
	valor = funcion_R_numerica(x_val, y_val, a, b, c, d)
	return float(valor)


def calcular_derivadas(x_val, y_val, a=2, b=2, c=0.5, d=0.5):
	parcial_x = derivada_x_numerica(x_val, y_val, a, b, c, d)
	parcial_y = derivada_y_numerica(x_val, y_val, a, b, c, d)
	return {
		"parcial_x": float(parcial_x),
		"parcial_y": float(parcial_y),
	}


def calcular_gradiente(x_val, y_val, a=2, b=2, c=0.5, d=0.5):
	derivadas = calcular_derivadas(x_val, y_val, a=a, b=b, c=c, d=d)
	gradiente = [derivadas["parcial_x"], derivadas["parcial_y"]]
	magnitud = float(np.sqrt(gradiente[0] ** 2 + gradiente[1] ** 2))
	return {
		"gradiente": gradiente,
		"magnitud": magnitud,
	}


def generar_superficie(a=2, b=2, c=0.5, d=0.5, rango=10, puntos=40):
	grilla_x = np.linspace(0.1, rango, puntos)
	grilla_y = np.linspace(0.1, rango, puntos)
	x_mesh, y_mesh = np.meshgrid(grilla_x, grilla_y)
	valores_z = funcion_R_numerica(x_mesh, y_mesh, a, b, c, d)

	return {
		"x": x_mesh.tolist(),
		"y": y_mesh.tolist(),
		"z": np.asarray(valores_z, dtype=float).tolist(),
	}


def encontrar_punto_critico(a=2, b=2, c=0.5, d=0.5):
	x_optimo = float(a / c)
	y_optimo = float(b / d)
	valor_optimo = float(calcular_funcion(x_optimo, y_optimo, a=a, b=b, c=c, d=d))

	return {
		"x_optimo": x_optimo,
		"y_optimo": y_optimo,
		"valor_optimo": valor_optimo,
		"tipo": "maximo",
	}
