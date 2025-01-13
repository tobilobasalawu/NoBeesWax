import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tempo } from "tempo-devtools/dist/vite";


const conditionalPlugins = [];
if (process.env.TEMPO) {
  conditionalPlugins.push('tempo-devtools/dist/babel-plugin');
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [...conditionalPlugins]
      }
    }),
    tempo() // Add the tempo plugin
  ]
});
