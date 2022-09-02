$(document).ready(function () {
    q1();
    listing();
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


function listing() {
    $('.music_list').empty()

    $.ajax({
        type: "GET",
        url: '/music',
        data: {},
        success: function (response) {
            let rows = response['musics']
            for (let i = 0; i < rows.length; i++) {
                let rank = rows[i]['rank']
                let image = rows[i]['image']
                let title = rows[i]['title']
                let artist = rows[i]['artist']
                let like = rows[i]['like']

                let temp_html = ``

                if (like === false) {
                    temp_html = `<tr class="music" onclick="move_page(${rank})">
                                    <th scope="row">${rank}</th>
                                    <td><img class="album"
                                             src="${image}"
                                             alt="album"></td>
                                    <td>${title}</td>
                                    <td>${artist}</td>
                                    <td onclick="event.cancelBubble=true">
                                        <button onclick="like_music(${rank})"><span class="heart">🤍  </span></button>
                                    </td>
                                </tr>`
                } else {
                    temp_html = `<tr class="music" onclick="move_page(${rank})">
                                    <th scope="row">${rank}</th>
                                    <td><img class="album"
                                             src="${image}"
                                             alt="album"></td>
                                    <td>${title}</td>
                                    <td>${artist}</td>
                                    <td onclick="event.cancelBubble=true">
                                        <button onclick="cancel_music(${rank})"><span class="heart">❤️</span></button>
                                    </td>
                                </tr>`
                }
                $('.music_list').append(temp_html)
            }
        }
    })
}


function like_music(rank) {
    $.ajax({
        type: 'POST',
        url: '/music/like',
        data: {'rank_give': rank},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

function cancel_music(rank) {
    $.ajax({
        type: 'POST',
        url: '/music/cancel',
        data: {'rank_give': rank},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}



