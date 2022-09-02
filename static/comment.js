$(document).ready(function () {
    q1()
    show_comment();
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


function save_comment() {
    let nickname = $('#nickname').val()
    let comment = $('#comment').val()

    if (nickname === '' || comment === '') {
        alert('빈란을 채워주세용~~ㅎㅅㅎ')
    } else {
        $.ajax({
            type: "POST",
            url: "/comment/spend",
            data: {'nickname_give': nickname, 'comment_give': comment},
            success: function (response) {
                alert(response["msg"])
                window.location.reload()
            }
        });
    }
}

function show_comment() {
    $('#comment-list').empty()
    $.ajax({
        type: "GET",
        url: "/comment/receive",
        date: {}, success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let num = rows[i]['num']
                let nickname = rows[i]['nickname']
                let comment = rows[i]['comment']
                let temp_html = `<div class="card">
                                    <div class="card-body">
                                        <blockquote class="blockquote mb-0">
                                            <p>${comment}</p>
                                            <footer class="blockquote-footer">${nickname}</footer>
                                        </blockquote>
                                        <div class="buttongroup">
                                            <button onclick="open_edit(${num})" type="button" class="btn btn-outline-secondary btn-sm">
                                                수정
                                            </button>
                                            <button onclick="delete_box(${num})" type="button" class="btn btn-outline-secondary btn-sm">
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                 </div>`

                $('#comment-list').append(temp_html)
            }
        }
    })
}

function delete_box(num) {

    $('#delete-box').show()

    temp_html = `<h3>삭제하시겠습니까?</h3>
                <div class="delete_btns">
                    <button onclick="delete_btn(${num})" type="button" class="btn btn-outline-dark ">삭제</button>
                    <button onclick="cancel_btn()" type="button" class="btn btn-dark ">취소</button>
                </div>`

    $('#delete-box').append(temp_html)
}

function delete_btn(num) {

    $.ajax({
        type: "POST",
        url: "/comment/delete",
        data: {num_give: num},
        success: function (response) {
            alert(response["msg"])

            window.location.reload()
        }
    });
}

function cancel_btn() {
    $('#delete-box').hide()

    window.location.reload()
}

function open_edit(num) {
    $('#edit-box').show()
    $.ajax({
        type: 'GET',
        url: '/comment/edit',
        data: {},
        success: function (response) {
            let rows = response['comments']
            console.log(rows)
            for (let i = 0; i < rows.length; i++) {

                let num1 = rows[i]['num']
                let nickname = rows[i]['nickname']
                let comment = rows[i]['comment']

                let temp_html = ``
                if (num === num1) {
                    temp_html = `<div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="nickname_e" value="${nickname}" placeholder="name@example.com">
                                    <label for="correct nickname">수정할 닉네임</label>
                                 </div>
                                 <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="comment_e" value="${comment}" placeholder="name@example.com">
                                    <label for="correct comment">수정할 댓글</label>
                                 </div>
                                 <div class="mybtn">
                                     <button onclick="edit_order(${num})" type="button" class="btn btn-dark">수정하기</button>
                                     <button onclick="close_edit()" type="button" class="btn btn-outline-dark">닫기</button>
                                 </div>`
                } else {
                    temp_html = ``
                }
                $('#edit-box').append(temp_html)

            }


        }
    })

}

function close_edit() {
    $('#edit-box').hide()

    window.location.reload()

}


function edit_order(num) {
    let nickname = $('#nickname_e').val()
    let comment = $('#comment_e').val()

    $.ajax({
        type: "POST",
        url: "/save/edit_comment",
        data: {num_give:num, 'nickname_give': nickname, 'comment_give': comment},
        success: function (response) {
            alert(response["msg"])

            window.location.reload()
        }
    });
}
