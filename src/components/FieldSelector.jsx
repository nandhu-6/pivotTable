import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RowIcon, ColumnIcon } from "../assets/icons"

const FieldItem = ({ field, type, onDrop, onRemove, isDateHierarchy }) => {
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
      className={`p-1 text-[12px] bg-[#ffffffb5] border border-gray-300 rounded shadow-sm cursor-move flex items-center justify-between mb-1 ${isDragging ? "opacity-50" : ""
        }`}
    >
      <span className={isDateHierarchy ? "text-blue-600" : ""}>{field}</span>
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
        className={`p-2 border rounded min-h-28 max-h-[130px] ${isOver ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
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
              isDateHierarchy={field.includes("_Year") || field.includes("_Quarter") || field.includes("_Month")}
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
  const [dateFields, setDateFields] = useState([]);
  const [dateHierarchyFields, setDateHierarchyFields] = useState([]);

  // Detect date fields and create hierarchy fields
  useEffect(() => {
    // Only detect fields that are explicitly named as dates
    const dateCols = fields.filter(field =>
      field.toLowerCase().includes(" on") ||
      field.toLowerCase().includes("date") ||
      field.toLowerCase().includes("dob")
    );

    const hierarchyFields = dateCols.flatMap(dateField => [
      `${dateField}_Year`,
      `${dateField}_Quarter`,
      `${dateField}_Month`
    ]);

    setDateFields(dateCols);
    setDateHierarchyFields(hierarchyFields);
  }, [fields]);

  const handleDrop = (field, targetType) => {
    let newRows = [...rows];
    let newColumns = [...columns];
    let newValues = [...values];
    let newAggregations = { ...aggregations };

    // Remove from source
    if (newRows.includes(field)) newRows = newRows.filter((f) => f !== field);
    if (newColumns.includes(field)) newColumns = newColumns.filter((f) => f !== field);
    if (newValues.includes(field)) {
      newValues = newValues.filter((f) => f !== field);
      delete newAggregations[field];
    }

    // Add to target
    if (targetType === "rows" && !newRows.includes(field)) newRows.push(field);
    if (targetType === "columns" && !newColumns.includes(field)) newColumns.push(field);
    if (targetType === "values" && !newValues.includes(field)) newValues.push(field);

    // Finally update all together
    setRows(newRows);
    setColumns(newColumns);
    setValues(newValues);
    setAggregations(newAggregations);
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

  const handleReset = () => {
    setRows([]);
    setColumns([]);
    setValues([]);
    setAggregations({});
  };

  // Combine regular fields and date hierarchy fields
  const allAvailableFields = [
    ...fields.filter(f => !rows.includes(f) && !columns.includes(f) && !values.includes(f)),
    ...dateHierarchyFields.filter(f => !rows.includes(f) && !columns.includes(f) && !values.includes(f))
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-[300px] h-[480px] flex flex-col bg-[#F5F5F5] shadow-lg">
        {/* Header */}
        <div className="px-3 py-2 flex justify-between">
          <h2 className="font-semibold text-gray-600">PivotTable Fields</h2>
          <button 
            className="cursor-pointer hover:opacity-70 transition-opacity" 
            onClick={handleReset}
          >
            <img
              src="../public/reset.png"
              alt="reset"
              width="20"
              height="20"
            />
          </button>
        </div>

        {/* Available Fields */}
        <div className="flex-1 max-h-45 overflow-y-auto border-b border-b-gray-300 p-3 pt-0" id="scroll">
          {allAvailableFields.map((field) => (
            <FieldItem
              key={field}
              field={field}
              type="available"
              onDrop={handleDrop}
              onRemove={handleRemove}
              isDateHierarchy={field.includes("_Year") || field.includes("_Quarter") || field.includes("_Month")}
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
                  <span className="text-lg">
                    <img
                      src="https://img.icons8.com/material-outlined/24/4A5565/calculator--v1.png"
                      alt="calculator"
                      width="20"
                      height="20"
                      className="inline-block mr-1"
                    />
                  </span>
                  <span className="text-sm font-medium">Aggregation</span>
                </div>
                <div className="p-2 border border-gray-200 rounded bg-white max-w-[140px] max-h-[120px]">
                  <div className="max-w-[135px] min-h-[94px] max-h-[94px] overflow-y-auto no-scrollbar">
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


