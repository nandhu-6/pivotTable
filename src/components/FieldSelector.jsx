import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RowIcon, ColumnIcon } from "../assets/icons"

const FieldItem = ({ field, type, onDrop, onRemove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "FIELD",
    item: { field, sourceType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-1 text-[12px] bg-[#ffffffb5] border border-gray-300 rounded shadow-sm cursor-move flex items-center justify-between mb-1   ${isDragging ? "opacity-50" : ""
        }`}
    >
      <span>{field}</span>
      {type !== "available" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(field);
          }}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  );
};

const DropZone = ({ type, fields, onDrop, onRemove, title, icon }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "FIELD",
    drop: (item) => onDrop(item.field, type),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-1 text-gray-600">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div
        ref={drop}
        className={`p-2 border rounded min-h-28 max-h-[130px]  ${isOver ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
          }`}
      >
        <div className="max-h-[90px] overflow-y-auto no-scrollbar">
          {fields.map((field) => (
            <FieldItem
              key={field}
              field={field}
              type={type}
              onDrop={onDrop}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

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
  const handleDrop = (field, targetType) => {
    // Remove from source
    if (rows.includes(field)) setRows(rows.filter((f) => f !== field));
    if (columns.includes(field)) setColumns(columns.filter((f) => f !== field));
    if (values.includes(field)) setValues(values.filter((f) => f !== field));

    // Add to target
    if (targetType === "rows") setRows([...rows, field]);
    if (targetType === "columns") setColumns([...columns, field]);
    if (targetType === "values") setValues([...values, field]);
  };

  const handleRemove = (field) => {
    if (rows.includes(field)) setRows(rows.filter((f) => f !== field));
    if (columns.includes(field)) setColumns(columns.filter((f) => f !== field));
    if (values.includes(field)) {
      setValues(values.filter((f) => f !== field));
      const newAggregations = { ...aggregations };
      delete newAggregations[field];
      setAggregations(newAggregations);
    }
  };

  const availableFields = fields.filter(
    (f) => !rows.includes(f) && !columns.includes(f) && !values.includes(f)
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-[300px] h-[480px] flex flex-col bg-[#F5F5F5] shadow-lg">
        {/* Header */}
        <div className="px-3 py-2">
          <h2 className="font-semibold text-gray-600">PivotTable Fields</h2>
        </div>

        {/* Available Fields */}
        <div className="flex-1 max-h-45 overflow-y-auto border-b border-b-gray-300 p-3 pt-0" id="scroll">
          {availableFields.map((field) => (
            <FieldItem
              key={field}
              field={field}
              type="available"
              onDrop={handleDrop}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Drop Zones */}
        <div className="p-1.5 space-y-1">
          {/* Rows and Columns side by side */}
          <div className="flex gap-2">
            <div className="flex-1">
              <DropZone
                type="rows"
                fields={rows}
                onDrop={handleDrop}
                onRemove={handleRemove}
                title="Rows"
                icon={<RowIcon />}
              />
            </div>
            <div className="flex-1">
              <DropZone
                type="columns"
                fields={columns}
                onDrop={handleDrop}
                onRemove={handleRemove}
                title="Columns"
                icon={<ColumnIcon />}
              />
            </div>
          </div>

          {/* Values and Aggregations */}
          <div className="flex gap-2">
            <div className="flex-1">
              <DropZone
                type="values"
                fields={values}
                onDrop={handleDrop}
                onRemove={handleRemove}
                title="Values"
                icon="Σ"
              />
            </div>
            {values.length > 0 && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 text-gray-600">
                  <span className="text-lg"><img src="https://img.icons8.com/material-outlined/24/4A5565/calculator--v1.png" alt="calculator" width="20" height="20" className="inline-block mr-1" /></span>
                  <span className="text-sm font-medium">Aggregation</span>
                </div>
                <div className="p-2 border border-gray-200 rounded bg-white max-w-[140px] max-h-[120px]">
                  <div className=" max-w-[135px] min-h-[94px] max-h-[94px] overflow-y-auto no-scrollbar">
                    {values.map((val) => (
                      <div key={val} className="flex justify-between items-center gap-2 text-[10px]">
                        <span className="font-medium">{val}:</span>
                        <select
                          className="flex-1 py-0.5 border border-gray-300 shadow-sm rounded max-w-[50px]"
                          value={aggregations[val] || "sum"}
                          onChange={(e) =>
                            setAggregations((prev) => ({ ...prev, [val]: e.target.value }))
                          }
                        >
                          <option value="sum">Sum</option>
                          <option value="avg">Avg</option>
                          <option value="count">Count</option>
                          <option value="min">Min</option>
                          <option value="max">Max</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}


