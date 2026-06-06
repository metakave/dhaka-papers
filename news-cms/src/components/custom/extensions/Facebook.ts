import { Node, mergeAttributes } from '@tiptap/core'

export interface FacebookOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    facebook: {
      /**
       * Insert a facebook video
       */
      setFacebookVideo: (options: { src: string }) => ReturnType,
    }
  }
}

export const Facebook = Node.create<FacebookOptions>({
  name: 'facebook',

  addOptions() {
    return {
      HTMLAttributes: {
        'data-facebook-video': '',
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
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-facebook-video] iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes),
      [
        'iframe',
        mergeAttributes(HTMLAttributes, {
          width: '100%',
          height: '100%',
          allowfullscreen: 'true',
          frameborder: '0',
          scrolling: 'no',
          allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share',
        }),
      ],
    ]
  },

  addCommands() {
    return {
      setFacebookVideo: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
