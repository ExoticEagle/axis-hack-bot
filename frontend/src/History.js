import React from "react";
import axios from "axios";
import { Tweet } from "react-twitter-widgets";
import Header from "./Header.js";
import URL from "./Constants";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.history = [];
    this.history = this.props.history;
    this.state.onDisplay = true;
    this.state.errorMessage = "";
    this.handleHistory = this.handleHistory.bind(this);
    this.renderHistory = this.renderHistory.bind(this);
  }
  handleHistory() {
    this.setState({
      onDisplay: false,
    });
    axios
      .post(URL + "/history/?user_handle=" + localStorage.getItem("userHandle"))
      .then((response) => {
        console.log(response);
        this.setState({
          history: response.data.Records,
          onDisplay: true,
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(() =>
        this.setState({
          onDisplay: true,
        })
      );
    console.log(this.state.history);
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
  renderHistory() {
    return (
      <div>
        {this.state.history.map((history) => (
          <div className="mb-2">
            <Tweet tweetId={history[1]} />
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div>
        <Header history={this.history} />
        <div className="flex flex-row ">
          <div className="w-3/4">
            <button
              class="blocks accent"
              style={{ "--block-accent-color": "#1DA1F2" }}
              onClick={this.handleHistory}
            >
              Refresh
            </button>
          </div>
          <div className="flex flex-grow text-right">
            <button
              class="blocks float-right"
              onClick={() => {
                this.history.goBack();
              }}
            >
              Go back
            </button>
          </div>
        </div>
        {!this.state.onDisplay && this.renderCreateLoading()}
        {this.state.onDisplay && this.renderHistory()}
      </div>
    );
  }
}
export default History;
