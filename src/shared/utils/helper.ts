export function dateTimeConvertToString(date?: Date) {
  if (date == null) return null;
  date = new Date(date);
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();
  var HH = date.getHours(); // set for GTM +7
  var MM = date.getMinutes();
  var ss = date.getSeconds();
  return yyyy + '-' + mm + '-' + dd + ' ' + HH + ':' + MM + ':' + ss;
  // 2012-02-20T17:00:00
}
