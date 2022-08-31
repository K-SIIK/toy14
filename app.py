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
  music_list = list(db.musics.find({},{'_id': False}))
  return jsonify({'musics': music_list})


@app.route('/music/like', methods=["POST"])
def like_music():
  rank_receive = request.form["rank_give"]
  db.musics.update_one({'rank': rank_receive}, {'$set': {'like': True}})
  return jsonify({'msg': '좋아요!'})


@app.route('/music/cancel', methods=["POST"])
def cancel_music():
  rank_receive = request.form["rank_give"]
  db.musics.update_one({'rank': rank_receive}, {'$set': {'like': False}})
  return jsonify({'msg': '좋아요 취소'})


@app.route("/comment", methods=["GET"])
def move_page():
  rank = request.args["rank"]
  print(rank)
  post = db.musics.find_one({"rank": rank}, {"_id": False})
  print(post)
  return render_template('comment.html')




if __name__ == '__main__':
  app.run('0.0.0.0', port=5000, debug=True)
