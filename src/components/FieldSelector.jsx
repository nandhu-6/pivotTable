// import React from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";

// // Constants
// const ItemTypes = {
//   FIELD: "FIELD",
// };

// // Draggable field component
// function DraggableField({ name }) {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: ItemTypes.FIELD,
//     item: { name },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       className={`p-1 px-2 border rounded bg-white shadow text-sm cursor-move mb-1 ${
//         isDragging ? "opacity-50" : ""
//       }`}
//     >
//       {name}
//     </div>
//   );
// }

// // Drop zone component
// function DropZone({ label, items, setItems, accept, children }) {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept,
//     drop: (item) => {
//       if (!items.includes(item.name)) {
//         setItems([...items, item.name]);
//       }
//     },
//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//   }));

//   const removeItem = (name) => {
//     setItems(items.filter((i) => i !== name));
//   };

//   return (
//     <div className="mb-4">
//       <h3 className="font-bold text-[#424242] mb-1">{label}</h3>
//       <div
//         ref={drop}
//         className={`min-h-[60px] p-2 border-2 rounded ${
//           isOver ? "border-blue-500" : "border-gray-300"
//         } bg-gray-50`}
//       >
//         {items.map((item, idx) => (
//           <div
//             key={idx}
//             className="p-1 px-2 border rounded bg-white shadow text-sm flex justify-between items-center mb-1"
//           >
//             {item}
//             {children ? children(item) : null}
//             <button
//               onClick={() => removeItem(item)}
//               className="text-red-500 ml-2 text-xs"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//         {items.length === 0 && (
//           <p className="text-sm text-gray-400">Drop fields here</p>
//         )}
//       </div>
//     </div>
//   );
// }

// // Main component
// export default function FieldSelector({
//   fields,
//   rows,
//   setRows,
//   columns,
//   setColumns,
//   values,
//   setValues,
//   aggregations,
//   setAggregations,
//   numericalFields,
// }) {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="flex flex-col col-1 gap-6 w-full">
//         {/* Left panel: All Fields */}
//         <div className="w-fit">
//           <h2 className="font-bold mb-2 text-[#424242]">All Fields</h2>
//           <div className="border p-2 rounded bg-gray-50 min-h-[100px]">
//             {fields.map((f, idx) => (
//               <DraggableField key={idx} name={f} />
//             ))}
//           </div>
//         </div>

//         {/*panel: Drop Zones */}
//         <div className="w-fit  grid md:grid-cols-3 gap-6">
//           <DropZone label="Rows" items={rows} setItems={setRows} accept="FIELD" />
//           <DropZone label="Columns" items={columns} setItems={setColumns} accept="FIELD" />
//           <DropZone
//             label="Values"
//             items={values}
//             setItems={setValues}
//             accept="FIELD"
//             children={(val) =>
//               numericalFields.includes(val) && (
//                 <select
//                   className="ml-2 text-[12px] p-1 border rounded text-[#424242]"
//                   value={aggregations[val] || "sum"}
//                   onChange={(e) =>
//                     setAggregations((prev) => ({
//                       ...prev,
//                       [val]: e.target.value,
//                     }))
//                   }
//                 >
//                   <option value="sum">Sum</option>
//                   <option value="avg">Average</option>
//                   <option value="count">Count</option>
//                   <option value="min">Min</option>
//                   <option value="max">Max</option>
//                 </select>
//               )
//             }
//           />
//         </div>
//       </div>
//     </DndProvider>
//   );
// }

import React from "react";
import Select from "react-select";

export default function FieldSelector({
  fields,
  rows,
  setRows,
  columns,
  setColumns,
  values,
  setValues,
  aggregations,
  setAggregations,
  numericalFields,
}) {
  const fieldOptions = fields.map(f => ({ label: f, value: f }));
  const numericalOptions = numericalFields.map(f => ({ label: f, value: f }));

  

  return (
    <div className="w-full md:w-1/4 space-y-6">
      <div>
        <h2 className="font-bold mb-2 text-[#424242]">Rows</h2>
        <Select
          isMulti
          options={fieldOptions}
          value={rows.map(r => ({ label: r, value: r }))}
          onChange={(selected) => setRows(selected.map(s => s.value))}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>

      <div>
        <h2 className="font-bold mb-2 text-[#424242]">Columns</h2>
        <Select
          isMulti
          options={fieldOptions}
          value={columns.map(c => ({ label: c, value: c }))}
          onChange={(selected) => setColumns(selected.map(s => s.value))}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>

      <div>
        <h2 className="font-bold mb-2 text-[#424242]">Values</h2>
        <Select
          isMulti
          options={numericalOptions}
          value={values.map(v => ({ label: v, value: v }))}
          onChange={(selected) => setValues(selected.map(s => s.value))}
          className="basic-multi-select"
          classNamePrefix="select"
        />

        {values.map(val => (
          <div key={val} className="mt-2 flex items-center space-x-2">
            <span className="font-semibold text-[#424242] text-sm">{val}</span>
            <select
              className="text-[12px] p-1 border rounded text-[#424242]"
              value={aggregations[val] || "sum"}
              onChange={(e) =>
                setAggregations(prev => ({ ...prev, [val]: e.target.value }))
              }
            >
              <option value="sum">Sum</option>
              <option value="avg">Average</option>
              <option value="count">Count</option>
              <option value="min">Min</option>
              <option value="max">Max</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
