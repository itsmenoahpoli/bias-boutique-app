import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { GradientLayout } from "./layouts/GradientLayout";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showErrorDetails: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showErrorDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      showErrorDetails: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, showErrorDetails: false });
  };

  toggleErrorDetails = () => {
    this.setState((prevState) => ({
      showErrorDetails: !prevState.showErrorDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <GradientLayout>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.container}>
              <Text style={styles.title}>Oops! Something went wrong</Text>
              <Text style={styles.message}>
                We apologize for the inconvenience. Please try again.
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={this.handleRestart}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.debugButton}
                onPress={this.toggleErrorDetails}
              >
                <Text style={styles.debugButtonText}>
                  {this.state.showErrorDetails
                    ? "Hide Error Details"
                    : "Show Error Details"}
                </Text>
              </TouchableOpacity>

              {this.state.showErrorDetails && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorTitle}>Error Details:</Text>
                  <Text style={styles.errorName}>
                    {this.state.error?.name || "Unknown Error"}
                  </Text>
                  <Text style={styles.errorMessage}>
                    {this.state.error?.message || "No error message available"}
                  </Text>
                  <Text style={styles.errorStack}>
                    {this.state.error?.stack || "No stack trace available"}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </GradientLayout>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "white",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  buttonText: {
    color: "#8e2de2",
    fontSize: 16,
    fontWeight: "bold",
  },
  debugButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  debugButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  errorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    width: "100%",
    maxHeight: 300,
  },
  errorTitle: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorName: {
    color: "#FFD93D",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  errorMessage: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
  },
  errorStack: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontFamily: "monospace",
  },
});
