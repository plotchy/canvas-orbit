const FIXED_SEED = 42; // Use a fixed seed value
let currentSeed = FIXED_SEED;

function seededRandom() {
  currentSeed = (currentSeed * 9301 + 49297) % 233280;
  return currentSeed / 233280;
}

function calculateTotalBTC() {
  currentSeed = FIXED_SEED; // Reset seed before calculation
  let total = 0;
  for (let i = 0; i < 1000; i++) {
    const tickers = ["BTC", "ETH", "LTC", "XRP", "SOL"];
    const ticker = tickers[Math.floor(seededRandom() * tickers.length)];
    const value = parseFloat((seededRandom() * 10).toFixed(2));
    if (ticker === "BTC") {
      total += value;
    }
  }
  return total.toFixed(2);
}

export async function POST(request) {
  const { code } = await request.json();
  const correctTotal = calculateTotalBTC();
  console.log("Correct total:", correctTotal);
  const formattedCorrectTotal = `${correctTotal} BTC`;

  const isCorrect = (input) => {
    const normalizedInput = input.trim().toLowerCase();
    const normalizedCorrectTotal = correctTotal.toLowerCase();
    const normalizedFormattedCorrectTotal = formattedCorrectTotal.toLowerCase();
    return (
      normalizedInput === normalizedCorrectTotal ||
      normalizedInput === normalizedFormattedCorrectTotal ||
      normalizedInput === correctTotal ||
      normalizedInput === formattedCorrectTotal ||
      normalizedInput === `${normalizedCorrectTotal}btc` // New condition
    );
  };

  if (isCorrect(code)) {
    return new Response(JSON.stringify({ success: true, message: `🎉 Congratulations! You nailed it! 🎉 Apply now: https://www.example.com/careers` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ success: false, message: "Incorrect total. Keep calculating!" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}