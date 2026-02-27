$path = 'c:\Users\migue\.gemini\antigravity\scratch\SistemaSupraLegis_V2';
$lines = Get-Content "$path\app_v2.js";
$newContent = Get-Content "$path\temp_arrendamiento.js";
$before = $lines[0..626];
$after = $lines[656..($lines.Count - 1)];
$final = $before + $newContent + $after;
$final | Set-Content "$path\app_v2.js" -Encoding UTF8;
