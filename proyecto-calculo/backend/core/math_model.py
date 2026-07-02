import numpy as np
import sympy as sp
import scipy.optimize as opt

x, y, a, b, c, d = sp.symbols("x y a b c d", real=True)
B_sym, C_x_sym, C_y_sym, lam = sp.symbols("B_sym C_x_sym C_y_sym lam", real=True)

# 1. Definiciones base globales
funcion_R = x**a * y**b * sp.exp(-c * x) * sp.exp(-d * y)

# 2. Derivadas globales (Caché en memoria)
derivada_parcial_x = sp.diff(funcion_R, x)
derivada_parcial_y = sp.diff(funcion_R, y)

# Derivadas segundas globales
d2R_dx2_sym = sp.diff(derivada_parcial_x, x)
d2R_dy2_sym = sp.diff(derivada_parcial_y, y)
d2R_dxdy_sym = sp.diff(derivada_parcial_x, y)

# Lagrangiano global
L_sym = funcion_R + lam * (B_sym - C_x_sym * x - C_y_sym * y)
dL_dx_sym = sp.diff(L_sym, x)
dL_dy_sym = sp.diff(L_sym, y)
dL_dlam_sym = sp.diff(L_sym, lam)

# 3. Funciones NumPy globales
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
	try:
		a_s, b_s, c_s, d_s = sp.symbols("a b c d", real=True)
		subs_dict = {a_s: a, b_s: b, c_s: c, d_s: d}
		
		eq1 = derivada_parcial_x.subs(subs_dict)
		eq2 = derivada_parcial_y.subs(subs_dict)
		
		soluciones = sp.solve((eq1, eq2), (x, y), dict=True)
		
		punto_critico = None
		for sol in soluciones:
			x_sol = sol.get(x)
			y_sol = sol.get(y)
			if x_sol is not None and y_sol is not None:
				try:
					x_val = float(x_sol)
					y_val = float(y_sol)
					if x_val > 0 and y_val > 0:
						punto_critico = sol
						break
				except (TypeError, ValueError):
					pass
					
		if punto_critico:
			x_opt = float(punto_critico[x])
			y_opt = float(punto_critico[y])
			
			d2R_dx2 = d2R_dx2_sym.subs(subs_dict)
			d2R_dy2 = d2R_dy2_sym.subs(subs_dict)
			d2R_dxdy = d2R_dxdy_sym.subs(subs_dict)
			
			A = float(d2R_dx2.subs({x: x_opt, y: y_opt}))
			C = float(d2R_dy2.subs({x: x_opt, y: y_opt}))
			B_hess = float(d2R_dxdy.subs({x: x_opt, y: y_opt}))
			
			D = A * C - B_hess**2
			
			tipo = "punto_silla"
			if D > 0 and A < 0:
				tipo = "maximo_local_absoluto"
			elif D > 0 and A > 0:
				tipo = "minimo_local"
				
			valor_optimo = float(calcular_funcion(x_opt, y_opt, a=a, b=b, c=c, d=d))
			
			return {
				"x_optimo": x_opt,
				"y_optimo": y_opt,
				"valor_optimo": valor_optimo,
				"tipo": tipo,
			}
	except Exception:
		pass
		
	def objetivo(vars):
		return -funcion_R_numerica(vars[0], vars[1], a, b, c, d)
		
	punto_inicial = [1.0, 1.0]
	limites = ((0.1, None), (0.1, None))
	resultado = opt.minimize(objetivo, punto_inicial, bounds=limites)
	
	if resultado.success:
		return {
			"x_optimo": float(resultado.x[0]),
			"y_optimo": float(resultado.x[1]),
			"valor_optimo": float(-resultado.fun),
			"tipo": "maximo_local_absoluto"
		}
	else:
		return {
			"x_optimo": 0.0,
			"y_optimo": 0.0,
			"valor_optimo": 0.0,
			"tipo": "error"
		}

def optimizar_con_restriccion(C_x, C_y, B, a=2, b=2, c=0.5, d=0.5, rango_x=50.0, rango_y=50.0):
	max_x = min(B / C_x, rango_x * 2.0) if C_x > 0 else rango_x * 2.0
	max_y = min(B / C_y, rango_y * 2.0) if C_y > 0 else rango_y * 2.0

	try:
		a_s, b_s, c_s, d_s = sp.symbols("a b c d", real=True)
		B_s, C_x_s, C_y_s = sp.symbols("B_sym C_x_sym C_y_sym", real=True)
		subs_dict = {a_s: a, b_s: b, c_s: c, d_s: d, B_s: B, C_x_s: C_x, C_y_s: C_y}
		
		eq1 = dL_dx_sym.subs(subs_dict)
		eq2 = dL_dy_sym.subs(subs_dict)
		eq3 = dL_dlam_sym.subs(subs_dict)
		
		soluciones = sp.solve((eq1, eq2, eq3), (x, y, lam), dict=True)
		
		punto_opt = None
		for sol in soluciones:
			x_sol = sol.get(x)
			y_sol = sol.get(y)
			if x_sol is not None and y_sol is not None:
				try:
					x_val = float(x_sol)
					y_val = float(y_sol)
					if 0 < x_val <= max_x and 0 < y_val <= max_y:
						punto_opt = sol
						break
				except (TypeError, ValueError):
					pass
					
		if punto_opt:
			x_opt = float(punto_opt[x])
			y_opt = float(punto_opt[y])
			valor_opt = float(calcular_funcion(x_opt, y_opt, a=a, b=b, c=c, d=d))
			return {
				"x_optimo": x_opt,
				"y_optimo": y_opt,
				"valor_optimo": valor_opt,
				"tipo": "maximo_presupuesto"
			}
	except Exception:
		pass

	def objetivo(vars):
		return -funcion_R_numerica(vars[0], vars[1], a, b, c, d)
	
	restricciones = [
		{'type': 'ineq', 'fun': lambda vars: B - C_x * vars[0] - C_y * vars[1]}
	]
	
	limites = ((0.1, max_x), (0.1, max_y))
	
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
