
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById("root")!).render(
	<ThemeProvider>
		<App />
	</ThemeProvider>
);
