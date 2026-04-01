import QueryProvider from "./query_provider";
import ThemeProvider from "./theme_provider";   
import AuthProvider from "./auth_provider";
import GlobalNotification from "@/shared/ui/GlobalNotification";

export default function AppProviders({ children  }  : { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <GlobalNotification />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}