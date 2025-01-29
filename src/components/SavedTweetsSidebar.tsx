import React, { useState, useEffect, useRef } from 'react'
import { useSavedTweets } from '../context/SavedTweetsContext'
import { TwitterIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons'

interface SavedTweetsSidebarProps {
  onCollapsedChange?: (isCollapsed: boolean) => void;
}

export default function SavedTweetsSidebar({ onCollapsedChange }: SavedTweetsSidebarProps) {
  const { tweets, isLoading, deleteTweet, updateTweet } = useSavedTweets()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    onCollapsedChange?.(isCollapsed)
  }, [isCollapsed, onCollapsedChange])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [editingContent])

  const handleTweet = (content: string) => {
    const tweetText = encodeURIComponent(content)
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank')
  }

  const handleEditStart = (tweet: { id: number; content: string }) => {
    setEditingId(tweet.id)
    setEditingContent(tweet.content)
  }

  const handleEditSave = async () => {
    if (editingId === null) return
    try {
      await updateTweet(editingId, editingContent)
      setEditingId(null)
    } catch (error) {
      console.error('Failed to update tweet:', error)
    }
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))
  }

  return (
    <div className={`fixed right-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-6 top-12 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center w-12 h-12"
        title={isCollapsed ? "Show Saved Tweets" : "Hide Saved Tweets"}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </div>
      </button>
      
      <div className={`h-full ${isCollapsed ? 'hidden' : 'p-4 overflow-y-auto'}`}>
        <h2 className="text-2xl font-bold mb-4">Saved Tweets</h2>
        
        {isLoading ? (
          <div className="text-gray-500">Loading saved tweets...</div>
        ) : tweets.length === 0 ? (
          <div className="text-gray-500">No saved tweets yet</div>
        ) : (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div 
                key={tweet.id}
                className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative"
              >
                <div onClick={() => handleEditStart(tweet)} className="relative">
                  {editingId === tweet.id ? (
                    <textarea
                      ref={textareaRef}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 resize-none overflow-hidden whitespace-pre-wrap"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      onBlur={handleEditSave}
                      autoFocus
                    />
                  ) : (
                    <p className="mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded whitespace-pre-wrap">
                      {formatContent(tweet.content)}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleTweet(tweet.content)}
                    className="bg-[#1DA1F2] text-white p-2 rounded-full hover:bg-[#1a8cd8] transition-colors"
                    title="Tweet This"
                  >
                    <TwitterIcon />
                  </button>
                  <button
                    onClick={() => deleteTweet(tweet.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Delete Tweet"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 