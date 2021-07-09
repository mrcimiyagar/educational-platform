import React from "react";

class Auth extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <iframe name="auth-frame" src={'https://authentication.kaspersoft.cloud'}
            style={{width: '100%', height: '100vh'}} frameBorder="0"></iframe>
    );
  }
}

export default Auth;