import { useEffect, useRef } from 'react';
import BeefreeSDK from '@beefree.io/sdk';

export default function BeefreeEditor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initializeEditor() {
      try {
        // Beefree SDK configuration
        const beeConfig = {
          container: 'beefree-react-demo',
          language: 'en-US',
          onSave: (pageJson: string, pageHtml: string, ampHtml: string | null, templateVersion: number, language: string | null) => {
            console.log('Saved!', { pageJson, pageHtml, ampHtml, templateVersion, language });
          },
          onError: (error: unknown) => {
            console.error('Error:', error);
          }
        };

        // Load provided template from public folder
        const templateJson = await fetch('/black-friday-template.json')
          .then((r) => (r.ok ? r.json() : undefined))
          .catch(() => undefined);

        // Get a token from your backend
        const response = await fetch(import.meta.env.VITE_BEE_AUTH_URL || 'http://localhost:3001/proxy/bee-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: 'demo-user' })
        });
        const token = await response.json();

        // Ensure token includes v2 flag per best practices
        const v2Token = { ...token, v2: true };

        // Initialize the editor using the constructor and start promise
        const BeefreeSDKInstance = new BeefreeSDK(v2Token);
        BeefreeSDKInstance
          .start(beeConfig, templateJson, '', { shared: false })
          .then(() => {
            // Editor initialized
            console.log('Beefree SDK initialized successfully');
          })
          .catch((err: unknown) => {
            console.error('Error during start():', err);
          });
      } catch (error) {
        console.error('error during initialization --> ', error);
      }
    }

    initializeEditor();
  }, []);

  return (
    <div
      id="beefree-react-demo"
      ref={containerRef}
      style={{
        height: '600px',
        width: '90%',
        margin: '20px auto',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}
    />
  );
}