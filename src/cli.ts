import * as R from 'remeda';
import z from 'zod';
import mergeSpecs from './mergeSpecs';
import readSpecFromFile from './readSpecFromFile';

const args = process.argv.slice(2);
const combinedSpec = R.pipe(args, z.array(z.string()).min(2, { error: 'Please provide at least 2 openapi spec paths.' }).parse, R.map(readSpecFromFile), mergeSpecs)
process.stdout.write(JSON.stringify(combinedSpec, null, 2));
