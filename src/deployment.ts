#! /usr/bin/env node

import { KubeConfig, CoreV1Api, V1Service, V1Endpoints, AppsV1Api } from "@kubernetes/client-node";
import * as alfy from 'alfy';
import { fromPromise } from "rxjs/internal-compatibility";
import { filter, flatMap, map, reduce, takeLast } from "rxjs/operators";
import process = require("process");
import { cache } from "./cache";
import { fromArray } from "rxjs/internal/observable/fromArray";
import { ApiV1NamespacesNameServices } from "kubernetes-client";

const kubeConfig = new KubeConfig();

kubeConfig.loadFromDefault();

const apiClient = kubeConfig.makeApiClient(AppsV1Api);

async function run(argv: string[]) {
  const { body: { items } } = await apiClient.listNamespacedDeployment(process.env.namespace);

  const menus = items.map(i => {
    const title = i.metadata.name;
    return { title, subtitle: `replicas is ${ i.spec.replicas }`, arg: title };
  });

  alfy.output(menus);
}

run(process.argv);





