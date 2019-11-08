#!/bin/zsh

${kubectl} -n $namespace scale deployment/$deployment --replicas=$replicas


