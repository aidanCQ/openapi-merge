# openapi-merge

A simple and naive tool for combining openapi specifications (JSON) together. The component/schema records in each spec are prefixed with the title of the spec to make them unique, then the specs are deep merged, left to right. It doesn't attempt to de-duplicate models across schemas and schemas may be left as orphans if the paths that reference them are overwritten during the merge. If you want to see example input files and their merged output, look at the json specs in `test/`.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun src/cli.ts test/exampleSpecA.json test/exampleSpecB.json test/exampleSpecC.json > output.json
```

To build the cli tool:

```bash
bun build --compile --outfile=openapi-merge-cli ./src/cli.ts
```
To use the cli tool:

```bash
./openapi-merge-cli test/exampleSpecA.json test/exampleSpecB.json test/exampleSpecC.json > output.json
```


