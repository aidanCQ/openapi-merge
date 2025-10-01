import * as R from 'remeda';
import mergeSpecs from './mergeSpecs';
import readSpecFromFile from './readSpecFromFile';


R.pipe(
    process.argv.slice(2),
    R.map(readSpecFromFile),
    specs => mergeSpecs(specs, specs.map(({ info }) => info.title).join("+")),
    merged => JSON.stringify(merged, null, 2),
    merged_as_json_string => process.stdout.write(merged_as_json_string),
)
