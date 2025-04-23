export function generatePivotData({ data, rows, columns, values, aggregations }) {
    if (!data.length || (!rows.length && !columns.length)) {
      return { pivotRows: [], pivotColumns: [], pivotMatrix: [], rowTotals: [], columnTotals: [] };
    }
  
    const pivotMap = new Map();
    const allColumnValues = new Set();
  
    data.forEach(item => {
      const rowKey = rows.map(r => item[r] ?? "N/A").join(" | ");
      const columnKey = columns.map(c => item[c] ?? "N/A").join(" | ");
  
      allColumnValues.add(columnKey);
  
      const pivotKey = rowKey + "||" + columnKey;
      if (!pivotMap.has(pivotKey)) {
        pivotMap.set(pivotKey, {});
      }
  
      values.forEach(val => {
        const fieldVal = item[val];
        if (typeof fieldVal === "number") {
          if (!pivotMap.get(pivotKey)[val]) {
            pivotMap.get(pivotKey)[val] = [];
          }
          pivotMap.get(pivotKey)[val].push(fieldVal);
        }
      });
    });
  
    const pivotRows = Array.from(new Set(
      data.map(item => rows.map(r => item[r] ?? "N/A").join(" | "))
    )).sort();
  
    const pivotColumns = Array.from(allColumnValues).sort();
  
    const pivotMatrix = pivotRows.map(rowKey => {
      return pivotColumns.map(colKey => {
        const pivotKey = rowKey + "||" + colKey;
        const fieldAggs = pivotMap.get(pivotKey) || {};
        const result = {};
        values.forEach(val => {
          const nums = fieldAggs[val] || [];
          switch (aggregations[val]) {
            case "sum":
              result[val] = nums.reduce((a, b) => a + b, 0);
              break;
            case "avg":
              result[val] = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : 0;
              break;
            case "count":
              result[val] = nums.length;
              break;
            case "min":
              result[val] = nums.length ? Math.min(...nums) : 0;
              break;
            case "max":
              result[val] = nums.length ? Math.max(...nums) : 0;
              break;
            default:
              result[val] = 0;
          }
        });
        return result;
      });
    });
  
    // Calculate row totals and column totals
    const rowTotals = pivotMatrix.map(row =>
      row.reduce((acc, cell) => {
        return acc + values.reduce((subAcc, val) => subAcc + Number(cell[val] || 0), 0);
      }, 0)
    );
  
    const columnTotals = pivotColumns.flatMap((_, colIdx) =>
      values.map(val =>
        pivotMatrix.reduce((acc, row) => acc + Number(row[colIdx][val] || 0), 0)
      )
    );
  
    return { pivotRows, pivotColumns, pivotMatrix, rowTotals, columnTotals };
  }
  