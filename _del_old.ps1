$file = 'C:\Users\migue\.gemini\antigravity\scratch\SistemaSupraLegis_V2\app_v2.js'
$lines = [System.IO.File]::ReadAllLines($file, [System.Text.Encoding]::UTF8)
Write-Host "Total lines before: $($lines.Count)"
# Delete lines 1200-1508 (0-indexed: 1199-1507)
$startDel = 1199  # 0-indexed
$endDel = 1507  # 0-indexed inclusive
$newLines = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($i -lt $startDel -or $i -gt $endDel) {
        $newLines += $lines[$i]
    }
}
Write-Host "Total lines after: $($newLines.Count)"
[System.IO.File]::WriteAllLines($file, $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Done."
