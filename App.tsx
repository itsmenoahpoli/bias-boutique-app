import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppNavigation } from "@/navigation";

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <AppNavigation />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
