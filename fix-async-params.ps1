$files = @(
    "Ecommerce_Cloud_Backend\src\app\api\categories\[id]\route.ts",
    "Ecommerce_Cloud_Backend\src\app\api\cart\[id]\route.ts",
    "Ecommerce_Cloud_Backend\src\app\api\orders\[id]\route.ts",
    "Ecommerce_Cloud_Backend\src\app\api\payments\[id]\route.ts",
    "Ecommerce_Cloud_Backend\src\app\api\reviews\[id]\route.ts",
    "Ecommerce_Cloud_Backend\src\app\api\shipping\[id]\route.ts",
    "Ecommerce_Cloud_Backend\src\app\api\couriers\[id]\route.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        Write-Host "Fixing $file..."
        
        $content = Get-Content $fullPath -Raw
        
        # Replace params type
        $content = $content -replace '\{ params \}: \{ params: \{ id: string \} \}', '{ params }: { params: Promise<{ id: string }> }'
        
        # Replace params destructuring
        $content = $content -replace 'const \{ id \} = params;', 'const { id } = await params;'
        
        Set-Content -Path $fullPath -Value $content -NoNewline
        Write-Host "Fixed $file" -ForegroundColor Green
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nAll files have been updated!" -ForegroundColor Green

