import { ThemeProvider } from './context/ThemeContext';
import { PlacementPredictionWorkspace } from './components/predictor/PlacementPredictionWorkspace';

export default function App() {
  return (
    <ThemeProvider>
      <PlacementPredictionWorkspace />
    </ThemeProvider>
  );
}
