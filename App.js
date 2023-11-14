import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./context/AuthContext";
import AppNav from "./navigation/AppNav";
import { store } from "./store";
import { Provider } from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </Provider>
  );
}
