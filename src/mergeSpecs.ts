import * as R from 'remeda';
import z from 'zod';
import { specSchema, type Spec } from './types';

function renameSchemas(spec: Spec): Spec {
    const key_map = R.pipe(spec.components.schemas, R.keys(), (old_keys) => old_keys.map(old_key => ({ old_key, new_key: `${spec.info.title}_${old_key}` })));
    let spec_as_str = JSON.stringify(spec);
    const spec_as_str_2 = key_map.reduce<string>((acc, { old_key, new_key }) => {
        return R.pipe(acc, txt => txt.replace(new RegExp(`\\b${old_key}\\b`, 'g'), new_key), txt => txt.replace(new RegExp(`\\b#/components/schemas/${old_key}\\b`, 'g'), new_key))
    }, spec_as_str)
    return JSON.parse(spec_as_str_2) as Spec;
}

function validateSpecUniqueness(specs: Spec[]): void {
    const titles = specs.map(({ info }) => info.title);
    const versions = specs.map(({ openapi }) => openapi);
    const has_duplicate_titles = (R.unique(titles).length === titles.length) === false
    const has_mismatched_versions = R.unique(versions).length > 1
    if (has_duplicate_titles) throw new Error('Openapi specs must have unique titles');
    if (has_mismatched_versions) throw new Error('Openapi specs must have the same version');
}

function deepMergeSpecs(specs: Spec[]): Spec {
    const [first, ...rest] = specs;
    return rest.reduce((acc, spec) => R.mergeDeep(acc, spec), first)
}

export default function mergeSpecs(specs: Spec[]): Spec {
    return R.pipe(
        specs,
        z.array(specSchema).min(2, { error: 'Please provide at least 2 openapi spec paths.' }).parse,
        R.tap(validateSpecUniqueness),
        R.map(renameSchemas),
        deepMergeSpecs,
        spec => ({
            ...spec,
            info: {
                title: specs.map(({ info }) => info.title.replaceAll(" ", "_")).join("+"),
                version: spec.info.version
            }
        })
    );

}










