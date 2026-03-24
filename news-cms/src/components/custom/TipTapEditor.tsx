'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { MediaEmbed } from './extensions/MediaEmbed';
import { Toggle } from '@/components/ui/toggle';
import {
    Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Highlighter, Share2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="border border-b-0 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-2 items-center">
            {/* ... existing buttons ... */}
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Select value={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : 'p'}
                onValueChange={(val) => {
                    if (val === 'p') editor.chain().focus().setParagraph().run();
                    else editor.chain().focus().toggleHeading({ level: parseInt(val.replace('h', '')) }).run();
                }}>
                <SelectTrigger className="w-[100px] h-8">
                    <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="p">Paragraph</SelectItem>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                </SelectContent>
            </Select>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'left' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
            >
                <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'center' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
            >
                <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'right' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
            >
                <AlignRight className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'justify' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
            >
                <AlignJustify className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <input
                type="color"
                onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="h-8 w-8 cursor-pointer border-none bg-transparent p-0"
                title="Text Color"
            />

            <Toggle
                size="sm"
                pressed={editor.isActive('highlight')}
                onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
            >
                <Highlighter className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    const input = window.prompt('Paste Media URL (YouTube, FB) or Embed Code (iframe)');
                    if (input) {
                        let src = input;
                        let ratio = '16/9';
                        let maxWidth = '100%';
                        
                        // Detect aspect ratio based on URL/Code hints
                        const lowInput = input.toLowerCase();

                        // Extract src, width, height if user pasted full code
                        const srcMatch = input.match(/src="([^"]+)"/);
                        const widthMatch = input.match(/width="(\d+)"/);
                        const heightMatch = input.match(/height="(\d+)"/);

                        if (srcMatch) {
                            src = srcMatch[1];
                            if (widthMatch && heightMatch) {
                                const w = parseInt(widthMatch[1]);
                                const h = parseInt(heightMatch[1]);
                                ratio = `${w} / ${h}`;
                                // Use the source width as a max-width hint, capped at a reasonable value for desktop
                                maxWidth = w > 900 ? '900px' : `${w}px`;
                            } else if (lowInput.includes('reel') || lowInput.includes('short') || lowInput.includes('tiktok')) {
                                ratio = '9/16';
                                maxWidth = '450px';
                            }
                        } else if (input.includes('youtube.com/watch?v=')) {
                            const videoId = input.split('v=')[1]?.split('&')[0];
                            if (videoId) src = `https://www.youtube.com/embed/${videoId}`;
                        } else if (input.includes('youtu.be/')) {
                            const videoId = input.split('/').pop()?.split('?')[0];
                            if (videoId) src = `https://www.youtube.com/embed/${videoId}`;
                        } else if (input.includes('facebook.com')) {
                            src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(input)}&show_text=false&t=0`;
                            if (lowInput.includes('reel')) {
                                ratio = '9/16';
                                maxWidth = '450px';
                            }
                        }

                        editor.commands.setMediaEmbed({ src, ratio, maxWidth });
                    }
                }}
                className="h-8 w-8 p-0"
                title="Embed Media (YouTube, FB, X, etc.)"
            >
                <Share2 className="h-4 w-4" />
            </Button>

        </div>
    );
};

interface TipTapEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            FontFamily,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            MediaEmbed,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[200px]',
            },
        },
        immediatelyRender: false,
    });

    return (
        <div className="border rounded-md overflow-hidden bg-white">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="p-4" />
        </div>
    );
}
