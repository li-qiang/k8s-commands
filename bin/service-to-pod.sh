#!/bin/zsh

tempFile=temp/${app}-service.yml

cp templates/service.yml $tempFile

sed -i '' -e s/SERVICE_NAME/$service/g $tempFile
sed -i '' -e s/APP/$app/g $tempFile

${kubectl} -n $namespace apply -f $tempFile;

rm -f $tempFile

