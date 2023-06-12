$(document).ready(function(){
    $("#add-restaurant-form").submit(function(event){
        event.preventDefault();

        var name = $("#name").val();
        var rating = $("#rating").val();
        var price = $("#price").val();

        $.ajax({
            url: 'http://localhost:5000/restaurants',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ "name": name, "rating": parseFloat(rating), "price": parseInt(price) }),
            success: function(result){
                alert(result.message);
                $("#add-restaurant-form").trigger("reset");
            },
            error: function(err){
                console.log(err);
            }
        });
    });

    $("#user-pref-form").submit(function(event){
        event.preventDefault();

        var price_limit = $("#price_limit").val();
        var rating_minimum = $("#rating_minimum").val();

        $.ajax({
            url: 'http://localhost:5000/recommend',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ "price_limit": parseInt(price_limit), "rating_minimum": parseFloat(rating_minimum) }),
            success: function(result){
                var recommendation_div = $("#recommendationTime");
                recommendation_div.empty();
                if (result.greedy_result) {
                    recommendation_div.append('<p>&emsp;Greedy: ');
                    recommendation_div.append('<p>&emsp;&emsp;&emsp;&emsp;' + result.greedy_time + ' seconds</p>');
                    recommendation_div.append('<p>&emsp;&emsp;&emsp;');
                } else {
                    recommendation_div.append('<p>No greedy result.</p>');
                }
                if (result.divide_and_conquer_result) {
                    recommendation_div.append('<p>&emsp;Divide and Conquer: ');
                    recommendation_div.append('<p>&emsp;&emsp;&emsp;&emsp;' + result.divide_and_conquer_time + ' seconds</p>');
                } else {
                    recommendation_div.append('<p>No divide and conquer result.</p>');
                }
                $("#user-pref-form").trigger("reset");
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

async function getRestaurantList() {
    const response = await fetch('http://localhost:5000/restaurants');
    const restaurants = await response.json();

    const restaurantListElement = document.getElementById('restaurantList');
    restaurantListElement.innerHTML = '';  // Menghapus semua elemen di dalam restaurantListElement

    for (const restaurant of restaurants) {
        const restaurantElement = document.createElement('p');
        restaurantElement.textContent = `Restoran: ${restaurant.name}, Harga: ${restaurant.price}, Rating: ${restaurant.rating}`;
        restaurantListElement.appendChild(restaurantElement);
    }
}

// Memanggil fungsi getRestaurantList saat halaman dimuat
window.addEventListener('DOMContentLoaded', getRestaurantList);