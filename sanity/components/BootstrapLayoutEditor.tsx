import React, { useState } from 'react'
import { Card, Stack, Button, Text, Flex, Box, Select, TextInput, Checkbox, Grid, Tab, TabList, TabPanel, Dialog, Avatar } from '@sanity/ui'
import { AddIcon, TrashIcon, ComponentIcon, EditIcon, EyeOpenIcon, CogIcon, CloseIcon } from '@sanity/icons'
import { set } from 'sanity'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'

interface Row {
  id: string
  columns: Column[]
  cssClasses?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  noGutters?: boolean
}

interface Component {
  id: string
  type: string
  placeholder: string
  contentType?: string
  itemId?: string
  itemRef?: {
    _type: string
    _ref: string
  }
}

interface Column {
  id: string
  size: number
  smSize?: number
  mdSize?: number
  lgSize?: number
  xlSize?: number
  offset?: number
  components: Component[]
  cssClasses?: string
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'middle' | 'bottom'
}

interface LayoutData {
  rows: Row[]
  containerType?: 'container' | 'container-fluid' | 'none'
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    backgroundColor?: string
  }
}

// Sortable Item Component for drag and drop
const SortableItem = ({ component, onRemove, onComponentClick }: { 
  component: Component, 
  onRemove: () => void,
  onComponentClick?: (component: Component) => void 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const hasDataSource = component.itemRef?._ref || component.itemId;
  const canNavigateToDataSource = hasDataSource && onComponentClick;

  return (
    <Flex
      ref={setNodeRef}
      justify="space-between"
      align="center"
      style={{
        ...style,
        padding: '4px 6px',
        backgroundColor: isDragging ? '#bbdefb' : (canNavigateToDataSource ? '#e3f2fd' : '#f8f9fa'),
        border: canNavigateToDataSource ? '1px solid #2196f3' : '1px solid #e9ecef',
        borderRadius: '3px',
        fontSize: '10px',
        color: '#495057',
        marginBottom: '2px',
      }}
    >
      <Flex 
        align="center" 
        gap={1}
        style={{ flex: 1 }}
      >
        {/* Drag Handle */}
        <Box
          {...attributes}
          {...listeners}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
          }}
          title="Drag to reorder"
        >
          ⋮⋮
        </Box>
        
        {/* Clickable Title */}
        <Text 
          size={0}
          style={{
            flex: 1,
            userSelect: 'none',
            cursor: canNavigateToDataSource ? 'pointer' : 'default',
            textDecoration: canNavigateToDataSource ? 'underline' : 'none',
            color: canNavigateToDataSource ? '#2196f3' : '#495057',
            fontWeight: canNavigateToDataSource ? '500' : 'normal',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (canNavigateToDataSource) {
              onComponentClick(component);
            }
          }}
          title={canNavigateToDataSource ? "Click to open datasource" : undefined}
        >
          {component.placeholder}
        </Text>
        
        {canNavigateToDataSource && (
          <EyeOpenIcon 
            style={{
              color: '#2196f3',
              fontSize: '10px',
            }}
            title="Has datasource"
          />
        )}
      </Flex>
      <Button
        icon={TrashIcon}
        mode="ghost"
        tone="critical"
        size={0}
        style={{ padding: '1px', cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onRemove()
        }}
      />
    </Flex>
  )
}

// Droppable Column Component
const DroppableColumn = ({ 
  columnId, 
  components, 
  onAddComponent, 
  onRemoveComponent,
  onComponentClick
}: { 
  columnId: string
  components: Component[]
  onAddComponent: () => void
  onRemoveComponent: (componentId: string) => void
  onComponentClick?: (component: Component) => void
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  })

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        backgroundColor: isOver ? '#e3f2fd' : 'transparent',
        borderRadius: '4px',
        padding: '4px',
        minHeight: '40px',
        overflow: 'visible',
      }}
    >
      {components.length === 0 ? (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #ddd',
            borderRadius: '4px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#666',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minHeight: '40px',
          }}
          onClick={onAddComponent}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f8ff'
            e.currentTarget.style.borderColor = '#007bff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = '#ddd'
          }}
        >
          <Flex align="center" gap={1}>
            <ComponentIcon />
            <Text size={0}>Add Component</Text>
          </Flex>
        </Box>
      ) : (
        <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {components.map((component) => (
            <SortableItem
              key={component.id}
              component={component}
              onRemove={() => onRemoveComponent(component.id)}
              onComponentClick={onComponentClick}
            />
          ))}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed #ccc',
              borderRadius: '3px',
              padding: '4px',
              fontSize: '10px',
              color: '#666',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa',
            }}
            onClick={onAddComponent}
          >
            <Flex align="center" gap={1}>
              <AddIcon />
              <Text size={0}>Add Component</Text>
            </Flex>
          </Box>
        </SortableContext>
      )}
    </Box>
  )
}

const componentTypes = [
  { 
    title: 'Header', 
    value: 'header',
    icon: '🏠',
    description: 'Site header with logo and navigation',
    category: 'Structure'
  },
  { 
    title: 'Navigation', 
    value: 'navigation',
    icon: '🧭',
    description: 'Navigation menu or breadcrumbs',
    category: 'Structure'
  },
  { 
    title: 'Hero Banner', 
    value: 'hero',
    icon: '🎯',
    description: 'Large promotional banner or hero section',
    category: 'Content'
  },
  { 
    title: 'Content Block', 
    value: 'content',
    icon: '📄',
    description: 'Rich text content area',
    category: 'Content'
  },
  { 
    title: 'Card', 
    value: 'card',
    icon: '🗂️',
    description: 'Information cards with image and text',
    category: 'Content'
  },
  { 
    title: 'Gallery', 
    value: 'gallery',
    icon: '🖼️',
    description: 'Image gallery or carousel',
    category: 'Media'
  },
  { 
    title: 'Form', 
    value: 'form',
    icon: '📝',
    description: 'Contact or subscription forms',
    category: 'Interactive'
  },
  { 
    title: 'Sidebar', 
    value: 'sidebar',
    icon: '📋',
    description: 'Sidebar with widgets or links',
    category: 'Structure'
  },
  { 
    title: 'Footer', 
    value: 'footer',
    icon: '📧',
    description: 'Site footer with links and info',
    category: 'Structure'
  },
  { 
    title: 'Accordion', 
    value: 'accordion',
    icon: '📑',
    description: 'Collapsible content sections',
    category: 'Interactive'
  },
  { 
    title: 'Testimonials', 
    value: 'testimonials',
    icon: '💬',
    description: 'Customer testimonials or reviews',
    category: 'Content'
  },
  { 
    title: 'Pricing Table', 
    value: 'pricing',
    icon: '💰',
    description: 'Pricing plans or comparison table',
    category: 'Content'
  },
  { 
    title: 'Blog Posts', 
    value: 'blog',
    icon: '📰',
    description: 'Blog post listing or featured posts',
    category: 'Content'
  },
  { 
    title: 'Search', 
    value: 'search',
    icon: '🔍',
    description: 'Search functionality with results display',
    category: 'Interactive'
  },
  { 
    title: 'Custom Component', 
    value: 'custom',
    icon: '⚙️',
    description: 'Custom component placeholder',
    category: 'Custom'
  }
]

const contentTypes = [
  // Core Content
  { 
    title: 'Landing Pages', 
    value: 'landingPage',
    icon: '🏠',
    description: 'Complete landing pages with layouts',
    category: 'Pages'
  },
  { 
    title: 'Shows', 
    value: 'shows',
    icon: '📻',
    description: 'Radio show information and schedules',
    category: 'Content'
  },
  { 
    title: 'Amazon Podcasts', 
    value: 'amazonPodcast',
    icon: '🎧',
    description: 'Podcast episodes and listings',
    category: 'Content'
  },
  { 
    title: 'Staff', 
    value: 'staff',
    icon: '👥',
    description: 'Team member profiles and bios',
    category: 'Content'
  },
  { 
    title: 'Videos', 
    value: 'video',
    icon: '🎥',
    description: 'Video content and embeds',
    category: 'Media'
  },
  { 
    title: 'Playlists', 
    value: 'playlist',
    icon: '🎵',
    description: 'Music playlists and track listings',
    category: 'Media'
  },
  
  // Structure & Navigation
  { 
    title: 'Headers', 
    value: 'headerConfiguration',
    icon: '🏗️',
    description: 'Site header configurations',
    category: 'Structure'
  },
  { 
    title: 'Footers', 
    value: 'footer',
    icon: '📧',
    description: 'Site footer configurations',
    category: 'Structure'
  },
  { 
    title: 'Menus', 
    value: 'menu',
    icon: '🧭',
    description: 'Navigation menu configurations',
    category: 'Structure'
  },
  { 
    title: 'Navigation Links', 
    value: 'navigationLink',
    icon: '🔗',
    description: 'Individual navigation links',
    category: 'Structure'
  },
  { 
    title: 'Linked Icons', 
    value: 'linkedIcon',
    icon: '🎯',
    description: 'Clickable icon links',
    category: 'Structure'
  },

  // Promotional & Marketing
  { 
    title: 'Banners', 
    value: 'banner',
    icon: '🏷️',
    description: 'Promotional banners and announcements',
    category: 'Marketing'
  },
  { 
    title: 'Sponsors', 
    value: 'sponsor',
    icon: '🤝',
    description: 'Sponsor information and logos',
    category: 'Marketing'
  },

  // Scheduling & Programming
  { 
    title: 'Schedule', 
    value: 'schedule',
    icon: '📅',
    description: 'Radio programming schedule',
    category: 'Programming'
  },
  { 
    title: 'Show Slots', 
    value: 'showSlot',
    icon: '⏰',
    description: 'Individual show time slots',
    category: 'Programming'
  },
  { 
    title: 'Streams', 
    value: 'stream',
    icon: '📡',
    description: 'Live streaming information',
    category: 'Programming'
  },

  // Layout Components
  { 
    title: 'Layouts', 
    value: 'layout',
    icon: '📐',
    description: 'Page layout configurations',
    category: 'Layout'
  },
  { 
    title: 'Layout Columns', 
    value: 'layoutColumn',
    icon: '📊',
    description: 'Column configurations for layouts',
    category: 'Layout'
  },
  { 
    title: 'Components', 
    value: 'component',
    icon: '🧩',
    description: 'Reusable layout components',
    category: 'Layout'
  },

  // Interactive Components
  { 
    title: 'Accordions', 
    value: 'accordion',
    icon: '📑',
    description: 'Collapsible content sections',
    category: 'Interactive'
  },
  { 
    title: 'Carousels', 
    value: 'carousel',
    icon: '🎠',
    description: 'Image and content carousels',
    category: 'Interactive'
  },
  { 
    title: 'Lists', 
    value: 'list',
    icon: '📋',
    description: 'Structured content lists',
    category: 'Interactive'
  },
  { 
    title: 'Messages', 
    value: 'message',
    icon: '💬',
    description: 'Message and announcement blocks',
    category: 'Interactive'
  },

  // Special Features
  { 
    title: 'Latest Podcasts', 
    value: 'latestPodcasts',
    icon: '🎙️',
    description: 'Dynamic latest podcast listings',
    category: 'Dynamic'
  },
  { 
    title: 'DJ by ID', 
    value: 'djById',
    icon: '🎚️',
    description: 'Specific DJ information display',
    category: 'Dynamic'
  },

  // Search
  { 
    title: 'Search Boxes', 
    value: 'searchBox',
    icon: '🔍',
    description: 'Search box configurations and settings',
    category: 'Interactive'
  },

  // Configuration
  { 
    title: 'Site Config', 
    value: 'config',
    icon: '⚙️',
    description: 'Global site configuration',
    category: 'System'
  }
]

const ItemSelector = ({ contentType, onSelectItem }: { contentType: string, onSelectItem: (id: string, title: string) => void }) => {
  const [items, setItems] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        // Use Sanity client from the studio context
        const { createClient } = await import('@sanity/client')
        const client = createClient({
          projectId: '7nd9afqv',
          dataset: 'production', 
          useCdn: false
        })
        
        // Create query based on content type
        let query = ''
        let titleField = 'title'
        
        switch (contentType) {
          case 'stream':
            query = '*[_type == "stream"] | order(title asc)'
            break
          case 'shows':
            query = '*[_type == "shows"] | order(title asc)'
            break
          case 'staff':
            query = '*[_type == "staff"] | order(name asc)'
            titleField = 'name'
            break
          case 'amazonPodcast':
            query = '*[_type == "amazonPodcast"] | order(title asc)'
            break
          case 'banner':
            query = '*[_type == "banner"] | order(title asc)'
            break
          case 'sponsor':
            query = '*[_type == "sponsor"] | order(title asc)'
            break
          case 'playlist':
            query = '*[_type == "playlist"] | order(title asc)'
            break
          case 'video':
            query = '*[_type == "video"] | order(title asc)'
            break
          case 'searchBox':
            query = '*[_type == "searchBox"] | order(title asc)'
            break
          default:
            query = `*[_type == "${contentType}"] | order(title asc)`
        }

        const result = await client.fetch(query)
        setItems(result.map((item: any) => ({
          ...item,
          displayTitle: item[titleField] || item.title || `${contentType} ${item._id}`
        })))
      } catch (error) {
        console.error('Error fetching items:', error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    if (contentType) {
      fetchItems()
    }
  }, [contentType])

  if (loading) {
    return (
      <Stack space={3}>
        <Text size={1} style={{ color: '#666' }}>
          Loading {contentType} items...
        </Text>
      </Stack>
    )
  }

  if (items.length === 0) {
    return (
      <Stack space={3}>
        <Text size={1} style={{ color: '#666' }}>
          No {contentType} items found. Create some {contentType} content first.
        </Text>
      </Stack>
    )
  }

  return (
    <Stack space={3}>
      <Text size={1} style={{ color: '#666' }}>
        Choose a specific {contentType} to display ({items.length} available):
      </Text>
      <Box style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <Grid columns={1} gap={2}>
          {items.map(item => (
            <Card
              key={item._id}
              padding={3}
              border
              tone="transparent"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectItem(item._id, item.displayTitle)}
            >
              <Text size={1} weight="medium">
                {item.displayTitle}
              </Text>
            </Card>
          ))}
        </Grid>
      </Box>
    </Stack>
  )
}

const BootstrapLayoutEditor = React.forwardRef((props: any, ref) => {
  const { elementProps, onChange, value = { rows: [], containerType: 'container' } } = props
  
  // Migrate legacy data structure to new format
  const migrateLayoutData = (data: any): LayoutData => {
    if (!data || !data.rows) return { rows: [], containerType: 'container' }
    
    return {
      ...data,
      rows: data.rows.map((row: any) => ({
        ...row,
        columns: row.columns?.map((col: any) => ({
          ...col,
          // Migrate old single component structure to new components array
          components: col.components || (col.componentType ? [{
            id: `comp-${Date.now()}-${Math.random()}`,
            type: col.componentType,
            placeholder: col.componentPlaceholder || componentTypes.find(c => c.value === col.componentType)?.title || 'Component',
            contentType: undefined
          }] : [])
        })) || []
      })) || []
    }
  }
  
  const [layoutData, setLayoutData] = useState<LayoutData>(migrateLayoutData(value))
  const [activeTab, setActiveTab] = useState('layout')
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalColumn, setModalColumn] = useState<{rowId: string, columnId: string} | null>(null)
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null)
  const [showItemSelector, setShowItemSelector] = useState(false)
  const [modalTab, setModalTab] = useState<'components' | 'content'>('components')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const updateLayout = (newLayout: LayoutData) => {
    console.log('updateLayout called with:', newLayout)
    setLayoutData(newLayout)
    onChange(set(newLayout))
  }

  // Handle component click to navigate to datasource
  const handleComponentClick = (component: Component) => {
    if (component.itemRef?._ref) {
      // Navigate to the referenced document in Sanity Studio
      if (props.onPathOpen) {
        // Use Sanity Studio's navigation API if available
        props.onPathOpen([
          { _type: component.itemRef._type, _id: component.itemRef._ref }
        ])
      } else if (window.location.pathname.includes('/studio')) {
        // Fallback: construct URL manually
        const baseUrl = window.location.origin + window.location.pathname.split('/studio')[0] + '/studio'
        const docType = component.itemRef._type
        const docId = component.itemRef._ref
        window.open(`${baseUrl}/desk/${docType};${docId}`, '_blank')
      }
    } else if (component.itemId) {
      // Handle itemId case (legacy or different format)
      if (props.onPathOpen) {
        props.onPathOpen([
          { _type: component.contentType || 'document', _id: component.itemId }
        ])
      }
    }
  }

  const addRow = () => {
    const newRow: Row = {
      id: `row-${Date.now()}`,
      columns: [{ 
        id: `col-${Date.now()}`, 
        size: 12,
        components: [],
        textAlign: 'left'
      }],
      verticalAlign: 'top',
      spacing: 'md'
    }
    updateLayout({
      ...layoutData,
      rows: [...layoutData.rows, newRow]
    })
  }

  const removeRow = (rowId: string) => {
    updateLayout({
      ...layoutData,
      rows: layoutData.rows.filter(row => row.id !== rowId)
    })
  }

  const addColumn = (rowId: string) => {
    const newLayout = {
      ...layoutData,
      rows: layoutData.rows.map(row => {
        if (row.id === rowId) {
          const currentColumns = row.columns.length
          const newColumnCount = currentColumns + 1
          
          // Calculate new sizes - distribute 12 columns evenly
          const newSize = Math.floor(12 / newColumnCount)
          const remainder = 12 % newColumnCount
          
          // Create new columns array with redistributed sizes
          const newColumns = row.columns.map((col, index) => ({
            ...col,
            size: newSize + (index < remainder ? 1 : 0)
          }))
          
          // Add the new column
          const newColumn: Column = {
            id: `col-${Date.now()}`,
            size: newSize + (currentColumns < remainder ? 1 : 0),
            components: [],
            textAlign: 'left'
          }
          
          return { ...row, columns: [...newColumns, newColumn] }
        }
        return row
      })
    }
    updateLayout(newLayout)
  }

  const removeColumn = (rowId: string, columnId: string) => {
    const newLayout = {
      ...layoutData,
      rows: layoutData.rows.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            columns: row.columns.filter(col => col.id !== columnId)
          }
        }
        return row
      })
    }
    updateLayout(newLayout)
  }

  const updateColumn = (rowId: string, columnId: string, updates: Partial<Column>) => {
    const newLayout = {
      ...layoutData,
      rows: layoutData.rows.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            columns: row.columns.map(col => 
              col.id === columnId ? { ...col, ...updates } : col
            )
          }
        }
        return row
      })
    }
    updateLayout(newLayout)
  }

  const updateColumnSpan = (rowId: string, columnId: string, newSize: number) => {
    const newLayout = {
      ...layoutData,
      rows: layoutData.rows.map(row => {
        if (row.id === rowId) {
          const columnIndex = row.columns.findIndex(col => col.id === columnId)
          if (columnIndex === -1) return row
          
          const currentColumn = row.columns[columnIndex]
          const otherColumns = row.columns.filter((_, index) => index !== columnIndex)
          const otherColumnsTotal = otherColumns.reduce((sum, col) => sum + col.size, 0)
          
          // Calculate maximum allowed size for this column (12 - minimum size for other columns)
          const minSizeForOthers = otherColumns.length // Each column needs at least 1
          const maxAllowedSize = Math.min(12 - minSizeForOthers, 12)
          
          // Clamp new size to valid range - ensure minimum of 1
          const clampedNewSize = Math.max(1, Math.min(maxAllowedSize, newSize))
          
          // If no change needed, return unchanged
          if (clampedNewSize === currentColumn.size) return row
          
          // Create new columns array with immutable updates
          const newColumns = [...row.columns]
          newColumns[columnIndex] = { ...currentColumn, size: clampedNewSize }
          
          // Calculate how much we need to adjust other columns
          const sizeDifference = clampedNewSize - currentColumn.size
          
          if (sizeDifference !== 0 && otherColumns.length > 0) {
            // Distribute the adjustment among other columns proportionally
            let remainingAdjustment = -sizeDifference
            const validOtherColumns = otherColumns.filter(col => col.size > 0)
            
            if (validOtherColumns.length > 0) {
              // First pass: proportional adjustment
              for (let i = 0; i < validOtherColumns.length && Math.abs(remainingAdjustment) > 0; i++) {
                const colIndex = newColumns.findIndex(col => col.id === validOtherColumns[i].id)
                const currentSize = newColumns[colIndex].size
                const proportionalAdjustment = Math.round(remainingAdjustment * (currentSize / otherColumnsTotal))
                
                // Ensure column never goes below 1 or above 12
                const maxDecrease = currentSize - 1
                const maxIncrease = 12 - currentSize
                const adjustment = Math.max(-maxDecrease, Math.min(maxIncrease, proportionalAdjustment))
                
                if (adjustment !== 0) {
                  newColumns[colIndex] = { ...newColumns[colIndex], size: Math.max(1, currentSize + adjustment) }
                  remainingAdjustment -= adjustment
                }
              }
              
              // Second pass: handle any remaining adjustment
              if (Math.abs(remainingAdjustment) > 0) {
                for (let i = 0; i < validOtherColumns.length && Math.abs(remainingAdjustment) > 0; i++) {
                  const colIndex = newColumns.findIndex(col => col.id === validOtherColumns[i].id)
                  const currentSize = newColumns[colIndex].size
                  
                  if (remainingAdjustment > 0 && currentSize < 12) {
                    const adjustment = Math.min(12 - currentSize, remainingAdjustment)
                    newColumns[colIndex] = { ...newColumns[colIndex], size: currentSize + adjustment }
                    remainingAdjustment -= adjustment
                  } else if (remainingAdjustment < 0 && currentSize > 1) {
                    const adjustment = Math.max(1 - currentSize, remainingAdjustment)
                    newColumns[colIndex] = { ...newColumns[colIndex], size: Math.max(1, currentSize + adjustment) }
                    remainingAdjustment -= adjustment
                  }
                }
              }
            }
          }
          
          // Final validation: ensure all columns are at least 1 and total doesn't exceed 12
          const finalColumns = newColumns.map(col => ({
            ...col,
            size: Math.max(1, Math.min(12, col.size))
          }))
          
          // Verify total and adjust if necessary
          const totalSize = finalColumns.reduce((sum, col) => sum + col.size, 0)
          if (totalSize > 12) {
            // Proportionally reduce all columns to fit within 12
            const scaleFactor = 12 / totalSize
            let adjustedTotal = 0
            
            const adjustedColumns = finalColumns.map((col, index) => {
              if (index === finalColumns.length - 1) {
                // Last column gets whatever's left to ensure total is exactly 12
                const remainingSize = Math.max(1, 12 - adjustedTotal)
                return { ...col, size: remainingSize }
              } else {
                const adjustedSize = Math.max(1, Math.floor(col.size * scaleFactor))
                adjustedTotal += adjustedSize
                return { ...col, size: adjustedSize }
              }
            })
            
            return { ...row, columns: adjustedColumns }
          }
          
          return { ...row, columns: finalColumns }
        }
        return row
      })
    }
    
    // Ensure the layout state is properly updated with immutable update
    const updatedLayout = JSON.parse(JSON.stringify(newLayout)) // Deep clone to ensure React sees it as new
    setLayoutData(updatedLayout)
    updateLayout(updatedLayout)
  }

  const updateRow = (rowId: string, updates: Partial<Row>) => {
    const newLayout = {
      ...layoutData,
      rows: layoutData.rows.map(row => 
        row.id === rowId ? { ...row, ...updates } : row
      )
    }
    updateLayout(newLayout)
  }

  const duplicateRow = (rowId: string) => {
    const rowToDuplicate = layoutData.rows.find(row => row.id === rowId)
    if (rowToDuplicate) {
      const duplicatedRow: Row = {
        ...rowToDuplicate,
        id: `row-${Date.now()}`,
        columns: rowToDuplicate.columns.map(col => ({
          ...col,
          id: `col-${Date.now()}`
        }))
      }
      const rowIndex = layoutData.rows.findIndex(row => row.id === rowId)
      const newRows = [...layoutData.rows]
      newRows.splice(rowIndex + 1, 0, duplicatedRow)
      updateLayout({ ...layoutData, rows: newRows })
    }
  }

  const openComponentModal = (rowId: string, columnId: string) => {
    setModalColumn({ rowId, columnId })
    setShowModal(true)
  }

  const addComponentToColumn = (rowId: string, columnId: string, componentType: string, contentType?: string, itemId?: string, itemTitle?: string) => {
    const component = componentTypes.find(c => c.value === componentType.replace('-item', ''))
    const content = contentType ? contentTypes.find(c => c.value === contentType) : null
    
    const newComponent: Component = {
      id: `comp-${Date.now()}`,
      type: componentType,
      placeholder: itemTitle ? 
        `${content?.title}: ${itemTitle}` : 
        (content ? `${component?.title} - ${content.title}` : component?.title || 'Component'),
      contentType,
      itemId,
      itemRef: itemId && contentType ? {
        _type: contentType,
        _ref: itemId
      } : undefined
    }

    const newLayout = {
      ...layoutData,
      rows: layoutData.rows.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            columns: row.columns.map(col => 
              col.id === columnId 
                ? { ...col, components: [...col.components, newComponent] }
                : col
            )
          }
        }
        return row
      })
    }
    updateLayout(newLayout)
  }

  const removeComponentFromColumn = (rowId: string, columnId: string, componentId: string) => {
    const newLayout = {
      ...layoutData,
      rows: layoutData.rows.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            columns: row.columns.map(col => 
              col.id === columnId 
                ? { ...col, components: (col.components || []).filter(comp => comp.id !== componentId) }
                : col
            )
          }
        }
        return row
      })
    }
    
    // Ensure the layout state is properly updated with immutable update
    const updatedLayout = JSON.parse(JSON.stringify(newLayout))
    setLayoutData(updatedLayout)
    updateLayout(updatedLayout)
  }

  const selectComponent = (componentType: string, contentType?: string) => {
    // If it's a content type, show the item selector
    if (contentType && !componentType.includes('-item')) {
      setSelectedContentType(contentType)
      setShowItemSelector(true)
      return
    }
    
    // Add the component
    if (modalColumn) {
      addComponentToColumn(modalColumn.rowId, modalColumn.columnId, componentType, contentType)
    }
    setShowModal(false)
    setModalColumn(null)
    setSelectedContentType(null)
    setShowItemSelector(false)
  }
  
  const selectContentItem = (itemId: string, itemTitle: string) => {
    if (modalColumn && selectedContentType) {
      addComponentToColumn(modalColumn.rowId, modalColumn.columnId, `${selectedContentType}-item`, selectedContentType, itemId, itemTitle)
      setShowModal(false)
      setModalColumn(null)
      setSelectedContentType(null)
      setShowItemSelector(false)
    }
  }
  
  const goBackToContentTypes = () => {
    setShowItemSelector(false)
    setSelectedContentType(null)
  }

  const renderComponentModal = () => {
    if (!showModal) return null

    const categories = [...new Set(componentTypes.map(c => c.category))]

    return (
      <Dialog
        id="component-selector"
        header={showItemSelector ? `Select ${selectedContentType}` : "Select Component"}
        onClose={() => {
          setShowModal(false)
          setShowItemSelector(false)
          setSelectedContentType(null)
        }}
        width={2}
      >
        <Box padding={4}>
          <Stack space={4}>
            {showItemSelector && (
              <Flex justify="space-between" align="center">
                <Button
                  text="← Back to Content Types"
                  mode="ghost"
                  onClick={goBackToContentTypes}
                />
                <Text weight="medium">Select a {selectedContentType} item:</Text>
              </Flex>
            )}
            
            {!showItemSelector && (
              <>
                <TabList space={2}>
                  <Tab
                    id="components-tab"
                    selected={modalTab === 'components'}
                    onClick={() => setModalTab('components')}
                  >
                    Components
                  </Tab>
                  <Tab
                    id="content-tab"
                    selected={modalTab === 'content'}
                    onClick={() => setModalTab('content')}
                  >
                    Content Types
                  </Tab>
                </TabList>

                <Box>
              <TabPanel hidden={modalTab !== 'components'}>
                <Stack space={4}>
                  {categories.map(category => (
                    <Stack key={category} space={3}>
                      <Text weight="bold" size={1}>{category}</Text>
                      <Grid columns={3} gap={3}>
                        {componentTypes
                          .filter(component => component.category === category)
                          .map(component => (
                            <Card
                              key={component.value}
                              padding={3}
                              border
                              tone="transparent"
                              style={{ cursor: 'pointer' }}
                              onClick={() => component.value === 'search' ? selectComponent('content', 'searchBox') : selectComponent(component.value)}
                            >
                              <Stack space={2} align="center">
                                <Text size={3}>{component.icon}</Text>
                                <Text size={1} weight="medium" align="center">
                                  {component.title}
                                </Text>
                                <Text size={0} align="center" style={{ color: '#666' }}>
                                  {component.description}
                                </Text>
                              </Stack>
                            </Card>
                          ))}
                      </Grid>
                    </Stack>
                  ))}
                </Stack>
              </TabPanel>

              <TabPanel hidden={modalTab !== 'content'}>
                <Stack space={4}>
                  <Text size={1} style={{ color: '#666' }}>
                    Select a Sanity content type to display in this column
                  </Text>
                  {[...new Set(contentTypes.map(c => c.category))].map(category => (
                    <Stack key={category} space={3}>
                      <Text weight="bold" size={1}>{category}</Text>
                      <Grid columns={2} gap={3}>
                        {contentTypes
                          .filter(content => content.category === category)
                          .map(content => (
                            <Card
                              key={content.value}
                              padding={3}
                              border
                              tone="transparent"
                              style={{ cursor: 'pointer' }}
                              onClick={() => selectComponent('content', content.value)}
                            >
                              <Stack space={2}>
                                <Flex align="center" gap={2}>
                                  <Text size={2}>{content.icon}</Text>
                                  <Text size={1} weight="medium">
                                    {content.title}
                                  </Text>
                                </Flex>
                                <Text size={0} style={{ color: '#666' }}>
                                  {content.description}
                                </Text>
                              </Stack>
                            </Card>
                          ))}
                      </Grid>
                    </Stack>
                  ))}
                </Stack>
              </TabPanel>
                </Box>
              </>
            )}

            {showItemSelector && selectedContentType && (
              <Box>
                <ItemSelector
                  contentType={selectedContentType}
                  onSelectItem={selectContentItem}
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Dialog>
    )
  }

  const renderDesignPanel = () => (
    <Card padding={3} border>
      <Stack space={3}>
        <Text weight="bold" size={1}>Design Panel</Text>
        
        <Stack space={2}>
          <Text size={1} weight="medium">Container Type</Text>
          <Select
            value={layoutData.containerType || 'container'}
            onChange={(event) => updateLayout({
              ...layoutData,
              containerType: event.currentTarget.value as any
            })}
          >
            <option value="container">Container</option>
            <option value="container-fluid">Container Fluid</option>
            <option value="none">No Container</option>
          </Select>
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="medium">Theme Colors</Text>
          <Grid columns={2} gap={2}>
            <Stack space={1}>
              <Text size={0}>Primary</Text>
              <TextInput
                type="color"
                value={layoutData.theme?.primaryColor || '#007bff'}
                onChange={(event) => updateLayout({
                  ...layoutData,
                  theme: {
                    ...layoutData.theme,
                    primaryColor: event.currentTarget.value
                  }
                })}
              />
            </Stack>
            <Stack space={1}>
              <Text size={0}>Secondary</Text>
              <TextInput
                type="color"
                value={layoutData.theme?.secondaryColor || '#6c757d'}
                onChange={(event) => updateLayout({
                  ...layoutData,
                  theme: {
                    ...layoutData.theme,
                    secondaryColor: event.currentTarget.value
                  }
                })}
              />
            </Stack>
          </Grid>
        </Stack>

        <Flex align="center" gap={2}>
          <Checkbox
            checked={showGrid}
            onChange={(event) => setShowGrid(event.currentTarget.checked)}
          />
          <Text size={1}>Show Grid Overlay</Text>
        </Flex>
      </Stack>
    </Card>
  )

  const renderColumnEditor = () => {
    if (!selectedColumn) return null
    
    const selectedCol = layoutData.rows
      .flatMap(row => row.columns)
      .find(col => col.id === selectedColumn)
    
    if (!selectedCol) return null

    const rowId = layoutData.rows.find(row => 
      row.columns.some(col => col.id === selectedColumn)
    )?.id

    return (
      <Card padding={3} border>
        <Stack space={3}>
          <Text weight="bold" size={1}>Column Editor</Text>
          
          <Stack space={2}>
            <Text size={1} weight="medium">Components in Column</Text>
            {(!selectedCol.components || selectedCol.components.length === 0) ? (
              <Card padding={2} tone="transparent" border style={{ textAlign: 'center' }}>
                <Text size={0} style={{ color: '#666' }}>No components added yet</Text>
              </Card>
            ) : (
              <Stack space={2}>
                {(selectedCol.components || []).map((component, index) => (
                  <Card key={component.id} padding={2} border tone="caution">
                    <Flex justify="space-between" align="center">
                      <Text size={0} weight="medium">{component.placeholder}</Text>
                      <Button
                        icon={TrashIcon}
                        mode="ghost"
                        tone="critical"
                        size={0}
                        onClick={() => removeComponentFromColumn(rowId!, selectedColumn, component.id)}
                      />
                    </Flex>
                  </Card>
                ))}
              </Stack>
            )}
            <Button
              text="Add Component"
              icon={AddIcon}
              mode="ghost"
              onClick={() => openComponentModal(rowId!, selectedColumn)}
              size={1}
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight="medium">Responsive Sizes</Text>
            <Grid columns={4} gap={1}>
              <Stack space={1}>
                <Text size={0}>XS</Text>
                <TextInput
                  type="number"
                  min="1"
                  max="12"
                  value={selectedCol.size.toString()}
                  onChange={(event) => updateColumn(rowId!, selectedColumn, {
                    size: parseInt(event.currentTarget.value) || 1
                  })}
                />
              </Stack>
              <Stack space={1}>
                <Text size={0}>SM</Text>
                <TextInput
                  type="number"
                  min="1"
                  max="12"
                  value={selectedCol.smSize?.toString() || ''}
                  onChange={(event) => updateColumn(rowId!, selectedColumn, {
                    smSize: parseInt(event.currentTarget.value) || undefined
                  })}
                />
              </Stack>
              <Stack space={1}>
                <Text size={0}>MD</Text>
                <TextInput
                  type="number"
                  min="1"
                  max="12"
                  value={selectedCol.mdSize?.toString() || ''}
                  onChange={(event) => updateColumn(rowId!, selectedColumn, {
                    mdSize: parseInt(event.currentTarget.value) || undefined
                  })}
                />
              </Stack>
              <Stack space={1}>
                <Text size={0}>LG</Text>
                <TextInput
                  type="number"
                  min="1"
                  max="12"
                  value={selectedCol.lgSize?.toString() || ''}
                  onChange={(event) => updateColumn(rowId!, selectedColumn, {
                    lgSize: parseInt(event.currentTarget.value) || undefined
                  })}
                />
              </Stack>
            </Grid>
          </Stack>

          <Stack space={2}>
            <Text size={1} weight="medium">Text Alignment</Text>
            <Select
              value={selectedCol.textAlign || 'left'}
              onChange={(event) => updateColumn(rowId!, selectedColumn, {
                textAlign: event.currentTarget.value as any
              })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </Select>
          </Stack>

          <Stack space={2}>
            <Text size={1} weight="medium">Background Color</Text>
            <TextInput
              type="color"
              value={selectedCol.backgroundColor || '#ffffff'}
              onChange={(event) => updateColumn(rowId!, selectedColumn, {
                backgroundColor: event.currentTarget.value
              })}
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight="medium">Component Placeholder</Text>
            <TextInput
              value={selectedCol.componentPlaceholder || ''}
              onChange={(event) => updateColumn(rowId!, selectedColumn, {
                componentPlaceholder: event.currentTarget.value
              })}
              placeholder="Enter component description"
            />
          </Stack>

          <Stack space={2}>
            <Text size={1} weight="medium">CSS Classes</Text>
            <TextInput
              value={selectedCol.cssClasses || ''}
              onChange={(event) => updateColumn(rowId!, selectedColumn, {
                cssClasses: event.currentTarget.value
              })}
              placeholder="Enter custom CSS classes"
            />
          </Stack>
        </Stack>
      </Card>
    )
  }

  const renderLayoutView = () => (
    <Stack space={4}>
      <Flex justify="space-between" align="center">
        <Text weight="bold" size={2}>Bootstrap Layout Designer</Text>
        <Button 
          icon={AddIcon} 
          text="Add Row" 
          tone="primary"
          onClick={addRow}
        />
      </Flex>

      <div style={{
        border: showGrid ? '1px dashed #ccc' : 'none',
        padding: '8px',
        background: showGrid ? 'repeating-linear-gradient(0deg, transparent, transparent 10px, #f8f9fa 10px, #f8f9fa 11px)' : 'transparent',
        overflow: 'visible'
      }}>
        {layoutData.rows.map((row, rowIndex) => (
          <Card key={`${row.id}-${row.columns.map(c => `${c.id}:${c.size}:${c.components?.length || 0}`).join('-')}`} padding={2} border tone="transparent" style={{ marginBottom: '8px' }}>
            <Stack space={3}>
              <Flex justify="space-between" align="center">
                <Text weight="medium" size={1}>Row {rowIndex + 1}</Text>
                <Flex gap={1}>
                  <Button 
                    icon={AddIcon} 
                    text="Column" 
                    mode="ghost"
                    size={1}
                    onClick={() => addColumn(row.id)}
                  />
                  <Button 
                    icon={ComponentIcon} 
                    mode="ghost"
                    size={1}
                    onClick={() => duplicateRow(row.id)}
                    title="Duplicate Row"
                  />
                  <Button 
                    icon={TrashIcon} 
                    mode="ghost" 
                    tone="critical"
                    size={1}
                    onClick={() => removeRow(row.id)}
                  />
                </Flex>
              </Flex>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: row.columns.map(col => `${(col.size / 12) * 100}%`).join(' '),
                gap: '4px',
                minHeight: '80px'
              }}>
                {row.columns.map((column) => (
                  <Card 
                    key={`${column.id}-${column.size}-${column.components?.length || 0}-${column.components?.map(c => c.id).join(',') || ''}`}
                    padding={2} 
                    border
                    tone={selectedColumn === column.id ? 'primary' : 'caution'}
                    style={{ 
                      position: 'relative',
                      minHeight: '80px',
                      cursor: 'pointer',
                      backgroundColor: column.backgroundColor || '#f8f9fa',
                      textAlign: column.textAlign || 'left'
                    }}
                    onClick={() => setSelectedColumn(column.id)}
                  >
                    <Stack space={2} style={{ height: '100%' }}>
                      <Flex justify="space-between" align="center">
                        <Text size={0} weight="medium">
                          {(column.components && column.components.length > 0)
                            ? `${column.components.length} Component${column.components.length > 1 ? 's' : ''}`
                            : 'Empty Column'
                          }
                        </Text>
                        {row.columns.length > 1 && (
                          <Button 
                            icon={TrashIcon} 
                            mode="ghost" 
                            tone="critical"
                            size={0}
                            onClick={(e) => {
                              e.stopPropagation()
                              removeColumn(row.id, column.id)
                            }}
                          />
                        )}
                      </Flex>
                      
                      <Flex align="center" gap={1} style={{ marginBottom: '4px' }}>
                        <Text size={0} style={{ color: '#666', minWidth: '30px' }}>
                          col-{column.size}
                        </Text>
                        <Flex align="center" gap={0} style={{ 
                          border: '1px solid #ddd', 
                          borderRadius: '3px', 
                          backgroundColor: '#fff' 
                        }}>
                          <button
                            style={{
                              border: 'none',
                              background: 'transparent',
                              padding: '2px 4px',
                              fontSize: '10px',
                              cursor: 'pointer',
                              color: '#666'
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              updateColumnSpan(row.id, column.id, Math.max(1, column.size - 1))
                            }}
                            disabled={column.size <= 1}
                          >
                            −
                          </button>
                          <div style={{
                            padding: '2px 6px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: '#333',
                            minWidth: '16px',
                            textAlign: 'center',
                            borderLeft: '1px solid #ddd',
                            borderRight: '1px solid #ddd'
                          }}>
                            {column.size}
                          </div>
                          <button
                            style={{
                              border: 'none',
                              background: 'transparent',
                              padding: '2px 4px',
                              fontSize: '10px',
                              cursor: 'pointer',
                              color: '#666'
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              updateColumnSpan(row.id, column.id, Math.min(12, column.size + 1))
                            }}
                            disabled={column.size >= 12}
                          >
                            +
                          </button>
                        </Flex>
                      </Flex>
                      
                      {(column.smSize || column.mdSize || column.lgSize) && (
                        <Text size={0} style={{ color: '#999', fontSize: '9px' }}>
                          {column.smSize && `sm-${column.smSize} `}
                          {column.mdSize && `md-${column.mdSize} `}
                          {column.lgSize && `lg-${column.lgSize}`}
                        </Text>
                      )}
                      
                      <DroppableColumn
                        columnId={`column-${row.id}-${column.id}`}
                        components={column.components || []}
                        onAddComponent={() => openComponentModal(row.id, column.id)}
                        onRemoveComponent={(componentId) => removeComponentFromColumn(row.id, column.id, componentId)}
                        onComponentClick={handleComponentClick}
                      />
                    </Stack>
                  </Card>
                ))}
              </div>

              <Text size={0} style={{ color: '#666' }}>
                Total: {row.columns.reduce((sum, col) => sum + col.size, 0)}/12 columns
              </Text>
            </Stack>
          </Card>
        ))}
      </div>

      {layoutData.rows.length === 0 && (
        <Card padding={4} tone="transparent" style={{ textAlign: 'center' }}>
          <Text size={1} style={{ color: '#666' }}>
            No rows yet. Click "Add Row" to start building your layout.
          </Text>
        </Card>
      )}
    </Stack>
  )

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('onDragEnd called with event:', event)
    const { active, over } = event

    if (!over) {
      console.log('No destination - drag cancelled')
      return
    }

    if (active.id === over.id) {
      console.log('Same position - no change needed')
      return
    }

    // Parse the IDs to get component and container info
    const activeId = String(active.id)
    const overId = String(over.id)
    
    // Find which column contains the active component
    let sourceRowId = '', sourceColumnId = '', sourceIndex = -1
    let movedComponent: Component | null = null
    
    for (const row of layoutData.rows) {
      for (const column of row.columns) {
        const componentIndex = column.components.findIndex(comp => comp.id === activeId)
        if (componentIndex !== -1) {
          sourceRowId = row.id
          sourceColumnId = column.id
          sourceIndex = componentIndex
          movedComponent = column.components[componentIndex]
          break
        }
      }
      if (movedComponent) break
    }

    if (!movedComponent) return

    // Determine destination
    let destRowId = '', destColumnId = '', destIndex = 0
    
    // If dropped over a component, find its position
    for (const row of layoutData.rows) {
      for (const column of row.columns) {
        const componentIndex = column.components.findIndex(comp => comp.id === overId)
        if (componentIndex !== -1) {
          destRowId = row.id
          destColumnId = column.id
          destIndex = componentIndex
          break
        }
      }
      if (destRowId) break
    }

    // If not dropped over a component, check if dropped over a column
    if (!destRowId) {
      for (const row of layoutData.rows) {
        const column = row.columns.find(col => `column-${row.id}-${col.id}` === overId)
        if (column) {
          destRowId = row.id
          destColumnId = column.id
          destIndex = column.components.length // Add to end
          break
        }
      }
    }

    if (!destRowId) return

    // Create a deep copy of the layout data
    const newLayoutData = JSON.parse(JSON.stringify(layoutData))
    
    // Find source and destination columns
    const sourceRow = newLayoutData.rows.find(row => row.id === sourceRowId)
    const destRow = newLayoutData.rows.find(row => row.id === destRowId)
    
    if (!sourceRow || !destRow) return

    const sourceColumn = sourceRow.columns.find(col => col.id === sourceColumnId)
    const destColumn = destRow.columns.find(col => col.id === destColumnId)
    
    if (!sourceColumn || !destColumn) return

    // Remove component from source
    sourceColumn.components.splice(sourceIndex, 1)
    
    // Add component to destination
    if (sourceColumnId === destColumnId) {
      // Same column, adjust index if moving down
      if (destIndex > sourceIndex) destIndex--
    }
    destColumn.components.splice(destIndex, 0, movedComponent)

    console.log('Drag and drop update:', {
      sourceRowId,
      sourceColumnId,
      destRowId,
      destColumnId,
      movedComponent,
      newLayoutData
    })

    updateLayout(newLayoutData)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <>
        <Card padding={4} border style={{ width: '130%', maxWidth: 'none' }}>
        <TabList space={2}>
          <Tab 
            id="layout" 
            aria-controls="layout-panel"
            selected={activeTab === 'layout'}
            onClick={() => setActiveTab('layout')}
          >
            Layout
          </Tab>
          <Tab 
            id="design" 
            aria-controls="design-panel"
            selected={activeTab === 'design'}
            onClick={() => setActiveTab('design')}
          >
            Design
          </Tab>
          <Tab 
            id="column" 
            aria-controls="column-panel"
            selected={activeTab === 'column'}
            onClick={() => setActiveTab('column')}
          >
            Column Editor
          </Tab>
        </TabList>

        <Box marginTop={3}>
          <TabPanel id="layout-panel" hidden={activeTab !== 'layout'}>
            {renderLayoutView()}
          </TabPanel>
          <TabPanel id="design-panel" hidden={activeTab !== 'design'}>
            {renderDesignPanel()}
          </TabPanel>
          <TabPanel id="column-panel" hidden={activeTab !== 'column'}>
            {renderColumnEditor()}
          </TabPanel>
        </Box>
        </Card>
        
        {renderComponentModal()}
      </>
    </DndContext>
  )
})

BootstrapLayoutEditor.displayName = 'BootstrapLayoutEditor'

export default BootstrapLayoutEditor