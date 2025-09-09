import React, { useEffect, useState } from 'react'
import { Card, Stack, Text, Spinner, Box } from '@sanity/ui'
import { useClient } from 'sanity'

export function AmazonPodcastsList() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const query = `*[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...100]{
      _id,
      title,
      date,
      description,
      _createdAt
    }`

    client.fetch(query).then((result) => {
      setPodcasts(result)
      setLoading(false)
    })
  }, [client])

  if (loading) {
    return (
      <Card padding={4}>
        <Spinner />
      </Card>
    )
  }

  return (
    <Stack space={3} padding={4}>
      {podcasts.map((podcast) => {
        const dateStr = podcast.date ? new Date(podcast.date).toLocaleDateString() : 'No date'
        return (
          <Card key={podcast._id} padding={3} radius={2} shadow={1}>
            <Stack space={2}>
              <Text size={2} weight="semibold">
                {podcast.title}
              </Text>
              <Text size={1} muted>
                Date: {dateStr} | Created: {new Date(podcast._createdAt).toLocaleDateString()}
              </Text>
              {podcast.description && (
                <Text size={1}>
                  {typeof podcast.description === 'string' 
                    ? podcast.description.substring(0, 100) + '...'
                    : 'Rich text description'}
                </Text>
              )}
            </Stack>
          </Card>
        )
      })}
    </Stack>
  )
}