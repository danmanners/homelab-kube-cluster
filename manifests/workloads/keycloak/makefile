NAME	:=	Dan Manners

output:
	@kustomize build --enable_alpha_plugins .

apply:
	@kustomize build --enable_alpha_plugins . | kubectl apply -f -
