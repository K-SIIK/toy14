$(document).ready(function (){
    listing();
});

function listing() {
    $('.music_list').empty()

    $.ajax({
        type: "GET",
        url: '/music',
        data: {},
        success: function (response) {
            let rows = response['musics']
            for (let i=0; i<rows.length; i++) {
                let rank = rows[i]['rank']
                let image = rows[i]['image']
                let title = rows[i]['title']
                let artist = rows[i]['artist']
                let like = rows[i]['like']

                let temp_html = ``

                if (like === 0) {
                    temp_html = `<tr class="music" onclick="location.href='comment.html'">
                                    <th scope="row">${rank}</th>
                                    <td><img class="album"
                                             src="${image}"
                                             alt="album"></td>
                                    <td>${title}</td>
                                    <td>${artist}</td>
                                    <td>
                                        <button><span class="heart">🤍  </span></button>
                                    </td>
                                </tr>`
                } else {
                    temp_html = `<tr class="music" onclick="location.href='comment.html'">
                                    <th scope="row">${rank}</th>
                                    <td><img class="album"
                                             src="${image}"
                                             alt="album"></td>
                                    <td>${title}</td>
                                    <td>${artist}</td>
                                    <td>
                                        <button><span class="heart">❤️</span></button>
                                    </td>
                                </tr>`
                }
                $('.music_list').append(temp_html)
            }
        }
    })
}

function like_music(rank) {
    rank.stopPropagation();
    $.ajax({
        type: 'POST',
        url: '/music/like',
        data: {'rank_give':rank},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

