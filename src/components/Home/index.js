import React, { Component } from "react";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  error: null,
  loading: false,
  movies: [],
};

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...INITIAL_STATE,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id) {
    console.log("handleClick..." + id);

    this.props.firebase.RemoveMovie(id);
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.toptens().on("value", (snapshot) => {
      var movieList = [];

      if (snapshot.exists()) {
        const dbObject = snapshot.val();

        movieList = Object.keys(dbObject).map((key) => ({
          ...dbObject[key],
          uid: key,
        }));
      }

      this.setState({
        movies: movieList ? movieList : null,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.toptens().off();
  }

  render() {
    const { movies, loading, error } = this.state;

    return (
      <div>
        <h1>Home</h1>
        {error && <p>{error.message}</p>}
        {loading && <div>Loading ...</div>}
        <ul>
          {movies.map((movie) => (
            <li key={movie.uid}>
              <div>
                <span>Movie: {movie.text} </span>
                <button onClick={this.handleClick.bind(this, movie.uid)}>
                  Delete Row
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withFirebase(HomePage);
