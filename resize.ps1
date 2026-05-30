Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\cts\.gemini\antigravity\brain\8b927946-f8e0-48ea-baa2-57a3f1b05a20\ghiras_app_icon_1780147701621.png')
$bmp192 = New-Object System.Drawing.Bitmap 192, 192
$g192 = [System.Drawing.Graphics]::FromImage($bmp192)
$g192.DrawImage($img, 0, 0, 192, 192)
$bmp192.Save('c:\Users\cts\dhikr-book\public\icon-192x192.png', [System.Drawing.Imaging.ImageFormat]::Png)

$bmp512 = New-Object System.Drawing.Bitmap 512, 512
$g512 = [System.Drawing.Graphics]::FromImage($bmp512)
$g512.DrawImage($img, 0, 0, 512, 512)
$bmp512.Save('c:\Users\cts\dhikr-book\public\icon-512x512.png', [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()
$g192.Dispose()
$bmp192.Dispose()
$g512.Dispose()
$bmp512.Dispose()
