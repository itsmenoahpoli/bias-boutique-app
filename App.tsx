import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppNavigation } from "@/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigation />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
