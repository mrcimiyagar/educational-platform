
import React, {Component} from 'react'

export default class DivSize extends Component {

  sizeFetcher;

  constructor(props) {
    super(props)

    this.sizeFetcher = props.sizeFetcher;

    this.state = {
      height: 0,
      width: 0
    }
  }

  componentDidMount() {
    const height = this.divElement.clientHeight;
    const width = this.divElement.clientWidth;
    this.setState({ width, height });
    this.sizeFetcher({width, height});
  }

  render() {
    return (
      <div style={{position: 'absolute'}} style={{width: '100%', height: '100%'}} ref={ (divElement) => { this.divElement = divElement } }></div>
    )
  }
}