module github.com/aereal/hibi

go 1.13

require (
	cloud.google.com/go/firestore v1.1.1
	contrib.go.opencensus.io/exporter/stackdriver v0.13.4
	firebase.google.com/go v3.12.1+incompatible
	github.com/99designs/gqlgen v0.13.0
	github.com/aws/aws-sdk-go v1.29.14 // indirect
	github.com/dgryski/trifles v0.0.0-20191129005055-5a6159895336 // indirect
	github.com/dimfeld/httptreemux/v5 v5.2.2
	github.com/hashicorp/golang-lru v0.5.4 // indirect
	github.com/kr/text v0.2.0 // indirect
	github.com/mitchellh/mapstructure v1.1.2 // indirect
	github.com/niemeyer/pretty v0.0.0-20200227124842-a10e7caefd8e // indirect
	github.com/rs/cors v1.7.0
	github.com/soh335/mtexport v0.0.0-20160510011016-e2434569f78d
	github.com/stretchr/testify v1.5.1 // indirect
	github.com/vektah/gqlparser/v2 v2.1.0
	github.com/yfuruyama/stackdriver-request-context-log v0.0.1
	go.opencensus.io v0.22.4
	golang.org/x/sync v0.0.0-20200625203802-6e8e738ad208
	google.golang.org/api v0.32.0
	google.golang.org/grpc v1.32.0
	gopkg.in/check.v1 v1.0.0-20200227125254-8fa46927fb4f // indirect
	gopkg.in/russross/blackfriday.v2 v2.0.1
	gopkg.in/yaml.v2 v2.2.8 // indirect
)

replace gopkg.in/russross/blackfriday.v2 v2.0.1 => gopkg.in/russross/blackfriday.v2 v2.0.0
