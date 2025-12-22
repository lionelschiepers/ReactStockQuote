This project is built with [Next.js](https://nextjs.org/) and React.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `out` folder (static export).<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm start`

Starts the production server. Make sure you have run `npm run build` first.

### `npm run lint`

Runs ESLint to check for code quality issues.

### `npm run build:proxy`

Builds the API proxy functions located in the `api/` directory.

### `npm run deploy`

Builds and deploys the app to GitHub Pages using the `gh-pages` package.

## Project Structure

This project follows a structured approach with the following key directories:

- `pages/` - Next.js pages and API routes
- `components/` - React components organized by type:
  - `features/` - Business logic components
  - `layout/` - Layout components like navigation
  - `ui/` - Reusable UI components
- `lib/` - Configuration files and utilities
- `api/` - Azure Functions for API proxy
- `public/` - Static assets
- `styles/` - CSS and styling files

## Learn More

To learn more about Next.js, check out the [Next.js documentation](https://nextjs.org/docs).

To learn React, check out the [React documentation](https://reactjs.org/).

### Deployment

This project is configured for static export and can be deployed to various static hosting platforms. The current setup includes GitHub Pages deployment via the `npm run deploy` script.

For more deployment options, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

### Static Export Configuration

The project uses Next.js static export feature with the following configuration:
- Output mode: static export
- Trailing slashes: enabled
- Images: unoptimized (for static compatibility)
