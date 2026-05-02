import QueryProvider from "./query_provider";
import ThemeProvider from "./theme_provider";   
import AuthProvider from "./auth_provider";
import { Toaster } from 'react-hot-toast';

export default function AppProviders({ children  }  : { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#1F2937',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
              },
              success: {
                iconTheme: {
                  primary: '#1F7A63',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E63946',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}