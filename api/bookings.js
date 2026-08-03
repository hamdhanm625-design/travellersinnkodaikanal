const initialBookings = [
  {
    id: "TIK-2026-9841",
    name: "Suresh & Family",
    phone: "9841029384",
    email: "suresh@example.com",
    service: "Local Kodaikanal Sightseeing",
    vehicle: "Toyota Innova Crysta",
    date: "2026-08-10",
    passengers: 4,
    pickup: "Kodaikanal Bus Stand",
    status: "Confirmed",
    createdAt: new Date().toISOString()
  },
  {
    id: "TIK-2026-7721",
    name: "Priya Nair",
    phone: "9745123890",
    email: "priya.nair@example.com",
    service: "Airport/Station Pickup Drop",
    vehicle: "Swift Dzire Sedan",
    date: "2026-08-12",
    passengers: 2,
    pickup: "Madurai Airport (IXM)",
    status: "Confirmed",
    createdAt: new Date().toISOString()
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e){}
    }
    const newBk = {
      id: body.id || ("TIK-2026-" + Math.floor(1000 + Math.random() * 9000)),
      name: body.name || "Guest",
      phone: body.phone || "N/A",
      email: body.email || "",
      service: body.service || "Kodaikanal Sightseeing",
      vehicle: body.vehicle || "Toyota Innova Crysta",
      date: body.date || new Date().toISOString().split('T')[0],
      passengers: body.passengers || 2,
      pickup: body.pickup || "Kodaikanal",
      notes: body.notes || "",
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    initialBookings.unshift(newBk);
    return res.status(201).json({ status: "Success", booking: newBk });
  }

  res.status(200).json(initialBookings);
};
