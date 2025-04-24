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
