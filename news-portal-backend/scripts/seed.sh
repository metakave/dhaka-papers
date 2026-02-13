#!/bin/bash

# Configuration
API_URL="http://127.0.0.1:8080/api/v1"
DB_NAME="news_portal"
DB_USER="postgres"

echo "🚀 Starting Data Seed..."



# 2. Get Admin Token
# Assuming the user created an admin with these credentials via 'make create-admin'
echo "🔑 Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -L -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@news.com", "password": "password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    echo "❌ Error: Could not get auth token."
    echo "Response from server: $LOGIN_RESPONSE"
    echo "Did you run 'make create-admin' with admin@news.com/password123?"
    exit 1
fi

# 3. Get Category IDs
echo "🔍 Fetching Category IDs..."
CATEGORIES=$(curl -s -X GET $API_URL/categories)

# Function to extract ID by Slug (more reliable than name)
get_id() {
    echo $CATEGORIES | jq -r ".[] | select(.slug == \"$1\") | .id"
}

CAT_BD=$(get_id "bangladesh")
CAT_INT=$(get_id "international")
CAT_SPT=$(get_id "sports")
CAT_ENT=$(get_id "entertainment")

# 4. Create News Articles
echo "📰 Creating News Articles..."

IMAGE_URL="https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"

# Function to create news
create_news() {
    local cat_id=$1
    local title=$2
    local title_en=$3
    local excerpt=$4
    local content=$5
    local featured=$6

    TIMESTAMP=$(date +%s)
    RESPONSE_FILE="/tmp/seed_response_$TIMESTAMP.txt"

    HTTP_CODE=$(curl -s -w "%{http_code}" -o "$RESPONSE_FILE" -X POST $API_URL/SEED_news \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"category_id\": \"$cat_id\",
        \"title\": \"$title\",
        \"title_en\": \"$title_en\",
        \"excerpt\": \"$excerpt\",
        \"content\": \"$content\",
        \"thumbnail_url\": \"$IMAGE_URL\",
        \"is_featured\": $featured
      }")

    if [ "$HTTP_CODE" -ne 200 ] && [ "$HTTP_CODE" -ne 201 ]; then
        echo "❌ Error creating news '$title_en' (Status: $HTTP_CODE)"
        cat "$RESPONSE_FILE"
        echo ""
    fi
    rm -f "$RESPONSE_FILE"
}

# --- Bangladesh (বাংলাদেশ) ---
# --- Bangladesh (বাংলাদেশ) ---
echo "🇧🇩 Seeding Bangladesh news..."
create_news "$CAT_BD" "পদ্মা সেতুতে রেকর্ড রাজস্ব আদায়" "Record Revenue Collection on Padma Bridge" "গত ২৪ ঘণ্টায় পদ্মা সেতুতে ৩ কোটি টাকার বেশি টোল আদায় হয়েছে।" "<p>পদ্মা সেতু উদ্বোধনের পর থেকে দেশের দক্ষিণ-পশ্চিমাঞ্চলের অর্থনীতিতে আমূল পরিবর্তন এসেছে। গত ২৪ ঘণ্টায় সেতুটি দিয়ে রেকর্ড সংখ্যক যানবাহন পারাপার হয়েছে এবং ৩ কোটি টাকার বেশি টোল আদায় হয়েছে।</p><p>সেতু কর্তৃপক্ষ জানিয়েছে, মাওয়া এবং জাজিরা উভয় প্রান্তেই যানবাহনের চাপ ছিল অনেক বেশি।</p>" "true"
create_news "$CAT_BD" "ঢাকায় মেট্রো রেলের নতুন রুট চালু" "New Metro Rail Route Opens in Dhaka" "মতিঝিল থেকে কমলাপুর পর্যন্ত পরীক্ষামূলকভাবে মেট্রো রেল চলাচল শুরু হয়েছে। " "<p>রাজধানীর যানজট নিরসনে মেট্রো রেল এক নতুন দিগন্ত উন্মোচন করেছে। আজ থেকে মতিঝিল থেকে কমলাপুর পর্যন্ত নতুন রুটে পরীক্ষামূলকভাবে ট্রেন চলাচল শুরু হয়েছে।</p><p>যাত্রীরা আশা করছেন, এই রুটটি পূর্ণাঙ্গভাবে চালু হলে যাতায়াতে সময় আরও অনেক কমে যাবে।</p>" "false"
create_news "$CAT_BD" "সবুজ শিল্পায়নে বিশ্বের শীর্ষে বাংলাদেশ" "Bangladesh Tops World in Green Industrialization" "পরিবেশবান্ধব কারখানার তালিকায় বাংলাদেশের জয়জয়কার।" "<p>বিশ্বের শীর্ষ ১০০টি পরিবেশবান্ধব পোশাক কারখানার মধ্যে অর্ধেকই এখন বাংলাদেশে। আন্তর্জাতিক স্ট্যান্ডার্ড মেনে তৈরি এই কারখানাগুলো বাংলাদেশের রপ্তানি বাণিজ্যে নতুন শক্তি জোগাচ্ছে।</p><p>পরিবেশবিদরা এই উদ্যোগকে সাধুবাদ জানিয়েছেন।</p>" "false"

# --- International (আন্তর্জাতিক) ---
# --- International (আন্তর্জাতিক) ---
echo "🌍 Seeding International news..."
create_news "$CAT_INT" "মঙ্গল গ্রহে নতুন প্রাণের সন্ধান" "New Signs of Life Found on Mars" "নাসার রোভার মঙ্গলের বুকে প্রাচীন জীবনের চিহ্ন খুঁজে পেয়েছে।" "<p>আমেরিকান মহাকাশ গবেষণা সংস্থা নাসা জানিয়েছে, তাদের পারসিভিয়ারেন্স রোভার মঙ্গল গ্রহের একটি প্রাচীন হ্রদের তলদেশে জৈব অণুর সন্ধান পেয়েছে।</p><p>বিজ্ঞানীরা মনে করছেন, এটি কোটি কোটি বছর আগে মঙ্গলে প্রাণের অস্তিত্ব থাকার একটি শক্তিশালী সংকেত।</p>" "true"
create_news "$CAT_INT" "বিশ্ব জলবায়ু সম্মেলনে ঐতিহাসিক চুক্তি" "Historic Agreement at World Climate Conference" "কার্বন নিঃসরণ কমাতে একমত হয়েছে বিশ্বের ১৮০টি দেশ।" "<p>জলবায়ু পরিবর্তনের ক্ষতিকর প্রভাব মোকাবিলায় এবারের সম্মেলনে এক ঐতিহাসিক চুক্তি স্বাক্ষরিত হয়েছে। উন্নত দেশগুলো ২০৪০ সালের মধ্যে শতভাগ নবায়নযোগ্য জ্বালানি ব্যবহারের প্রতিশ্রুতি দিয়েছে।</p><p>উন্নয়নশীল দেশগুলোকে আর্থিক সহায়তা প্রদানের জন্য একটি বিশেষ ফান্ড গঠন করা হয়েছে।</p>" "false"

# --- Sports (খেলা) ---
# --- Sports (খেলা) ---
echo "⚽ Seeding Sports news..."
create_news "$CAT_SPT" "বিশ্বকাপে বাংলাদেশের দুর্দান্ত জয়" "Bangladesh's Magnificent Victory in World Cup" "শেষ ওভারের রোমাঞ্চে শক্তিশালী নিউজিল্যান্ডকে হারাল টাইগাররা।" "<p>বিশ্বকাপের গুরুত্বপূর্ণ ম্যাচে নিউজিল্যান্ডকে ৩ উইকেটে হারিয়ে ইতিহাস গড়ল বাংলাদেশ। দলের জয়ে অলরাউন্ড পারফরম্যান্স করেছেন সাকিব আল হাসান।</p><p>এই জয়ের ফলে সেমিফাইনালের পথ আরও প্রশস্ত হলো বাংলাদেশের জন্য।</p>" "true"
create_news "$CAT_SPT" "লিওনেল মেসির নতুন রেকর্ড" "Lionel Messi's New Record" "ইতিহাসের প্রথম ফুটবলার হিসেবে ৮০০ গোল এবং ৩৫০ ড্রিবলিংয়ের রেকর্ড।" "<p>ফুটবল জাদুকর লিওনেল মেসি আরও একটি অনন্য মাইলফলক স্পর্শ করেছেন। গতকালের ম্যাচে জোড়া গোল করার মাধ্যমে তিনি ফুটবল ইতিহাসের সর্বোচ্চ গোলদাতার তালিকায় নিজের অবস্থান আরও মজবুত করলেন।</p>" "false"

# --- Entertainment (বিনোদন) ---
# --- Entertainment (বিনোদন) ---
echo "🎬 Seeding Entertainment news..."
create_news "$CAT_ENT" "অস্কারে বাংলাদেশী সিনেমার জয়জয়কার" "Bangladeshi Cinema Triumphs at Oscars" "সেরা আন্তর্জাতিক চলচ্চিত্র বিভাগে মনোনয়ন পেল 'অচেনা পথ'।" "<p>বাংলাদেশের চলচ্চিত্র ইতিহাসে এক নতুন অধ্যায় রচিত হলো। তরুণ নির্মাতার 'অচেনা পথ' চলচ্চিত্রটি বিশ্বের সবচেয়ে সম্মানজনক অস্কার পুরস্কারের জন্য মনোনীত হয়েছে।</p><p>চলচ্চিত্র বিশেষজ্ঞরা এই খবরকে বাংলাদেশী সিনেমার জন্য একটি বিরাট সাফল্য হিসেবে দেখছেন।</p>" "true"
create_news "$CAT_ENT" "কোক স্টুডিও বাংলার নতুন সিজন" "New Season of Coke Studio Bangla" "লোকসংগীত ও আধুনিকতার মেলবন্ধনে আসছে নতুন চমক।" "<p>দীর্ঘ প্রতীক্ষার পর কোক স্টুডিও বাংলার তৃতীয় সিজন শুরু হতে যাচ্ছে। এবারের সিজনে থাকছে নতুন ও পুরনো শিল্পীদের সমন্বয়ে তৈরি এক গুচ্ছ লোকজ ও আধুনিক গান।</p>" "false"

echo ""
echo "✅ Seeding Complete! Enjoy your live News Portal in Bengali."
echo "🔗 View categories at: http://localhost:3001/categories"
echo "🔗 View news at: http://localhost:3001/news"
