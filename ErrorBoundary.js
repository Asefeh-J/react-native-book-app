import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('🛑 ErrorBoundary caught an error:', error, info);
    this.setState({ info });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    const { hasError, error, info } = this.state;

    if (hasError) {
      return (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.errorTitle}>❌ خطایی رخ داد</Text>
          <Text style={styles.errorText}>
            مشکلی در اجرای برنامه به وجود آمده است. لطفاً برنامه را ببندید و دوباره باز کنید.
          </Text>

          {__DEV__ && error && (
            <View style={styles.devDetails}>
              <Text style={styles.devTitle}>🔍 خطای توسعه‌دهنده:</Text>
              <Text style={styles.devError}>{String(error)}</Text>
              {info?.componentStack && (
                <Text style={styles.devStack}>{info.componentStack}</Text>
              )}
            </View>
          )}

          <Button title="تلاش مجدد" onPress={this.handleReset} />
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F4F1EA',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#B00020',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#3E3C64',
    textAlign: 'center',
    marginBottom: 20,
  },
  devDetails: {
    marginTop: 20,
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  devTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#B00020',
  },
  devError: {
    fontFamily: 'Courier',
    color: '#D32F2F',
  },
  devStack: {
    fontFamily: 'Courier',
    marginTop: 5,
    color: '#555',
  },
});

export default ErrorBoundary;
