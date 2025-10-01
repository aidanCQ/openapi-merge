import * as R from 'remeda';
import { type Spec } from './types';

export default function mergeSpecs(specs: Spec[]): Spec {
    return R.pipe(
        specs,
        R.tap(specs => {
            const titles = specs.map(({ info }) => info.title);
            const versions = specs.map(({ openapi }) => openapi);
            const has_duplicate_titles = (R.unique(titles).length === titles.length) === false
            const has_mismatched_versions = R.unique(versions).length > 1
            if (has_duplicate_titles) throw new Error('Openapi specs must have unique titles');
            if (has_mismatched_versions) throw new Error('Openapi specs must have the same version');

        }),
        R.map((spec, idx) => {
            if (idx === 0) return spec
            const key_map = R.pipe(spec.components.schemas, R.keys(), (old_keys) => old_keys.map(old_key => ({ old_key, new_key: `${spec.info.title}_${old_key}` })));
            let spec_as_str = JSON.stringify(spec);
            const spec_as_str_2 = key_map.reduce<string>((acc, { old_key, new_key }) => {
                return R.pipe(acc, txt => txt.replace(new RegExp(`\\b${old_key}\\b`, 'g'), new_key), txt => txt.replace(new RegExp(`\\b#/components/schemas/${old_key}\\b`, 'g'), new_key))
            }, spec_as_str)
            return JSON.parse(spec_as_str_2) as Spec;
        }),
        (arr) => {
            const [first, ...rest] = arr;
            return [first, rest] as const
        },
        ([first, rest]) => rest.reduce((acc, spec) => R.mergeDeep(acc, spec), first),
        fullSpec => {
            return {
                ...fullSpec,
                info: {
                    title: 'Combined OpenAPI Schema',
                    version: fullSpec.info.version
                }
            }
        }
    );

}










