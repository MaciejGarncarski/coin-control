export default {
  '*.{js,jsx,ts,tsx,json}': ['pnpm prettier --write --cache'],
  '*.{js,jsx,ts,tsx}': ['pnpm eslint --fix --max-warnings=0 --no-warn-ignored'],
}
