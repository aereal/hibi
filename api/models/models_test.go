package models

import "testing"

func TestPublishState_CanChangeTo(t *testing.T) {
	type args struct {
		next PublishState
	}
	tests := []struct {
		name string
		s    PublishState
		args args
		want bool
	}{
		{
			name: "published->published",
			s:    PublishStatePublished,
			args: args{next: PublishStatePublished},
			want: true,
		},
		{
			name: "published->draft",
			s:    PublishStatePublished,
			args: args{next: PublishStateDraft},
			want: false,
		},
		{
			name: "draft->draft",
			s:    PublishStateDraft,
			args: args{next: PublishStateDraft},
			want: true,
		},
		{
			name: "draft->published",
			s:    PublishStateDraft,
			args: args{next: PublishStatePublished},
			want: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.s.CanChangeTo(tt.args.next); got != tt.want {
				t.Errorf("PublishState.CanChangeTo() = %v, want %v", got, tt.want)
			}
		})
	}
}
