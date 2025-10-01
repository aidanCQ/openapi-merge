# openapi-merge

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


