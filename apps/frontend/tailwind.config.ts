import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import { join } from 'path';

const config = {
  content: [
    './apps/frontend/**/*.{js,jsx,ts,tsx,html}',
    './libs/**/*.{js,jsx,ts,tsx,html}',
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,js,jsx,html}'
    ),
    createGlobPatternsForDependencies(__dirname),
  ],
  plugins: [],
  daisyui: {
    themes: ['dark'],
  },
};

export default config;
