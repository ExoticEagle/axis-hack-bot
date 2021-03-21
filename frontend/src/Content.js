import React from "react";
import Header from "./Header.js";
import URL from "./Constants.js";
import axios from "axios";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.tweets = [
      {
        id: "hello world",
        content: "ridiculous analogy",
      },
      {
        id: "hey there",
        content: "sdfdsfsd",
      },
    ];
    this.state.errorMessage = "";

    this.handleButton = this.handleButton.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.state.currentHandle = "";
    this.getTweetHistory = this.getTweetHistory.bind(this);
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
  getTweetHistory() {
    this.setState({});
    axios
      .post(URL + "getHistory")
      .then((response) => {
        this.setState({
          tweets: response.data.tweets,
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(() => {
        this.setState({});
      });
  }

  renderTweets() {
    return this.state.tweets.map((tweet) => (
      <tr>
        <th scope="col">
          <span class=" text-left text-xs">{tweet.id}</span>
          <span class=" text-left  text-xs">{tweet.content}</span>
        </th>
      </tr>
    ));
  }
  handleButton() {
    axios
      .post(URL + "handle", {
        userHandle: this.state.currentHandle,
      })
      .then(console.log("success"))
      .catch((error) => {
        if (error.response.status == 401)
          this.setState({
            errorMessage: "No response!",
          });
        else
          this.setState({
            errorMessage: "Handle does not exist!",
          });
        console.log(this.state.errorMessage);
      });
  }
  handleGenerateButton() {
    axios
      .post(URL + "getTweet", {
        userHandle: this.state.currentHandle,
      })
      .then(console.log("success"))
      .catch((error) => {
        if (error.response.status == 401)
          this.setState({
            errorMessage: "No response!",
          });
        else
          this.setState({
            errorMessage: "Handle does not exist!",
          });
        console.log(this.state.errorMessage);
      });
  }
  renderButton() {
    return (
      <div>
        <button
          className={"w-full blocks accent text-2xl"}
          onClick={this.handleSearchButton}
        >
          Search
        </button>
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
        {this.renderButton()}
        {this.renderTweets()}
      </div>
    );
  }
}
export default Content;
