/**
 * Gate 1 only. This web app is a shell for a runtime-supplied public child URL.
 * It deliberately has no storage, server calls, or deployment-specific values.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Shell')
    .setTitle('Browser Battlegorithms nested-frame probe');
}
