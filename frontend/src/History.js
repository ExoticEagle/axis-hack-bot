import React from "react";
import axios from "axios";
import { Tweet } from "react-twitter-widgets";
import Header from "./Header.js";

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
      .post(URL + "history", { userHandle: localStorage.getItem("userHandle") })
      .then((response) => {
        this.setState({
          history: response.data.history,
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
  }
  renderHistory() {
    return this.state.history.map((history) => (
      <div className="mb-2">
        <Tweet tweetId={history[2]} />
        <Tweet tweetId={history[1]} />
      </div>
    ));
  }

  render() {
    return (
      <div>
        <Header history={this.history} />
        <div className="flex flex-row ">
          <div className="w-4/5">
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
        {this.state.onDisplay && this.renderHistory()}
      </div>
    );
  }
}
export default History;
