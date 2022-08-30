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
  music_list = list(db.muiscs.find({}, {'_id': False}))
  return jsonify({'musics': music_list})


if __name__ == '__main__':
  app.run('0.0.0.0', port=5000, debug=True)
