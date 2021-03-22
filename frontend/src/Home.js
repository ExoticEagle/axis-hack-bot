import React from 'react';
import Header from './Header.js';
import URL from './Constants.js';
import axios from 'axios';
import { Tweet } from 'react-twitter-widgets';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.loaded = [];
    this.state.tweets = null;
    this.state.generated = false;
    this.state.replytweet = '';
    this.state.isLoadingReplyTweet = [];
    this.state.replyingIndex = -1;
    this.history = this.props.history;
    this.state.currentHandle = '';
    this.state.errorMessage = '';

    this.handleGenerateButton = this.handleGenerateButton.bind(this);
  }
  areTweetsLoaded() {
    return (
      this.state.tweets != null &&
      this.state.loaded.reduce((x, y) => x + y, 0) == this.state.tweets.length
    );
  }
  createform() {
    return (
      <div className=" sm:mb-2 sm:mb-2  pd-4 ">
        <form className="lg:space-y-2 font-mono sm-text-sm lg:text-2xl ">
          <div class="blocks outline-none">
            <input
              type="text"
              placeholder="Twitter handle"
              className="lg:py-3 px-2 py-1 lg:px-4 outline-none lg:w-full"
              value={this.state.currentHandle}
              onChange={(e) => this.setState({ currentHandle: e.target.value })}
            />
          </div>
        </form>
      </div>
    );
  }
  renderCreateLoading() {
    return (
      <div class="relative flex justify-center items-center ">
        <div class="inline-block animate-spin ease duration-50 w-5 h-5 bg-gradient-to-r from-pink-500 to-yellow-500 mx-2"></div>
        <div class="inline-block animate-spin ease duration-50 w-5 h-5 bg-gradient-to-r from-pink-500 to-yellow-500 mx-2"></div>
        <div class="inline-block animate-spin ease duration-50 w-5 h-5 bg-gradient-to-r from-pink-500 to-yellow-500 mx-2"></div>
        <div class="inline-block animate-spin ease duration-50 w-5 h-5 bg-gradient-to-r from-pink-500 to-yellow-500 mx-2"></div>
      </div>
    );
  }
  renderTweets() {
    return (
      <div>
        {this.areTweetsLoaded() &&
          this.state.tweets.length === 0 &&
          this.renderError()}
        {this.state.tweets != null &&
          this.state.tweets.map((tweet, index) => (
            <div
              class="m-4 "
              onClick={() => {
                this.setState({
                  replyingIndex: index,
                });
              }}
            >
              <Tweet
                onLoad={() => {
                  this.setState((state) => {
                    state.loaded[index] = 1;
                    return state;
                  });
                }}
                tweetId={tweet[1]}
              />
              {this.state.isLoadingReplyTweet[index] !== 0 &&
                this.renderLoadingicon()}
              <div class="flex item-end">
                {this.state.tweets != null &&
                  this.state.loaded[index] !== 0 &&
                  this.renderReplyButton(tweet, index)}
              </div>
            </div>
          ))}
      </div>
    );
  }
  renderLoadingicon() {
    return (
      <div>
        <p>
          <span>
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          <span> Generating reply..</span>
        </p>
      </div>
    );
  }
  handleGenerateButton() {
    this.setState({
      tweets: null,
      generated: true,
    });
    axios
      .post(URL + '/display/?handle=' + this.state.currentHandle)
      .then((response) => {
        this.setState({
          tweets: response.data.Tweets,
          loaded: Array(response.data.Tweets.length).fill(0),
          isLoadingReplyTweet: Array(response.data.Tweets.length).fill(0),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  renderGenerateButton() {
    return (
      <div class="items item-end mt-3">
        <button
          className="blocks accent m-4 bg-indigo-300 item-end text-md"
          onClick={this.handleGenerateButton}
          style={{ '--block-accent-color': '#1DA1F2' }}
        >
          Analyse tweets for this user
        </button>
      </div>
    );
  }
  renderError() {
    return (
      <div>
        <p className="font-extrabold">No anti-scientific tweets.</p>
      </div>
    );
  }
  updateHistory(tweet, index) {
    this.setState({
      onLoadReplyTweet: true,
    });
    axios
      .post(
        URL +
          '/update_history/?tweet_id=' +
          tweet[1] +
          '&tweet_text=' +
          tweet[0] +
          '&user_handle=' +
          localStorage.getItem('userHandle')
      )
      .then((response) => {
        // console.log(response.data);
        this.setState((state) => {
          state.isLoadingReplyTweet[index] = 0;
        });
        this.setState(
          {
            replytweet: response.data.reply_text,
          },
          (state) => {
            var tweetURL =
              'https://twitter.com/intent/tweet?text=' +
              this.state.replytweet +
              '&in_reply_to=' +
              tweet[1];

            //console.log(this.state.replytweet);
            window.open(tweetURL, '_blank') ||
              window.location.replace(tweetURL);
          }
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  renderReplyButton(tweet, index) {
    return (
      <div>
        <button
          class="blocks accent"
          style={{ '--block-accent-color': '#1DA1F2' }}
          onClick={() => {
            this.setState((state) => {
              state.isLoadingReplyTweet[index] = 1;
            });
            this.updateHistory(tweet, index);
          }}
        >
          Reply
        </button>
      </div>
    );
  }
  render() {
    return (
      <div>
        <Header history={this.history} />
        <div className="">
          <button
            class="blocks accent p-5 "
            onClick={() => {
              this.history.push('/history');
            }}
            style={{ '--block-accent-color': '#1DA1F2' }}
          >
            Users responded to
          </button>
        </div>
        {this.createform()}
        {this.renderGenerateButton()}
        {this.state.generated &&
          !this.areTweetsLoaded() &&
          this.renderCreateLoading()}
        {this.state.tweets != null && this.renderTweets()}
      </div>
    );
  }
}
export default Home;
