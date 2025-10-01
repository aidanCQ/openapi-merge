# openapi-merge

To install dependencies:

```bash
bun install
```

To run:

```bash
bun merge.ts specA.json specB.json specC.json > specD.json
```

To build the cli tool:

```bash
bun build --compile --outfile=openapi-merge ./src/cli.tsx
```


