import React from "react";
import axios from "axios";

class History extends React.Component {
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
      .post(URL + "history")
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
      <tr>
        <th scope="col">
          <span class=" text-left text-xs">{history.tweetID}</span>
          <span class=" text-left  text-xs">{history.tweetText}</span>
          <span class=" text-left text-xs">{history.replyText}</span>
          <span class=" text-left text-xs">{history.replyID}</span>
        </th>
      </tr>
    ));
  }
  render() {
    return (
      <div>
        <button onClick={this.handleHistory}>Refresh</button>
        {this.state.onDisplay && this.renderHistory()}
        <button
          onClick={() => {
            this.history.goBack();
          }}
        >
          Go back
        </button>
      </div>
    );
  }
}
export default History;
