from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

restaurants = [
    # contoh data restoran
    {'id': 1, 'name': 'Warkop ADD',     'rating': 4.5, 'price': 20000},
    {'id': 2, 'name': 'Bebek Kalilo',   'rating': 4.0, 'price': 30000},
    {'id': 3, 'name': 'Warung SKB', 'rating': 5.0, 'price': 15000},
    {'id': 4, 'name': 'Diagram', 'rating': 4.1, 'price': 30000},
    {'id': 5, 'name': 'Soto Madura', 'rating': 3.1, 'price': 10000},
    {'id': 6, 'name': 'Susu Bendera', 'rating': 3.0, 'price': 30000},
    {'id': 7, 'name': 'Nasi Uduk SP', 'rating': 4.2, 'price': 15000},
    {'id': 8, 'name': 'Nasi Goreng Gila', 'rating': 3.9, 'price': 18000},
    {'id': 9, 'name': 'Mie Ayam Jamur', 'rating': 4.0, 'price': 20000},
    {'id': 10, 'name': 'Pizza Margherita', 'rating': 4.5, 'price': 35000},
]

# memastikan restoran diurutkan berdasarkan harga dan rating
restaurants.sort(key=lambda x: (x['price'], x['rating']), reverse = True)

@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    restaurant_data = []
    for restaurant in restaurants:
        restaurant_info = {
            'name': restaurant['name'],
            'rating': restaurant['rating'],
            'price': restaurant['price']
        }
        restaurant_data.append(restaurant_info)

    return jsonify(restaurant_data), 200


@app.route('/restaurants', methods=['POST'])
def add_restaurant():
    data = request.json
    restaurant_name = data['name']

    # Check if restaurant already exists
    for restaurant in restaurants:
        if restaurant['name'] == restaurant_name:
            return jsonify({"message": "Restaurant already exists!"}), 400

    # Add the restaurant to the list
    restaurants.append(data)
    restaurants.sort(key=lambda x: (x['price'], x['rating']), reverse=True)
    return jsonify({"message": "Restaurant added successfully!"}), 200

@app.route('/recommend', methods=['POST'])
def recommend():
    user_pref = request.json
    price_limit = user_pref['price_limit']
    rating_minimum = user_pref['rating_minimum']

    # algoritma greedy
    start_greedy = time.perf_counter()
    for restaurant in restaurants:
        if restaurant['price'] <= price_limit and restaurant['rating'] >= rating_minimum:
            greedy_result = restaurant
            break
    else:
        greedy_result = None
    end_greedy = time.perf_counter()
    greedy_time = end_greedy - start_greedy

    # algoritma divide-and-conquer
    start_divide_and_conquer = time.perf_counter()
    def binary_search(restaurants):
        if not restaurants:
            return None

        mid = len(restaurants) // 2
        if restaurants[mid]['price'] <= price_limit and restaurants[mid]['rating'] >= rating_minimum:
            return restaurants[mid]
        elif restaurants[mid]['price'] > price_limit:
            return binary_search(restaurants[mid+1:])
        else:
            return binary_search(restaurants[:mid])

    divide_and_conquer_result = binary_search(restaurants)
    end_divide_and_conquer = time.perf_counter()
    divide_and_conquer_time = end_divide_and_conquer - start_divide_and_conquer

    return jsonify({
        "greedy_result": greedy_result, 
        "greedy_time": greedy_time, 
        "divide_and_conquer_result": divide_and_conquer_result,
        "divide_and_conquer_time": divide_and_conquer_time
    }), 200

if __name__ == '__main__':
    app.run(debug=True)