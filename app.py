# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cars.db'
db = SQLAlchemy(app)

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    details = db.Column(db.String(50), nullable=False)

@app.route('/cars', methods=['GET'])
def get_cars():
    year = request.args.get('year')
    if year:
        filtered_cars = Car.query.filter_by(year=year).all()
        cars = [{"id": car.id, "brand": car.brand, "model": car.model, "year": car.year, "details": car.details} for car in filtered_cars]
        return jsonify(cars)
    else:
        cars = Car.query.all()
        cars = [{"id": car.id, "brand": car.brand, "model": car.model, "year": car.year, "details": car.details} for car in cars]
        return jsonify(cars)

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, host='0.0.0.0')