'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { MediaEmbed } from './extensions/MediaEmbed';
import { Toggle } from '@/components/ui/toggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Bold, Italic, Strikethrough,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Highlighter, Share2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// ─── Platform Detection ──────────────────────────────────────────────────────

type EmbedPlatform =
    | 'youtube'
    | 'youtube-short'
    | 'twitter'
    | 'facebook-post'
    | 'facebook-video'
    | 'facebook-reel'
    | 'facebook-share'   // share links can't be embedded directly — need embed code
    | 'iframe'
    | null;

function detectPlatform(input: string): EmbedPlatform {
    const lower = input.toLowerCase().trim();
    if (!lower) return null;

    if (lower.includes('youtube.com/shorts/')) return 'youtube-short';
    if (lower.includes('youtube.com/watch') || lower.includes('youtu.be/')) return 'youtube';

    if ((lower.includes('twitter.com/') || lower.includes('x.com/')) && lower.includes('/status/')) {
        return 'twitter';
    }

    // Facebook: check for full <iframe> embed code first (src contains plugins URL)
    if (lower.includes('facebook.com/plugins/post.php')) return 'facebook-post';
    if (lower.includes('facebook.com/plugins/video.php')) return 'facebook-video';

    // Facebook raw URLs
    if (lower.includes('facebook.com/') || lower.includes('fb.watch/')) {
        if (lower.includes('/reel') || lower.includes('/reels')) return 'facebook-reel';
        if (lower.includes('/videos/') || lower.includes('fb.watch/')) return 'facebook-video';
        // Share links (e.g. /share/p/, /share/v/) can't be resolved by the plugin
        if (lower.includes('/share/')) return 'facebook-share';
        return 'facebook-post';
    }

    if (lower.includes('<iframe') || lower.match(/src="[^"]+"/)) return 'iframe';

    return null;
}

const platformInfo: Record<NonNullable<EmbedPlatform>, { label: string; color: string; hint: string }> = {
    'youtube':          { label: 'YouTube Video',         color: '#dc2626', hint: '16:9 · full width' },
    'youtube-short':    { label: 'YouTube Short',         color: '#dc2626', hint: '9:16 · 315px wide' },
    'twitter':          { label: 'X (Twitter) Post',      color: '#0ea5e9', hint: '550px wide · fixed height' },
    'facebook-post':    { label: 'Facebook Post',         color: '#2563eb', hint: 'exact size from embed code' },
    'facebook-video':   { label: 'Facebook Video',        color: '#2563eb', hint: 'exact size from embed code' },
    'facebook-reel':    { label: 'Facebook Reel',         color: '#2563eb', hint: '9:16 · vertical' },
    'facebook-share':   { label: 'Facebook Share Link',   color: '#dc2626', hint: 'share links cannot be embedded — use the embed code instead' },
    'iframe':           { label: 'Custom Embed Code',     color: '#6b7280', hint: 'size from embed code' },
};

// ─── Build Embed Params ───────────────────────────────────────────────────────

interface EmbedParams {
    src: string;
    type: string;
    ratio: string;
    maxWidth: string;
    embedHeight?: string;
}

function buildEmbed(input: string, platform: EmbedPlatform): EmbedParams | null {
    if (!platform) return null;
    const trimmed = input.trim();

    if (platform === 'youtube') {
        let videoId = '';
        if (trimmed.includes('watch?v=')) {
            videoId = trimmed.split('v=')[1]?.split('&')[0] || '';
        } else if (trimmed.includes('youtu.be/')) {
            videoId = trimmed.split('youtu.be/')[1]?.split('?')[0] || '';
        }
        if (!videoId) return null;
        return { src: `https://www.youtube.com/embed/${videoId}`, type: 'youtube', ratio: '16/9', maxWidth: '100%' };
    }

    if (platform === 'youtube-short') {
        const videoId = trimmed.split('/shorts/')[1]?.split('?')[0] || '';
        if (!videoId) return null;
        return { src: `https://www.youtube.com/embed/${videoId}`, type: 'youtube', ratio: '9/16', maxWidth: '315px' };
    }

    if (platform === 'twitter') {
        const tweetId = trimmed.split('/status/')[1]?.split('?')[0]?.split('/')[0] || '';
        if (!tweetId) return null;
        return {
            src: `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=light`,
            type: 'twitter',
            ratio: '',
            maxWidth: '550px',
            embedHeight: '550',
        };
    }

    if (platform === 'facebook-share') {
        // Share links cannot be embedded — buildEmbed returns null, dialog blocks insert
        return null;
    }

    if (platform === 'facebook-post') {
        // Full <iframe> embed code pasted → extract src + exact dimensions
        const srcMatch = trimmed.match(/src="([^"]+)"/);
        if (srcMatch) {
            const widthMatch = trimmed.match(/width="(\d+)"/);
            const heightMatch = trimmed.match(/height="(\d+)"/);
            const w = widthMatch ? parseInt(widthMatch[1]) : 500;
            const h = heightMatch ? parseInt(heightMatch[1]) : 700;
            return {
                src: srcMatch[1],
                type: 'facebook-post',
                ratio: '',
                maxWidth: `${w}px`,
                embedHeight: `${h}`,
            };
        }
        // Raw post URL (not a share link) → construct plugin URL
        return {
            src: `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(trimmed)}&show_text=true&width=500`,
            type: 'facebook-post',
            ratio: '',
            maxWidth: '500px',
            embedHeight: '700',
        };
    }

    if (platform === 'facebook-video') {
        // Full <iframe> embed code pasted → extract src + exact dimensions
        const srcMatch = trimmed.match(/src="([^"]+)"/);
        if (srcMatch) {
            const widthMatch = trimmed.match(/width="(\d+)"/);
            const heightMatch = trimmed.match(/height="(\d+)"/);
            const w = widthMatch ? parseInt(widthMatch[1]) : 560;
            const h = heightMatch ? parseInt(heightMatch[1]) : 315;
            return {
                src: srcMatch[1],
                type: 'facebook-video',
                ratio: `${w}/${h}`,
                maxWidth: `${w}px`,
            };
        }
        // Raw video URL
        return {
            src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false&t=0`,
            type: 'facebook-video',
            ratio: '16/9',
            maxWidth: '100%',
        };
    }

    if (platform === 'facebook-reel') {
        return {
            src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false&t=0`,
            type: 'facebook-video',
            ratio: '9/16',
            maxWidth: '315px',
        };
    }

    if (platform === 'iframe') {
        const srcMatch = trimmed.match(/src="([^"]+)"/);
        const widthMatch = trimmed.match(/width="(\d+)"/);
        const heightMatch = trimmed.match(/height="(\d+)"/);
        if (srcMatch) {
            const w = widthMatch ? parseInt(widthMatch[1]) : null;
            const h = heightMatch ? parseInt(heightMatch[1]) : null;
            return {
                src: srcMatch[1],
                type: 'generic',
                ratio: w && h ? `${w}/${h}` : '16/9',
                maxWidth: w ? `${Math.min(w, 900)}px` : '100%',
            };
        }
    }

    return null;
}

// ─── Embed Dialog ─────────────────────────────────────────────────────────────

interface EmbedDialogProps {
    onInsert: (params: EmbedParams) => void;
}

function EmbedDialog({ onInsert }: EmbedDialogProps) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const platform = detectPlatform(url);
    const info = platform ? platformInfo[platform] : null;

    const handleInsert = () => {
        const embed = buildEmbed(url, platform);
        if (embed) {
            onInsert(embed);
            setOpen(false);
            setUrl('');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setUrl('');
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 gap-1"
                title="Embed YouTube / Facebook / X"
                onClick={() => setOpen(true)}
                type="button"
            >
                <Share2 className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Embed</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Embed Media</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-1">
                        <div className="space-y-2">
                            <Label htmlFor="embed-url">URL or embed code</Label>
                            <Input
                                id="embed-url"
                                placeholder="Paste YouTube / Facebook / X link or <iframe> code…"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleInsert(); }}
                                autoFocus
                            />
                        </div>

                        {/* Detection result */}
                        {info && platform !== 'facebook-share' && (
                            <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                                <span className="font-semibold" style={{ color: info.color }}>
                                    {info.label}
                                </span>
                                <span className="text-gray-400">·</span>
                                <span className="text-gray-500">{info.hint}</span>
                            </div>
                        )}

                        {/* Facebook share link warning */}
                        {platform === 'facebook-share' && (
                            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 space-y-1">
                                <p className="font-semibold">Facebook share links cannot be embedded directly.</p>
                                <p>On Facebook, open the post → click <strong>⋯ More</strong> → <strong>Embed</strong> → copy the <code className="bg-red-100 px-1 rounded">&lt;iframe&gt;</code> code and paste it here instead.</p>
                            </div>
                        )}

                        {!info && url.trim() && (
                            <p className="text-sm text-amber-600">
                                Platform not recognized. Paste a full URL or &lt;iframe&gt; code.
                            </p>
                        )}

                        {/* Platform guide */}
                        <div className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500 space-y-1">
                            <p className="font-medium text-gray-700 mb-1">Supported sources:</p>
                            <p>
                                <span className="font-medium" style={{ color: '#dc2626' }}>YouTube</span>
                                {' '}— paste video or Shorts URL
                            </p>
                            <p>
                                <span className="font-medium" style={{ color: '#0ea5e9' }}>X (Twitter)</span>
                                {' '}— paste tweet URL (twitter.com or x.com)
                            </p>
                            <p>
                                <span className="font-medium" style={{ color: '#2563eb' }}>Facebook</span>
                                {' '}— paste the <strong>&lt;iframe&gt; embed code</strong> from Facebook (Post → ⋯ → Embed)
                            </p>
                            <p>
                                <span className="font-medium text-gray-600">Custom</span>
                                {' '}— paste any &lt;iframe&gt; embed code
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose} type="button">
                            Cancel
                        </Button>
                        <Button onClick={handleInsert} disabled={!info || platform === 'facebook-share'} type="button">
                            Insert Embed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <div className="border border-b-0 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-2 items-center">
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

            <Select
                value={
                    editor.isActive('heading', { level: 1 }) ? 'h1' :
                    editor.isActive('heading', { level: 2 }) ? 'h2' :
                    editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'
                }
                onValueChange={(val) => {
                    if (val === 'p') editor.chain().focus().setParagraph().run();
                    else editor.chain().focus().toggleHeading({ level: parseInt(val.replace('h', '')) }).run();
                }}
            >
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

            <EmbedDialog
                onInsert={(params) => editor.commands.setMediaEmbed(params)}
            />
        </div>
    );
};

// ─── Editor ───────────────────────────────────────────────────────────────────

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
