$(document).ready(function () {
    q1();
    const rank = window.document.URL.split("?rank=")[1];
    move_page(rank);
    show_comment(rank);
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
            const {rank, title, image} = response
            $('#artist').append(`<p>${title}</p>`)
            $('#album').attr('src', image)
            $('#post-button').attr('onclick', `save_comment(${rank})`)
        }
    })
}

// 복붙

function save_comment(rank) {
    let nickname = $('#nickname').val()
    let comment = $('#comment').val()

    if (nickname === '' || comment === '') {
        alert('댓글을 작성해 주세요.')
    } else {
        $.ajax({
            type: "POST",
            url: `/comment/post?rank=${rank}`,
            data: {'nickname_give': nickname, 'comment_give': comment},
            success: function (response) {
                // alert(response["msg"])
                window.location.reload()
            }
        });
    }
}

function show_comment(rank) {
    $('#comment-list').empty()
    $.ajax({
        type: "GET",
        url: `/comment/show?rank=${rank}`,
        date: {}, success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let num = rows[i]['num']
                let nickname = rows[i]['nickname']
                let comment = rows[i]['comment']
                let temp_html = `<div class="card">
                                    <div class="card-body">
                                        <div class="text">
                                        <blockquote class="blockquote mb-0">
                                            <p>${comment}</p>
                                            <footer class="blockquote-footer">${nickname}</footer>
                                        </blockquote>
                                        </div>
                                        
                                        <div class="buttongroup">
                                            <button onclick="open_edit(${rank},${num})" type="button" id="edit">
                                                ✂
                                            </button>
                                            <button onclick="delete_box(${rank},${num})" type="button" id="delete">
                                                ✖
                                            </button>
                                        </div>
                                    </div>
                                 </div>`

                $('#comment-list').append(temp_html)
            }
        }
    })
}


function delete_box(rank, num) {

    $('#delete-box').show()

    temp_html = `<h3>삭제 하시겠습니까?</h3>
                <div class="delete_btns">
                    <button onclick="delete_btn(${rank},${num})" type="button" class="btn btn-dark ">삭제</button>
                    <button onclick="cancel_btn()" type="button" class="btn btn-dark ">취소</button>
                </div>`

    $('#delete-box').append(temp_html)
}


function delete_btn(rank, num) {
    $.ajax({
        type: "POST",
        url: `/comment/delete?rank=${rank}&${num}`,
        data: {num_give: num},
        success: function (response) {
            window.location.reload()
        }
    });
}


function cancel_btn() {
    $('#delete-box').hide()
    window.location.reload()
}


function open_edit(rank, num) {
    $.ajax({
        type: 'POST',
        url: `/comment/edit?rank=${rank}&${num}`,
        data: {num_give: num},
        success: function (response) {
            const {nickname, comment} = response

            $('#nickname').attr('value', `${nickname}`)
            $('#comment').val(`${comment}`)
            $('#post-button').text('수정')
            $('#post-button').removeAttr('onclick')
            $('#post-button').attr('onclick',`edit_order(${rank},${num})`)
            $('#post').attr('style', "background-color: #384b5e;")
        }
    })

}



function edit_order(rank, num) {
    let nickname = $('#nickname').val()
    let comment = $('#comment').val()

    $.ajax({
        type: "POST",
        url: `/comment/resave?rank=${rank}&${num}`,
        data: {num_give: num, "nickname_give": nickname, "comment_give": comment},
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}