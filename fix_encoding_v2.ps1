
$path = 'C:\Users\migue\Desktop\antigravity\SistemaSupraLegis_V2\app_v2.js';
try {
    $content = [System.IO.File]::ReadAllText($path);
    
    if ($content.Contains([char]0x00C3)) {
        Write-Host "Fixing Mojibake using Windows-1252..."
        
        $win1252 = [System.Text.Encoding]::GetEncoding(1252);
        $utf8 = [System.Text.Encoding]::UTF8;
        
        $bytes = $win1252.GetBytes($content);
        $fixed = $utf8.GetString($bytes);
        
        [System.IO.File]::WriteAllText($path, $fixed, $utf8);
        Write-Host "Fixed file: $path";
    }
    else {
        Write-Host "No corruption detected."
    }
}
catch {
    Write-Host "Error: $_"
}
