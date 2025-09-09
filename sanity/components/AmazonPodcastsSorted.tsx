import React, { useEffect, useState, useMemo } from 'react'
import { Card, Stack, Text, Spinner, Box, Button, Flex, Select, Heading, TextInput, Checkbox, Badge, Switch, Label } from '@sanity/ui'
import { SearchIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, SortIcon, CalendarIcon, ClockIcon, DocumentIcon } from '@sanity/icons'
import { useClient, useFormValue } from 'sanity'
import { useRouter } from 'sanity/router'
import { useWorkspace } from 'sanity'
import { useToast } from '@sanity/ui'

export function AmazonPodcastsSorted() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const router = useRouter()
  const toast = useToast()
  const workspace = useWorkspace()
  const [allPodcasts, setAllPodcasts] = useState([]) // Cache all podcasts
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('date-desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [deleting, setDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [lastFetchedPerspective, setLastFetchedPerspective] = useState(null)

  const loadPodcasts = async (forceRefresh = false) => {
    // Get current perspective from router state
    const currentPerspective = router.state?.perspective || 'published'
    console.log('Current perspective:', currentPerspective, 'Router state:', router.state)
    
    // Only fetch from server if perspective changed or force refresh
    if (!forceRefresh && lastFetchedPerspective === currentPerspective && allPodcasts.length > 0) {
      console.log('Using cached data for perspective:', currentPerspective)
      setLoading(false)
      return
    }

    setLoading(true)
    
    // Adjust query based on perspective
    let baseQuery = '*[_type == "amazonPodcast"]'
    let perspectiveFilter = ''
    
    if (currentPerspective === 'previewDrafts' || currentPerspective === 'drafts') {
      // Show only drafts
      perspectiveFilter = ' && _id in path("drafts.**")'
      baseQuery = '*[_type == "amazonPodcast"' + perspectiveFilter + ']'
    } else if (currentPerspective === 'published') {
      // Show only published (not in drafts path)
      perspectiveFilter = ' && !(_id in path("drafts.**"))'
      baseQuery = '*[_type == "amazonPodcast"' + perspectiveFilter + ']'
    }
    // If perspective is 'all' or undefined, show everything
    
    console.log('Base query:', baseQuery)

    // Fetch all data without sorting (we'll sort client-side)
    const query = `${baseQuery} [0...3000]{
      _id,
      title,
      date,
      description,
      _createdAt,
      _updatedAt,
      createdAt,
      updatedAt,
      podcastImage,
      "isDraft": _id in path("drafts.**")
    }`

    try {
      const result = await client.fetch(query)
      console.log(`Query returned ${result.length} podcasts for perspective "${currentPerspective}"`)
      
      // Debug: Count drafts vs published in results
      const draftsCount = result.filter(p => p.isDraft).length
      const publishedCount = result.filter(p => !p.isDraft).length
      console.log(`Results breakdown: ${draftsCount} drafts, ${publishedCount} published`)
      
      // Debug: Log first few IDs to check format
      if (result.length > 0) {
        console.log('Sample podcast IDs:', result.slice(0, 3).map(p => p._id))
      }
      
      setAllPodcasts(result)
      setLastFetchedPerspective(currentPerspective)
    } catch (error) {
      console.error('Error fetching podcasts:', error)
    }
    setLoading(false)
  }

  // Initial load
  useEffect(() => {
    loadPodcasts()
  }, [])

  // Watch for perspective changes in router state
  useEffect(() => {
    loadPodcasts()
  }, [router.state?.perspective])

  // Client-side sorting function
  const getSortedPodcasts = useMemo(() => {
    if (!allPodcasts.length) return []

    const sorted = [...allPodcasts].sort((a, b) => {
      switch(sortBy) {
        case 'date-asc':
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        case 'date-desc':
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '')
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '')
        case 'created-desc':
          return new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime()
        case 'updated-desc':
          return new Date(b._updatedAt || 0).getTime() - new Date(a._updatedAt || 0).getTime()
        default:
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      }
    })

    return sorted
  }, [allPodcasts, sortBy])

  const handlePodcastClick = (podcast: any, event: React.MouseEvent) => {
    // Prevent click if user is clicking on checkbox
    if ((event.target as HTMLElement).closest('[data-ui="Checkbox"]')) {
      return
    }
    
    console.log('Opening podcast:', podcast._id, podcast.title)
    
    // Get current URL to see what structure path we're in
    const currentPath = window.location.pathname
    console.log('Current path:', currentPath)
    console.log('Current full URL:', window.location.href)
    
    // Clean the current path to just the base structure path
    const basePath = currentPath.split(';')[0] // Remove any existing document ID
    const structurePath = `${basePath};${podcast._id}`
    
    console.log('Base path:', basePath)
    console.log('Trying structure path:', structurePath)
    
    // Use intent navigation - this was working to open documents
    try {
      console.log('Using intent navigation...')
      router.navigate({
        intent: 'edit',
        params: { 
          id: podcast._id,
          type: 'amazonPodcast'
        }
      })
      console.log('Intent navigation successful for:', podcast._id)
    } catch (error) {
      console.error('Intent navigation failed:', error)
      toast.push({
        title: 'Navigation Error',
        description: 'Unable to open podcast for editing',
        status: 'error'
      })
    }
  }

  // Filter podcasts based on search term
  const filteredPodcasts = useMemo(() => {
    let filtered = getSortedPodcasts
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(podcast => {
        const title = (podcast.title || '').toLowerCase()
        const description = typeof podcast.description === 'string' 
          ? podcast.description.toLowerCase() 
          : ''
        const dateStr = podcast.date 
          ? new Date(podcast.date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).toLowerCase()
          : ''
        
        return title.includes(term) || 
               description.includes(term) || 
               dateStr.includes(term)
      })
    }
    
    // Filter out untitled podcasts with null dates (they're likely broken drafts)
    filtered = filtered.filter(p => p.title || p.date)
    
    return filtered
  }, [getSortedPodcasts, searchTerm])

  // Pagination logic
  const totalPages = Math.ceil(filteredPodcasts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPodcasts = filteredPodcasts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedIds(new Set()) // Clear selections when changing pages
  }

  // Handle selection
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedPodcasts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedPodcasts.map(p => p._id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // Handle deletion
  const handleDelete = async () => {
    if (selectedIds.size === 0) return
    
    const confirmMsg = `Are you sure you want to delete ${selectedIds.size} podcast${selectedIds.size > 1 ? 's' : ''}?`
    if (!confirm(confirmMsg)) return
    
    setDeleting(true)
    try {
      // Delete each selected podcast
      for (const id of selectedIds) {
        await client.delete(id)
      }
      
      toast.push({
        status: 'success',
        title: `Deleted ${selectedIds.size} podcast${selectedIds.size > 1 ? 's' : ''}`,
      })
      
      // Reload podcasts to refresh cache
      await loadPodcasts(true) // Force refresh
      setSelectedIds(new Set())
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Failed to delete podcasts',
        description: error.message,
      })
    }
    setDeleting(false)
  }

  if (loading) {
    return (
      <Card padding={4}>
        <Flex align="center" justify="center">
          <Spinner />
          <Box marginLeft={3}>
            <Text>Loading podcasts...</Text>
          </Box>
        </Flex>
      </Card>
    )
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        {/* Search Box */}
        <Card padding={3} tone="default">
          <Stack space={3}>
            <TextInput
              fontSize={2}
              icon={SearchIcon}
              placeholder="Search podcasts by title, description, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
            {searchTerm && (
              <Text size={1} muted>
                Found {filteredPodcasts.length} of {allPodcasts.length} podcasts matching "{searchTerm}"
              </Text>
            )}
          </Stack>
        </Card>

        {/* Selection Controls */}
        <Card padding={3} tone="default">
          <Stack space={3}>
            {paginatedPodcasts.length > 0 && (
              <Flex align="center" justify="space-between">
                <Flex align="center" gap={3}>
                  <Checkbox
                    checked={selectedIds.size === paginatedPodcasts.length && paginatedPodcasts.length > 0}
                    indeterminate={selectedIds.size > 0 && selectedIds.size < paginatedPodcasts.length}
                    onChange={handleSelectAll}
                  />
                  <Text size={1}>
                    {selectedIds.size > 0 
                      ? `${selectedIds.size} selected`
                      : 'Select all on page'}
                  </Text>
                  {selectedIds.size > 0 && (
                    <Button
                      tone="critical"
                      text={`Delete ${selectedIds.size} podcast${selectedIds.size > 1 ? 's' : ''}`}
                      icon={TrashIcon}
                      onClick={handleDelete}
                      disabled={deleting}
                      loading={deleting}
                    />
                  )}
                </Flex>
                <Text muted size={2}>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredPodcasts.length)} of {filteredPodcasts.length} podcasts
                </Text>
              </Flex>
            )}

          </Stack>
        </Card>

        {filteredPodcasts.length === 0 ? (
          <Card padding={4} tone="transparent">
            <Flex align="center" justify="center">
              <Stack space={3} align="center">
                <Text size={2} muted>
                  {searchTerm 
                    ? `No podcasts found matching "${searchTerm}"`
                    : 'No podcasts found'}
                </Text>
                {searchTerm && (
                  <Button
                    text="Clear search"
                    tone="primary"
                    onClick={() => setSearchTerm('')}
                  />
                )}
              </Stack>
            </Flex>
          </Card>
        ) : (
          <Stack space={3}>
            {/* Pagination Controls - Top */}
            <Card padding={3} tone="transparent">
              <Flex align="center" justify="space-between">
                {/* All Sorting Icons */}
                <Flex align="center" gap={3}>
                  {/* Date Sorting */}
                  <Flex align="center" gap={2}>
                    <CalendarIcon />
                    <Text size={1} weight="semibold">Date:</Text>
                    <Button
                      text={sortBy === 'date-desc' || sortBy === 'date-asc' ? 
                        (sortBy === 'date-desc' ? 'Newest' : 'Oldest') : 'Newest'}
                      mode="default"
                      tone={sortBy === 'date-desc' || sortBy === 'date-asc' ? 'primary' : 'default'}
                      onClick={() => setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
                      fontSize={1}
                    />
                  </Flex>

                  {/* Title Sorting */}
                  <Flex align="center" gap={2}>
                    <DocumentIcon />
                    <Text size={1} weight="semibold">Title:</Text>
                    <Button
                      text={sortBy === 'title-asc' || sortBy === 'title-desc' ? 
                        (sortBy === 'title-asc' ? 'A-Z' : 'Z-A') : 'A-Z'}
                      mode="default"
                      tone={sortBy === 'title-asc' || sortBy === 'title-desc' ? 'primary' : 'default'}
                      onClick={() => setSortBy(sortBy === 'title-asc' ? 'title-desc' : 'title-asc')}
                      fontSize={1}
                    />
                  </Flex>

                  {/* Created/Updated Sorting */}
                  <Flex align="center" gap={2}>
                    <ClockIcon />
                    <Text size={1} weight="semibold">Recent:</Text>
                    <Button
                      text={sortBy === 'created-desc' || sortBy === 'updated-desc' ? 
                        (sortBy === 'created-desc' ? 'Created' : 'Updated') : 'Created'}
                      mode="default"
                      tone={sortBy === 'created-desc' || sortBy === 'updated-desc' ? 'primary' : 'default'}
                      onClick={() => setSortBy(sortBy === 'created-desc' ? 'updated-desc' : 'created-desc')}
                      fontSize={1}
                    />
                  </Flex>
                </Flex>

                {/* Pagination and Items Per Page */}
                <Flex align="center" gap={3}>
                  {/* Items per page selector */}
                  <Flex align="center" gap={2}>
                    <Text size={1} weight="semibold">Show:</Text>
                    <Select
                      value={itemsPerPage.toString()}
                      onChange={(e) => setItemsPerPage(parseInt(e.currentTarget.value))}
                      fontSize={1}
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </Select>
                  </Flex>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Flex align="center" gap={2}>
                      <Button
                        icon={ChevronLeftIcon}
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        mode="ghost"
                      />
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (currentPage <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage > totalPages - 4) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = currentPage - 3 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            text={pageNum.toString()}
                            mode={currentPage === pageNum ? 'default' : 'ghost'}
                            tone={currentPage === pageNum ? 'primary' : 'default'}
                            onClick={() => handlePageChange(pageNum)}
                          />
                        );
                      })}
                      <Button
                        icon={ChevronRightIcon}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        mode="ghost"
                      />
                      <Text muted size={1} style={{ marginLeft: '16px' }}>
                        Page {currentPage} of {totalPages}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Card>

            <Stack space={2}>
            {paginatedPodcasts.map((podcast) => {
              const dateStr = podcast.date 
                ? new Date(podcast.date).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })
                : 'No date'
              const createdStr = podcast._createdAt
                ? new Date(podcast._createdAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })
                : ''
              
              // Highlight search term in title
              const highlightText = (text: string) => {
                if (!searchTerm || !text) return text
                const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
                return parts.map((part, i) => 
                  part.toLowerCase() === searchTerm.toLowerCase() 
                    ? <mark key={i} style={{ backgroundColor: '#ffe066', padding: '0 2px' }}>{part}</mark>
                    : part
                )
              }

              // Generate thumbnail URL from Cloudinary asset
              const thumbnailUrl = podcast.podcastImage?.secure_url ? 
                podcast.podcastImage.secure_url.replace('/upload/', '/upload/w_80,h_80,c_fill/') : null
              
              return (
                <Card 
                  key={podcast._id} 
                  padding={3} 
                  radius={2} 
                  shadow={1}
                  tone="default"
                  style={{ cursor: 'pointer' }}
                  onClick={(event) => handlePodcastClick(podcast, event)}
                >
                  <Flex align="flex-start" gap={3}>
                    <Box paddingTop={1} onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(podcast._id)}
                        onChange={() => handleSelectOne(podcast._id)}
                      />
                    </Box>
                    <Box flex={1}>
                      <Stack space={2}>
                        <Flex align="center" gap={2}>
                          <Text size={2} weight="semibold">
                            {highlightText(podcast.title || 'Untitled')}
                          </Text>
                          {podcast.isDraft && (
                            <Badge tone="caution" fontSize={0}>Draft</Badge>
                          )}
                        </Flex>
                        <Flex gap={3}>
                          <Text size={1} muted>
                            {dateStr}
                          </Text>
                          <Text size={1} muted>
                            | Created: {createdStr}
                          </Text>
                        </Flex>
                        {podcast.description && (
                          <Text size={1} muted>
                            {typeof podcast.description === 'string' 
                              ? podcast.description.substring(0, 150) + '...'
                              : 'Content available'}
                          </Text>
                        )}
                      </Stack>
                    </Box>
                    {/* Thumbnail */}
                    {thumbnailUrl && (
                      <Box>
                        <img 
                          src={thumbnailUrl} 
                          alt={podcast.title || 'Podcast thumbnail'} 
                          style={{ 
                            width: 80, 
                            height: 80, 
                            objectFit: 'cover', 
                            borderRadius: 4
                          }}
                        />
                      </Box>
                    )}
                  </Flex>
                </Card>
              )
            })}
            </Stack>

            {/* Pagination Controls - Bottom */}
            <Card padding={3} tone="transparent">
              <Flex align="center" justify="space-between">
                {/* All Sorting Icons */}
                <Flex align="center" gap={3}>
                  {/* Date Sorting */}
                  <Flex align="center" gap={2}>
                    <CalendarIcon />
                    <Text size={1} weight="semibold">Date:</Text>
                    <Button
                      text={sortBy === 'date-desc' || sortBy === 'date-asc' ? 
                        (sortBy === 'date-desc' ? 'Newest' : 'Oldest') : 'Newest'}
                      mode="default"
                      tone={sortBy === 'date-desc' || sortBy === 'date-asc' ? 'primary' : 'default'}
                      onClick={() => setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
                      fontSize={1}
                    />
                  </Flex>

                  {/* Title Sorting */}
                  <Flex align="center" gap={2}>
                    <DocumentIcon />
                    <Text size={1} weight="semibold">Title:</Text>
                    <Button
                      text={sortBy === 'title-asc' || sortBy === 'title-desc' ? 
                        (sortBy === 'title-asc' ? 'A-Z' : 'Z-A') : 'A-Z'}
                      mode="default"
                      tone={sortBy === 'title-asc' || sortBy === 'title-desc' ? 'primary' : 'default'}
                      onClick={() => setSortBy(sortBy === 'title-asc' ? 'title-desc' : 'title-asc')}
                      fontSize={1}
                    />
                  </Flex>

                  {/* Created/Updated Sorting */}
                  <Flex align="center" gap={2}>
                    <ClockIcon />
                    <Text size={1} weight="semibold">Recent:</Text>
                    <Button
                      text={sortBy === 'created-desc' || sortBy === 'updated-desc' ? 
                        (sortBy === 'created-desc' ? 'Created' : 'Updated') : 'Created'}
                      mode="default"
                      tone={sortBy === 'created-desc' || sortBy === 'updated-desc' ? 'primary' : 'default'}
                      onClick={() => setSortBy(sortBy === 'created-desc' ? 'updated-desc' : 'created-desc')}
                      fontSize={1}
                    />
                  </Flex>
                </Flex>

                {/* Pagination and Items Per Page */}
                <Flex align="center" gap={3}>
                  {/* Items per page selector */}
                  <Flex align="center" gap={2}>
                    <Text size={1} weight="semibold">Show:</Text>
                    <Select
                      value={itemsPerPage.toString()}
                      onChange={(e) => setItemsPerPage(parseInt(e.currentTarget.value))}
                      fontSize={1}
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </Select>
                  </Flex>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Flex align="center" gap={2}>
                      <Button
                        icon={ChevronLeftIcon}
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        mode="ghost"
                      />
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (currentPage <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage > totalPages - 4) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = currentPage - 3 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            text={pageNum.toString()}
                            mode={currentPage === pageNum ? 'default' : 'ghost'}
                            tone={currentPage === pageNum ? 'primary' : 'default'}
                            onClick={() => handlePageChange(pageNum)}
                          />
                        );
                      })}
                      <Button
                        icon={ChevronRightIcon}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        mode="ghost"
                      />
                      <Text muted size={1} style={{ marginLeft: '16px' }}>
                        Page {currentPage} of {totalPages}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Card>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}