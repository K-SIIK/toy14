import requests
from bs4 import BeautifulSoup

from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.zk1syua.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
data = requests.get('https://www.genie.co.kr/chart/top200?ditc=M&rtm=N&ymd=20210701', headers=headers)

soup = BeautifulSoup(data.text, 'html.parser')

trs = soup.select('#body-content > div.newest-list > div > table > tbody > tr')
for tr in trs:
    rank = tr.select_one('td.number').text[0:2].strip()
    title = tr.select_one('td.info > a.title.ellipsis').text.strip()
    artist = tr.select_one('td.info > a.artist.ellipsis').text
    image = tr.select_one('td:nth-child(3) > a > img')['src']
    if '19금' in title:
        title = title.strip('19금').strip()
    if '(' in title:
        idx = title.index('(')
        title = title[:idx]

    doc = {
        'rank': int(rank),
        'image': image,
        'title': title,
        'artist': artist,
        'like': False
    }

    db.musics.insert_one(doc)
