from flask import Blueprint, jsonify, request

api_bp = Blueprint('api', __name__)

@api_bp.route('/calculate', methods=['POST'])
def calculate():
    # TODO: Recibir datos de entrada x, y
    # TODO: Evaluar R(x, y) usando core.math_model
    data = request.get_json() or {}
    return jsonify({
        'x': data.get('x'),
        'y': data.get('y'),
        'result': 0.0,
        'partial_x': 0.0,
        'partial_y': 0.0,
        'gradient': [0.0, 0.0]
    })

@api_bp.route('/surface', methods=['GET'])
def surface():
    # TODO: Generar malla de puntos (x, y) y evaluar R en cada punto
    # TODO: Retornar datos para graficar superficie 3D
    return jsonify({
        'x': [],
        'y': [],
        'z': []
    })

@api_bp.route('/optimize', methods=['POST'])
def optimize():
    # TODO: Implementar optimización (descenso por gradiente, Newton, etc.)
    data = request.get_json() or {}
    return jsonify({
        'optimal_x': 0.0,
        'optimal_y': 0.0,
        'optimal_value': 0.0,
        'iterations': 0,
        'converged': False
    })
