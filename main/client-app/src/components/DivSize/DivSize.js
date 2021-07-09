import React, {Component} from 'react'

export default function DivSize(props) {
  var img = new Image();
  img.src = props.url;
  img.onload = function() { alert(this.width + ' ' + this.height); props.sizeFetcher(this.width, this.height); }
  return <div/>;
}