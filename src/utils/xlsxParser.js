import * as XLSX from "xlsx";

export const parseExcelFile = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (evt) => {
    const bstr = evt.target.result;
    const wb = XLSX.read(bstr, { type: "binary" });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const jsonData = XLSX.utils.sheet_to_json(ws, { raw: true });

    const newData = jsonData.map((row) => {
      const newRow = { ...row };
      for (let key in newRow) {
        if (newRow[key] instanceof Date) {
          newRow[key] = newRow[key];
        } else if (typeof newRow[key] === "string" && !isNaN(Date.parse(newRow[key]))) {
          newRow[key] = new Date(newRow[key]);
        }
      }
      return newRow;
    });

    callback(newData);
  };
  reader.readAsBinaryString(file);
};
