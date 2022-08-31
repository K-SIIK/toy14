$(document).ready(function () {
    q1();
});

function q1() {
    $.ajax({
        type: "GET",
        url: "http://spartacodingclub.shop/sparta_api/weather/seoul",
        data: {},
        success: function (response) {
            console.log(response)
            let temp = response['temp']
            let icon = response['icon']
            let city = response['city']

            $('#city').text(city)
            $('#degree').text(temp)
            $('#icon').attr('src', icon)
        }
    })
}
