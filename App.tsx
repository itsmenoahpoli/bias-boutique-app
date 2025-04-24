import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppNavigation } from "@/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useUserStore } from "@/store/user.store";

const App: React.FC = () => {
  const loadUser = useUserStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, []);

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
