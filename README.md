# openapi-merge

A very basic tool for combining openapi JSON specifications together. The component/schema records in each spec are prefixed with the title of the spec to make them unique, then the specs are deep merged, left to right. It doesn't attempt to de-duplicate models across schemas and schemas may be left as orphans if the paths that reference them are overwritten during the merge. If you want to see example input files and their merged output, look at the json specs in `test/`.

This tool can be run with a js runtime (e.g. Bun) or as a standalone CLI tool.


Install dependencies:

```bash
bun install
```

# Run with Bun

```bash
bun src/cli.ts test/exampleSpecA.json test/exampleSpecB.json test/exampleSpecC.json > output.json
```

# Run with CLI tool

Build the CLI tool:

```bash
bun build --compile --outfile=openapi-merge-cli ./src/cli.ts
```

Run the CLI tool:

```bash
./openapi-merge-cli test/exampleSpecA.json test/exampleSpecB.json test/exampleSpecC.json > output.json
```


