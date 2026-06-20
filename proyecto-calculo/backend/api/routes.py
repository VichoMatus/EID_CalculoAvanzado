from flask import Blueprint, jsonify, request

from core.math_model import (
    calcular_derivadas,
    calcular_funcion,
    calcular_gradiente,
    encontrar_punto_critico,
    generar_superficie,
)

api_bp = Blueprint('api', __name__)

@api_bp.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json() or {}
    x_val = data.get('x')
    y_val = data.get('y')
    a = data.get('a', 2)
    b = data.get('b', 2)
    c = data.get('c', 0.5)
    d = data.get('d', 0.5)

    resultado = calcular_funcion(x_val, y_val, a=a, b=b, c=c, d=d)
    derivadas = calcular_derivadas(x_val, y_val, a=a, b=b, c=c, d=d)
    gradiente = calcular_gradiente(x_val, y_val, a=a, b=b, c=c, d=d)

    return jsonify({
        'resultado': resultado,
        'partial_x': derivadas['parcial_x'],
        'partial_y': derivadas['parcial_y'],
        'gradiente': gradiente['gradiente'],
        'magnitud': gradiente['magnitud'],
    })

@api_bp.route('/surface', methods=['GET'])
def surface():
    a = request.args.get('a', 2, type=float)
    b = request.args.get('b', 2, type=float)
    c = request.args.get('c', 0.5, type=float)
    d = request.args.get('d', 0.5, type=float)
    rango = request.args.get('rango', 10, type=float)
    puntos = request.args.get('puntos', 40, type=int)

    superficie = generar_superficie(a=a, b=b, c=c, d=d, rango=rango, puntos=puntos)

    return jsonify({
        'x': superficie['x'],
        'y': superficie['y'],
        'z': superficie['z'],
    })

@api_bp.route('/optimize', methods=['POST'])
def optimize():
    data = request.get_json() or {}
    a = data.get('a', 2)
    b = data.get('b', 2)
    c = data.get('c', 0.5)
    d = data.get('d', 0.5)

    punto_critico = encontrar_punto_critico(a=a, b=b, c=c, d=d)

    return jsonify({
        'x_optimo': punto_critico['x_optimo'],
        'y_optimo': punto_critico['y_optimo'],
        'valor_optimo': punto_critico['valor_optimo'],
        'tipo': punto_critico['tipo'],
    })
