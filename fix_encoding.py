
import os

file_path = r'C:\Users\migue\Desktop\antigravity\SistemaSupraLegis_V2\app_v2.js'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for corruption pattern
    if 'Ã' in content:
        print("Corruption detected (Ã found). Attempting to fix...")
        
        # Method 1: The "Mojibake" fix (UTF-8 bytes interpreted as Latin-1 and saved as UTF-8)
        # We perform the reverse: Encode to Latin-1, then Decode as UTF-8
        try:
            fixed_content = content.encode('latin-1').decode('utf-8')
            print("Fix successful!")
            
            # Write back
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
                
            print(f"File saved: {file_path}")
            
        except UnicodeError as e:
            print(f"Error fixing encoding: {e}")
            # Fallback: Manual replacements if the automated way fails
            replacements = {
                'Ã¡': 'á', 'Ã©': 'é', 'Ãed': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
                'Ã±': 'ñ', 'Ã‘': 'Ñ', 'Ã“': 'Ó', 'Ã‰': 'É', 'Ã ': 'Á',
                'Ã“': 'Ó'
            }
            # This is risky, better to stop.
    else:
        print("No obvious corruption detected.")

except Exception as e:
    print(f"Error: {e}")
