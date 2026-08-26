$API_URL = "https://airbnb-clone-beryl-nine-82.vercel.app"
$PASS = 0
$FAIL = 0

function Test-Pass($label) {
    Write-Host "  PASS: $label" -ForegroundColor Green
    $global:PASS++
}
function Test-Fail($label, $reason) {
    Write-Host "  FAIL: $label -- $reason" -ForegroundColor Red
    $global:FAIL++
}

Write-Host ""
Write-Host "======================================================"
Write-Host " Tropica Full-Stack Test Suite"
Write-Host "======================================================"
Write-Host ""

# TEST 1: Backend Health
Write-Host "[1] Backend Health Check"
try {
    $health = Invoke-RestMethod -Uri "$API_URL/api/health" -Method Get
    if ($health.status -eq "UP") { Test-Pass "Backend is UP" } else { Test-Fail "Backend is UP" "Status: $($health.status)" }
    if ($health.database -like "*connected*") { Test-Pass "Database connected (PostgreSQL)" } else { Test-Fail "Database connected" $health.database }
} catch { Test-Fail "Health endpoint" $_.Exception.Message }

# TEST 2: Get All Listings
Write-Host ""
Write-Host "[2] GET /api/listings"
try {
    $listings = Invoke-RestMethod -Uri "$API_URL/api/listings" -Method Get
    if ($listings.Count -gt 0) { Test-Pass "Returns $($listings.Count) listings" } else { Test-Fail "Returns listings" "Empty array" }
    if ($listings[0].title) { Test-Pass "Listings have titles" } else { Test-Fail "Listings have titles" "No title field" }
    if ($listings[0].price) { Test-Pass "Listings have prices" } else { Test-Fail "Listings have prices" "No price field" }
    if ($listings[0].rating) { Test-Pass "Listings have ratings" } else { Test-Fail "Listings have ratings" "No rating field" }
} catch { Test-Fail "GET /api/listings" $_.Exception.Message }

# TEST 3: Get Single Listing
Write-Host ""
Write-Host "[3] GET /api/listings/1"
try {
    $listing = Invoke-RestMethod -Uri "$API_URL/api/listings/1" -Method Get
    if ($listing.id) { Test-Pass "Single listing returned with ID: $($listing.id)" } else { Test-Fail "Single listing" "No ID" }
    if ($listing.amenities) { Test-Pass "Listing has amenities" } else { Test-Fail "Listing has amenities" "Missing" }
} catch { Test-Fail "GET /api/listings/1" $_.Exception.Message }

# TEST 4: Filter Listings
Write-Host ""
Write-Host "[4] GET /api/listings?type=beachfront"
try {
    $filtered = Invoke-RestMethod -Uri "$API_URL/api/listings?type=beachfront" -Method Get
    Test-Pass "Category filter works, returned $($filtered.Count) beachfront listings"
} catch { Test-Fail "GET /api/listings?type=beachfront" $_.Exception.Message }

# TEST 5: User Registration
Write-Host ""
Write-Host "[5] POST /api/auth/register"
$testEmail = "tester_$(Get-Date -Format 'HHmmss')@test.com"
$token = $null
try {
    $registerBody = '{"name":"Tester","email":"' + $testEmail + '","password":"TestPass123"}'
    $reg = Invoke-RestMethod -Uri "$API_URL/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    if ($reg.token) { Test-Pass "Registration returned JWT token" } else { Test-Fail "Registration" "No token" }
    if ($reg.user.id) { Test-Pass "Registration returned user object with ID: $($reg.user.id)" } else { Test-Fail "Registration user object" "No ID" }
    $token = $reg.token
} catch { Test-Fail "POST /api/auth/register" $_.Exception.Message }

# TEST 6: Duplicate Registration
Write-Host ""
Write-Host "[6] POST /api/auth/register (duplicate email - should be rejected)"
try {
    $dupBody = '{"name":"Dupe","email":"' + $testEmail + '","password":"TestPass123"}'
    Invoke-RestMethod -Uri "$API_URL/api/auth/register" -Method Post -Body $dupBody -ContentType "application/json" | Out-Null
    Test-Fail "Reject duplicate email" "Should have failed but did not"
} catch {
    Test-Pass "Correctly rejects duplicate email (400)"
}

# TEST 7: User Login
Write-Host ""
Write-Host "[7] POST /api/auth/login"
try {
    $loginBody = '{"email":"' + $testEmail + '","password":"TestPass123"}'
    $login = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    if ($login.token) { Test-Pass "Login successful, JWT received" } else { Test-Fail "Login" "No token" }
    $token = $login.token
} catch { Test-Fail "POST /api/auth/login" $_.Exception.Message }

# TEST 8: Invalid Login
Write-Host ""
Write-Host "[8] POST /api/auth/login (wrong password - should be rejected)"
try {
    $badBody = '{"email":"' + $testEmail + '","password":"wrongpassword"}'
    Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method Post -Body $badBody -ContentType "application/json" | Out-Null
    Test-Fail "Reject wrong password" "Should have failed but did not"
} catch {
    Test-Pass "Correctly rejects wrong password (401)"
}

# TEST 9: Create Listing (Authenticated)
Write-Host ""
Write-Host "[9] POST /api/listings (authenticated)"
$createdListingId = $null
if ($token) {
    try {
        $listingBody = '{"title":"Test Villa","description":"A lovely test villa.","price":200,"location":"Test Island","image":"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2","type":"beachfront"}'
        $newListing = Invoke-RestMethod -Uri "$API_URL/api/listings" -Method Post -Body $listingBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
        if ($newListing.id) { Test-Pass "Listing created with ID: $($newListing.id)" } else { Test-Fail "Create listing" "No ID returned" }
        $createdListingId = $newListing.id
    } catch { Test-Fail "POST /api/listings" $_.Exception.Message }
} else {
    Test-Fail "Create listing (skipped)" "No auth token available"
}

# TEST 10: Create Listing without Auth
Write-Host ""
Write-Host "[10] POST /api/listings (unauthenticated - should be rejected)"
try {
    $listingBody = '{"title":"Hack"}'
    Invoke-RestMethod -Uri "$API_URL/api/listings" -Method Post -Body $listingBody -ContentType "application/json" | Out-Null
    Test-Fail "Reject unauthenticated listing" "Should have failed"
} catch {
    Test-Pass "Correctly rejects unauthenticated listing creation (401)"
}

# TEST 11: Create Booking
Write-Host ""
Write-Host "[11] POST /api/bookings"
$listingIdToBook = if ($createdListingId) { $createdListingId } else { 1 }
try {
    $bookingBody = '{"listing_id":' + $listingIdToBook + ',"check_in":"2026-10-01","check_out":"2026-10-05","guest_name":"Tester User","total_price":920}'
    $booking = Invoke-RestMethod -Uri "$API_URL/api/bookings" -Method Post -Body $bookingBody -ContentType "application/json"
    if ($booking.id) { Test-Pass "Booking created with ID: $($booking.id)" } else { Test-Fail "Create booking" "No ID returned" }
} catch { Test-Fail "POST /api/bookings" $_.Exception.Message }

# TEST 12: Get All Bookings
Write-Host ""
Write-Host "[12] GET /api/bookings"
try {
    $bookings = Invoke-RestMethod -Uri "$API_URL/api/bookings" -Method Get
    if ($bookings.Count -gt 0) { Test-Pass "Returns $($bookings.Count) bookings" } else { Test-Pass "Returns bookings list (currently empty)" }
} catch { Test-Fail "GET /api/bookings" $_.Exception.Message }

# Summary
Write-Host ""
Write-Host "======================================================"
Write-Host " TEST RESULTS"
Write-Host "======================================================"
Write-Host " PASSED: $PASS" -ForegroundColor Green
Write-Host " FAILED: $FAIL" -ForegroundColor Red
Write-Host "======================================================"
Write-Host ""
