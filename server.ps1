# ==========================================================================
# TRAVELLERS INN TOURS AND TRAVELS - KODAIKANAL
# Complete All-India Routes & Flight/Train Booking Backend Server (Port 5000)
# ==========================================================================

param (
    [int]$Port = 5000
)

$rootDir = Get-Location
$dataDir = Join-Path $rootDir "data"
$bookingsFile = Join-Path $dataDir "bookings.json"
$reviewsFile = Join-Path $dataDir "reviews.json"

if (!(Test-Path $dataDir)) { New-Item -ItemType Directory -Path $dataDir | Out-Null }
if (!(Test-Path $bookingsFile)) { "[]" | Out-File -FilePath $bookingsFile -Encoding utf8 }
if (!(Test-Path $reviewsFile)) { "[]" | Out-File -FilePath $reviewsFile -Encoding utf8 }

function Get-JsonData($path) {
    if (Test-Path $path) {
        $content = Get-Content $path -Raw -ErrorAction SilentlyContinue
        if (![string]::IsNullOrWhiteSpace($content)) {
            return ConvertFrom-Json $content
        }
    }
    return @()
}

function Save-JsonData($path, $data) {
    $json = ConvertTo-Json -InputObject $data -Depth 6
    $json | Out-File -FilePath $path -Encoding utf8
}

$listener = New-Object System.Net.HttpListener
$url = "http://localhost:$Port/"
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host " TRAVELLERS INN TOURS AND TRAVELS - ALL-INDIA REST SERVER" -ForegroundColor Cyan
    Write-Host " Owner: Sulthan Ibrahim | Hotline: 9894119264" -ForegroundColor Yellow
    Write-Host " Live Server URL: $url" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
} catch {
    Write-Host "Failed to start listener on $url : $_" -ForegroundColor Red
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $rawUrl = $request.Url.AbsolutePath
        $query = $request.QueryString

        # REST API ROUTING
        if ($rawUrl.StartsWith("/api/")) {
            $response.ContentType = "application/json; charset=utf-8"
            
            # HEALTH ENDPOINT
            if ($rawUrl -eq "/api/health") {
                $bookings = Get-JsonData $bookingsFile
                $resObj = @{
                    status = "ok"
                    app = "TRAVELLERS INN TOURS AND TRAVELS REST API"
                    owner = "Sulthan Ibrahim"
                    phone = "9894119264"
                    location = "Kodaikanal, Tamil Nadu"
                    totalBookings = $bookings.Count
                    serverTime = (Get-Date).ToString("o")
                }
                $json = ConvertTo-Json $resObj
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            
            # ALL-INDIA ROUTES API
            elseif ($rawUrl -eq "/api/routes") {
                $routes = @(
                    @{ city = "Chennai"; distance = "520 km"; driveTime = "9.5 Hours"; highway = "NH44 & NH183 via Trichy / Dindigul"; mode = "Flight to Madurai / Direct Sleeper Bus / Train to Kodai Road" },
                    @{ city = "Bengaluru"; distance = "465 km"; driveTime = "8.0 Hours"; highway = "NH44 via Hosur, Salem, Karur, Dindigul"; mode = "Direct Outstation Cab / Overnight Sleeper Bus" },
                    @{ city = "Hyderabad"; distance = "1,030 km"; driveTime = "17 Hours"; highway = "NH44 via Anantapur, Bengaluru, Salem"; mode = "Flight to Madurai / Train to Dindigul" },
                    @{ city = "Kochi / Munnar"; distance = "290 km"; driveTime = "6.5 Hours"; highway = "NH85 & SH37 via Theni & Periyakulam"; mode = "Scenic Hill Highway Taxi" },
                    @{ city = "Mumbai / Pune"; distance = "1,420 km"; driveTime = "24 Hours"; highway = "NH48 via Satara, Belagavi, Bengaluru"; mode = "Direct Flight to Madurai / Coimbatore" },
                    @{ city = "Delhi / NCR"; distance = "2,580 km"; driveTime = "Flight + Cab"; highway = "Air Corridor to IXM / CJB"; mode = "Daily Direct Flights to Madurai (2.5h Cab to Kodai)" }
                )
                $json = ConvertTo-Json $routes
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }

            # NEARBY AIRPORTS & CAB FARES API
            elseif ($rawUrl -eq "/api/airports") {
                $airports = @(
                    @{ code = "IXM"; name = "Madurai Airport"; distance = "120 km"; driveTime = "2.5 Hours"; sedanRate = 3200; innovaRate = 4500; status = "Closest & Most Popular" },
                    @{ code = "CJB"; name = "Coimbatore International Airport"; distance = "175 km"; driveTime = "4.0 Hours"; sedanRate = 4500; innovaRate = 6200; status = "Major Flight Hub" },
                    @{ code = "TRZ"; name = "Tiruchirappalli (Trichy) Airport"; distance = "195 km"; driveTime = "4.5 Hours"; sedanRate = 4800; innovaRate = 6500; status = "International Flights" },
                    @{ code = "COK"; name = "Cochin International Airport (Kerala)"; distance = "260 km"; driveTime = "6.0 Hours"; sedanRate = 6500; innovaRate = 8800; status = "Scenic Kerala Connection" }
                )
                $json = ConvertTo-Json $airports
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }

            # MULTI-CITY SOUTH INDIA TOUR PACKAGES API
            elseif ($rawUrl -eq "/api/packages/multi-city") {
                $pkgs = @(
                    @{ title = "Kodaikanal + Munnar Hills Combo"; duration = "5 Days / 4 Nights"; cities = "Kodaikanal, Munnar, Theni"; price = "₹18,500"; highlight = "Twin Hill Station Special with Tea Gardens & Lakes" },
                    @{ title = "Royal Tamil Nadu Pilgrimage & Hills"; duration = "6 Days / 5 Nights"; cities = "Madurai, Kodaikanal, Rameshwaram"; price = "₹22,000"; highlight = "Meenakshi Temple + Misty Hills + Pamban Sea Bridge" },
                    @{ title = "Ultimate South India Triangle"; duration = "8 Days / 7 Nights"; cities = "Kodaikanal, Ooty, Coonoor, Mysuru"; price = "₹29,500"; highlight = "Nilgiri Mountain Railway + Palani Hills + Mysore Palace" }
                )
                $json = ConvertTo-Json $pkgs
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }

            # BOOKINGS ENDPOINTS
            elseif ($rawUrl -eq "/api/bookings" -or $rawUrl.StartsWith("/api/bookings/")) {
                $parts = $rawUrl.Split('/')
                $bookingId = if ($parts.Length -gt 3) { $parts[3] } else { "" }
                $action = if ($parts.Length -gt 4) { $parts[4] } else { "" }

                if (![string]::IsNullOrEmpty($bookingId) -and $action -eq "voucher") {
                    $response.ContentType = "text/html; charset=utf-8"
                    $bookings = Get-JsonData $bookingsFile
                    $bk = $bookings | Where-Object { $_.id -eq $bookingId } | Select-Object -First 1

                    if ($null -ne $bk) {
                        $htmlVoucher = @"
<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmation Voucher - $(${bk}.id)</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f8fafc; padding: 40px; color: #0f172a; }
        .voucher-card { max-width: 650px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 2px solid #0d9488; overflow: hidden; }
        .voucher-header { background: linear-gradient(135deg, #0d9488, #14532d); color: #fff; padding: 24px; text-align: center; }
        .voucher-body { padding: 30px; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
        .info-label { font-weight: bold; color: #475569; }
        .info-val { font-weight: bold; color: #0f172a; }
        .status-badge { background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 20px; font-weight: bold; }
        .voucher-footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 0.9rem; color: #64748b; }
        @media print { body { background: #fff; padding: 0; } .voucher-card { box-shadow: none; } }
    </style>
</head>
<body>
    <div class="voucher-card">
        <div class="voucher-header">
            <h2 style="margin:0;">TRAVELLERS INN TOURS AND TRAVELS</h2>
            <p style="margin:4px 0 0 0; font-size:0.9rem;">Kodaikanal, Tamil Nadu | Owner: Sulthan Ibrahim (9894119264)</p>
        </div>
        <div class="voucher-body">
            <h3 style="color:#0d9488; margin-top:0;">Official Tour Confirmation Voucher</h3>
            <div class="info-row"><span class="info-label">Booking Reference:</span><span class="info-val">$(${bk}.id)</span></div>
            <div class="info-row"><span class="info-label">Guest Name:</span><span class="info-val">$(${bk}.name)</span></div>
            <div class="info-row"><span class="info-label">Phone Number:</span><span class="info-val">$(${bk}.phone)</span></div>
            <div class="info-row"><span class="info-label">Selected Service:</span><span class="info-val">$(${bk}.service)</span></div>
            <div class="info-row"><span class="info-label">Vehicle Type:</span><span class="info-val">$(${bk}.vehicle)</span></div>
            <div class="info-row"><span class="info-label">Travel Date:</span><span class="info-val">$(${bk}.date)</span></div>
            <div class="info-row"><span class="info-label">Passengers:</span><span class="info-val">$(${bk}.passengers) Persons</span></div>
            <div class="info-row"><span class="info-label">Pickup Address:</span><span class="info-val">$(${bk}.pickup)</span></div>
            <div class="info-row"><span class="info-label">Booking Status:</span><span class="status-badge">$(${bk}.status)</span></div>
        </div>
        <div class="voucher-footer">
            Thank you for choosing Travellers Inn! For assistance or modifications, call Sulthan Ibrahim: <strong>9894119264</strong>
        </div>
    </div>
    <script>window.onload = function() { window.print(); };</script>
</body>
</html>
"@
                        $buffer = [System.Text.Encoding]::UTF8.GetBytes($htmlVoucher)
                        $response.OutputStream.Write($buffer, 0, $buffer.Length)
                    } else {
                        $response.StatusCode = 404
                        $buffer = [System.Text.Encoding]::UTF8.GetBytes("<h1>Voucher Not Found</h1>")
                        $response.OutputStream.Write($buffer, 0, $buffer.Length)
                    }
                    $response.Close()
                    continue
                }

                if ($request.HttpMethod -eq "GET") {
                    $bookings = Get-JsonData $bookingsFile
                    $search = $query["search"]
                    $status = $query["status"]

                    if (![string]::IsNullOrWhiteSpace($search)) {
                        $bookings = $bookings | Where-Object { $_.name -like "*$search*" -or $_.phone -like "*$search*" -or $_.id -like "*$search*" }
                    }
                    if (![string]::IsNullOrWhiteSpace($status) -and $status -ne "All") {
                        $bookings = $bookings | Where-Object { $_.status -eq $status }
                    }

                    $json = ConvertTo-Json -InputObject $bookings -Depth 5
                    if ([string]::IsNullOrWhiteSpace($json)) { $json = "[]" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
                elseif ($request.HttpMethod -eq "POST") {
                    $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                    $postBody = $reader.ReadToEnd()
                    $newBk = ConvertFrom-Json $postBody
                    
                    if ([string]::IsNullOrWhiteSpace($newBk.id)) {
                        $newBk | Add-Member -MemberType NoteProperty -Name "id" -Value ("TIK-" + (Get-Date -Format "yyyyMMdd") + "-" + (Get-Random -Min 1000 -Max 9999))
                    }
                    if ([string]::IsNullOrWhiteSpace($newBk.status)) {
                        $newBk | Add-Member -MemberType NoteProperty -Name "status" -Value "Pending"
                    }
                    
                    $bookings = @(Get-JsonData $bookingsFile)
                    $bookings = @($newBk) + $bookings
                    Save-JsonData $bookingsFile $bookings
                    
                    $resObj = @{
                        success = $true
                        message = "Booking created successfully on server database"
                        booking = $newBk
                    }
                    $json = ConvertTo-Json $resObj
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
                elseif ($request.HttpMethod -eq "PUT" -and ![string]::IsNullOrEmpty($bookingId)) {
                    $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                    $postBody = $reader.ReadToEnd()
                    $updateData = ConvertFrom-Json $postBody

                    $bookings = @(Get-JsonData $bookingsFile)
                    for ($i = 0; $i -lt $bookings.Count; $i++) {
                        if ($bookings[$i].id -eq $bookingId) {
                            if ($updateData.status) { $bookings[$i].status = $updateData.status }
                            break
                        }
                    }
                    Save-JsonData $bookingsFile $bookings
                    
                    $resObj = @{ success = $true; message = "Booking status updated successfully" }
                    $json = ConvertTo-Json $resObj
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }

            # ADMIN STATS ENDPOINT
            elseif ($rawUrl -eq "/api/admin/stats") {
                $bookings = Get-JsonData $bookingsFile
                $resObj = @{
                    totalBookings = $bookings.Count
                    activeFleet = 15
                    topDestination = "Pillar Rocks & Coaker's Walk"
                }
                $json = ConvertTo-Json $resObj
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }

            # FARE ESTIMATE ENDPOINT
            elseif ($rawUrl -eq "/api/estimate") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $postBody = $reader.ReadToEnd()
                $req = ConvertFrom-Json $postBody

                $vehicle = $req.vehicle
                $days = [int]($req.days)
                if ($days -lt 1) { $days = 1 }
                $type = $req.type

                $rateMap = @{
                    "sedan" = @{ base = 2200; perDay = 2800 }
                    "innova" = @{ base = 3500; perDay = 4200 }
                    "tempo" = @{ base = 5500; perDay = 6800 }
                }

                $vRate = $rateMap[$vehicle]
                if ($null -eq $vRate) { $vRate = $rateMap["innova"] }

                $estimatedFare = 0
                if ($type -eq "pickup") {
                    $estimatedFare = $vRate.base
                } elseif ($type -eq "outstation") {
                    $estimatedFare = $vRate.perDay * $days * 1.15
                } else {
                    $estimatedFare = $vRate.perDay * $days
                }

                $resObj = @{
                    vehicle = $vehicle
                    days = $days
                    type = $type
                    estimatedFare = [Math]::Round($estimatedFare)
                    formattedPrice = "₹" + [Math]::Round($estimatedFare).ToString("N0")
                }
                $json = ConvertTo-Json $resObj
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }

            # REVIEWS ENDPOINTS
            elseif ($rawUrl -eq "/api/reviews") {
                if ($request.HttpMethod -eq "GET") {
                    $reviews = Get-JsonData $reviewsFile
                    $json = ConvertTo-Json -InputObject $reviews -Depth 5
                    if ([string]::IsNullOrWhiteSpace($json)) { $json = "[]" }
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
                elseif ($request.HttpMethod -eq "POST") {
                    $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                    $postBody = $reader.ReadToEnd()
                    $newRev = ConvertFrom-Json $postBody
                    
                    $reviews = @(Get-JsonData $reviewsFile)
                    $reviews = @($newRev) + $reviews
                    Save-JsonData $reviewsFile $reviews
                    
                    $resObj = @{ success = $true; message = "Review saved successfully" }
                    $json = ConvertTo-Json $resObj
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }

            else {
                $response.StatusCode = 404
                $resObj = @{ error = "Endpoint not found" }
                $json = ConvertTo-Json $resObj
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
        }
        else {
            # STATIC FILE SERVING
            $relativePath = $rawUrl.TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = "index.html" }
            $filePath = Join-Path $rootDir $relativePath

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                if ($mimeTypes.ContainsKey($ext)) {
                    $response.ContentType = $mimeTypes[$ext]
                } else {
                    $response.ContentType = "application/octet-stream"
                }
                
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $buffer = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
        }

        $response.Close()
    } catch {
        Write-Host "Request error: $_" -ForegroundColor Red
    }
}
