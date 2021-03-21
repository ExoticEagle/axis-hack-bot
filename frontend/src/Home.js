import React from "react";
import Header from "./Header.js";
import URL from "./Constants.js";
import axios from "axios";
import { Redirect } from "react-router";
import { Tweet } from "react-twitter-widgets";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.isFinalTweetLoading = false;
    this.state.loaded = [];
    this.state.history = [
      {
        tweetHandle: "dfdf",
        tweetID: "hello world",
        replyID: "ridiculous analogy",
        tweetText: "sdfds",
        replyText: "dfs",
      },
    ];
    this.state.tweets = [];
    this.state.replytweet = {
      id: "fdsdsf",
      text: "dfsdafsf",
    };
    this.state.isReplyButtonVisible = false;
    this.state.openReplyDialog = false;
    this.state.replyingIndex = -1;
    this.history = this.props.history;
    this.state.currentHandle = "";
    this.state.errorMessage = "";
    this.state.onDisplay = false;

    this.handleReply = this.handleReply.bind(this);
    this.renderReplyButton = this.renderReplyButton.bind(this);
    this.handleGenerateButton = this.handleGenerateButton.bind(this);
    this.renderGenerateButton = this.renderGenerateButton.bind(this);
    this.renderCreateLoading = this.renderCreateLoading.bind(this);
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
        <div class="inline-block animate-spin ease duration-50 w-5 h-5  bg-gradient-to-r from-pink-500 to-yellow-500 mx-2"></div>
        <div class="inline-block animate-spin ease duration-50 w-5 h-5  bg-gradient-to-r from-pink-500 to-yellow-500 mx-2"></div>
        <div class="inline-block animate-spin ease duration-50 w-5 h-5 bg-gradient-to-r from-pink-500 to-yellow-500 mx-2"></div>
        <div class="inline-block animate-spin ease duration-50 w-5 h-5 bg-gradient-to-r from-pink-500 to-yellow-500 mx-2"></div>
      </div>
    );
  }

  renderTweets() {
    return this.state.tweets.map((tweet, index) => (
      <div
        class="m-4 "
        onClick={() => {
          this.setState({
            replyingIndex: index,
            openReplyDialog: true,
          });
          //this.handleReply();
        }}
      >
        <Tweet
          onLoad={() => {
            this.setState((state) => {
              state.loaded[index] = 1;
              if (index === state.tweets.length - 1)
                state.isFinalTweetLoading = false;
              return state;
            });
          }}
          tweetId={tweet[1]}
        />

        <div class="flex item-end">
          {this.state.isReplyButtonVisible &&
            this.state.loaded[index] != 0 &&
            this.renderReplyButton(tweet)}
        </div>
      </div>
    ));
  }

  handleGenerateButton() {
    this.setState({
      isFinalTweetLoading: true,
      tweets: [],
    });
    axios
      .post(URL + "/display/?handle=" + this.state.currentHandle)
      .then((response) => {
        this.setState({
          tweets: response.data.Tweets,
          loaded: Array(response.data.Tweets.length).fill(0),
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(() => {
        this.setState({
          onDisplay: true,
          isReplyButtonVisible: true,
        });
      });
  }
  renderGenerateButton() {
    return (
      <div class="items item-end mt-3">
        <button
          className="blocks accent m-4 bg-indigo-300 item-end text-md"
          onClick={this.handleGenerateButton}
          style={{ "--block-accent-color": "#1DA1F2" }}
        >
          Analyse tweets for this user
        </button>
      </div>
    );
  }
  handleReply(tweet) {
    axios
      .post(URL + "replyToTweet", {
        tweetID: tweet[0],
      })
      .then((response) => {
        this.setState({
          replytweet: response.data.reply_tweet,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  updateHistory(tweet) {
    // axios
    //   .post(URL + "/update_history", {
    //     tweetHandle: this.state.currentHandle,
    //     tweetID: tweet[1],
    //     //replyID: this.state.replytweet.id,
    //     tweetText: tweet[0],
    //     //replyText: this.state.replytweet.text,
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    console.log("we are here");
  }
  renderReplyButton(tweet) {
    //this.handleReply(tweet);
    var tweetURL =
      "https://twitter.com/intent/tweet?text=" +
      this.state.replytweet.text +
      "&in_reply_to=" +
      tweet[1];

    return (
      <div>
        <a
          class="blocks accent"
          style={{ "--block-accent-color": "#1DA1F2" }}
          onClick={() => {
            this.updateHistory(tweet);
          }}
          href={tweetURL}
        >
          Reply
        </a>
      </div>
    );
  }
  render() {
    return (
      <div>
        <Header history={this.history} />
        {this.createform()}
        {this.renderGenerateButton()}
        {this.state.isFinalTweetLoading && this.renderCreateLoading()}
        {this.state.onDisplay && this.renderTweets()}
        <div className="">
          <button
            class="blocks accent p-5 "
            onClick={() => {
              this.history.push("/history");
            }}
            style={{ "--block-accent-color": "#1DA1F2" }}
          >
            Users responded to
          </button>
        </div>
      </div>
    );
  }
}
export default Home;
