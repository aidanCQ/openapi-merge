import { readFileSync } from 'fs'
import * as R from 'remeda'
import { z } from 'zod'

const spec = z.object({
    openapi: z.string(),
  info:z.object({ title: z.string().transform(title => title.replaceAll(" ", "_")), version: z.string() }),
  paths: z.record(z.string(), z.unknown()),
  components: z.object({ schemas:z.record(z.string(), z.unknown()),})

})
type Spec = z.infer<typeof spec>



const args = process.argv.slice(2);

const fullSpec = R.pipe(
    args,
    R.map(path => ({path, data: readFileSync(path, "utf-8")})),
    R.map(({path, data}) => ({json: JSON.parse(data), path})),
    R.map(({json, path}) => {
        const res = spec.safeParse(json)
        if (res.success) return res.data;
        throw new Error(`${path} is not a valid openapi schema`)
    }),
    R.tap(specs => {

        const titles = specs.map(({info}) => info.title);
        const versions = specs.map(({openapi}) => openapi);
        const has_duplicate_titles = (R.unique(titles).length === titles.length) === false
        const has_mismatched_versions = R.unique(versions).length > 1
        if (has_duplicate_titles) throw new Error('Openapi specs must have unique titles');
        if (has_mismatched_versions) throw new Error('Openapi specs must have the same version');

    }),
    R.map((spec, idx) => {
        if (idx === 0) return spec
        const key_map = R.pipe(spec.components.schemas, R.keys(), (old_keys) => old_keys.map(old_key => ({ old_key, new_key: `${spec.info.title}_${old_key}` })));
        let spec_as_str = JSON.stringify(spec);
        const spec_as_str_2 = key_map.reduce<string>((acc, {old_key, new_key}) => {
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

process.stdout.write(JSON.stringify(fullSpec, null, 2));



