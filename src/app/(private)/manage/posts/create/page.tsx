'use client'
import { useState, useActionState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import TextareaAutosize from "react-textarea-autosize";
import "highlight.js/styles/github.css"; // コードハイライト用のスタイル
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/actions/createPost";
import Image from "next/image";

export default function CreatePage() {
    const [content, setContent] = useState('')
    const [contentLength, setContentLength] = useState(0)
    // const [preview, setPreview] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const [state, formAction] = useActionState(createPost, {
      success: false, errors: {}
    })

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setContent(value)
        setContentLength(value.length)
    }

    const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(file){
            const previewUrl = URL.createObjectURL(file)
            setImagePreview(previewUrl)
        }
    }

    useEffect(()=> {
        return () => {
            if(imagePreview){
                URL.revokeObjectURL(imagePreview)
            }
        }
    }, [imagePreview])

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">新規記事投稿</h1>
      <form action={formAction} className="space-y-4">
        <div>
            <Label>タイトル</Label>
            <Input type="text" id="title" name="title" placeholder="タイトルを入力してください" />
            {state.errors.title && (
              <p className="text-red-500 text-sm mt-1">{state.errors.title.join(',')}</p>
            )}
        </div>
        <div>
          <Label htmlFor="topImage">トップ画像</Label>
          <Input
            type="file"
            id="topImage"
            accept="image/*"
            name="topImage"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="プレビュー画像"
                width={0}
                height={0}
                sizes="200px"
                className="w-[200px]"
                priority
              />
            </div>
          )}
          {state.errors.topImage && (
            <p className="text-red-500 text-sm mt-1">{state.errors.topImage.join(',')}</p>
          )}
        </div>
        <div>
            <Label htmlFor="content">内容</Label>
            <TextareaAutosize
                id="content" name="content" className="w-full border p-2" placeholder="記事の内容を入力してください"
                minRows={8} value={content} onChange={handleContentChange} />
                {state.errors.content && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.content.join(',')}</p>
                )}
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">
            文字数: {contentLength}
        </div>
        {/* <div>
          <Button type="button" onClick={()=> setPreview(!preview)}>
            {preview ? 'プレビューを閉じる' : 'プレビューを表示'}
          </Button>
        </div> */}
        {/* {preview && (
          <div className="border p-4 bg-gray-50 prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false} // HTMLスキップを無効化
              unwrapDisallowed={true} // Markdownの改行を解釈
            >{content}</ReactMarkdown>
          </div>
        )} */}
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">投稿する</Button>
      </form>
    </div>
  )
}
