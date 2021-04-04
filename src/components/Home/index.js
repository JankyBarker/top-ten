import React, { Component } from "react";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  movieName: "",
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
    //console.log("handleClick..." + id);

    this.props.firebase.RemoveMovie(id);
  }

  onSubmit = (event) => {
    const { movieName } = this.state;

    this.props.firebase.SaveMovie(movieName);

    //stop refreshing by default when clicking submit
    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.setState({ loading: true });

    var topUserPostsRef = this.props.firebase.toptens();

    topUserPostsRef.on("value", (snapshot) => {
      var movieList = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          var item = childSnapshot.val();
          item.key = childSnapshot.key;
          item.uid = childSnapshot.key;
          movieList.push(item);
        });
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
    const { movies, loading, movieName, error } = this.state;

    return (
      <div>
        <h1>Home</h1>
        <form onSubmit={this.onSubmit}>
          <input
            name="movieName"
            value={movieName}
            onChange={this.onChange}
            type="text"
            placeholder="Name of movie?"
          />
          <button type="submit">Save</button>
        </form>
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
