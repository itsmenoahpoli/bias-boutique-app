import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppNavigation } from "@/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useUserStore } from "@/store/user.store";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://e83772699b59c927ac8f1fd3c01bb206@o1177737.ingest.us.sentry.io/4509225240559616',

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

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

export default Sentry.wrap(App);