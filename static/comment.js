$(document).ready(function () {
    q1();
    const rank = window.document.URL.split("?rank=")[1];
    move_page(rank)
    show_comment(rank)
});


function q1() {
    $.ajax({
        type: "GET",
        url: "http://spartacodingclub.shop/sparta_api/weather/seoul",
        data: {},
        success: function (response) {
            let temp = response['temp']
            let icon = response['icon']
            let city = response['city']

            $('#city').text(city)
            $('#degree').text(temp.toFixed(1) + ' °C')
            $('#icon').attr('src', icon)
        }
    })
}


function move_page(rank) {
    $.ajax({
        type: "GET",
        url: `/comment/view?rank=${rank}`,
        data: {},
        success: function (response) {
            const {title, image} = response
            $('#artist').append(`<p>${title}</p>`)
            $('#album').attr('src', image)
        }
    })
}


