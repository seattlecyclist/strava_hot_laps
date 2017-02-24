import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    return (
      <div>
        <h1>Strava Hot Laps</h1>
      </div>
    );
  }

  componentWillMount() {
      console.log("React App Component Will Mount");

  }
}

render(<App/>, document.getElementById('app'));