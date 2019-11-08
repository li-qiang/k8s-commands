import { KubeConfig, CoreV1Api } from "@kubernetes/client-node";
import * as alfy from 'alfy';
import { fromPromise } from "rxjs/internal-compatibility";
import { filter, flatMap, map, reduce, takeLast } from "rxjs/operators";
import process = require("process");
import { cache } from "./cache";
import { fromArray } from "rxjs/internal/observable/fromArray";

const kubeConfig = new KubeConfig();

kubeConfig.loadFromDefault();

const apiClient = kubeConfig.makeApiClient(CoreV1Api);

const namespaces: Promise<string[]> = cache.get('namespaces',
  () => apiClient.listNamespace().then(({ body: { items } }) => items.map(i => i.metadata.name as string)),
  1000 * 60 * 60);

async function run(argv: string[]) {
  const [, , query] = argv;

  fromPromise(namespaces).pipe(
    flatMap(names => fromArray(names)),
    filter(name => query == undefined || name.lastIndexOf(query) > -1),
    map(title => ({ title })),
    reduce((prev: any[], next) => prev.concat(next), []),
    takeLast(1)
  ).subscribe((value: any[]) => alfy.output(value));
}

run(process.argv);





