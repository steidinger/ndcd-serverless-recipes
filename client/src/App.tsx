import { Auth0Provider } from "@auth0/auth0-react";
import { HashRouter as Router } from "react-router-dom";
import { Home } from './screens/Home';
import { authConfig } from './config';

function App() {

  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      redirectUri={authConfig.callbackUrl}
      audience={authConfig.audience}
      >
      <Router>
        <Home />
      </Router>
    </Auth0Provider>
  );
}

export default App;
