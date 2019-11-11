## Newfang Developer Portal

### Setup

```bash
# Install dependencies
npm run install
```

### Development

```bash
# Start development server
npm run dev
```
### Lint and test

```bash
# Run linter
npm run lint

# Run linter and autofix errors
npm run lint -- --fix

# Run unit tests
npm run test:unit

# Run lint and tests
npm run test:ci
```

### Build and preview

```bash
# Build for test environment
npm run build:stage

# Build for production environment
npm run build:prod

# Preview the build
npm run preview

# Preview the build + static resource analysis
npm run preview -- --report
```

Refer the `vue-admin-template` [documentation](https://panjiachen.github.io/vue-element-admin-site/) for more information.

### Deployment

[Github Actions](https://help.github.com/en/articles/about-github-actions) are used for deployment.

- **On committing to the master branch**, the [staging workflow](.github/workflows/staging.yml) runs tests, builds a staging release and updates [developer.staging.newfang.io](https://developer.staging.newfang.io).

- **On creating a new tag**, the [production workflow](.github/workflows/production.yml) runs tests, builds a production release and updates [developer.newfang.io](https://developer.newfang.io).

### Credits

The template is based on PanJiaChen's [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template).
