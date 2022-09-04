from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.zk1syua.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta


@app.route('/')
def home():
  return render_template('index.html')


@app.route('/music', methods=['GET'])
def get_music():
  music_list = list(db.musics.find({}, {'_id': False}))
  return jsonify({'musics': music_list})


@app.route('/music/like', methods=["POST"])
def like_music():
  rank_receive = int(request.form["rank_give"])
  db.musics.update_one({'rank': rank_receive}, {'$set': {'like': True}})
  return jsonify({'msg': '좋아요!'})


@app.route('/music/cancel', methods=["POST"])
def cancel_music():
  rank_receive = int(request.form["rank_give"])
  db.musics.update_one({'rank': rank_receive}, {'$set': {'like': False}})
  return jsonify({'msg': '좋아요 취소'})


@app.route("/comment", methods=["GET"])
def move_page():
  return render_template("comment.html")


@app.route("/comment/view", methods=["GET"])
def show_page():
  rank = int(request.args["rank"])
  music_info = db.musics.find_one({"rank": rank}, {"_id": False})
  return jsonify(music_info)


@app.route("/comment/post", methods=["POST"])
def save_comment():
  rank = int(request.args["rank"])
  nickname_receive = request.form["nickname_give"]
  comment_receive = request.form["comment_give"]

  comment_list = list(db.comment.find({"rank": rank}, {'_id': False}))
  count = len(comment_list) + 1

  doc = {
    'rank': rank,
    'num': count,
    'nickname': nickname_receive,
    'comment': comment_receive
  }

  db.comment.insert_one(doc)
  return jsonify({'msg': '응원 완료!'})


@app.route("/comment/show", methods=["GET"])
def show_comment():
  rank = int(request.args["rank"])

  comment_list = list(db.comment.find({'rank': rank}, {'_id': False}))
  return jsonify({'comments': comment_list})


@app.route("/comment/delete", methods=["POST"])
def delete_post():
  rank = int(request.args["rank"])
  num_receive = int(request.form['num_give'])
  db.comment.delete_one({"rank": rank, "num": num_receive})

  delete_info = list(db.comment.find({"rank": rank, "num": {"$gt": num_receive}}))
  cnt = len(delete_info)

  if cnt != 0:
    for i in range(num_receive + 1, num_receive + cnt + 1):
      db.comment.update_one({"rank": rank, "num": i}, {'$set': {"num": i - 1}})


  return jsonify({'msg': '삭제 완료!'})


@app.route("/comment/edit", methods=["POST"])
def open_edit():
  rank = int(request.args["rank"])
  num_recieve = int(request.form["num_give"])

  comment = db.comment.find_one({"rank": rank, "num": num_recieve}, {'_id': False})
  return jsonify(comment)


@app.route("/comment/resave", methods=["POST"])
def edit_post():
  rank = int(request.args["rank"])
  num_receive = int(request.form['num_give'])
  nickname_receive = request.form['nickname_give']
  comment_receive = request.form['comment_give']

  db.comment.update_one({'rank':rank, 'num': int(num_receive)},
                        {'$set': {'nickname': nickname_receive, 'comment': comment_receive}})
  return jsonify({'msg': '수정 완료!'})


if __name__ == '__main__':
  app.run('0.0.0.0', port=5000, debug=True)
