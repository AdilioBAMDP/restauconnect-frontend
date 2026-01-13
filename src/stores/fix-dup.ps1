$file = "c:\Users\Alexandre\Downloads\RestauConnectV3\RestauConnectV2\FRONTEND-COMPLET\src\stores\businessStore.ts"
$backup = "c:\Users\Alexandre\Downloads\RestauConnectV3\RestauConnectV2\FRONTEND-COMPLET\src\stores\businessStore.backup-before-fix.ts"

Copy-Item $file $backup -Force
Write-Host "Backup cree"

$lines = Get-Content $file
$newLines = @()
$skip = $false
$lineNum = 0

foreach ($line in $lines) {
    $lineNum++
    
    if ($lineNum -eq 589 -and $line -match "^\s*partners: \[") {
        Write-Host "Debut bloc partners ligne $lineNum"
        $skip = $true
        continue
    }
    
    if ($skip -and $lineNum -eq 1277 -and $line -match "^\s*\],\s*$") {
        Write-Host "Fin bloc partners ligne $lineNum"
        $skip = $false
        continue
    }
    
    if (-not $skip) {
        $newLines += $line
    }
}

Write-Host "Lignes: $($lines.Count) -> $($newLines.Count)"
$newLines | Set-Content $file -Encoding UTF8
Write-Host "OK!"
