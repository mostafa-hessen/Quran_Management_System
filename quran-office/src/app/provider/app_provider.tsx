import QueryProvider from "./query_provider";
import ThemeProvider from "./theme_provider";   
import AuthProvider from "./auth_provider";

export default function AppProviders({ children  }  : { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}