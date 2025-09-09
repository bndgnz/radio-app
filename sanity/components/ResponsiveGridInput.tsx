import React from 'react'
import { Stack, Card, Text, TextInput } from '@sanity/ui'
import { set, unset } from 'sanity'

const ResponsiveGridInput = React.forwardRef((props: any, ref) => {
  const { elementProps, onChange, value = {} } = props
  const { mobile = 12, tablet = 6, desktop = 4 } = value

  const handleChange = (field: string, fieldValue: string) => {
    const numValue = parseInt(fieldValue) || 1
    const clampedValue = Math.max(1, Math.min(12, numValue))
    
    onChange(
      fieldValue 
        ? set({ ...value, [field]: clampedValue })
        : unset([field])
    )
  }

  return (
    <Card padding={3} border style={{ marginBottom: '1rem' }}>
      <Text weight="medium" size={1} style={{ marginBottom: '0.5rem' }}>
        Grid Settings
      </Text>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '1rem',
        alignItems: 'end'
      }}>
        <Stack space={2}>
          <Text size={1} weight="medium">Mobile</Text>
          <TextInput
            {...elementProps}
            ref={ref}
            type="number"
            min={1}
            max={12}
            value={mobile.toString()}
            onChange={(event) => handleChange('mobile', event.currentTarget.value)}
            placeholder="12"
          />
        </Stack>
        <Stack space={2}>
          <Text size={1} weight="medium">Tablet</Text>
          <TextInput
            type="number"
            min={1}
            max={12}
            value={tablet.toString()}
            onChange={(event) => handleChange('tablet', event.currentTarget.value)}
            placeholder="6"
          />
        </Stack>
        <Stack space={2}>
          <Text size={1} weight="medium">Desktop</Text>
          <TextInput
            type="number"
            min={1}
            max={12}
            value={desktop.toString()}
            onChange={(event) => handleChange('desktop', event.currentTarget.value)}
            placeholder="4"
          />
        </Stack>
      </div>
    </Card>
  )
})

ResponsiveGridInput.displayName = 'ResponsiveGridInput'

export default ResponsiveGridInput