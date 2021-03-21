import React from "react";
import Header from "./Header.js";
import URL from "./Constants.js";
import axios from "axios";
import { Dialog } from "@material-ui/core";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    this.state.openReplyDialog = false;
    this.state.replyingIndex = -1;
    this.history = this.props.history;
    this.state.currentHandle = "";
    this.state.errorMessage = "";
    this.state.onDisplay = false;

    this.handleReply = this.handleReply.bind(this);
    this.renderDialog = this.renderDialog.bind(this);
    this.handleGenerateButton = this.handleGenerateButton.bind(this);
    this.renderGenerateButton = this.renderGenerateButton.bind(this);
  }
  createform() {
    return (
      <div className=" sm:mb-2 sm:mb-2  lg:mb-4 lg:mt-4 ">
        <form className="lg:space-y-2 font-mono sm-text-sm lg:text-2xl ">
          <div class="">
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

  renderTweets() {
    return this.state.tweets.map((tweet, index) => (
      <tr>
        <th scope="col">
          <span
            class=" text-left text-xs"
            onClick={() => {
              this.setState({
                replyingIndex: index,
                openReplyDialog: true,
              });
              //this.handleReply();
            }}
          >
            {tweet}
          </span>
          {/* <span class=" text-left  text-xs">{tweet.tweetText}</span>
          <span class=" text-left text-xs">{tweet.replyText}</span>
          <span class=" text-left text-xs">{tweet.replyID}</span> */}
        </th>
      </tr>
    ));
  }

  handleGenerateButton() {
    axios
      .post(URL + "/display/?handle=" + this.state.currentHandle)
      .then((response) => {
        console.log(response.data.Tweets);
        this.setState({
          tweets: response.data.Tweets,
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(() => {
        this.setState({
          onDisplay: true,
        });
      });
  }
  renderGenerateButton() {
    return (
      <div>
        <button
          className={"w-full blocks accent text-2xl"}
          onClick={this.handleGenerateButton}
        >
          Generate
        </button>
      </div>
    );
  }
  handleReply() {
    //console.log(this.state.tweets[this.state.replyingIndex]);
    this.setState({
      openReplyDialog: false,
    });
    axios
      .post(URL + "replyToTweet", {
        tweet: this.state.tweets[this.state.replyingIndex],
      })
      .then((response) => {
        this.setState({
          replytweet: response.data,
          openReplyDialog: true,
        });
        this.history.push("/reply");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  updateHistory() {
    axios
      .post(URL + "updateHisotry", {
        tweetHandle: this.state.currentHandle,
        tweetID: this.state.tweets[this.state.replyingIndex].id,
        replyID: this.state.replytweet.id,
        tweetText: this.state.tweets[this.state.replyingIndex].text,
        replyText: this.state.replytweet.text,
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  renderDialog() {
    return (
      <div class="text-5xl w-full h-full overflow-hidden">
        <p>{this.state.tweets[this.state.replyingIndex]}</p>
        <p>{this.state.replytweet.text}</p>
        <button
          onClick={() => {
            this.updateHistory();
            var tweetURL = new URLSearchParams();
            tweetURL.append(
              "https://twitter.com/intent/tweet?text=",
              this.state.replytweet.text
            );
            tweetURL.append(
              "&in_reply_to=",
              this.state.tweets[this.state.replyingIndex].id
            );
          }}
        >
          Reply on Twitter
        </button>
      </div>
    );
  }
  render() {
    return (
      <div>
        <Header />
        {this.createform()}
        {this.renderGenerateButton()}
        {this.state.onDisplay && this.renderTweets()}
        <Dialog
          fullscreen
          open={this.state.openReplyDialog}
          onClose={() => {
            this.setState({
              openReplyDialog: false,
            });
          }}
        >
          {this.renderDialog()}
        </Dialog>
        <button
          onClick={() => {
            this.history.push("/history");
          }}
        >
          Display
        </button>
      </div>
    );
  }
}
export default Home;
