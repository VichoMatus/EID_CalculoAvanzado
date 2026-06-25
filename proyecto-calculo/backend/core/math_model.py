import numpy as np
import sympy as sp
import scipy.optimize as opt

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


def calcular_derivada_direccional(x_val, y_val, u_x, u_y, a=2, b=2, c=0.5, d=0.5):
	norma = np.sqrt(u_x**2 + u_y**2)
	if norma == 0:
		return 0.0
	u_x_norm = u_x / norma
	u_y_norm = u_y / norma

	grad_data = calcular_gradiente(x_val, y_val, a=a, b=b, c=c, d=d)
	gradiente = grad_data["gradiente"]
	derivada_dir = gradiente[0] * u_x_norm + gradiente[1] * u_y_norm
	return float(derivada_dir)


def calcular_plano_tangente(x0, y0, x_eval, y_eval, a=2, b=2, c=0.5, d=0.5):
	z0 = calcular_funcion(x0, y0, a=a, b=b, c=c, d=d)
	derivadas = calcular_derivadas(x0, y0, a=a, b=b, c=c, d=d)
	z_aprox = z0 + derivadas["parcial_x"] * (x_eval - x0) + derivadas["parcial_y"] * (y_eval - y0)
	return float(z_aprox)


def generar_superficie(a=2, b=2, c=0.5, d=0.5, rango_x=10, rango_y=10, puntos=40):
	grilla_x = np.linspace(0.1, rango_x, puntos)
	grilla_y = np.linspace(0.1, rango_y, puntos)
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

def optimizar_con_restriccion(C_x, C_y, B, a=2, b=2, c=0.5, d=0.5):
	def objetivo(vars):
		return -funcion_R_numerica(vars[0], vars[1], a, b, c, d)
	
	restricciones = [
		{'type': 'ineq', 'fun': lambda vars: B - C_x * vars[0] - C_y * vars[1]}
	]
	
	limites = ((0.1, None), (0.1, None))
	
	punto_inicial = [B / (2 * C_x), B / (2 * C_y)] if C_x > 0 and C_y > 0 else [1.0, 1.0]
	
	resultado = opt.minimize(objetivo, punto_inicial, method='SLSQP', bounds=limites, constraints=restricciones)
	
	if resultado.success:
		return {
			"x_optimo": float(resultado.x[0]),
			"y_optimo": float(resultado.x[1]),
			"valor_optimo": float(-resultado.fun),
			"tipo": "maximo_presupuesto"
		}
	else:
		return encontrar_punto_critico(a=a, b=b, c=c, d=d)
