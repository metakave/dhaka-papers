import { Node } from '@tiptap/core'

export interface MediaEmbedOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mediaEmbed: {
      setMediaEmbed: (options: {
        src: string;
        type?: string;
        ratio?: string;
        maxWidth?: string;
        embedHeight?: string;
      }) => ReturnType,
    }
  }
}

export const MediaEmbed = Node.create<MediaEmbedOptions>({
  name: 'mediaEmbed',

  addOptions() {
    return { HTMLAttributes: {} }
  },

  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.querySelector('iframe')?.getAttribute('src'),
      },
      type: {
        default: 'generic',
        parseHTML: element => element.getAttribute('data-embed-type') || 'generic',
      },
      ratio: {
        default: '16/9',
        parseHTML: element => element.getAttribute('data-ratio'),
      },
      maxWidth: {
        default: '100%',
        parseHTML: element => element.getAttribute('data-max-width'),
      },
      embedHeight: {
        default: null,
        parseHTML: element => element.getAttribute('data-embed-height'),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-media-embed]' }]
  },

  renderHTML({ node }) {
    const { type, ratio, maxWidth, embedHeight, src } = node.attrs

    const isFixedSize = type === 'twitter' || type === 'facebook-post'

    let containerStyle: string
    const iframeAttrs: Record<string, any> = {
      src,
      frameborder: '0',
      allowfullscreen: 'true',
      loading: 'lazy',
      allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share',
    }

    if (type === 'twitter') {
      // Twitter: fixed width 550px, height set by embedHeight (default 550)
      containerStyle = `max-width: ${maxWidth || '550px'};`
      iframeAttrs.width = '550'
      iframeAttrs.height = embedHeight || '550'
      iframeAttrs.scrolling = 'yes'
    } else if (type === 'facebook-post') {
      // Facebook Post: fixed width 500px, taller height for post content
      containerStyle = `max-width: ${maxWidth || '500px'};`
      iframeAttrs.width = '500'
      iframeAttrs.height = embedHeight || '700'
      iframeAttrs.scrolling = 'no'
      iframeAttrs.style = 'border: none; overflow: hidden;'
    } else {
      // Aspect-ratio types: youtube, facebook-video, generic
      const aspectRatio = ratio || '16/9'
      containerStyle = `aspect-ratio: ${aspectRatio}; max-width: ${maxWidth || '100%'};`
      iframeAttrs.width = '100%'
      iframeAttrs.height = '100%'
      iframeAttrs.scrolling = 'no'
    }

    const containerAttrs: Record<string, any> = {
      'data-media-embed': '',
      'data-embed-type': type || 'generic',
      'data-ratio': ratio,
      'data-max-width': maxWidth,
      style: containerStyle,
    }

    if (embedHeight) {
      containerAttrs['data-embed-height'] = embedHeight
    }

    return ['div', containerAttrs, ['iframe', iframeAttrs]]
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
