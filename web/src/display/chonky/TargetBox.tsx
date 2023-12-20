// import { useDrop, DndProvider} from 'react-dnd'
// import { NativeTypes } from 'react-dnd-html5-backend'
import React, {useCallback, useMemo, useState} from "react";

function useDndProvider() {
  const [dndArea, setDndArea] = useState();
  const handleRef = useCallback((node) => setDndArea(node), []);
  const html5Options = useMemo(
    () => ({rootElement: dndArea}),
    [dndArea]
  );
  return {dndArea, handleRef, html5Options};
}

const TargetBoxContent = (props) => {
  const {onDrop, ReactDnd, ReactDndHtml5Backend} = props
  const {DndProvider, useDrop} = ReactDnd;
  const {HTML5Backend, NativeTypes} = ReactDndHtml5Backend;
  const [{canDrop, isOver}, drop] = useDrop(() => ({
      accept: [NativeTypes.FILE],
      drop(item) {
        if (onDrop) {
          onDrop(item)
        }
      },
      canDrop(item) {
        // console.log('canDrop', item.files, item.items)
        return true
      },
      hover(item) {
        // console.log('hover', item.files, item.items)
      },
      collect: (monitor) => {
        const item = monitor.getItem()
        if (item) {
          // console.log('collect', item.files, item.items)
        }
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }
      },
    }),
    [props],
  )
  const isActive = canDrop && isOver
  return <div style={{width: "100%", height: "100%"}} ref={e => drop(e)}>
    {props.children}
  </div>;
}

const TargetBox = (props) => {
  const {onDrop, ReactDnd, ReactDndHtml5Backend} = props
  const {DndProvider, useDrop} = ReactDnd;
  const {HTML5Backend, NativeTypes} = ReactDndHtml5Backend;

  const {dndArea, handleRef, html5Options} = useDndProvider();
  return <div style={{width: "100%", height: "100%"}} ref={e => handleRef(e)}>
    {dndArea && (
      <DndProvider backend={HTML5Backend} options={html5Options}>
        <TargetBoxContent {...props}/>
      </DndProvider>)}
  </div>
}


export default TargetBox;
