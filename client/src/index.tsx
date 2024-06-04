import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ThemeWrapper from './theme/ThemeWrapper';
import { AuthProvider } from './providers/AuthProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const queryClient = new QueryClient();

root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeWrapper>
          <App />
        </ThemeWrapper>
      </AuthProvider>
    </QueryClientProvider>
);
