import React from 'react';

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
        <div className="flex-grow">
          <p
            className="text-4xl font-extrabold"
            style={{ '--block-accent-color': '#1DA1F2' }}
          >
            Exotic Eagles
          </p>
          <p className="font-mono text-sm">
            Fighting for science since 2021...
          </p>
        </div>
        <button
          class="blocks text-right text-md "
          onClick={() => {
            this.history.push('/');
          }}
        >
          Logout
        </button>
      </div>
    );
  }
}
export default Header;
