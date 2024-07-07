import update from 'immutability-helper'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import PivotTable from './PivotTable'
import DraggableAttribute from './utils/DraggableAttribute'
import Dropdown from './utils/DropDown'
import { PivotData, getSort, sortAs } from './utils/Utilities'

class PivotTableUI extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      unusedOrder: [],
      zIndices: {},
      maxZIndex: 1000,
      openDropdown: false,
      attrValues: {},
      materializedInput: [],
      vals: this.props.vals, // valsをstateに追加
    }
  }

  componentDidMount() {
    this.materializeInput(this.props.data)
  }

  componentDidUpdate() {
    this.materializeInput(this.props.data)
  }

  materializeInput(nextData) {
    if (isEqual(this.state.data, nextData)) {
      return
    }
    const newState = {
      data: nextData,
      attrValues: {},
      materializedInput: [],
    }
    let recordsProcessed = 0
    PivotData.forEachRecord(newState.data, this.props.derivedAttributes, (record) => {
      newState.materializedInput.push(record)
      for (const attr of Object.keys(record)) {
        if (!(attr in newState.attrValues)) {
          newState.attrValues[attr] = {}
          if (recordsProcessed > 0) {
            newState.attrValues[attr].null = recordsProcessed
          }
        }
      }
      for (const attr in newState.attrValues) {
        const value = attr in record ? record[attr] : 'null'
        if (!(value in newState.attrValues[attr])) {
          newState.attrValues[attr][value] = 0
        }
        newState.attrValues[attr][value]++
      }
      recordsProcessed++
    })
    this.setState(newState)
  }

  sendPropUpdate(command) {
    this.props.onChange(update(this.props, command))
    this.materializeInput(this.props.data) // 追加
  }

  propUpdater(key) {
    return (value) => this.sendPropUpdate({ [key]: { $set: value } })
  }

  setValuesInFilter(attribute, values) {
    this.sendPropUpdate({
      valueFilter: {
        [attribute]: {
          $set: values.reduce((r, v) => {
            r[v] = true
            return r
          }, {}),
        },
      },
    })
  }

  addValuesToFilter(attribute, values) {
    if (attribute in this.props.valueFilter) {
      this.sendPropUpdate({
        valueFilter: {
          [attribute]: values.reduce((r, v) => {
            r[v] = { $set: true }
            return r
          }, {}),
        },
      })
    } else {
      this.setValuesInFilter(attribute, values)
    }
  }

  removeValuesFromFilter(attribute, values) {
    this.sendPropUpdate({
      valueFilter: { [attribute]: { $unset: values } },
    })
  }

  moveFilterBoxToTop(attribute) {
    this.setState(
      update(this.state, {
        maxZIndex: { $set: this.state.maxZIndex + 1 },
        zIndices: { [attribute]: { $set: this.state.maxZIndex + 1 } },
      }),
    )
  }

  isOpen(dropdown) {
    return this.state.openDropdown === dropdown
  }

  makeDnDCell(items, onChange, classes, stateKey) {
    return (
      <ReactSortable
        list={items}
        setList={(newOrder) => onChange(newOrder, stateKey)}
        tag="td"
        className={classes}
        group="shared"
        ghostClass="pvtPlaceholder"
        filter=".pvtFilterBox"
        preventOnFilter={false}
      >
        {items.map((x) => (
          <DraggableAttribute
            name={x}
            key={x}
            data-id={x}
            attrValues={this.state.attrValues[x]}
            valueFilter={this.props.valueFilter[x] || {}}
            sorter={getSort(this.props.sorters, x)}
            menuLimit={this.props.menuLimit}
            setValuesInFilter={this.setValuesInFilter.bind(this)}
            addValuesToFilter={this.addValuesToFilter.bind(this)}
            moveFilterBoxToTop={this.moveFilterBoxToTop.bind(this)}
            removeValuesFromFilter={this.removeValuesFromFilter.bind(this)}
            zIndex={this.state.zIndices[x] || this.state.maxZIndex}
          />
        ))}
      </ReactSortable>
    )
  }

  render() {
    const aggregatorCellOutlet = this.props.aggregators[this.props.aggregatorName]([])().outlet
    const rendererName =
      this.props.rendererName in this.props.renderers ? this.props.rendererName : Object.keys(this.props.renderers)

    const rendererCell = (
      <td className="pvtRenderers">
        <Dropdown
          current={rendererName}
          values={Object.keys(this.props.renderers)}
          open={this.isOpen('renderer')}
          zIndex={this.isOpen('renderer') ? this.state.maxZIndex + 1 : 1}
          toggle={() =>
            this.setState({
              openDropdown: this.isOpen('renderer') ? false : 'renderer',
            })
          }
          setValue={this.propUpdater('rendererName')}
        />
      </td>
    )

    const sortIcons = {
      key_a_to_z: {
        rowSymbol: '↕',
        colSymbol: '↔',
        next: 'value_a_to_z',
      },
      value_a_to_z: {
        rowSymbol: '↓',
        colSymbol: '→',
        next: 'value_z_to_a',
      },
      value_z_to_a: { rowSymbol: '↑', colSymbol: '←', next: 'key_a_to_z' },
    }

    const aggregatorCell = (
      <td className="pvtVals">
        <Dropdown
          current={this.props.aggregatorName}
          values={Object.keys(this.props.aggregators)}
          open={this.isOpen('aggregators')}
          zIndex={this.isOpen('aggregators') ? this.state.maxZIndex + 1 : 1}
          toggle={() =>
            this.setState({
              openDropdown: this.isOpen('aggregators') ? false : 'aggregators',
            })
          }
          setValue={this.propUpdater('aggregatorName')}
        />
        <a
          role="button"
          className="pvtRowOrder"
          onClick={() => this.propUpdater('rowOrder')(sortIcons[this.props.rowOrder].next)}
        >
          {sortIcons[this.props.rowOrder].rowSymbol}
        </a>
        <a
          role="button"
          className="pvtColOrder"
          onClick={() => this.propUpdater('colOrder')(sortIcons[this.props.colOrder].next)}
        >
          {sortIcons[this.props.colOrder].colSymbol}
        </a>
        {this.state.vals.length > 0 && <br />}
        {this.state.vals.map((val, i) => [
          <Dropdown
            key={i}
            current={val}
            values={Object.keys(this.state.attrValues).filter(
              (e) => !this.props.hiddenAttributes.includes(e) && !this.props.hiddenFromAggregators.includes(e),
            )}
            open={this.isOpen(`val${i}`)}
            zIndex={this.isOpen(`val${i}`) ? this.state.maxZIndex + 1 : 1}
            toggle={() =>
              this.setState({
                openDropdown: this.isOpen(`val${i}`) ? false : `val${i}`,
              })
            }
            setValue={(value) =>
              this.sendPropUpdate({
                vals: { $splice: [[i, 1, value]] },
              })
            }
          />,
          i + 1 !== this.state.vals.length ? <br key={`br${i}`} /> : null,
        ])}
        {aggregatorCellOutlet && aggregatorCellOutlet(this.props.data)}
      </td>
    )

    const unusedAttrs = Object.keys(this.state.attrValues)
      .filter(
        (e) =>
          !this.props.rows.includes(e) &&
          !this.props.cols.includes(e) &&
          !this.props.hiddenAttributes.includes(e) &&
          !this.props.hiddenFromDragDrop.includes(e),
      )
      .sort(sortAs(this.state.unusedOrder))

    const unusedLength = unusedAttrs.reduce((r, e) => r + e.length, 0)
    const horizUnused = unusedLength < this.props.unusedOrientationCutoff

    const unusedAttrsCell = this.makeDnDCell(
      unusedAttrs,
      (order) => this.setState({ unusedOrder: order }),
      `pvtAxisContainer pvtUnused ${horizUnused ? 'pvtHorizList' : 'pvtVertList'}`,
      'unusedOrder',
    )

    const colAttrs = this.props.cols.filter(
      (e) => !this.props.hiddenAttributes.includes(e) && !this.props.hiddenFromDragDrop.includes(e),
    )

    const rowAttrs = this.props.rows.filter(
      (e) => !this.props.hiddenAttributes.includes(e) && !this.props.hiddenFromDragDrop.includes(e),
    )

    const colAttrsCell = this.makeDnDCell(
      colAttrs,
      (newOrder) => this.sendPropUpdate({ cols: { $set: newOrder } }),
      'pvtAxisContainer pvtHorizList pvtCols',
      'cols',
    )

    const rowAttrsCell = this.makeDnDCell(
      rowAttrs,
      (newOrder) => this.sendPropUpdate({ rows: { $set: newOrder } }),
      'pvtAxisContainer pvtVertList pvtRows',
      'rows',
    )

    const outputCell = (
      <td className="pvtOutput">
        <PivotTable
          {...update(this.props, {
            data: { $set: this.state.materializedInput },
          })}
        />
      </td>
    )

    if (horizUnused) {
      return (
        <table className="pvtUi">
          <tbody onClick={() => this.setState({ openDropdown: false })}>
            <tr>
              {rendererCell}
              {unusedAttrsCell}
            </tr>
            <tr>
              {aggregatorCell}
              {colAttrsCell}
            </tr>
            <tr>
              {rowAttrsCell}
              {outputCell}
            </tr>
          </tbody>
        </table>
      )
    }

    return (
      <table className="pvtUi">
        <tbody onClick={() => this.setState({ openDropdown: false })}>
          <tr>
            {rendererCell}
            {aggregatorCell}
            {colAttrsCell}
          </tr>
          <tr>
            {unusedAttrsCell}
            {rowAttrsCell}
            {outputCell}
          </tr>
        </tbody>
      </table>
    )
  }
}

PivotTableUI.propTypes = Object.assign({}, PivotTable.propTypes, {
  onChange: PropTypes.func.isRequired,
  hiddenAttributes: PropTypes.arrayOf(PropTypes.string),
  hiddenFromAggregators: PropTypes.arrayOf(PropTypes.string),
  hiddenFromDragDrop: PropTypes.arrayOf(PropTypes.string),
  unusedOrientationCutoff: PropTypes.number,
  menuLimit: PropTypes.number,
})

PivotTableUI.defaultProps = Object.assign({}, PivotTable.defaultProps, {
  hiddenAttributes: [],
  hiddenFromAggregators: [],
  hiddenFromDragDrop: [],
  unusedOrientationCutoff: 85,
  menuLimit: 500,
})

export default PivotTableUI
