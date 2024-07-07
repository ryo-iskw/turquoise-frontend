import * as React from 'react'
import Draggable from 'react-draggable'

interface DraggableAttributeProps {
  name: string
  attrValues: { [key: string]: number }
  valueFilter: { [key: string]: boolean }
  sorter: (a: string, b: string) => number
  menuLimit: number
  zIndex: number
  addValuesToFilter: (attribute: string, values: string[]) => void
  removeValuesFromFilter: (attribute: string, values: string[]) => void
  moveFilterBoxToTop: (attribute: string) => void
  setValuesInFilter: (attribute: string, values: string[]) => void
}

interface DraggableAttributeState {
  open: boolean
  filterText: string
}

class DraggableAttribute extends React.Component<DraggableAttributeProps, DraggableAttributeState> {
  constructor(props: DraggableAttributeProps) {
    super(props)
    this.state = { open: false, filterText: '' }
  }

  toggleValue(value: string) {
    if (value in this.props.valueFilter) {
      this.props.removeValuesFromFilter(this.props.name, [value])
    } else {
      this.props.addValuesToFilter(this.props.name, [value])
    }
  }

  matchesFilter(x: string) {
    return x.toLowerCase().trim().includes(this.state.filterText.toLowerCase().trim())
  }

  selectOnly(e: React.MouseEvent, value: string) {
    e.stopPropagation()
    this.props.setValuesInFilter(
      this.props.name,
      Object.keys(this.props.attrValues).filter((y) => y !== value),
    )
  }

  getFilterBox() {
    const showMenu = Object.keys(this.props.attrValues).length < this.props.menuLimit

    const values = Object.keys(this.props.attrValues)
    const shown = values.filter(this.matchesFilter.bind(this)).sort(this.props.sorter)

    return (
      <Draggable handle=".pvtDragHandle">
        <div
          className="pvtFilterBox"
          style={{
            display: 'block',
            cursor: 'initial',
            zIndex: this.props.zIndex,
          }}
          onClick={() => this.props.moveFilterBoxToTop(this.props.name)}
        >
          <a onClick={() => this.setState({ open: false })} className="pvtCloseX">
            ×
          </a>
          <span className="pvtDragHandle">☰</span>
          <h4>{this.props.name}</h4>

          {showMenu || <p>(too many values to show)</p>}

          {showMenu && (
            <p>
              <input
                type="text"
                placeholder="Filter values"
                className="pvtSearch"
                value={this.state.filterText}
                onChange={(e) =>
                  this.setState({
                    filterText: e.target.value,
                  })
                }
              />
              <br />
              <a
                role="button"
                className="pvtButton"
                onClick={() =>
                  this.props.removeValuesFromFilter(
                    this.props.name,
                    Object.keys(this.props.attrValues).filter(this.matchesFilter.bind(this)),
                  )
                }
              >
                Select {values.length === shown.length ? 'All' : shown.length}
              </a>{' '}
              <a
                role="button"
                className="pvtButton"
                onClick={() =>
                  this.props.addValuesToFilter(
                    this.props.name,
                    Object.keys(this.props.attrValues).filter(this.matchesFilter.bind(this)),
                  )
                }
              >
                Deselect {values.length === shown.length ? 'All' : shown.length}
              </a>
            </p>
          )}

          {showMenu && (
            <div className="pvtCheckContainer">
              {shown.map((x) => (
                <p
                  key={x}
                  onClick={() => this.toggleValue(x)}
                  className={x in this.props.valueFilter ? '' : 'selected'}
                >
                  <a className="pvtOnly" onClick={(e) => this.selectOnly(e, x)}>
                    only
                  </a>
                  <a className="pvtOnlySpacer">&nbsp;</a>

                  {x === '' ? <em>null</em> : x}
                </p>
              ))}
            </div>
          )}
        </div>
      </Draggable>
    )
  }

  toggleFilterBox() {
    this.setState({ open: !this.state.open })
    this.props.moveFilterBoxToTop(this.props.name)
  }

  render() {
    const filtered = Object.keys(this.props.valueFilter).length !== 0 ? 'pvtFilteredAttribute' : ''
    return (
      <li data-id={this.props.name}>
        <span className={'pvtAttr ' + filtered}>
          {this.props.name}
          <span className="pvtTriangle" onClick={this.toggleFilterBox.bind(this)}>
            {' '}
            ▾
          </span>
        </span>

        {this.state.open ? this.getFilterBox() : null}
      </li>
    )
  }
}

export default DraggableAttribute
