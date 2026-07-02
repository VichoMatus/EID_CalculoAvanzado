from flask import Blueprint, jsonify, request
from core.database import db
from core.models import Escenario

from core.math_model import (
    calcular_derivadas,
    calcular_funcion,
    calcular_gradiente,
    encontrar_punto_critico,
    generar_superficie,
    calcular_derivada_direccional,
    calcular_plano_tangente,
    optimizar_con_restriccion,
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

    u_x = data.get('u_x', 1.0)
    u_y = data.get('u_y', 0.0)
    x_eval = data.get('x_eval', x_val)
    y_eval = data.get('y_eval', y_val)

    resultado = calcular_funcion(x_val, y_val, a=a, b=b, c=c, d=d)
    derivadas = calcular_derivadas(x_val, y_val, a=a, b=b, c=c, d=d)
    gradiente = calcular_gradiente(x_val, y_val, a=a, b=b, c=c, d=d)
    
    derivada_dir = calcular_derivada_direccional(x_val, y_val, u_x, u_y, a=a, b=b, c=c, d=d)
    plano_tangente_aprox = calcular_plano_tangente(x_val, y_val, x_eval, y_eval, a=a, b=b, c=c, d=d)

    return jsonify({
        'resultado': resultado,
        'partial_x': derivadas['parcial_x'],
        'partial_y': derivadas['parcial_y'],
        'gradiente': gradiente['gradiente'],
        'magnitud': gradiente['magnitud'],
        'derivada_direccional': derivada_dir,
        'aproximacion_tangente': plano_tangente_aprox,
    })

@api_bp.route('/surface', methods=['GET'])
def surface():
    a = request.args.get('a', 2, type=float)
    b = request.args.get('b', 2, type=float)
    c = request.args.get('c', 0.5, type=float)
    d = request.args.get('d', 0.5, type=float)
    rango_x = request.args.get('rango_x', 10, type=float)
    rango_y = request.args.get('rango_y', 10, type=float)
    puntos = request.args.get('puntos', 40, type=int)

    superficie = generar_superficie(a=a, b=b, c=c, d=d, rango_x=rango_x, rango_y=rango_y, puntos=puntos)

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

@api_bp.route('/optimize_budget', methods=['POST'])
def optimize_budget():
    data = request.get_json() or {}
    a = data.get('a', 2)
    b = data.get('b', 2)
    c = data.get('c', 0.5)
    d = data.get('d', 0.5)
    
    costo_x = data.get('costo_x', 1.0)
    costo_y = data.get('costo_y', 1.0)
    presupuesto = data.get('presupuesto', 10.0)
    rango_x = data.get('rango_x', 50.0)
    rango_y = data.get('rango_y', 50.0)

    resultado = optimizar_con_restriccion(C_x=costo_x, C_y=costo_y, B=presupuesto, a=a, b=b, c=c, d=d, rango_x=rango_x, rango_y=rango_y)

    return jsonify({
        'x_optimo': resultado['x_optimo'],
        'y_optimo': resultado['y_optimo'],
        'valor_optimo': resultado['valor_optimo'],
        'tipo': resultado['tipo'],
    })

@api_bp.route('/escenarios', methods=['GET'])
def get_escenarios():
    escenarios = Escenario.query.order_by(Escenario.id.desc()).limit(10).all()
    return jsonify([e.to_dict() for e in escenarios])

@api_bp.route('/escenarios', methods=['POST'])
def save_escenario():
    data = request.get_json() or {}
    nuevo_escenario = Escenario(
        x=data.get('x', 0),
        y=data.get('y', 0),
        a=data.get('a', 2),
        b=data.get('b', 2),
        c=data.get('c', 0.5),
        d=data.get('d', 0.5),
        rendimiento=data.get('rendimiento', 0),
        partial_x=data.get('partial_x', 0),
        partial_y=data.get('partial_y', 0)
    )
    db.session.add(nuevo_escenario)
    db.session.commit()
    return jsonify(nuevo_escenario.to_dict()), 201

@api_bp.route('/escenarios/<int:id>', methods=['DELETE'])
def delete_escenario(id):
    escenario = Escenario.query.get(id)
    if escenario:
        db.session.delete(escenario)
        db.session.commit()
        return jsonify({'message': 'Eliminado correctamente'}), 200
    return jsonify({'error': 'Escenario no encontrado'}), 404
