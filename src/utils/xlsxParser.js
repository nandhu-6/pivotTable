import * as XLSX from "xlsx";

// Helper to format date as 'dd mmm yyyy'
const formatDate = (date) => {
    if (!(date instanceof Date)) return date;
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth is 0-based
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  

export const parseExcelFile = (file, callback) => {
  const reader = new FileReader();

  reader.onload = (evt) => {
    const bstr = evt.target.result;
    const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const jsonData = XLSX.utils.sheet_to_json(ws, { raw: true });

    const newData = jsonData.map((row) => {
      const newRow = { ...row };

      for (let key in newRow) {
        const value = newRow[key];

        // Check and convert if it's a valid date (as object or string)
        if (value instanceof Date) {
          newRow[key] = formatDate(value);
        } else if (
          typeof value === "string" &&
          !isNaN(Date.parse(value))
        ) {
          const parsedDate = new Date(value);
          if (!isNaN(parsedDate)) {
            newRow[key] = formatDate(parsedDate);
          }
        }
      }

      return newRow;
    });

    callback(newData);
  };

  reader.readAsArrayBuffer(file);
};


// import * as XLSX from "xlsx";

// export const parseExcelFile = (file, callback) => {
//   const reader = new FileReader();
//   reader.onload = (evt) => {
//     const bstr = evt.target.result;
//     const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
//     const wsname = wb.SheetNames[0];
//     const ws = wb.Sheets[wsname];
//     const jsonData = XLSX.utils.sheet_to_json(ws, { raw: true });

//     const newData = jsonData.map((row) => {
//       const newRow = { ...row };
//       for (let key in newRow) {
//         if (newRow[key] instanceof Date) {
//           newRow[key] = newRow[key];
//         } else if (typeof newRow[key] === "string" && !isNaN(Date.parse(newRow[key]))) {
//           newRow[key] = new Date(newRow[key]);
//         }
//       }
//       return newRow;
//     });

//     callback(newData);
//   };
//   reader.readAsArrayBuffer(file);
  
// };
