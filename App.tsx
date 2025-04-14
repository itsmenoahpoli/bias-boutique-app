import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppNavigation } from "@/navigation";

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigation />
    </SafeAreaProvider>
  );
};

export default App;
