import PropTypes from 'prop-types'
import React from 'react'
import TableRenderers from './TableRenderers'
import { PivotData } from './utils/Utilities'

/* eslint-disable react/prop-types */
// eslint can't see inherited propTypes!

class PivotTable extends React.PureComponent {
  render() {
    const Renderer =
      this.props.renderers[
        this.props.rendererName in this.props.renderers ? this.props.rendererName : Object.keys(this.props.renderers)[0]
      ]
    console.log('Renderer:', Renderer) // デバッグ用
    return <Renderer {...this.props} />
  }
}

PivotTable.propTypes = Object.assign({}, PivotData.propTypes, {
  rendererName: PropTypes.string,
  renderers: PropTypes.objectOf(PropTypes.func),
})

PivotTable.defaultProps = Object.assign({}, PivotData.defaultProps, {
  rendererName: 'Table',
  renderers: TableRenderers,
})

export default PivotTable
