from core.database import db

class Escenario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Float, nullable=False)
    y = db.Column(db.Float, nullable=False)
    a = db.Column(db.Float, nullable=False)
    b = db.Column(db.Float, nullable=False)
    c = db.Column(db.Float, nullable=False)
    d = db.Column(db.Float, nullable=False)
    rendimiento = db.Column(db.Float, nullable=False)
    partial_x = db.Column(db.Float, nullable=False)
    partial_y = db.Column(db.Float, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'x': self.x,
            'y': self.y,
            'a': self.a,
            'b': self.b,
            'c': self.c,
            'd': self.d,
            'rendimiento': self.rendimiento,
            'partial_x': self.partial_x,
            'partial_y': self.partial_y
        }
