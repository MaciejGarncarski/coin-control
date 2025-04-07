export default {
  '*.{js,jsx,ts,tsx,css,json,md,mdx}': ['pnpm prettier --write --cache'],
  '*.{js,jsx,ts,tsx}': ['pnpm eslint --fix --max-warnings=0 --no-warn-ignored'],
}
