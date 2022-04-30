import { Card, Grow, Paper, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import './index.css';

export let handleGuiUpdate = undefined

export default function BotContainer(props) {

    let idDict = {}

    let renderGui = el => {
      if (el === undefined) return <div/>
      let style = {
          width: el.width,
          height: el.height,
          position: el.position,
          left: el.left,
          top: el.top,
          right: el.right,
          bottom: el.bottom,
          ...(el.background && {background: el.background}),
          ...(el.backColor && {backgroundColor: el.backColor}),
          ...(el.backImage && {backgroundImage: el.backImage}),
          ...(el.backImageSize && {backgroundSize: el.backImageSize}),
          ...(el.backRepeat && {backgroundRepeat: el.backRepeat}),
          borderRadius: el.borderRadius,
          border: el.border,
          textAlign: el.alignChildren,
          alignItems: el.alignChildren,
          justifyContent: el.alignChildren,
          transform: el.transform,
          transformOrigin: el.transformOrigin,
          transitionDuration: el.transitionDuration,
          transition: el.transition,
          zIndex: el.zIndex,
          display: el.display,
          flexWrap: el.flexWrap,
          fontSize: el.fontSize,
          color: el.color,
          paddingLeft: el.paddingLeft,
          paddingTop: el.paddingTop,
          paddingRight: el.paddingRight,
          paddingBottom: el.paddingBottom,
          padding: el.padding,
          marginLeft: el.marginLeft,
          marginTop: el.marginTop,
          marginRight: el.marginRight,
          marginBottom: el.marginBottom,
          margin: el.margin,
          backdropFilter: el.backdropFilter,
          opacity: el.opacity,
          overflow: el.overflow,
          objectFit: el.objectFit
        }
        let result = <div/>
        el.realId = props.realIdPrefix + el.id;
        if (el.type === 'Box') {
          result = (
            <div id={el.realId} style={style} onClick={() => {props.onElClick(el.id);}}>
              {el.children && el.children.map(child => (
                renderGui(child)
              ))}
            </div>
          )
        }
        else if (el.type === 'Card') {
          result = (
            <Card id={el.realId} style={style} onClick={() => {props.onElClick(el.id);}}>
              {el.children && el.children.map(child => (
                renderGui(child)
              ))}
            </Card>
          )
        }
        else if (el.type === 'Text') {
          result = (
            <Typography id={el.realId} style={style} onClick={() => {props.onElClick(el.id);}}>
              {el.text}
            </Typography>
          )
        }
        else if (el.type === 'Image') {
          result = (
            <img alt={''} id={el.realId} style={style} src={el.src} onClick={() => {props.onElClick(el.id);}}/>
          )
        }

        if (el.id !== undefined) {
          idDict[el.id] = {obj: el, view: result}
        }

        return result
    }

    let fullGui = renderGui(props.gui)

    props.onIdDictPrepared(idDict)

    return (
      <Grow in={props.gui !== undefined} {...{ timeout: (props.step + 1) * 650 }}>
        <div id={"widget-pane-" + props.widgetWorkerId + (props.isPreview ? '-preview' : '')}
          style={{width: props.widgetWidth, height: props.widgetHeight, position: 'absolute', left: props.widgetX, top: props.widgetY}}>
          <div style={{width: '100%', height: '100%', position: 'relative', direction: 'ltr'}}>
            {
              [fullGui]
            }
          </div>
        </div>
      </Grow>
    );
}
