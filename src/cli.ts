import minimist from 'minimist';
import * as R from 'remeda';
import mergeSpecs from './mergeSpecs';
import readSpecFromFile from './readSpecFromFile';

const args = minimist(process.argv.slice(2));
const specs = args._;
const title = args?.['title'] || undefined;
R.pipe(
    specs,
    R.map(readSpecFromFile),
    specs => mergeSpecs(specs, title),
    merged => JSON.stringify(merged, null, 2),
    merged_as_json_string => process.stdout.write(merged_as_json_string),
)
