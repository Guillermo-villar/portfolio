# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### Webhook analytics (n8n)

Este proyecto incluye un tracker (`src/components/VisitorTracker.tsx`) que manda un POST a n8n al salir de la página (evento `visibilitychange`).

- En desarrollo (`npm start`) lee `REACT_APP_N8N_WEBHOOK_URL` desde `.env.development`.
- En producción (`npm run build`) lee `REACT_APP_N8N_WEBHOOK_URL` desde `.env.production`.

Para comprobar que se envía correctamente:

1. Abre DevTools → Network.
2. Navega por 1-2 rutas.
3. Cambia de pestaña o cierra la pestaña.
4. Verás un POST al webhook configurado con el payload `{ visitor, history, summary }`.

### `npm test`

Launches the test runner in the interactive watch mode.,
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

#### Deploy (GitHub Pages / branch `gh_pages`)

Este repo está pensado para servir el contenido estático de `build/`. Si usas una branch `gh_pages` como fuente del hosting, el flujo típico es:

1. Asegura que `.env.production` tiene `REACT_APP_N8N_WEBHOOK_URL` apuntando al webhook de producción (no `webhook-test`).
2. Genera el build.
3. Publica el contenido de `build/` en la branch `gh_pages` (el mecanismo exacto depende de cómo lo tengas montado: manual o con GitHub Actions).

Nota: Create React App solo expone variables de entorno que empiezan por `REACT_APP_`.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
