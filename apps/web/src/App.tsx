/**
 * Minimal presentation host shell — WP-1.1 only.
 * No business features, auth, or API integration.
 */
export function App() {
  return (
    <main>
      <h1>ATI Platform</h1>
      <p data-testid="host-status">Web host ready</p>
    </main>
  );
}
