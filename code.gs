function doGet(e) {
  var action = e.parameter.action;
  var response = {};
  
  if (action === 'getEvents') {
    response = getEvents();
  } else if (action === 'addEvent') {
    var date = e.parameter.date;
    var content = e.parameter.content;
    var type = e.parameter.type;
    response = addEvent(date, content, type);
  } else if (action === 'cleanOldEvents') {
    response = cleanOldEvents();
  }
  
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(response));
  
  return output;
}

function addEvent(date, content, type) {
  try {
    var spreadsheetId = '1skHY59I6K_HLaBqBD_xdVrPmmvObURrYVCXTSt8J1L8';
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    if (!spreadsheet) {
      throw new Error('找不到試算表');
    }
    
    var sheet = spreadsheet.getSheets()[0];  // 使用第一个工作表
    var lastRow = sheet.getLastRow();
    
    // 找到第一个空行
    var nextRow = lastRow + 1;
    
    // 将日期字符串转换为日期对象
    var dateObj = new Date(date);
    
    // 写入数据
    sheet.getRange('B' + nextRow).setValue(dateObj);
    sheet.getRange('C' + nextRow).setValue(content);
    sheet.getRange('D' + nextRow).setValue(type);
    
    // 获取更新后的数据
    var updatedData = getEvents();
    return {
      success: true,
      data: updatedData.data
    };
  } catch (error) {
    Logger.log('添加事件错误: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getEvents() {
  try {
    var spreadsheetId = '1skHY59I6K_HLaBqBD_xdVrPmmvObURrYVCXTSt8J1L8';
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    if (!spreadsheet) {
      throw new Error('找不到試算表');
    }
    
    var sheet = spreadsheet.getSheets()[0];  // 使用第一个工作表
    var lastRow = sheet.getLastRow();
    var data = [];
    
    if (lastRow > 0) {
      var range = sheet.getRange('B1:D' + lastRow);
      var values = range.getValues();
      
      for (var i = 0; i < values.length; i++) {
        if (values[i][0]) { // 如果日期不为空
          try {
            data.push({
              date: new Date(values[i][0]).toISOString().split('T')[0],
              content: values[i][1],
              type: values[i][2]
            });
          } catch (e) {
            Logger.log('日期转换错误: ' + e.toString());
          }
        }
      }
    }
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    Logger.log('获取事件错误: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

function cleanOldEvents() {
  try {
    var spreadsheetId = '1skHY59I6K_HLaBqBD_xdVrPmmvObURrYVCXTSt8J1L8';
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    if (!spreadsheet) {
      throw new Error('找不到試算表');
    }
    
    var sheet = spreadsheet.getSheets()[0];  // 使用第一个工作表
    var lastRow = sheet.getLastRow();
    
    if (lastRow > 0) {
      var range = sheet.getRange('B1:D' + lastRow);
      var values = range.getValues();
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var rowsToDelete = [];
      
      for (var i = 0; i < values.length; i++) {
        if (values[i][0]) {
          var eventDate = new Date(values[i][0]);
          eventDate.setHours(0, 0, 0, 0);
          if (eventDate < today) {
            rowsToDelete.push(i + 1);
          }
        }
      }
      
      // 从后往前删除行
      for (var i = rowsToDelete.length - 1; i >= 0; i--) {
        sheet.deleteRow(rowsToDelete[i]);
      }
    }
    
    // 获取更新后的数据
    var updatedData = getEvents();
    return {
      success: true,
      data: updatedData.data
    };
  } catch (error) {
    Logger.log('清理旧事件错误: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}
