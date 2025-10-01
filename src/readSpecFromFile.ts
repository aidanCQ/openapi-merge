import { readFileSync } from 'fs';
import * as R from 'remeda';
import { specSchema, type Spec } from './types';

export default function readSpecFromFile(path: string): Spec {
    return R.pipe(
        path,
        path => ({ path, data: readFileSync(path, "utf-8") }),
        ({ path, data }) => ({ json: JSON.parse(data), path }),
        ({ json, path }) => {
            const res = specSchema.safeParse(json)
            if (res.success) return res.data;
            throw new Error(`${path} is not a valid openapi schema. Reason: ${res.error.message}`)
        })
}

