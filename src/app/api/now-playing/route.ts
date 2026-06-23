import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Your exact VosCast API Key
    const VOSCAST_KEY = "31b8dac67aae02545f7e5a44e2f8ec7c";
    
    // Fetch both the Server Title (Live DJs) and the Song Title (AutoDJ)
    const [serverRes, songRes] = await Promise.all([
      fetch(`https://cdn.voscast.com/stats/display.js?key=${VOSCAST_KEY}&stats=servertitle`, { cache: 'no-store' }),
      fetch(`https://cdn.voscast.com/stats/display.js?key=${VOSCAST_KEY}&stats=songtitle`, { cache: 'no-store' })
    ]);

    const serverJs = await serverRes.text();
    const songJs = await songRes.text();

    const extractText = (jsString: string) => {
      const match = jsString.match(/document\.write\('(.*?)'\);/);
      return match && match[1] ? match[1].trim() : "";
    };

    const serverTitle = extractText(serverJs);
    const songTitle = extractText(songJs);

    let displayTitle = "Radio PPI Dunia Mengudara";

    if (serverTitle && (serverTitle.includes("SS ") || serverTitle.includes("SK ") || serverTitle.includes("||"))) {
      displayTitle = serverTitle;
    } else if (songTitle && songTitle.length > 0) {
      displayTitle = songTitle;
    } else if (serverTitle && serverTitle !== "Unnamed Server") {
      displayTitle = serverTitle;
    }

    // THE CLEANUP PHASE
    displayTitle = displayTitle
      // 1. Unescape HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      // 2. THIS IS THE MAGIC LINE: Strip out ANY HTML tags (like <div id="..."> or </div>)
      .replace(/<[^>]+>/g, '')
      .trim();

    return NextResponse.json({ displayTitle });

  } catch (error) {
    console.error("VosCast Official API Error:", error);
    return NextResponse.json({ displayTitle: "Radio PPI Dunia Mengudara" });
  }
}