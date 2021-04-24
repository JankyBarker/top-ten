import React from "react";

const FirebaseContext = React.createContext(null);

export const withFirebase = (ComponentArg) => (props) => (
  <FirebaseContext.Consumer>
    {(firebase) => <ComponentArg {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;
