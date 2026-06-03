export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const API_KEY = process.env.YOUTUBE_API_KEY
  const CHANNEL_ID = process.env.RAJ_CHANNEL_ID

  if (!API_KEY || !CHANNEL_ID) {
    return res.status(500).json({ error: 'YouTube API key or Channel ID missing' })
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=50&type=video`
    )
    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch YouTube data' })
  }
}