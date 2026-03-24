import { Node, mergeAttributes } from '@tiptap/core'

export interface MediaEmbedOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mediaEmbed: {
      /**
       * Insert a media embed (YouTube, Facebook, etc.)
       */
      setMediaEmbed: (options: { src: string }) => ReturnType,
    }
  }
}

export const MediaEmbed = Node.create<MediaEmbedOptions>({
  name: 'mediaEmbed',

  addOptions() {
    return {
      HTMLAttributes: {
        'data-media-embed': '',
      },
    }
  },

  group: 'block',

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      ratio: {
        default: '16/9',
        parseHTML: element => element.getAttribute('data-ratio'),
        renderHTML: attributes => ({ 'data-ratio': attributes.ratio }),
      },
      maxWidth: {
        default: '100%',
        parseHTML: element => element.getAttribute('data-max-width'),
        renderHTML: attributes => ({ 'data-max-width': attributes.maxWidth }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-media-embed] iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { ratio, maxWidth, ...attrs } = HTMLAttributes

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-ratio': ratio,
        'data-max-width': maxWidth,
        style: `aspect-ratio: ${ratio}; max-width: ${maxWidth};`,
      }),
      [
        'iframe',
        mergeAttributes(attrs, {
          width: '100%',
          height: '100%',
          allowfullscreen: 'true',
          frameborder: '0',
          scrolling: 'no',
          loading: 'lazy',
          allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share',
        }),
      ],
    ]
  },

  addCommands() {
    return {
      setMediaEmbed: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
