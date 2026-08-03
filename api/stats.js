module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: "Active",
    totalBookings: 124,
    confirmedBookings: 98,
    pendingBookings: 18,
    completedBookings: 8,
    activeFleet: 15,
    ceo: "Sulthan Ibrahim",
    hotline: "9894119264"
  });
};
