import React, { useState, useRef, useEffect } from 'react'
import { tweetfrompost } from '../services/api'
import { useSavedTweets } from '../context/SavedTweetsContext'
import { SaveIcon, TwitterIcon } from './Icons'
import SavedTweetsSidebar from './SavedTweetsSidebar'

function Remixer() {
  const [inputText, setInputText] = useState('')
  const [outputTweets, setOutputTweets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { saveTweet } = useSavedTweets()

  useEffect(() => {
    if (textareaRef.current && editingIndex !== null) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [outputTweets, editingIndex])

  const handleRemix = async () => {
    if (!inputText.trim()) return
    
    setIsLoading(true)
    try {
      const remixedTweets = await tweetfrompost(inputText)
      setOutputTweets(remixedTweets)
    } catch (error) {
      console.error('Failed to remix:', error)
      setOutputTweets(['Sorry, there was an error remixing your content.'])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTweetClick = (tweet: string) => {
    const tweetText = encodeURIComponent(tweet)
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank')
  }

  const handleSaveClick = async (tweet: string) => {
    try {
      await saveTweet(tweet, inputText)
    } catch (error) {
      console.error('Failed to save tweet:', error)
    }
  }

  const handleTweetEdit = (index: number, newText: string) => {
    const newTweets = [...outputTweets]
    newTweets[index] = newText
    setOutputTweets(newTweets)
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
    <div className="flex min-h-screen bg-gray-50">
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'mr-12' : 'mr-80'}`}>
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">Tweet Remixer</h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-600 text-lg mb-2">Input Text:</label>
                <textarea
                  className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here..."
                />
              </div>

              <button
                onClick={handleRemix}
                disabled={isLoading || !inputText.trim()}
                className="w-full bg-purple-500 text-white py-4 rounded-xl text-lg font-medium hover:bg-purple-600 transition-colors disabled:bg-purple-300"
              >
                {isLoading ? 'Remixing...' : 'Generate Tweet Variations'}
              </button>

              <div>
                <label className="block text-gray-600 text-lg mb-2">Tweet Variations:</label>
                <div className="space-y-4">
                  {outputTweets.length > 0 ? (
                    outputTweets.map((tweet, index) => (
                      <div 
                        key={index}
                        className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-grow" onClick={() => setEditingIndex(index)}>
                            {editingIndex === index ? (
                              <textarea
                                ref={textareaRef}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-hidden whitespace-pre-wrap"
                                value={tweet}
                                onChange={(e) => handleTweetEdit(index, e.target.value)}
                                onBlur={() => setEditingIndex(null)}
                                autoFocus
                              />
                            ) : (
                              <p className="cursor-pointer hover:bg-gray-100 p-2 rounded whitespace-pre-wrap">
                                {formatContent(tweet)}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex gap-2">
                            <button
                              onClick={() => handleSaveClick(tweet)}
                              className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                              title="Save as Draft"
                            >
                              <SaveIcon />
                            </button>
                            <button
                              onClick={() => handleTweetClick(tweet)}
                              className="bg-[#1DA1F2] text-white p-2 rounded-full hover:bg-[#1a8cd8] transition-colors"
                              title="Tweet This"
                            >
                              <TwitterIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                      Tweet variations will appear here...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SavedTweetsSidebar onCollapsedChange={setIsSidebarCollapsed} />
    </div>
  )
}

export default Remixer
