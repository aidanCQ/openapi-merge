import { z } from 'zod'

export const specSchema = z.object({
    openapi: z.string(),
    info: z.object({ title: z.string().transform(title => title.replaceAll(" ", "_")), version: z.string() }),
    paths: z.record(z.string(), z.unknown()),
    components: z.object({ schemas: z.record(z.string(), z.unknown()), }),
    tags: z.array(z.unknown()).optional().default([])
})

export type Spec = z.infer<typeof specSchema>

export type SubSpec = Omit<Spec, 'openapi' | 'info'>
