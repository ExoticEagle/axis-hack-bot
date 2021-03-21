# app.py
import asyncpg
import bs4
from bs4 import BeautifulSoup
import flask
from flask import Flask, request, jsonify, url_for
import itertools
import json
import os
# import pandas
import re
import requests
import snscrape.modules.twitter as sntwitter

app = Flask(__name__)

#!########## Internal helper functions ##########
def is_not_hashtag(obj):
    return type(obj) != type(bs4.Tag(name=''))

# Returns list of tuples (tweet, tweet_id) for tweets that are NOT retweets
def get_tweets(handle, max_results=100, debug=False):
    return [[tweet.content, tweet.id, tweet.quotedTweet] for i, tweet in enumerate(sntwitter.TwitterSearchScraper(f'from:{handle}').get_items()) if i<max_results]
    
#! ML STUFF
def get_reply_text(tweet_ID):
	# first get tweet text using ID
	return ""

#!########## DATABASE STUFF ##########
async def init_db() -> asyncpg.connection.Connection:
    conn = await asyncpg.connect(dsn=os.getenv('DATABASE_URL'))
    await conn.execute(
    '''CREATE TABLE IF NOT EXISTS bot_history (
            s_no SERIAL PRIMARY KEY, 
            reply_content varchar2(288), 
            tweet_id varchar2(20)
        )
    ''')
    # print("Create table if not exists done.")
    return conn

async def insert_history(reply_text, tweet_id): 
    conn = await init_db()
    await conn.execute("INSERT INTO bot_history VALUES ($1, $2)", reply_text, tweet_id)
    await conn.close()

##########! ACTUAL FLASK ENDPOINTS, returning json ###########

# takes just one tweet ID as GET parameter and inserts into table
@app.route('/update_history', methods=['POST', 'GET'])
async def update_history():
    tweet_id = request.args.get('tweet_id')
    tweet_text = None
    reply_text = get_reply_text(tweet_text)
    
    await insert_history(reply_text, tweet_id)

@app.route('/display/', methods=['POST', 'GET'])
def display():
    handle = request.args.get('handle')
    max_results = request.args.get('max_results')
    if max_results:
        tweets = get_tweets(handle, max_results, debug=True)
    else:
        tweets = get_tweets(handle, debug=True)
    
    print(f"Handle = {handle}, max_results = {max_results}")

    # You can add the test cases you made in the previous function, but in our case here you are just testing the POST functionality
    if handle:
        handle = handle.lower() # since it is NOT case-sensitive

        return Flask.make_response(app, { # When a dict is passed to this, it automatically gets json-ified
            "Handle": f"{handle}",
            "Tweets": tweets 
        })
    else:
        return Flask.make_response(app, {
            "ERROR": "No handle found, please send a handle."
        })

# index.html basically (not needed in production because we have React frontend)
@app.route('/')
def index():
    return Flask.make_response(app,
        "<h1>Welcome to the backend webapp!</h1>" + \
        f"<form action=\"{url_for('display')}\"> " + \
        "Enter twitter handle to search: <input type=\"text\" id=\"handle\" name=\"handle\">" + \
        f"</form>"
    )

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(
        threaded=True, 
        port=5000, 
        debug=True
    )