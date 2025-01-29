/// <reference types="vite/client" />

import Anthropic from '@anthropic-ai/sdk'

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY
console.log('API Key:', API_KEY ? 'Present' : 'Missing')

// Add this temporarily for debugging
console.log('First 4 chars of API key:', API_KEY?.substring(0, 4))

const anthropic = new Anthropic({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
})

const tweetfrompostprompt = `
You are a social media expert and ghostwriter. 

You work for a popular blogger, and your job is to take a post and create several thoughtful, interesting, concise maxims to share ideas from the post.

Since you are a ghostwriter, you should be careful to maintain the style, tone and voice of the original post.

The maxims should be no more than 280 characters each and text only.

Here is the post:

`

export async function tweetfrompost(content: string) {
  try {
    console.log('Making API request...')
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Create exactly 3 different tweet variations of the following content. Format requirements:
- Start each tweet with "TWEET 1:", "TWEET 2:", or "TWEET 3:"
- Each tweet must be true to the original post in style and tone
- Avoid cliches and common phrases
- Do not use any hashtags or emojis
- Use only plain text
- Maximum 280 characters per tweet; shorter is better
- Put each tweet on its own line

Content to remix:
${content}`
      }]
    })
    console.log('API Response:', response)
    // Parse tweets by looking for "TWEET N:" markers
    const messageContent = response.content[0]
    if (messageContent.type === 'text') {
      const tweets = messageContent.text.match(/TWEET \d:(.*?)(?=TWEET \d:|$)/gs)
        ?.map(tweet => tweet.replace(/TWEET \d:/, '').trim())
        ?? []
      return tweets
    }
    return []
  } catch (error) {
    console.error('Detailed API Error:', error)
    throw error
  }
}