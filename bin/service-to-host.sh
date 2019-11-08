#!/bin/zsh

tempFile=temp/${service}-${port}-endpoint.yml

cp templates/endpoint.yml $tempFile

sed -i '' -e s/SERVICE_NAME/$service/g $tempFile
sed -i '' -e s/PORT/$port/g $tempFile

${kubectl} -n $namespace apply -f $tempFile;

rm -f $tempFile



