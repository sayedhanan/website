// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Note = defineDocumentType(() => ({
  name: 'Note',
  filePathPattern: `notes/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title:    { type: 'string', required: true },
    section:  { type: 'string', required: true },
    order:    { type: 'number', required: true },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: doc => doc._raw.flattenedPath.replace(/^notes\//, ''),
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Note],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})
