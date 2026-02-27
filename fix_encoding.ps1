
$path = 'C:\Users\migue\Desktop\antigravity\SistemaSupraLegis_V2\app_v2.js';
try {
    $content = [System.IO.File]::ReadAllText($path);
    Write-Host "First 100 chars: $($content.Substring(0, 100))"
    
    # Check for Ã (U+00C3)
    if ($content.Contains([char]0x00C3)) {
        Write-Host "Corruption detected (U+00C3 found). Fixing..."
        
        $latin1 = [System.Text.Encoding]::GetEncoding("iso-8859-1");
        $utf8 = [System.Text.Encoding]::UTF8;
        
        # Convert string (Mojibake) back to raw bytes using Latin-1
        # This assumes the file was treated as UTF-8 when it should have been Latin-1, or vice versa?
        # No, the file *is* UTF-8 bytes representing the Mojibake characters.
        # We need to map those characters back to the bytes they represent in Latin-1.
        $bytes = $latin1.GetBytes($content);
        
        # Now reinterpret those bytes as UTF-8
        $fixed = $utf8.GetString($bytes);
        
        [System.IO.File]::WriteAllText($path, $fixed, $utf8);
        Write-Host "File saved.";
    }
    else {
        Write-Host "No corruption detected."
    }
}
catch {
    Write-Host "Error: $_"
}
