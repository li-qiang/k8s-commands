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

const namespace: Promise<string[]> = (async () => {
  const namespaces = alfy.cache.get('namespaces');
  if (namespaces) {
    return namespaces;
  }

  const values = await apiClient.listNamespace().then(({ body: { items } }) => items.map(i => i.metadata.name as string));
  alfy.cache.set('namespace', values, { maxAge: 1000 * 60 * 60 });
  return values;
})();

async function run(argv: string[]) {
  const [, , query] = argv;

  fromPromise(namespace).pipe(
    flatMap(names => fromArray(names)),
    filter(name => query == undefined || name.lastIndexOf(query) > -1),
    map(title => ({ title, arg: title })),
    reduce((prev: any[], next) => prev.concat(next), []),
    takeLast(1)
  ).subscribe((value: any[]) => alfy.output(value));
}

run(process.argv);





