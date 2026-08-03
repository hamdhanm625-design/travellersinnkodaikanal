module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e){}
  }

  const vehicle = body.vehicle || 'innova';
  const days = parseInt(body.days) || 1;
  const type = body.type || 'sightseeing';

  const rates = {
    sedan: { base: 2200, perDay: 2800, name: "Swift Dzire / Toyota Etios Sedan" },
    innova: { base: 3500, perDay: 4200, name: "Toyota Innova Crysta Luxury SUV" },
    tempo: { base: 5500, perDay: 6800, name: "Tempo Traveller (12-Seater)" }
  };

  const selected = rates[vehicle] || rates.innova;
  let total = selected.perDay * days;
  if (type === 'pickup') total = selected.base;
  else if (type === 'outstation') total = selected.perDay * days * 1.15;

  res.status(200).json({
    vehicle: selected.name,
    days: days,
    tripType: type,
    estimatedPrice: Math.round(total),
    formattedPrice: `₹${Math.round(total).toLocaleString('en-IN')}`,
    currency: "INR"
  });
};
