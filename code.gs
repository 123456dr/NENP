function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('课程和考试日程表')
      .setFaviconUrl('https://www.google.com/images/product/calendar_32.png');
}

function addEvent(date, content, type) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  // 找到第一个空行
  var nextRow = lastRow + 1;
  
  // 写入数据
  sheet.getRange('B' + nextRow).setValue(date);
  sheet.getRange('C' + nextRow).setValue(content);
  sheet.getRange('D' + nextRow).setValue(type);
  
  return getEvents();
}

function getEvents() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var data = [];
  
  if (lastRow > 0) {
    var range = sheet.getRange('B1:D' + lastRow);
    var values = range.getValues();
    
    for (var i = 0; i < values.length; i++) {
      if (values[i][0]) { // 如果日期不为空
        data.push({
          date: values[i][0],
          content: values[i][1],
          type: values[i][2]
        });
      }
    }
  }
  
  return data;
}

function cleanOldEvents() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow > 0) {
    var range = sheet.getRange('B1:D' + lastRow);
    var values = range.getValues();
    var today = new Date();
    var rowsToDelete = [];
    
    for (var i = 0; i < values.length; i++) {
      if (values[i][0]) {
        var eventDate = new Date(values[i][0]);
        if (eventDate < today) {
          rowsToDelete.push(i + 1);
        }
      }
    }
    
    // 从后往前删除行，以避免索引变化的问题
    for (var i = rowsToDelete.length - 1; i >= 0; i--) {
      sheet.deleteRow(rowsToDelete[i]);
    }
  }
  
  return getEvents();
}
