module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: "Healthy",
    service: "TRAVELLERS INN TOURS AND TRAVELS API",
    location: "Kodaikanal, Tamil Nadu",
    phone: "9894119264",
    ceo: "Sulthan Ibrahim",
    timestamp: new Date().toISOString()
  });
};
