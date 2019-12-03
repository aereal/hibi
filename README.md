# hibi

## api

requires Go 1.12 or later.

```sh
go get all
env \
  GOOGLE_CLOUD_PROJECT=... \
  GOOGLE_APPLIATION_CREDENTIALS=path/to/service-account-key.json \
  go run ./api/
```

see also: [Getting Started with Authentication][gcp-getting-started-with-authentication]

## front

requires Yarn and Node 10.x or later

```
yarn
yarn workspace front dev
```

[gcp-getting-started-with-authentication]: https://cloud.google.com/docs/authentication/getting-started
