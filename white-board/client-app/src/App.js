import React, { useEffect, useState, useRef } from "react";
import Excalidraw, {
  exportToCanvas,
  exportToSvg,
  exportToBlob
} from "@excalidraw/excalidraw";
import InitialData from "./initialData";

import "./styles.scss";
import initialData from "./initialData";

import {socket, setup} from './socket';

var mouseDown = 0;
let elems = {}
let uploadCounter = 0

export default function App() {

  const excalidrawRef = useRef(null);

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [canvasUrl, setCanvasUrl] = useState(null);
  const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
  const [shouldAddWatermark, setShouldAddWatermark] = useState(false);
  const [theme, setTheme] = useState("light");

  const updateScene = (data, state) => {
    const sceneData = {
      elements: data,
      appState: state
    };
    excalidrawRef.current.updateScene(sceneData);
  };

  useEffect(() => {
    document.body.onmousedown = function() {
      ++mouseDown;
    }
    document.body.onmouseup = function() {
      --mouseDown;
    }
    setup();
    socket.on('init-board', ({data, state}) => {
      data.forEach(d => {
        elems[d.id] = d
      })
      updateScene(data, state)
    })
    socket.on('update-board', ({added, updated, state}) => {
      let newDataArr = []
      for (let id in elems) {
        newDataArr.push(elems[id])
      }
      added.forEach(el => {
        newDataArr.push(el)
      })
      updated.forEach(el => {
        for (let i = 0; i < newDataArr.length; i++) {
          if (el.id === newDataArr[i].id) {
            newDataArr[i] = el
          }
        }
      });
      elems = newDataArr
      updateScene(newDataArr, state)
    })
    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get("addLibrary");
      if (libraryUrl) {
        excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
      }
    };
    window.addEventListener("hashchange", onHashChange, false);
    socket.emit('user-entered');
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  let buttonsWrapper = (
  <div className="button-wrapper">
  <button className="update-scene" onClick={updateScene}>
    Update Scene
  </button>
  <button
    className="reset-scene"
    onClick={() => {
      excalidrawRef.current.resetScene();
    }}
  >
    Reset Scene
  </button>
  <label>
    <input
      type="checkbox"
      checked={viewModeEnabled}
      onChange={() => setViewModeEnabled(!viewModeEnabled)}
    />
    View mode
  </label>
  <label>
    <input
      type="checkbox"
      checked={zenModeEnabled}
      onChange={() => setZenModeEnabled(!zenModeEnabled)}
    />
    Zen mode
  </label>
  <label>
    <input
      type="checkbox"
      checked={gridModeEnabled}
      onChange={() => setGridModeEnabled(!gridModeEnabled)}
    />
    Grid mode
  </label>
  <label>
    <input
      type="checkbox"
      checked={theme === "dark"}
      onChange={() => {
        let newTheme = "light";
        if (theme === "light") {
          newTheme = "dark";
        }
        setTheme(newTheme);
      }}
    />
    Switch to Dark Theme
  </label>
</div>);

let excalidrawExport = (
  <div className="export-wrapper button-wrapper">
          <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={exportWithDarkMode}
              onChange={() => setExportWithDarkMode(!exportWithDarkMode)}
            />
            Export with dark mode
          </label>
          <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={shouldAddWatermark}
              onChange={() => setShouldAddWatermark(!shouldAddWatermark)}
            />
            Add Watermark
          </label>
          <button
            onClick={() => {
              const svg = exportToSvg({
                elements: excalidrawRef.current.getSceneElements(),
                appState: {
                  ...initialData.appState,
                  exportWithDarkMode,
                  shouldAddWatermark
                }
              });
              document.querySelector(".export-svg").innerHTML = svg.outerHTML;
            }}
          >
            Export to SVG
          </button>
          <div className="export export-svg"></div>

          <button
            onClick={async () => {
              const blob = await exportToBlob({
                elements: excalidrawRef.current.getSceneElements(),
                mimeType: "image/png",
                appState: {
                  ...initialData.appState,
                  exportWithDarkMode,
                  shouldAddWatermark
                }
              });
              setBlobUrl(window.URL.createObjectURL(blob));
            }}
          >
            Export to Blob
          </button>
          <div className="export export-blob">
            <img src={blobUrl} alt="" />
          </div>

          <button
            onClick={() => {
              const canvas = exportToCanvas({
                elements: excalidrawRef.current.getSceneElements(),
                appState: {
                  ...initialData.appState,
                  exportWithDarkMode,
                  shouldAddWatermark
                }
              });
              setCanvasUrl(canvas.toDataURL());
            }}
          >
            Export to Canvas
          </button>
          <div className="export export-canvas">
            <img src={canvasUrl} alt="" />
          </div>
        </div>
        );

  return (
      <div style={{width: window.innerWidth - 24 + 'px', height: '100vh'}}>
    <Excalidraw
      ref={excalidrawRef}
      initialData={InitialData}
      onChange={(elements, state) => {
        if (uploadCounter >= 10) {
        let added = []
        let updated = []
        elements.forEach(el => {
          if (el.id in elems) {
            console.log(el.version, ' ', elems[el.id].customVersion)
            if (el.version > elems[el.id].customVersion) {
              updated.push(el)
              el.customVersion = el.version
              elems[el.id] = el
            }
          }
          else {
            added.push(el)
            el.customVersion = el.version
            elems[el.id] = el
          }
        });
        console.log("Added : ", added, ", Updated : ", updated)
        socket.emit('update-board', {added, updated, state})
        uploadCounter = 0  
      }
      else {
        uploadCounter++
      }
      }}
      onPointerUpdate={(payload) => {}}
      onCollabButtonClick={() => {
        
      }}
      viewModeEnabled={viewModeEnabled}
      zenModeEnabled={zenModeEnabled}
      gridModeEnabled={gridModeEnabled}
      theme={theme}
      name="Custom name of drawing"
      UIOptions={{ canvasActions: { loadScene: false } }}
    />
  </div>
  );
}
