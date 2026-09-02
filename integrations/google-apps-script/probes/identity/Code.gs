function readEmail(read) {
  try {
    return { value: read() || '', error: '' };
  } catch (error) {
    return { value: '', error: 'unavailable' };
  }
}

function doGet() {
  var active = readEmail(function () { return Session.getActiveUser().getEmail(); });
  var effective = readEmail(function () { return Session.getEffectiveUser().getEmail(); });
  var template = HtmlService.createTemplateFromFile('Page');
  template.identity = {
    activeEmail: active.value,
    activeNonblank: active.value !== '',
    activeReadError: active.error,
    effectiveEmail: effective.value,
    effectiveReadError: effective.error
  };
  return template.evaluate().setTitle('Browser Battlegorithms identity probe');
}
