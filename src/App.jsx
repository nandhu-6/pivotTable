
import React, { useState } from "react";
import FileUploader from "./components/FileUploader";
import FieldSelector from "./components/FieldSelector";
import PivotTable from "./components/PivotTable";

function App() {
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState([]);
  const [aggregations, setAggregations] = useState({});
  const [numericalFields, setNumericalFields] = useState([]);

  const handleDataParsed = (parsedData) => {
    setData(parsedData);
    if (parsedData.length > 0) {
      const allFields = Object.keys(parsedData[0]);
      setFields(allFields);

      // find numerical fields
      // console.log("allfields :", allFields);

      const nums = allFields.filter(f =>
        typeof parsedData[0][f] === "number" && !f.toLowerCase().includes("year")
      );
      setNumericalFields(nums);
      console.log("numericalfields", numericalFields);
    }
  };

  return (
    <div className="p-3 flex flex-col justify-center min-h-screen">
      <div>
        <FileUploader onDataParsed={handleDataParsed} />
      </div>

      {fields.length > 0 && (
        <div className="flex gap-6 justify-between px-6">

          <div className="w-[70%] h-120 overflow-auto" id="scroll">
            <PivotTable
              data={data}
              rows={rows}
              columns={columns}
              values={values}
              aggregations={aggregations}
            />
          </div>
          <div className="h-120">
            <FieldSelector
              fields={fields}
              rows={rows}
              setRows={setRows}
              columns={columns}
              setColumns={setColumns}
              values={values}
              setValues={setValues}
              aggregations={aggregations}
              setAggregations={setAggregations}
              numericalFields={numericalFields}
            />
          </div>

        </div>
      )}
    </div>
  );
}


export default App;
