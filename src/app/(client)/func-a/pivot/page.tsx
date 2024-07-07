'use client'
import { PivotTableUI } from '@/components/PivotTable'
import { useCallback, useEffect, useState } from 'react'

interface DataStructure {
  items: string
  month: string
  channel: '直販' | '通販'
  categories: 'TOPS' | 'OP'
  sales: number
}

type DataStructureArray = DataStructure[]

const fetchLocalJson = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export default function Page() {
  const [data, setData] = useState<DataStructureArray>([])
  const [pivotState, setPivotState] = useState({
    rows: ['channel', 'items'],
    cols: ['month', 'categories'],
    vals: ['sales'],
    aggregatorName: 'Sum',
    rendererName: 'Table',
  })

  const fetchData = useCallback(async () => {
    let sales: DataStructureArray = await fetchLocalJson('/json/sales.json') // 仮データを読み込む
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/sales.json`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      sales = await response.json()
    } catch (error) {
      console.error('There was an error!', error)
    }
    setData(sales)
  }, [])

  const handleChange = (newState: any) => {
    setPivotState((prevState) => ({ ...prevState, ...newState }))
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    console.log('data updated', data)
  }, [data])

  return (
    <main className="flex flex-col self-stretch p-4">
      <div className="flex w-full">
        {data.length > 0 && <PivotTableUI data={data} onChange={handleChange} {...pivotState} />}
      </div>
    </main>
  )
}

// Properties and layered architecture
// <PivotTableUI {...props} />
// <PivotTable {...props} />
// <Renderer {...props} />
// PivotData(props)
// The interactive component provided by react-pivottable is PivotTableUI, but output rendering is delegated to the non-interactive PivotTable component, which accepts a subset of its properties. PivotTable can be invoked directly and is useful for outputting non-interactive saved snapshots of PivotTableUI configurations. PivotTable in turn delegates to a specific renderer component, such as the default TableRenderer, which accepts a subset of the same properties. Finally, most renderers will create non-React PivotData object to handle the actual computations, which also accepts a subset of the same props as the rest of the stack.

// Here is a table of the properties accepted by this stack, including an indication of which layer consumes each, from the bottom up:

// Layer	Key & Type	Default Value	Description
// PivotData	data
// see below for formats	(none, required)	data to be summarized
// PivotData	rows
// array of strings	[]	attribute names to prepopulate in row area
// PivotData	cols
// array of strings	[]	attribute names to prepopulate in cols area
// PivotData	vals
// array of strings	[]	attribute names used as arguments to aggregator (gets passed to aggregator generating function)
// PivotData	aggregators
// object of functions	aggregators from Utilites	dictionary of generators for aggregation functions in dropdown (see original PivotTable.js documentation)
// PivotData	aggregatorName
// string	first key in aggregators	key to aggregators object specifying the aggregator to use for computations
// PivotData	valueFilter
// object of arrays of strings	{}	object whose keys are attribute names and values are objects of attribute value-boolean pairs which denote records to include or exclude from computation and rendering; used to prepopulate the filter menus that appear on double-click
// PivotData	sorters
// object or function	{}	accessed or called with an attribute name and can return a function which can be used as an argument to array.sort for output purposes. If no function is returned, the default sorting mechanism is a built-in "natural sort" implementation. Useful for sorting attributes like month names, see original PivotTable.js example 1 and original PivotTable.js example 2.
// PivotData	rowOrder
// string	"key_a_to_z"	the order in which row data is provided to the renderer, must be one of "key_a_to_z", "value_a_to_z", "value_z_to_a", ordering by value orders by row total
// PivotData	colOrder
// string	"key_a_to_z"	the order in which column data is provided to the renderer, must be one of "key_a_to_z", "value_a_to_z", "value_z_to_a", ordering by value orders by column total
// PivotData	derivedAttributes
// object of functions	{}	defines derived attributes (see original PivotTable.js documentation)
// Renderer	<any>	(none, optional)	Renderers may accept any additional properties
// PivotTable	renderers
// object of functions	TableRenderers	dictionary of renderer components
// PivotTable	rendererName
// string	first key in renderers	key to renderers object specifying the renderer to use
// PivotTableUI	onChange
// function	(none, required)	function called every time anything changes in the UI, with the new value of the properties needed to render the new state. This function must be hooked into a state-management system in order for the "dumb" PivotTableUI component to work.
// PivotTableUI	hiddenAttributes
// array of strings	[]	contains attribute names to omit from the UI
// PivotTableUI	hiddenFromAggregators
// array of strings	[]	contains attribute names to omit from the aggregator arguments dropdowns
// PivotTableUI	hiddenFromDragDrop
// array of strings	[]	contains attribute names to omit from the drag'n'drop portion of the UI
// PivotTableUI	menuLimit
// integer	500	maximum number of values to list in the double-click menu
// PivotTableUI	unusedOrientationCutoff
// integer	85	If the attributes' names' combined length in characters exceeds this value then the unused attributes area will be shown vertically to the left of the UI instead of horizontally above it. 0 therefore means 'always vertical', and Infinity means 'always horizontal'.
