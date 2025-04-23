import React from "react";
import { parseExcelFile } from "../utils/xlsxParser";

export default function FileUploader({ onDataParsed }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      parseExcelFile(file, (parsedData) => {
        onDataParsed(parsedData);
      });
    }
  };

  return (
    <div className="mb-6">
      <label className="inline-block bg-[#107C41] hover:bg-[#107c41e1] text-white font-semibold py-2 px-4 rounded cursor-pointer">
        Import File
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
