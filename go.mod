module github.com/aereal/hibi

go 1.13

require (
	cloud.google.com/go/firestore v1.1.1
	cloud.google.com/go/storage v1.6.0 // indirect
	contrib.go.opencensus.io/exporter/stackdriver v0.13.0
	firebase.google.com/go v3.12.0+incompatible
	github.com/99designs/gqlgen v0.11.1
	github.com/aws/aws-sdk-go v1.29.12 // indirect
	github.com/dgryski/trifles v0.0.0-20191129005055-5a6159895336 // indirect
	github.com/dimfeld/httptreemux v5.0.1+incompatible
	github.com/golang/protobuf v1.3.4 // indirect
	github.com/gorilla/websocket v1.4.1 // indirect
	github.com/hashicorp/golang-lru v0.5.4 // indirect
	github.com/kr/text v0.2.0 // indirect
	github.com/mitchellh/mapstructure v1.1.2 // indirect
	github.com/niemeyer/pretty v0.0.0-20200227124842-a10e7caefd8e // indirect
	github.com/rs/cors v1.7.0
	github.com/shurcooL/sanitized_anchor_name v1.0.0 // indirect
	github.com/stretchr/testify v1.5.1 // indirect
	github.com/vektah/gqlparser/v2 v2.0.1
	github.com/yfuruyama/stackdriver-request-context-log v0.0.0-20181011004750-72ecb0f55398
	go.opencensus.io v0.22.3
	golang.org/x/net v0.0.0-20200226121028-0de0cce0169b // indirect
	golang.org/x/sync v0.0.0-20190911185100-cd5d95a43a6e
	golang.org/x/tools v0.0.0-20200227222343-706bc42d1f0d // indirect
	google.golang.org/api v0.19.0
	google.golang.org/genproto v0.0.0-20200228133532-8c2c7df3a383 // indirect
	google.golang.org/grpc v1.27.1
	gopkg.in/check.v1 v1.0.0-20200227125254-8fa46927fb4f // indirect
	gopkg.in/russross/blackfriday.v2 v2.0.1
	gopkg.in/yaml.v2 v2.2.8 // indirect
)

replace gopkg.in/russross/blackfriday.v2 v2.0.1 => gopkg.in/russross/blackfriday.v2 v2.0.0
