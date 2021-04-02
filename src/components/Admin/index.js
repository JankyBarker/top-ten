import React, { Component } from "react";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  movieName: "",
  error: null,
  loading: false,
  users: [],
};

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...INITIAL_STATE,
    };
  }

  onSubmit = (event) => {
    const { movieName } = this.state;
    console.log(movieName);

    this.props.firebase.SaveMovie(movieName);

    //stop refreshing by default when clicking submit
    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    //const { users, loading } = this.state;
    const { users, loading, movieName, error } = this.state;

    return (
      <div>
        <h1>Admin</h1>
        <form onSubmit={this.onSubmit}>
          <input
            name="movieName"
            value={movieName}
            onChange={this.onChange}
            type="text"
            placeholder="Name of movie?"
          />
          <button type="submit">Save</button>

          {error && <p>{error.message}</p>}
        </form>
        {loading && <div>Loading ...</div>}
        <UserList users={users} />
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
        <Welcome name={user.username} />;
      </li>
    ))}
  </ul>
);

function Welcome(props) {
  return <span>Hello, {props.name}</span>;
}

export default withFirebase(AdminPage);
