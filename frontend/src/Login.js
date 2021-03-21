import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderLoginButton = this.renderLoginButton.bind(this);
    this.history = this.props.history;
  }
  renderLoginButton() {
    return (
      <div class="m-auto text-center">
        <div class="blocks mb-4 w-full">
          <input
            type="text"
            placeholder="Enter handle"
            className=" text-2xl font-mono text-left w-full outline-none"
          />
        </div>
        <button
          className=" blocks accent text-2xl mx-auto w-auto inline-block"
          onClick={() => {
            this.history.push("/home");
          }}
          style={{ "--block-accent-color": "#1DA1F2" }}
        >
          Get started
        </button>
      </div>
    );
  }
  render() {
    return (
      <div class="text-center bg-gray-200  h-screen  flex items-center overflow-hidden ">
        {this.renderLoginButton()}
      </div>
    );
  }
}
export default Login;
