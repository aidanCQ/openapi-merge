import * as R from 'remeda'
import { expect, test } from 'vitest'
import mergeSpecs from '../src/mergeSpecs'
import exampleSpecA from './exampleSpecA.json'
import exampleSpecB from './exampleSpecB.json'
import exampleSpecC from './exampleSpecC.json'
test('Merged spec is as expected.', () => {
  const mergedSpec = R.pipe([exampleSpecA, exampleSpecB, exampleSpecC], mergeSpecs);
  expect(mergedSpec).toEqual(mergedSpec)
})
