#! /usr/bin/env node

import { KubeConfig, CoreV1Api, V1Service, V1Endpoints } from "@kubernetes/client-node";
import * as alfy from 'alfy';
import { fromPromise } from "rxjs/internal-compatibility";
import { filter, flatMap, map, reduce, takeLast } from "rxjs/operators";
import process = require("process");
import { cache } from "./cache";
import { fromArray } from "rxjs/internal/observable/fromArray";
import { ApiV1NamespacesNameServices } from "kubernetes-client";

const kubeConfig = new KubeConfig();

kubeConfig.loadFromDefault();

const apiClient = kubeConfig.makeApiClient(CoreV1Api);

async function run(argv: string[]) {
  const { body: { items } } = await apiClient.listNamespacedEndpoints(process.env.namespace);

  const menus = items.map(i => {
    const title = i.metadata.name;
    return { title, arg: title };
  });

  alfy.output(menus);
}

run(process.argv);





