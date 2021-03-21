import React from "react";
import Header from "./Header.js";
import URL from "./Constants.js";
import axios from "axios";

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
    this.state.tweets = [
      {
        tweetID: "hello world",
        tweetText: "sdfds",
      },
    ];
    this.history = this.props.history;
    this.state.currentHandle = "";
    this.state.errorMessage = "";
    this.state.onDisplay = false;

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
    return this.state.tweets.map((tweet) => (
      <tr>
        <th scope="col">
          <span class=" text-left text-xs">{tweet.tweetID}</span>
          <span class=" text-left  text-xs">{tweet.tweetText}</span>
          <span class=" text-left text-xs">{tweet.replyText}</span>
          <span class=" text-left text-xs">{tweet.replyID}</span>
        </th>
      </tr>
    ));
  }

  handleGenerateButton() {
    axios
      .post(URL + "getTweets", {
        userHandle: this.state.currentHandle,
      })
      .then((response) => {
        this.setState({
          tweets: response.data.tweets,
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

  render() {
    return (
      <div>
        <Header />
        {this.createform()}
        {this.renderGenerateButton()}
        {this.state.onDisplay && this.renderTweets()}
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
