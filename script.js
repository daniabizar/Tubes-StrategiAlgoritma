$(document).ready(function(){
    var isAddingRestaurant = false;

    $("#add-restaurant-form").submit(function(event){
        event.preventDefault();

        if (isAddingRestaurant) {
            return; // Jika ya, berhenti dan tidak melakukan apa-apa
        }

        var name = $("#name").val();
        var rating = $("#rating").val();
        var price = $("#price").val();

        if (name === "" || rating === "" || price === "") {
            alert("Input restoran telah dikirim sebelumnya.");
            return;
        }


        $.ajax({
            url: 'http://localhost:5000/restaurants',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ "name": name, "rating": parseFloat(rating), "price": parseInt(price) }),
            success: function(result){
                alert(result.message);
                $("#add-restaurant-form").trigger("reset");
                isAddingRestaurant = true; // Setel flag menjadi true setelah pengiriman pertama selesai
                $(".button-add").attr("disabled", "disabled");
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
                var recommendation_div = $("#recommendation");
                recommendation_div.empty();
                if (result.greedy_result) {
                    recommendation_div.append('<h4>&emsp; Rekomendasi 1:</h4>');
                    recommendation_div.append('<h5>&emsp;&emsp;&emsp;&emsp; Greedy Result</h5>');
                    recommendation_div.append('<p>&emsp;&emsp;&emsp;&emsp; ' + result.greedy_result.name + '</p>');
                    recommendation_div.append('<p>&emsp;&emsp;&emsp;&emsp; Rating: ' + result.greedy_result.rating + '</p>');
                    recommendation_div.append('<p>&emsp;&emsp;&emsp;&emsp; Price: ' + result.greedy_result.price + '</p>');
                } else {
                    recommendation_div.append('<p>No greedy result.</p>');
                }
                if (result.divide_and_conquer_result) {
                    recommendation_div.append('<h4>&emsp; Rekomendasi 2:</h4>');
                    recommendation_div.append('<h5>&emsp;&emsp;&emsp;&emsp; Divide and Conquer Result</h5>');
                    recommendation_div.append('<p>&emsp;&emsp;&emsp;&emsp; ' + result.divide_and_conquer_result.name + '</p>');
                    recommendation_div.append('<p>&emsp;&emsp;&emsp;&emsp; Rating: ' + result.divide_and_conquer_result.rating + '</p>');
                    recommendation_div.append('<p>&emsp;&emsp;&emsp;&emsp; Price: ' + result.divide_and_conquer_result.price + '</p>');
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
    try {
      const response = await fetch('http://localhost:5000/restaurants');
      const restaurants = await response.json();
  
      const restaurantListElement = document.getElementById('restaurantList');
      restaurantListElement.innerHTML = ''; // Clear previous content
  
      for (const restaurant of restaurants) {
        const restaurantElement = document.createElement('p');
        restaurantElement.textContent = `Restoran: ${restaurant.name}, Harga: ${restaurant.price}, Rating: ${restaurant.rating}`;
        restaurantListElement.appendChild(restaurantElement);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  // Call the getRestaurantList function when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', getRestaurantList);
  