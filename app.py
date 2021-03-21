# app.py
from flask import Flask, request, jsonify, url_for
import bs4
from bs4 import BeautifulSoup
import itertools
import json
import requests
app = Flask(__name__)

def is_not_hashtag(obj):
    return type(obj) != type(bs4.Tag(name=''))

# Returns list of tweets that are NOT retweets
def get_tweets(handle, debug=False):
    response = requests.request(method="get", url=f"https://syndication.twitter.com/timeline/profile/?screen_name={handle}")
    soup = BeautifulSoup(response.json()['body'], "html.parser")

    # all tweets regardless of whether retweet or not
    all_tweets = [tweet.contents[0] for tweet in soup.find_all("p", class_="timeline-Tweet-text")]

    # filter out hashtags 
    all_tweets = list(filter(is_not_hashtag, all_tweets))
    
    if debug:
        print("ALL Tweets: [")
        print(',\n\t'.join(all_tweets))
        print("]")

    # filter
    isNotRetweets = [author.contents[0].lower() == f"@{handle}".lower() for author in soup.find_all("span", class_ = "TweetAuthor-screenName Identity-screenName")]

    # filtering the list, keeping only NON-RETWEETS
    return list(itertools.compress(all_tweets, isNotRetweets))

@app.route('/display/', methods=['POST', 'GET'])
def display():
    param = request.args.get('handle')
    tweets = get_tweets(param, debug=True)
    
    print(f"Param = {param}")

    # You can add the test cases you made in the previous function, but in our case here you are just testing the POST functionality
    if param:
        param = param.lower() # since it is NOT case-sensitive
        return jsonify({
            "Handle": f"{param}",
            "Tweets": tweets 
        })
    else:
        return jsonify({
            "ERROR": "no handle found, please send a handle."
        })

# A welcome message to test our server
@app.route('/')
def index():
    return "<h1>Welcome to our webapp!</h1>" + \
        f"<form action=\"{url_for('display')}\"> " + \
        "Enter twitter handle to search: <input type=\"text\" id=\"handle\" name=\"handle\">" + \
        f"</form>"

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(
        threaded=True, 
        port=5000, 
        debug=True
    )