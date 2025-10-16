import * as R from 'remeda';
import z from 'zod';
import { specSchema, type Spec } from './types';


const componentKeyLookup = (key: string) => new RegExp(`\\b${key}\\b`, 'g');
const componentRefLookup = (key: string) => new RegExp(`\\b#/components/schemas/${key}\\b`, 'g')
function renameSchemas(spec: Spec): Spec {
    return R.pipe(
        spec.components.schemas,
        R.keys(),
        (keys) => keys.map(key => ({ key, new_key: `${spec.info.title}_${key}` })),
        (keys) => keys.reduce<string>((acc, { key, new_key }) => {
            return R.pipe(acc, txt => txt.replace(componentKeyLookup(key), new_key), txt => txt.replace(componentRefLookup(key), new_key))
        }, JSON.stringify(spec)),
        JSON.parse
    )
}

function validateSpecUniqueness(specs: Spec[]): void {
    const titles = specs.map(({ info }) => info.title);
    const versions = specs.map(({ openapi }) => openapi);
    const has_duplicate_titles = R.unique(titles).length < titles.length
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
        R.map((spec, idx) => {
            if (idx === 0) return spec;
            return renameSchemas(spec);
        }),
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










