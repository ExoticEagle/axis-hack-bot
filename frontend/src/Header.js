import React from "react";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.history = this.props.history;
  }
  renderHeading() {}

  render() {
    return (
      <div className="bg-gray-200  flex flex-row p-4">
        <p
          className="text-4xl font-extrabold  flex-grow"
          style={{ "--block-accent-color": "#1DA1F2" }}
        >
          Exotic Eagles
        </p>
        <button
          class="blocks text-right text-md "
          onClick={() => {
            this.history.push("/");
          }}
        >
          Logout
        </button>
      </div>
    );
  }
}
export default Header;
