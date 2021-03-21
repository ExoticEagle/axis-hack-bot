import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderLoginButton = this.renderLoginButton.bind(this);
    this.history = this.props.history;
    this.state.userHandle = "";
  }
  renderLoginButton() {
    return (
      <div class="m-auto text-center bg-white border border-black rounded-md pl-5 pr-7 py-7">
        <p className="text-5xl mb-10 font-extrabold text-gray-800">
          Exotic Eagles
        </p>
        <div class="blocks mb-4 w-full">
          <input
            onChange={(e) => {
              this.setState({
                userHandle: e.target.value,
              });
            }}
            type="text"
            placeholder="Enter handle"
            className=" text-2xl font-mono text-left w-full outline-none"
          />
        </div>
        <button
          className=" blocks accent text-2xl mx-auto w-auto inline-block"
          onClick={() => {
            localStorage.setItem("userHandle", this.state.userHandle);
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
      <div>
        <div class="text-center bg-gray-200  h-screen  flex items-center overflow-hidden ">
          {this.renderLoginButton()}
        </div>
      </div>
    );
  }
}
export default Login;
