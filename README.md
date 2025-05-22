# Deno File Server

A collection of simple file servers for Deno Deploy.

## ssg.ts

This is a file server for SSG websites that supports clean
URLs by default (i.e. `/a/b/c` maps to `/a/b/c.html`).

### Example

Given the following filesystem

```
/
  index.html
  docs/
    api.html
    examples.html
    index.html
  css/
    light.css
```

The file server will create the following map from URL pathname to filesystem path.

| URL Pathname            | Filesystem Path            |
| ----------------------- | -------------------------- |
| `"/css/light.css"`      | `".../css/light.css"`      |
| `"/docs/api.html"`      | `".../docs/api.html"`      |
| `"/docs/api"`           | `".../docs/api.html"`      |
| `"/docs/examples.html"` | `".../docs/examples.html"` |
| `"/docs/examples"`      | `".../docs/examples.html"` |
| `"/docs/index.html"`    | `".../docs/index.html"`    |
| `"/docs/index"`         | `".../docs/index.html"`    |
| `"/docs"`               | `".../docs/index.html"`    |
| `"/docs/"`              | `".../docs/index.html"`    |
| `"/index.html"`         | `".../index.html"`         |
| `"/index"`              | `".../index.html"`         |
| `""`                    | `".../index.html"`         |
| `"/"`                   | `".../index.html"`         |

### Usage

Using the `deployctl` CLI.

```sh
deployctl deploy --include=_site --entrypoint=jsr:@kin/file-server/ssg.ts
```

Using GitHub Action

```yaml
jobs:
  deploy:
    name: Deploy Website
    runs-on: ubuntu-latest

    permissions:
      contents: read # Needed to clone the repository
      id-token: write # Needed for auth with Deno Deploy

    steps:
      - name: Clone repository
        uses: actions/checkout@v4

      - name: Install Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v2.x

      - name: Build
        run: deno task build

      - name: Upload to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: your-project-name
          entrypoint: https://jsr.io/@kin/file-server/0.1.0/ssg.ts
          root: _site
```

## TODO

- [ ] Add a file server for SPA
