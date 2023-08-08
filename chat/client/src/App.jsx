import axios from "axios";
import {UserContextProvider} from "./UserContext";
import Routes from "./Routes";

function App() {
  axios.defaults.baseURL = 'http://localhost:4040';
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App
