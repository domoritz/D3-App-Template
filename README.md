# D3-App-Template

A template for an interactive web application with D3

## Launch the app

```bash
yarn
yarn dev
```

This launches the app in developer mode. To run the app in production mode, run `yarn build` or see below.

## Code style

We recomme dusing VSCode for development. You can run `yarn lint` to check for linting errors.
Note that these tests automatically run when you comit your code to GitHub. See `test.yml` for details.
You can fix a lot of issues autoamtically with `yarn format`.

## Deployment

When you push to GitHub, the app automatically deploys to GitHub Pages. See `deploy.yml` for details.

## Notes

- Uses [Vite](https://vitejs.dev/)
- Bootstrapped with `yarn create vite app --template vanilla-ts`
