import React, { useState } from 'react'
import { tweetfrompost } from '../services/api'

const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
  </svg>
)

const SaveIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM12 17a3 3 0 100-6 3 3 0 000 6zm0-8H7V3h5v6z" />
  </svg>
)

function Remixer() {
  const [inputText, setInputText] = useState('')
  const [outputTweets, setOutputTweets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [savedDrafts, setSavedDrafts] = useState<string[]>([])

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

  const handleSaveClick = (tweet: string) => {
    setSavedDrafts(prev => {
      if (!prev.includes(tweet)) {
        return [...prev, tweet]
      }
      return prev
    })
  }

  return (
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
                      <div className="flex-grow">{tweet}</div>
                      <div className="flex-shrink-0 flex gap-2">
                        <button
                          onClick={() => handleSaveClick(tweet)}
                          className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
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

          {savedDrafts.length > 0 && (
            <div>
              <label className="block text-gray-600 text-lg mb-2">Saved Drafts:</label>
              <div className="space-y-4">
                {savedDrafts.map((draft, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl bg-gray-50"
                  >
                    {draft}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Remixer
