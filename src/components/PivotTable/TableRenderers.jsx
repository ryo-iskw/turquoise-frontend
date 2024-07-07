import PropTypes from 'prop-types'
import React from 'react'
import { PivotData } from './utils/Utilities'

// helper function for setting row/col-span in pivotTableRenderer
const spanSize = (arr, i, j) => {
  let x
  if (i !== 0) {
    let asc
    let end
    let noDraw = true
    for (x = 0, end = j, asc = end >= 0; asc ? x <= end : x >= end; asc ? x++ : x--) {
      if (arr[i - 1][x] !== arr[i][x]) {
        noDraw = false
      }
    }
    if (noDraw) {
      return -1
    }
  }
  let len = 0
  while (i + len < arr.length) {
    let asc1
    let end1
    let stop = false
    for (x = 0, end1 = j, asc1 = end1 >= 0; asc1 ? x <= end1 : x >= end1; asc1 ? x++ : x--) {
      if (arr[i][x] !== arr[i + len][x]) {
        stop = true
      }
    }
    if (stop) {
      break
    }
    len++
  }
  return len
}

function redColorScaleGenerator(values) {
  const min = Math.min.apply(Math, values)
  const max = Math.max.apply(Math, values)
  return (x) => {
    const nonRed = 255 - Math.round((255 * (x - min)) / (max - min))
    return { backgroundColor: `rgb(255,${nonRed},${nonRed})` }
  }
}

function makeRenderer(opts = {}) {
  class TableRenderer extends React.PureComponent {
    render() {
      const pivotData = new PivotData(this.props)
      const colAttrs = pivotData.props.cols
      const rowAttrs = pivotData.props.rows
      const rowKeys = pivotData.getRowKeys()
      const colKeys = pivotData.getColKeys()
      const grandTotalAggregator = pivotData.getAggregator([], [])

      let valueCellColors = () => {}
      let rowTotalColors = () => {}
      let colTotalColors = () => {}
      if (opts.heatmapMode) {
        const colorScaleGenerator = this.props.tableColorScaleGenerator
        const rowTotalValues = colKeys.map((x) => pivotData.getAggregator([], x).value())
        rowTotalColors = colorScaleGenerator(rowTotalValues)
        const colTotalValues = rowKeys.map((x) => pivotData.getAggregator(x, []).value())
        colTotalColors = colorScaleGenerator(colTotalValues)

        if (opts.heatmapMode === 'full') {
          const allValues = []
          for (const r of rowKeys) {
            for (const c of colKeys) {
              allValues.push(pivotData.getAggregator(r, c).value())
            }
          }
          const colorScale = colorScaleGenerator(allValues)
          valueCellColors = (r, c, v) => colorScale(v)
        } else if (opts.heatmapMode === 'row') {
          const rowColorScales = {}
          for (const r of rowKeys) {
            const rowValues = colKeys.map((x) => pivotData.getAggregator(r, x).value())
            rowColorScales[r] = colorScaleGenerator(rowValues)
          }
          valueCellColors = (r, c, v) => rowColorScales[r](v)
        } else if (opts.heatmapMode === 'col') {
          const colColorScales = {}
          for (const c of colKeys) {
            const colValues = rowKeys.map((x) => pivotData.getAggregator(x, c).value())
            colColorScales[c] = colorScaleGenerator(colValues)
          }
          valueCellColors = (r, c, v) => colColorScales[c](v)
        }
      }

      const getClickHandler =
        this.props.tableOptions && this.props.tableOptions.clickCallback
          ? (value, rowValues, colValues) => {
              const filters = {}
              colAttrs.forEach((attr, i) => {
                if (colValues[i] !== null) {
                  filters[attr] = colValues[i]
                }
              })
              rowAttrs.forEach((attr, i) => {
                if (rowValues[i] !== null) {
                  filters[attr] = rowValues[i]
                }
              })
              return (e) => this.props.tableOptions.clickCallback(e, value, filters, pivotData)
            }
          : null

      return (
        <table className="pvtTable">
          <thead>
            {colAttrs.map((c, j) => (
              <tr key={`colAttr${j}`}>
                {j === 0 && rowAttrs.length !== 0 && <th colSpan={rowAttrs.length} rowSpan={colAttrs.length} />}
                <th className="pvtAxisLabel">{c}</th>
                {colKeys.map((colKey, i) => {
                  const x = spanSize(colKeys, i, j)
                  if (x === -1) {
                    return null
                  }
                  return (
                    <th
                      className="pvtColLabel"
                      key={`colKey${i}`}
                      colSpan={x}
                      rowSpan={j === colAttrs.length - 1 && rowAttrs.length !== 0 ? 2 : 1}
                    >
                      {colKey[j]}
                    </th>
                  )
                })}
                {j === 0 && (
                  <th className="pvtTotalLabel" rowSpan={colAttrs.length + (rowAttrs.length === 0 ? 0 : 1)}>
                    Totals
                  </th>
                )}
              </tr>
            ))}
            {rowAttrs.length !== 0 && (
              <tr>
                {rowAttrs.map((r, i) => (
                  <th className="pvtAxisLabel" key={`rowAttr${i}`}>
                    {r}
                  </th>
                ))}
                <th className="pvtTotalLabel">{colAttrs.length === 0 ? 'Totals' : null}</th>
              </tr>
            )}
          </thead>
          <tbody>
            {rowKeys.map((rowKey, i) => {
              const totalAggregator = pivotData.getAggregator(rowKey, [])
              return (
                <tr key={`rowKeyRow${i}`}>
                  {rowKey.map((txt, j) => {
                    const x = spanSize(rowKeys, i, j)
                    if (x === -1) {
                      return null
                    }
                    return (
                      <th
                        key={`rowKeyLabel${i}-${j}`}
                        className="pvtRowLabel"
                        rowSpan={x}
                        colSpan={j === rowAttrs.length - 1 && colAttrs.length !== 0 ? 2 : 1}
                      >
                        {txt}
                      </th>
                    )
                  })}
                  {colKeys.map((colKey, j) => {
                    const aggregator = pivotData.getAggregator(rowKey, colKey)
                    return (
                      <td
                        className="pvtVal"
                        key={`pvtVal${i}-${j}`}
                        onClick={getClickHandler && getClickHandler(aggregator.value(), rowKey, colKey)}
                        style={valueCellColors(rowKey, colKey, aggregator.value())}
                      >
                        {aggregator.format(aggregator.value())}
                      </td>
                    )
                  })}
                  <td
                    className="pvtTotal"
                    onClick={getClickHandler && getClickHandler(totalAggregator.value(), rowKey, [null])}
                    style={colTotalColors(totalAggregator.value())}
                  >
                    {totalAggregator.format(totalAggregator.value())}
                  </td>
                </tr>
              )
            })}
            <tr>
              <th className="pvtTotalLabel" colSpan={rowAttrs.length + (colAttrs.length === 0 ? 0 : 1)}>
                Totals
              </th>
              {colKeys.map((colKey, i) => {
                const totalAggregator = pivotData.getAggregator([], colKey)
                return (
                  <td
                    className="pvtTotal"
                    key={`total${i}`}
                    onClick={getClickHandler && getClickHandler(totalAggregator.value(), [null], colKey)}
                    style={rowTotalColors(totalAggregator.value())}
                  >
                    {totalAggregator.format(totalAggregator.value())}
                  </td>
                )
              })}
              <td
                onClick={getClickHandler && getClickHandler(grandTotalAggregator.value(), [null], [null])}
                className="pvtGrandTotal"
              >
                {grandTotalAggregator.format(grandTotalAggregator.value())}
              </td>
            </tr>
          </tbody>
        </table>
      )
    }
  }

  TableRenderer.defaultProps = PivotData.defaultProps
  TableRenderer.propTypes = PivotData.propTypes
  TableRenderer.defaultProps.tableColorScaleGenerator = redColorScaleGenerator
  TableRenderer.defaultProps.tableOptions = {}
  TableRenderer.propTypes.tableColorScaleGenerator = PropTypes.func
  TableRenderer.propTypes.tableOptions = PropTypes.object
  return TableRenderer
}

class TSVExportRenderer extends React.PureComponent {
  render() {
    const pivotData = new PivotData(this.props)
    const rowKeys = pivotData.getRowKeys()
    const colKeys = pivotData.getColKeys()
    if (rowKeys.length === 0) {
      rowKeys.push([])
    }
    if (colKeys.length === 0) {
      colKeys.push([])
    }

    const headerRow = [...pivotData.props.rows, ...colKeys.map((c) => c.join('-')), 'Totals']
    const tsvRows = [headerRow]

    rowKeys.map((r) => {
      const row = [...r]
      colKeys.map((c) => row.push(pivotData.getAggregator(r, c).value()))
      row.push(pivotData.getAggregator(r, []).value())
      tsvRows.push(row)
    })

    const colTotals = ['Totals']
    colKeys.map((c) => colTotals.push(pivotData.getAggregator([], c).value()))
    colTotals.push(pivotData.getAggregator([], []).value())
    tsvRows.push(colTotals)

    const tsv = tsvRows
      .map((r) =>
        r
          .map((x) => {
            if (typeof x === 'string') {
              return x.replace(/\t/g, ' ').replace(/\n/g, ' ')
            } else {
              return x
            }
          })
          .join('\t'),
      )
      .join('\n')

    return <textarea value={tsv} style={{ width: window.innerWidth / 2, height: window.innerHeight / 2 }} readOnly />
  }
}

TSVExportRenderer.defaultProps = PivotData.defaultProps
TSVExportRenderer.propTypes = PivotData.propTypes

export default {
  Table: makeRenderer(),
  'Table Heatmap': makeRenderer({ heatmapMode: 'full' }),
  'Table Col Heatmap': makeRenderer({ heatmapMode: 'col' }),
  'Table Row Heatmap': makeRenderer({ heatmapMode: 'row' }),
  'TSV Export': TSVExportRenderer,
}
