function exportToExcel() {
    console.log(startKm);
    const laenge = startKm.length;
    const dataRows = [];

    for (let i = 0; i < laenge; i++) {
        dataRows.push({
            startKm: startKm[i] || "", // Sicherstellen, dass StartKm vorhanden ist
            endKm: endKm[i] || "",     // Sicherstellen, dass EndKm vorhanden ist
            startAbst: startAbst[i] || "", // Sicherstellen, dass StartAbst vorhanden ist
            endAbst: endAbst[i] || ""   // Sicherstellen, dass EndAbst vorhanden ist
        });
    } 
    
    console.log(dataRows);
    
    if (dataRows.length === 0) {
        console.log('Keine Daten zum Exportieren vorhanden.');
        return;
    }

    const wb = XLSX.utils.book_new();
    const header = ["Teiltrasse", "Näh-Abschnitt", "Beginn-km", "Ende-km", "Beginn-Abst.", "Ende-Abst.", "Kreuz-Abst.", "Bodenleitf.", "Anz.-Gleise", "Oberleitung"];
    const data = dataRows.map((row, index) => {
    return [
        `1a`, // Column A: "1a"
        (index + 1).toString(), // Column B: incrementing number
        row.startKm,
        row.endKm,
        row.startAbst,
        row.endAbst,
        "", "", "", "", ""
    ];
    });
    const ws = XLSX.utils.aoa_to_sheet([header].concat(data));
    // Füge die statischen Inhalte hinzu
    ws['A6'] = { v: "Kabeltrasse:", s: { font: { sz: 14 } } };
    ws['B6'] = { v: "", s: { font: { sz: 14 } } };
    ws['A7'] = { v: "Teiltrasse", s: { font: { sz: 11 } } };
    ws['B7'] = { v: "Näh-Abschnitt:", s: { font: { sz: 11 } } };
    ws['C7'] = { v: "Beginn-km:", s: { font: { sz: 11 } } };
    ws['D6'] = { v: "Kabeltrasse 1", s: { font: { sz: 14 } } };
    ws['D7'] = { v: "Ende-km", s: { font: { sz: 11 } } };
    ws['E7'] = { v: "Beginn-Abst.:", s: { font: { sz: 11 } } };
    ws['F7'] = { v: "Ende-Abst.:", s: { font: { sz: 11 } } };
    ws['G7'] = { v: "Kreuz-Abst.:", s: { font: { sz: 11 } } };
    ws['H7'] = { v: "Bodenleitf.:", s: { font: { sz: 11 } } };
    ws['I7'] = { v: "Anz.-Gleise:", s: { font: { sz: 11 } } };  
    ws['J7'] = { v: "Oberleitung:", s: { font: { sz: 11 } } };

    // Füge die dynamischen Inhalte basierend auf mouseData hinzu
    let rowIndex = 8; // Startet bei Zeile 8
    dataRows.forEach((row) => {
    ws[`A${rowIndex}`] = { v: "1a", s: { font: { sz: 11 } } };
    ws[`B${rowIndex}`] = { v: rowIndex - 7, s: { font: { sz: 11 } } };
    ws[`C${rowIndex}`] = { v: row.startKm, s: { font: { sz: 11 } } };
    ws[`D${rowIndex}`] = { v: row.endKm, s: { font: { sz: 11 } } };
    ws[`E${rowIndex}`] = { v: row.startAbst, s: { font: { sz: 11 } } };
    ws[`F${rowIndex}`] = { v: row.endAbst, s: { font: { sz: 11 } } };
    rowIndex++; // nächste Zeile
    });

    XLSX.utils.book_append_sheet(wb, ws, "1A-Daten");
    const fileName = `mauskoordinaten_${fileCount++}.xlsx`;
    XLSX.writeFile(wb, fileName);
    /*clearValues();*/
}