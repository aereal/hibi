package gqlopencensus

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
	"go.opencensus.io/trace"
)

type (
	Tracer struct{}
)

var _ interface {
	graphql.FieldInterceptor
	graphql.OperationInterceptor
} = Tracer{}

func (a Tracer) ExtensionName() string {
	return "OpenCensus"
}

func (a Tracer) Validate(schema graphql.ExecutableSchema) error {
	return nil
}

func (a Tracer) InterceptField(ctx context.Context, next graphql.Resolver) (res interface{}, err error) {
	fc := graphql.GetFieldContext(ctx)

	ctx, span := trace.StartSpan(ctx, fmt.Sprintf("field.%s", fc.Field.Name))
	defer span.End()
	if !span.IsRecordingEvents() {
		return next(ctx)
	}

	span.AddAttributes(trace.StringAttribute("resolver.path", fc.Path().String()))
	field := fc.Field
	span.AddAttributes(
		trace.StringAttribute("resolver.object", field.ObjectDefinition.Name),
		trace.StringAttribute("resolver.field", field.Name),
		trace.StringAttribute("resolver.alias", field.Alias),
	)
	for _, arg := range field.Arguments {
		if arg.Value != nil {
			span.AddAttributes(trace.StringAttribute(fmt.Sprintf("resolver.args.%s", arg.Name), arg.Value.String()))
		}
	}

	errs := graphql.GetErrors(ctx)
	if len(errs) != 0 {
		span.SetStatus(trace.Status{
			Code:    2,
			Message: errs.Error(),
		})
		span.AddAttributes(trace.BoolAttribute("resolver.hasError", true))
		for i, err := range errs {
			span.AddAttributes(trace.StringAttribute(fmt.Sprintf("resolver.error.%d.message", i), err.Error()))
			span.AddAttributes(trace.StringAttribute(fmt.Sprintf("resolver.error.%d.kind", i), fmt.Sprintf("%T", err)))
		}
	}

	return next(ctx)
}

func (a Tracer) InterceptOperation(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
	oc := graphql.GetOperationContext(ctx)

	ctx, span := trace.StartSpan(ctx, operationName(ctx))
	defer span.End()
	if !span.IsRecordingEvents() {
		return next(ctx)
	}
	span.AddAttributes(trace.StringAttribute("request.query", oc.RawQuery))

	// TODO: complexity limit

	for k, v := range oc.Variables {
		span.AddAttributes(trace.StringAttribute(fmt.Sprintf("request.variables.%s", k), fmt.Sprintf("%+v", v)))
	}

	return next(ctx)
}

func operationName(ctx context.Context) string {
	oc := graphql.GetOperationContext(ctx)
	reqName := "nameless-operation"
	if oc.Doc != nil && len(oc.Doc.Operations) != 0 {
		op := oc.Doc.Operations[0]
		if op.Name != "" {
			reqName = op.Name
		}
	}
	return reqName
}
