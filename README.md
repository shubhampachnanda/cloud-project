# Project Setup Instructions

This guide explains how to set up the project using Minikube and deploy the necessary Kubernetes resources.

## Prerequisites
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) configured
- [Node.js](https://nodejs.org/) installed for the proxy server
- Project files (namespaces, deployments, OPA policies, RBAC, monitoring, and `proxy-server.js`)

## Steps

### one
>minikube start

### two
>kubectl apply -f namespaces/

>kubectl apply -f deployments/

>kubectl apply -f opa/

>kubectl apply -f rbac/

>kubectl apply -f monitoring/

### three 

#### split the terminal after every command

>kubectl port-forward svc/tgi -n shared-llm 30080:80
>kubectl port-forward svc/prometheus -n monitoring 9090:9090

>kubectl port-forward svc/grafana -n monitoring 3000:3000

>node proxy-server.js

## Access links

#### use live server for the html file

>TGI Service: Available at http://localhost:30080

>Prometheus: Available at http://localhost:9090

>Grafana: Available at http://localhost:3000

# for grafana data source  http://prometheus.monitoring.svc.cluster.local:9090
 > then you can just use up command

## best of luck


