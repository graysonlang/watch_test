import { exec, execSync } from 'node:child_process';

export function openOrReuseChromeTab(url, { verbose = false } = {}) {
  const isChromeRunning = () => {
    try {
      const output = execSync('pgrep -x "Google Chrome"');
      return !!output.toString().trim();
    } catch {
      return false;
    }
  };

  if (!isChromeRunning()) {
    exec(`open ${url}`);
    if (verbose) console.log('Chrome not running. Opened URL using macOS open command.');
    return;
  }

  const script = `
tell application "Google Chrome"
  set foundTab to missing value
  set foundWindow to missing value
  set windowCount to 0
  repeat with win in windows
    set windowCount to windowCount + 1
    set tabList to tabs of win
    repeat with i from 1 to count of tabList
      set t to item i of tabList
      if URL of t starts with "${url}" then
        set foundTab to i
        set foundWindow to win
        exit repeat
      end if
    end repeat
    if foundTab is not missing value then exit repeat
  end repeat
  if foundTab is not missing value then
    set active tab index of foundWindow to foundTab
    reload (tabs of foundWindow whose URL contains "${url}")
    set index of win to 1
    activate
  else if windowCount > 0
    tell window 1 to make new tab with properties {URL:"${url}"}
  else
    make new window
    open location "${url}"
  end if
  activate
end tell
  `.trim();

  try {
    execSync(`osascript <<EOF\n${script}\nEOF`);
    if (verbose) console.log('Opened or reused Chrome tab with AppleScript.');
  } catch (err) {
    console.warn('Failed to reuse Chrome tab. Falling back to open.');
    exec(`open ${url}`);
  }
}
