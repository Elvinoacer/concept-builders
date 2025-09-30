import { Node, mergeAttributes } from '@tiptap/core'

export interface VideoOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /**
       * Add a video embed
       */
      setVideo: (options: { src: string }) => ReturnType,
    }
  }
}

export const VideoExtension = Node.create<VideoOptions>({
  name: 'video',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'video-wrapper',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: 'true',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', mergeAttributes(HTMLAttributes)]]
  },

  addCommands() {
    return {
      setVideo: options => ({ commands }) => {
        if (!options.src) {
          return false
        }

        let embedUrl = options.src;

        // Check for YouTube URLs
        if (options.src.includes('youtube.com') || options.src.includes('youtu.be')) {
            const videoId = options.src.split('v=')[1]?.split('&')[0] || options.src.split('/').pop();
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }

        return commands.insertContent({
          type: this.name,
          attrs: { src: embedUrl },
        })
      },
    }
  },
})
