# app.py
import bs4
from bs4 import BeautifulSoup
import flask
from flask import Flask, request, jsonify, url_for
import itertools
import json
import re
import requests
app = Flask(__name__)

########### Internal helper functions ##########
def is_not_hashtag(obj):
    return type(obj) != type(bs4.Tag(name=''))

# Returns list of tuples (tweet, tweet_id) for tweets that are NOT retweets
def get_tweets(handle, debug=False):
    response = requests.request(method="get", url=f"https://syndication.twitter.com/timeline/profile/?screen_name={handle}")
    soup = BeautifulSoup(response.json()['body'], "html.parser")

    # all tweets regardless of whether retweet or not
    all_tweets = [tweet.contents[0] for tweet in soup.find_all("p", class_="timeline-Tweet-text")]

    # all this stuff to get tweet ID
    all_ids = [re.search('/status/(\d+)', a_tag['href']).group(1) for a_tag in soup.find_all("a", class_ = "timeline-Tweet-timestamp")]

    # filter out hashtags 
    all_tweets = list(filter(lambda obj: type(obj[1]) != type(bs4.Tag(name='')), enumerate(all_tweets)))
    indices_to_keep, all_tweets = map(list, list(zip(*all_tweets)))

    if debug:
        print("ALL Tweets: [")
        for _id, _tweet in zip(all_ids, all_tweets):
            print(f'\tID: {_id}, Text: {_tweet},')
        print("]")

    # filter out retweets
    for idx, author in enumerate(soup.find_all("span", class_ = "TweetAuthor-screenName Identity-screenName")):
        if author.contents[0].lower() != f"@{handle}".lower() and idx in indices_to_keep: # if have to remove it
            indices_to_keep.remove(idx)
    
    user_tweets = [tweet for i, tweet in enumerate(all_tweets) if i in indices_to_keep]
    user_ids = [_id for idx, _id in enumerate(all_ids) if idx in indices_to_keep]

    if debug:
        print(f"User tweets: {user_tweets}")
        print(f"User ids: {user_ids}")

    return list(zip(user_tweets, user_ids))

##########! ACTUAL FLASK ENDPOINTS, returning json ###########

@app.route('/display/', methods=['POST', 'GET'])
def display():
    param = request.args.get('handle')
    tweets = get_tweets(param, debug=True)
    
    print(f"Param = {param}")

    # You can add the test cases you made in the previous function, but in our case here you are just testing the POST functionality
    if param:
        param = param.lower() # since it is NOT case-sensitive

        return Flask.make_response(app, { # When a dict is passed to this, it automatically gets json-ified
            "Handle": f"{param}",
            "Tweets": tweets 
        })
    else:
        return Flask.make_response(app, {
            "ERROR": "No handle found, please send a handle."
        })

# index.html basically (not needed in production because we have React frontend)
@app.route('/')
def index():
    return flask.Response(
        "<h1>Welcome to our webapp!</h1>" + \
        f"<form action=\"{url_for('display')}\"> " + \
        "Enter twitter handle to search: <input type=\"text\" id=\"handle\" name=\"handle\">" + \
        f"</form>",
        mimetype="application/json"
    )

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(
        threaded=True, 
        port=5000, 
        debug=True
    )